import { CAREER_CLUSTERS } from '@/data/careers'
import { PERSONALITY_CODES } from '@/data/personalities'
import { formatTopType, rankCodes } from '@/engine/scoring'
import type { PersonalityCode, ScoreMap, Student } from '@/types'

export interface CsvIssue {
  line: number
  message: string
}

export interface CsvParseResult {
  students: Student[]
  errors: CsvIssue[]
  warnings: string[]
}

export const CSV_HEADER = ['student_id', ...PERSONALITY_CODES, 'top_type', 'career'].join(',')

export const CSV_TEMPLATE = `${CSV_HEADER}
ST01,72,91,48,60,35,52,I-R-C,technology
ST02,35,40,85,55,60,30,A-E-S,design
ST03,45,50,30,92,58,40,S-E-I,education
`

/** Columns that may contain personal data. They are dropped on import. */
const SENSITIVE = /^(name|ten|ho_ten|fullname|full_name|email|mail|phone|sdt|so_dien_thoai|address|dia_chi|birthday|dob)$/i

const splitLine = (line: string): string[] => {
  const out: string[] = []
  let cur = ''
  let quoted = false
  for (const ch of line) {
    if (ch === '"') quoted = !quoted
    else if (ch === ',' && !quoted) {
      out.push(cur.trim())
      cur = ''
    } else cur += ch
  }
  out.push(cur.trim())
  return out
}

const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')

/** Accepts a cluster id ("technology"), short label ("Technology") or Vietnamese name. */
export function resolveCluster(value: string): string | undefined {
  const key = normalise(value)
  if (!key) return undefined
  return CAREER_CLUSTERS.find(
    (c) => normalise(c.id) === key || normalise(c.shortLabel) === key || normalise(c.name) === key,
  )?.id
}

export function parseStudentsCsv(text: string): CsvParseResult {
  const result: CsvParseResult = { students: [], errors: [], warnings: [] }
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((l, i) => ({ raw: l, line: i + 1 }))
    .filter((l) => l.raw.trim() !== '')

  const head = lines.shift()
  if (!head) {
    result.errors.push({ line: 1, message: 'File trống.' })
    return result
  }

  const columns = splitLine(head.raw).map((c) => c.trim())
  const idx = (name: string) => columns.findIndex((c) => c.toLowerCase() === name.toLowerCase())
  const missing = ['student_id', ...PERSONALITY_CODES].filter((c) => idx(c) < 0)
  if (missing.length) {
    result.errors.push({ line: head.line, message: `Thiếu cột bắt buộc: ${missing.join(', ')}.` })
    return result
  }
  const sensitive = columns.filter((c) => SENSITIVE.test(c))
  if (sensitive.length) {
    result.warnings.push(`Đã bỏ qua các cột có thể chứa thông tin cá nhân: ${sensitive.join(', ')}.`)
  }

  const seen = new Set<string>()
  for (const { raw, line } of lines) {
    const cells = splitLine(raw)
    const id = cells[idx('student_id')]?.trim()
    if (!id) {
      result.errors.push({ line, message: 'Thiếu student_id.' })
      continue
    }
    if (seen.has(id)) {
      result.errors.push({ line, message: `student_id "${id}" bị trùng.` })
      continue
    }

    const personality = {} as ScoreMap
    let bad: PersonalityCode | undefined
    for (const code of PERSONALITY_CODES) {
      const v = Number(cells[idx(code)])
      if (!Number.isFinite(v) || v < 0 || v > 100) bad = code
      personality[code] = Math.round(v)
    }
    if (bad) {
      result.errors.push({ line, message: `Điểm "${bad}" phải là số từ 0 đến 100.` })
      continue
    }

    const careerIdx = idx('career')
    const careerRaw = careerIdx >= 0 ? (cells[careerIdx] ?? '') : ''
    const careers = careerRaw
      .split(/[|;/]/)
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => ({ raw: c, id: resolveCluster(c) }))
    const unknown = careers.find((c) => !c.id)
    if (unknown) {
      result.errors.push({ line, message: `Nhóm nghề "${unknown.raw}" không có trong hệ thống.` })
      continue
    }

    const topIdx = idx('top_type')
    const topType = (topIdx >= 0 && cells[topIdx]) || formatTopType(rankCodes(personality))

    seen.add(id)
    result.students.push({
      id,
      personality,
      topType,
      careers: careers.map((c) => c.id as string),
    })
  }

  if (result.students.length === 0 && result.errors.length === 0) {
    result.errors.push({ line: 2, message: 'Không có dòng dữ liệu nào.' })
  }
  return result
}

export function studentsToCsv(students: Student[]): string {
  const rows = students.map((s) =>
    [s.id, ...PERSONALITY_CODES.map((c) => s.personality[c]), s.topType, s.careers[0] ?? ''].join(','),
  )
  return [CSV_HEADER, ...rows].join('\n')
}
