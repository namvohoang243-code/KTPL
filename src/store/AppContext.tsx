import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { computeClassStats, type ClassStats } from '@/engine/classStats'
import {
  fetchGoogleSheetStudents,
  getGoogleConfig,
  saveGoogleConfig,
  sendToGoogleForm,
} from '@/services/googleService'
import {
  broadcastConfigToServer,
  getDeletedKeys,
  isStudentDeleted,
  resultRepository,
  saveDeletedKeys,
  studentRepository,
  syncSharedDataFromServer,
  syncSharedStudentsFromServer,
} from '@/services/storage'
import type { QuizResult, Student } from '@/types'

interface AppState {
  students: Student[]
  stats: ClassStats
  /** true while the dataset is the built-in demo data */
  isDemo: boolean
  result: QuizResult | null
  setResult: (r: QuizResult) => void
  clearResult: () => void
  importStudents: (students: Student[], mode?: 'replace' | 'append') => Promise<void>
  resetToDemo: () => Promise<void>
  deleteStudent: (target: Student | string) => Promise<boolean>
  restoreDeletedStudents: () => Promise<void>
  deletedCount: number
  /** Adds the current anonymous result to the class dataset. Returns the new id. */
  addMyResultToClass: (careerId: string) => Promise<string | null>

  // User metadata for questionnaire
  studentName: string
  setStudentName: (name: string) => void
  studentClass: string
  setStudentClass: (cls: string) => void

  // Google Form submission state
  formSubmitStatus: 'idle' | 'sending' | 'success' | 'failed'
  submitResultToGoogleForm: (customResult?: QuizResult) => Promise<boolean>

  // Google Sheet Sync state
  googleSheetUrl: string
  setGoogleSheetUrl: (url: string) => void
  isSyncing: boolean
  lastSyncedAt: string | null
  syncError: string | null
  syncFromGoogleSheet: (url?: string) => Promise<boolean>

  // Display configurations
  classSize: number
  setClassSize: (size: number) => void
  showStudentNames: boolean
  setShowStudentNames: (show: boolean) => void

  // Host Protection & Authentication
  isHostAuthenticated: boolean
  loginHost: (passcode: string) => boolean
  logoutHost: () => void
}

export const HOST_PASSCODE = '6767'
const HOST_AUTH_KEY = 'career_map_host_auth_session'

function checkHostAuth(): boolean {
  try {
    return sessionStorage.getItem(HOST_AUTH_KEY) === 'true' || localStorage.getItem(HOST_AUTH_KEY) === 'true'
  } catch {
    return false
  }
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(() => studentRepository.getAllSync?.() ?? [])
  const [result, setResultState] = useState<QuizResult | null>(() => resultRepository.get())

  const [studentName, setStudentNameState] = useState<string>(() => {
    return localStorage.getItem('career_map_user_name') || ''
  })
  const [studentClass, setStudentClassState] = useState<string>(() => {
    return localStorage.getItem('career_map_user_class') || '10A1'
  })

  const [googleConfig, setGoogleConfigState] = useState(() => getGoogleConfig())
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [formSubmitStatus, setFormSubmitStatus] = useState<'idle' | 'sending' | 'success' | 'failed'>('idle')
  const [isHostAuthenticated, setIsHostAuthenticated] = useState<boolean>(() => checkHostAuth())

  const loginHost = useCallback((passcode: string): boolean => {
    if (passcode.trim() === HOST_PASSCODE) {
      try {
        sessionStorage.setItem(HOST_AUTH_KEY, 'true')
        localStorage.setItem(HOST_AUTH_KEY, 'true')
      } catch {}
      setIsHostAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logoutHost = useCallback(() => {
    try {
      sessionStorage.removeItem(HOST_AUTH_KEY)
      localStorage.removeItem(HOST_AUTH_KEY)
    } catch {}
    setIsHostAuthenticated(false)
  }, [])

  const setStudentName = useCallback((name: string) => {
    setStudentNameState(name)
    localStorage.setItem('career_map_user_name', name)
  }, [])

  const setStudentClass = useCallback((cls: string) => {
    setStudentClassState(cls)
    localStorage.setItem('career_map_user_class', cls)
  }, [])

  const setGoogleSheetUrl = useCallback((sheetCsvUrl: string) => {
    const updated = saveGoogleConfig({ sheetCsvUrl })
    setGoogleConfigState(updated)
    broadcastConfigToServer(updated)
  }, [])

  const setClassSize = useCallback((classSize: number) => {
    const updated = saveGoogleConfig({ classSize })
    setGoogleConfigState(updated)
    broadcastConfigToServer(updated)
  }, [])

  const setShowStudentNames = useCallback((showNames: boolean) => {
    const updated = saveGoogleConfig({ showNames })
    setGoogleConfigState(updated)
    broadcastConfigToServer(updated)
  }, [])

  useEffect(() => {
    let alive = true
    studentRepository.getAll().then((s) => alive && setStudents(s))
    return () => {
      alive = false
    }
  }, [])

  const stats = useMemo(() => computeClassStats(students), [students])
  const isDemo = students.length > 0 && students.every((s) => s.demo)

  const setResult = useCallback((r: QuizResult) => {
    resultRepository.save(r)
    setResultState(r)
  }, [])

  const clearResult = useCallback(() => {
    resultRepository.clear()
    setResultState(null)
    setFormSubmitStatus('idle')
  }, [])

  const persist = useCallback(async (next: Student[]) => {
    await studentRepository.saveAll(next)
    setStudents(next)
  }, [])

  const importStudents = useCallback<AppState['importStudents']>(
    async (incoming, mode = 'replace') => {
      if (mode === 'replace') return persist(incoming)
      const base = students.filter((s) => !s.demo)
      const byId = new Map(base.map((s) => [s.id, s]))
      incoming.forEach((s) => byId.set(s.id, s))
      return persist([...byId.values()])
    },
    [persist, students],
  )

  const [deletedCount, setDeletedCount] = useState<number>(() => getDeletedKeys().length)

  const deleteStudent = useCallback<AppState['deleteStudent']>(
    async (target) => {
      const studentToDelete =
        typeof target === 'string'
          ? students.find((s) => s.id === target)
          : target

      if (!studentToDelete) return false

      const next = await studentRepository.delete(studentToDelete)
      setStudents(next)
      setDeletedCount(getDeletedKeys().length)
      return true
    },
    [students],
  )

  const restoreDeletedStudents = useCallback<AppState['restoreDeletedStudents']>(async () => {
    const restored = await studentRepository.restoreAllDeleted()
    setStudents(restored)
    setDeletedCount(0)
  }, [])

  const resetToDemo = useCallback(async () => {
    const demo = await studentRepository.loadDemo()
    setStudents(demo)
    setDeletedCount(0)
  }, [])

  const addMyResultToClass = useCallback<AppState['addMyResultToClass']>(
    async (careerId) => {
      if (!result) return null
      const id = `ME${String(students.filter((s) => s.id.startsWith('ME')).length + 1).padStart(2, '0')}`
      const demo = students.every((s) => s.demo)
      await persist([
        ...students,
        {
          id,
          name: result.name || studentName || 'Tôi',
          nickname: result.name || studentName || 'Tôi',
          className: result.className || studentClass || '10A1',
          personality: result.scores,
          rawScores: result.rawScores,
          topType: result.topType,
          careers: [careerId],
          primaryCareerName: result.primaryCareer,
          demo,
        },
      ])
      return id
    },
    [persist, result, students, studentName, studentClass],
  )

  const syncFromGoogleSheet = useCallback(
    async (customUrl?: string): Promise<boolean> => {
      const urlToUse = customUrl !== undefined ? customUrl : googleConfig.sheetCsvUrl
      if (!urlToUse?.trim()) {
        setSyncError('Vui lòng nhập đường link Google Sheet của lớp')
        return false
      }

      setIsSyncing(true)
      setSyncError(null)

      try {
        const { students: fetched, error } = await fetchGoogleSheetStudents(urlToUse)
        if (error || !fetched || fetched.length === 0) {
          // If Google Sheet is unreachable or private, fallback to shared server API
          const shared = await syncSharedStudentsFromServer()
          if (shared.length > 0) {
            const validShared = shared.filter((s) => !isStudentDeleted(s))
            await persist(validShared)
            setLastSyncedAt(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
            setIsSyncing(false)
            return true
          }
          setSyncError(error || 'Không tải được danh sách học sinh từ Google Sheet')
          setIsSyncing(false)
          return false
        }

        const validFetched = fetched.filter((s) => !isStudentDeleted(s))
        await persist(validFetched)
        setLastSyncedAt(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        setIsSyncing(false)
        return true
      } catch (e) {
        // Fallback to shared server API on network error
        const shared = await syncSharedStudentsFromServer()
        if (shared.length > 0) {
          const validShared = shared.filter((s) => !isStudentDeleted(s))
          await persist(validShared)
          setLastSyncedAt(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
          setIsSyncing(false)
          return true
        }
        setSyncError(e instanceof Error ? e.message : 'Lỗi khi đồng bộ từ Google Sheet')
        setIsSyncing(false)
        return false
      }
    },
    [googleConfig.sheetCsvUrl, persist],
  )

  const submitResultToGoogleForm = useCallback(
    async (customResult?: QuizResult): Promise<boolean> => {
      const target = customResult || result
      if (!target) return false

      setFormSubmitStatus('sending')
      try {
        const raw = target.rawScores || target.scores
        await sendToGoogleForm(
          {
            name: target.name || studentName || 'Ẩn danh',
            cls: target.className || studentClass || '10A1',
            group: target.topType,
            code: target.topCodes.join(''),
            rawScores: raw,
            career: target.primaryCareer || 'Chưa chọn',
          },
          googleConfig,
        )
        setFormSubmitStatus('success')
        const refreshed = await studentRepository.getAll()
        setStudents(refreshed)
        return true
      } catch (e) {
        console.error('Failed to submit to Google Form', e)
        setFormSubmitStatus('failed')
        return false
      }
    },
    [result, studentName, studentClass, googleConfig],
  )

  // Real-time synchronization across devices (phone submits -> computer auto-updates)
  useEffect(() => {
    let active = true

    const syncShared = async () => {
      try {
        const remoteData = await syncSharedDataFromServer()
        if (!active || !remoteData) return

        // 1. Sync deletedKeys if provided by server
        if (Array.isArray(remoteData.deletedKeys)) {
          const currentDeleted = getDeletedKeys()
          if (remoteData.deletedKeys.length === 0 && currentDeleted.length > 0) {
            // Restore was called on another device
            saveDeletedKeys([])
            setDeletedCount(0)
          } else {
            const combined = Array.from(new Set([...currentDeleted, ...remoteData.deletedKeys]))
            if (combined.length !== currentDeleted.length) {
              saveDeletedKeys(combined)
              setDeletedCount(combined.length)
            }
          }
        }

        // 2. Sync googleConfig if provided by server
        if (remoteData.googleConfig && remoteData.googleConfig.sheetCsvUrl) {
          const currentConfig = getGoogleConfig()
          if (
            remoteData.googleConfig.sheetCsvUrl !== currentConfig.sheetCsvUrl ||
            remoteData.googleConfig.classSize !== currentConfig.classSize ||
            remoteData.googleConfig.showNames !== currentConfig.showNames
          ) {
            const updated = saveGoogleConfig(remoteData.googleConfig)
            setGoogleConfigState(updated)
          }
        }

        // 3. Sync students
        const currentDeleted = getDeletedKeys()
        const remoteStudents = remoteData.students || []
        if (remoteStudents.length > 0) {
          const validRemote = remoteStudents.filter((s) => !isStudentDeleted(s, currentDeleted))

          setStudents((prev) => {
            // Preserve locally-submitted quizzes not yet on server
            const localOnly = prev.filter(
              (s) => s.id?.startsWith('ME') && !remoteStudents.some((r) => r.id === s.id),
            )
            const nextList = [...validRemote, ...localOnly]

            // If length or items differ, update
            const isDiff =
              nextList.length !== prev.length ||
              nextList.some((s, idx) => s.id !== prev[idx]?.id || s.name !== prev[idx]?.name)

            if (isDiff) {
              return nextList
            }
            return prev
          })
        }
      } catch {}
    }

    // Run on initial load
    syncShared()

    // Run immediately when user focuses the tab or switches back to browser
    const onFocus = () => syncShared()
    window.addEventListener('focus', onFocus)
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') syncShared()
    })

    // Auto-poll every 3 seconds
    const pollTimer = setInterval(syncShared, 3000)

    return () => {
      active = false
      window.removeEventListener('focus', onFocus)
      clearInterval(pollTimer)
    }
  }, [])

  // Auto-sync on mount if Google Sheet URL is configured
  useEffect(() => {
    if (googleConfig.sheetCsvUrl?.trim()) {
      syncFromGoogleSheet()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo<AppState>(
    () => ({
      students,
      stats,
      isDemo,
      result,
      setResult,
      clearResult,
      importStudents,
      resetToDemo,
      deleteStudent,
      restoreDeletedStudents,
      deletedCount,
      addMyResultToClass,
      studentName,
      setStudentName,
      studentClass,
      setStudentClass,
      formSubmitStatus,
      submitResultToGoogleForm,
      googleSheetUrl: googleConfig.sheetCsvUrl,
      setGoogleSheetUrl,
      isSyncing,
      lastSyncedAt,
      syncError,
      syncFromGoogleSheet,
      classSize: googleConfig.classSize,
      setClassSize,
      showStudentNames: googleConfig.showNames,
      setShowStudentNames,
      isHostAuthenticated,
      loginHost,
      logoutHost,
    }),
    [
      students,
      stats,
      isDemo,
      result,
      setResult,
      clearResult,
      importStudents,
      resetToDemo,
      deleteStudent,
      restoreDeletedStudents,
      deletedCount,
      addMyResultToClass,
      studentName,
      setStudentName,
      studentClass,
      setStudentClass,
      formSubmitStatus,
      submitResultToGoogleForm,
      googleConfig.sheetCsvUrl,
      googleConfig.classSize,
      googleConfig.showNames,
      setGoogleSheetUrl,
      isSyncing,
      lastSyncedAt,
      syncError,
      syncFromGoogleSheet,
      setClassSize,
      setShowStudentNames,
      isHostAuthenticated,
      loginHost,
      logoutHost,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within <AppProvider>')
  return ctx
}
