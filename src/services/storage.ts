import { deleteLocalStudent, loadLocalSavedStudents } from '@/services/googleService'
import { DEMO_STUDENTS } from '@/data/demoStudents'
import type { QuizResult, Student } from '@/types'

export const STUDENTS_KEY = 'careermap.students.v1'
export const RESULT_KEY = 'careermap.result.v1'
export const DELETED_KEYS_KEY = 'careermap.deleted_keys.v1'

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function getDeletedKeys(): string[] {
  return readJson<string[]>(DELETED_KEYS_KEY) || []
}

export function saveDeletedKeys(keys: string[]): void {
  localStorage.setItem(DELETED_KEYS_KEY, JSON.stringify(keys))
}

export function generateStudentSignatures(s: Partial<Student>): string[] {
  const sigs: string[] = []
  if (s.id) sigs.push(s.id)
  if (s.name && s.submittedAt) {
    sigs.push(`${s.name}_${s.className || ''}_${s.submittedAt}`)
  } else if (s.name && s.demo) {
    // Demo records without unique timestamp
    sigs.push(`demo_${s.name}_${s.className || ''}_${s.topType || ''}`)
  }
  return sigs
}

export function isStudentDeleted(s: Student, deletedKeys = getDeletedKeys()): boolean {
  if (deletedKeys.length === 0) return false
  const sigs = generateStudentSignatures(s)
  return sigs.some((sig) => deletedKeys.includes(sig))
}

function getInitialStudents(): Student[] {
  const primary = readJson<Student[]>(STUDENTS_KEY)
  const deletedKeys = getDeletedKeys()

  let list: Student[] = []
  if (primary !== null && Array.isArray(primary)) {
    list = primary
  } else {
    const localSaved = loadLocalSavedStudents() || []
    const map = new Map<string, Student>()

    // 1. Base dataset: real Google Sheet submissions (Vo Hoang Nam, orz, Nam, Nguyen Hai Nam, Nam)
    DEMO_STUDENTS.forEach((s) => map.set(`${s.name}_${s.className}_${s.topType}`, s))

    // 2. Merge local submissions
    localSaved.forEach((s) => map.set(`${s.name}_${s.className}_${s.topType}`, s))

    list = Array.from(map.values())
  }

  return list.filter((s) => !isStudentDeleted(s, deletedKeys))
}

/**
 * Data access boundary.
 */
export interface StudentRepository {
  /** Synchronous snapshot used for the very first render (optional). */
  getAllSync?(): Student[]
  getAll(): Promise<Student[]>
  saveAll(students: Student[]): Promise<void>
  delete(student: Student): Promise<Student[]>
  restoreAllDeleted(): Promise<Student[]>
  /** Restore the built-in demo dataset explicitly. */
  loadDemo(): Promise<Student[]>
  /** Clear all stored data */
  reset(): Promise<void>
}

export interface ResultRepository {
  get(): QuizResult | null
  save(result: QuizResult): void
  clear(): void
}

export interface SharedSyncData {
  students: Student[]
  deletedKeys: string[]
  googleConfig: any | null
  updatedAt: number
}

export async function syncSharedDataFromServer(): Promise<SharedSyncData | null> {
  try {
    const res = await fetch('/api/students', { signal: AbortSignal.timeout(3000) })
    if (res.ok) {
      const data = await res.json()
      if (data && (Array.isArray(data.students) || Array.isArray(data.deletedKeys))) {
        return {
          students: Array.isArray(data.students) ? data.students : [],
          deletedKeys: Array.isArray(data.deletedKeys) ? data.deletedKeys : [],
          googleConfig: data.googleConfig || null,
          updatedAt: data.updatedAt || Date.now(),
        }
      }
    }
  } catch {
    // Server API not reachable (offline / static hosting)
  }
  return null
}

export async function syncSharedStudentsFromServer(): Promise<Student[]> {
  const data = await syncSharedDataFromServer()
  return data?.students || []
}

export async function broadcastStudentToServer(student: Student): Promise<boolean> {
  try {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
      signal: AbortSignal.timeout(4000),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function broadcastDeleteToServer(student: Partial<Student>): Promise<boolean> {
  try {
    const sigs = generateStudentSignatures(student)
    const res = await fetch('/api/students', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: student.id,
        name: student.name,
        signatures: sigs,
      }),
      signal: AbortSignal.timeout(4000),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function broadcastRestoreToServer(): Promise<boolean> {
  try {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restoreAll: true }),
      signal: AbortSignal.timeout(4000),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function broadcastConfigToServer(config: any): Promise<boolean> {
  try {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ googleConfig: config }),
      signal: AbortSignal.timeout(4000),
    })
    return res.ok
  } catch {
    return false
  }
}

export const studentRepository: StudentRepository = {
  getAllSync: () => getInitialStudents(),
  getAll: async () => {
    const local = getInitialStudents()
    const remoteData = await syncSharedDataFromServer()
    if (remoteData) {
      if (Array.isArray(remoteData.deletedKeys)) {
        saveDeletedKeys(remoteData.deletedKeys)
      }
      if (remoteData.students.length > 0) {
        const currentDeleted = getDeletedKeys()
        const merged = remoteData.students.filter((s) => !isStudentDeleted(s, currentDeleted))
        localStorage.setItem(STUDENTS_KEY, JSON.stringify(merged))
        return merged
      }
    }
    return local
  },
  saveAll: async (students) => {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students))
    try {
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          students,
          deletedKeys: getDeletedKeys(),
        }),
        signal: AbortSignal.timeout(4000),
      })
    } catch {}
  },
  delete: async (student) => {
    const currentDeleted = getDeletedKeys()
    const sigs = generateStudentSignatures(student)
    const newDeleted = Array.from(new Set([...currentDeleted, ...sigs]))
    saveDeletedKeys(newDeleted)

    // Remove from local backup list if present
    deleteLocalStudent(student)
    broadcastDeleteToServer(student)

    // Remove from primary storage
    const current = readJson<Student[]>(STUDENTS_KEY) ?? getInitialStudents()
    const next = current.filter((s) => !isStudentDeleted(s, newDeleted))
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(next))
    return next
  },
  restoreAllDeleted: async () => {
    saveDeletedKeys([])
    broadcastRestoreToServer()

    // Re-read with empty deleted keys
    const localSaved = loadLocalSavedStudents() || []
    const map = new Map<string, Student>()
    DEMO_STUDENTS.forEach((s) => map.set(`${s.name}_${s.className}_${s.topType}`, s))
    localSaved.forEach((s) => map.set(`${s.name}_${s.className}_${s.topType}`, s))
    const currentPrimary = readJson<Student[]>(STUDENTS_KEY) || []
    currentPrimary.forEach((s) => map.set(`${s.name}_${s.className}_${s.topType}`, s))
    const restored = Array.from(map.values())
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(restored))

    try {
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: restored, restoreAll: true }),
        signal: AbortSignal.timeout(4000),
      })
    } catch {}

    return restored
  },
  loadDemo: async () => {
    saveDeletedKeys([])
    broadcastRestoreToServer()
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(DEMO_STUDENTS))
    try {
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: DEMO_STUDENTS, restoreAll: true }),
      })
    } catch {}
    return DEMO_STUDENTS
  },
  reset: async () => {
    saveDeletedKeys([])
    broadcastRestoreToServer()
    localStorage.removeItem(STUDENTS_KEY)
  },
}

export const resultRepository: ResultRepository = {
  get: () => readJson<QuizResult>(RESULT_KEY),
  save: (result) => localStorage.setItem(RESULT_KEY, JSON.stringify(result)),
  clear: () => localStorage.removeItem(RESULT_KEY),
}
