import * as XLSX from 'xlsx'
import { CAREER_CLUSTERS } from '@/data/careers'
import { PERSONALITY_CODES, PERSONALITY_MAP } from '@/data/personalities'
import { formatTopType, rankCodes } from '@/engine/scoring'
import { mapCareerToCluster, normalizeScores } from '@/services/googleService'
import type { PersonalityCode, ScoreMap, Student } from '@/types'

/**
 * Read and parse an Excel (.xlsx, .xls) or CSV file into Student[] objects.
 */
export async function parseExcelOrCsvFile(file: File): Promise<Student[]> {
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data, { type: 'array' })

  // Read the first worksheet
  const firstSheetName = workbook.SheetNames[0]
  if (!firstSheetName) return []

  const worksheet = workbook.Sheets[firstSheetName]
  if (!worksheet) return []

  // Convert to array of arrays (string values)
  const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1, defval: '' }) as string[][]
  if (rows.length < 2) return []

  const header = rows[0]!.map((h) => String(h || '').trim().toLowerCase())

  // Dynamic column detection
  const findCol = (...keywords: string[]): number => {
    return header.findIndex((h) => keywords.some((k) => h.includes(k)))
  }

  let nameCol = findCol('tên', 'name', 'họ và tên', 'biệt danh', 'học sinh')
  let clsCol = findCol('lớp', 'class', 'khoá', 'khóa')
  let codeCol = findCol('mã holland', 'holland', 'mã', 'code')
  let careerCol = findCol('nghề', 'career', 'ngành', 'gợi ý')

  // Detect RIASEC columns
  const riasecColMap: Record<PersonalityCode, number> = {
    R: -1,
    I: -1,
    A: -1,
    S: -1,
    E: -1,
    C: -1,
  }

  for (const c of PERSONALITY_CODES) {
    let colIdx = header.findIndex(
      (h) => h === c.toLowerCase() || h.startsWith(`${c.toLowerCase()} `) || h.endsWith(` ${c.toLowerCase()}`)
    )
    if (colIdx === -1) {
      const viName = PERSONALITY_MAP[c].name.toLowerCase()
      colIdx = header.findIndex((h) => h.includes(viName))
    }
    riasecColMap[c] = colIdx
  }

  // Fallbacks by standard sequence
  if (nameCol === -1 && header.length >= 2) nameCol = 1
  if (clsCol === -1 && header.length >= 3) clsCol = 2
  if (codeCol === -1 && header.length >= 5) codeCol = 4
  if (careerCol === -1 && header.length >= 12) careerCol = 11

  PERSONALITY_CODES.forEach((k, j) => {
    if (riasecColMap[k] === -1 && header.length >= 6 + j) {
      riasecColMap[k] = 5 + j
    }
  })

  const students: Student[] = []

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]!
    if (row.length < 2 || row.every((c) => !String(c).trim())) continue

    const name = String(row[nameCol] ?? '').trim() || `Học sinh ${i}`
    const className = String(row[clsCol] ?? '').trim() || '10A1'
    const careerText = careerCol >= 0 ? String(row[careerCol] ?? '').trim() : ''

    const rawScores = {} as ScoreMap
    let totalScore = 0

    for (const c of PERSONALITY_CODES) {
      const colIdx = riasecColMap[c]
      const rawVal = colIdx >= 0 ? parseInt(String(row[colIdx] ?? ''), 10) || 0 : 0
      rawScores[c] = rawVal
      totalScore += rawVal
    }

    if (totalScore === 0) continue

    const normalizedScores = normalizeScores(rawScores)
    const ranked = rankCodes(normalizedScores)
    const codeVal = codeCol >= 0 ? String(row[codeCol] ?? '') : undefined
    const topType =
      (codeVal ? codeVal.trim().replace(/[^A-Za-z]/g, '') : '') || formatTopType(ranked).replace(/-/g, '')
    const clusterId = mapCareerToCluster(careerText)

    students.push({
      id: `file_${Date.now()}_${i}`,
      name,
      nickname: name,
      className,
      personality: normalizedScores,
      rawScores,
      topType,
      careers: [clusterId],
      primaryCareerName: careerText || CAREER_CLUSTERS.find((c) => c.id === clusterId)?.name,
      demo: false,
      submittedAt: String(row[0] ?? new Date().toISOString()),
    })
  }

  return students
}

/**
 * Export class roster to a polished Excel (.xlsx) file.
 */
export function exportClassToExcel(students: Student[], className = '10A1') {
  if (students.length === 0) return

  const dataRows = students.map((s, idx) => ({
    STT: idx + 1,
    'Họ và Tên': s.name,
    'Lớp': s.className || className,
    'Mã Holland': s.topType,
    'R (Thực tế)': s.rawScores?.R ?? s.personality.R,
    'I (Khám phá)': s.rawScores?.I ?? s.personality.I,
    'A (Sáng tạo)': s.rawScores?.A ?? s.personality.A,
    'S (Kết nối)': s.rawScores?.S ?? s.personality.S,
    'E (Dẫn đầu)': s.rawScores?.E ?? s.personality.E,
    'C (Tổ chức)': s.rawScores?.C ?? s.personality.C,
    'Nghề nghiệp gợi ý': s.primaryCareerName || 'Chưa xác định',
    'Thời gian nộp': s.submittedAt || '',
  }))

  const worksheet = XLSX.utils.json_to_sheet(dataRows)

  // Set column widths
  worksheet['!cols'] = [
    { wch: 6 }, // STT
    { wch: 22 }, // Họ và tên
    { wch: 10 }, // Lớp
    { wch: 14 }, // Mã Holland
    { wch: 12 }, // R
    { wch: 12 }, // I
    { wch: 12 }, // A
    { wch: 12 }, // S
    { wch: 12 }, // E
    { wch: 12 }, // C
    { wch: 35 }, // Nghề nghiệp
    { wch: 22 }, // Thời gian
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Thống Kê Hướng Nghiệp')

  const fileName = `Thong_Ke_Huong_Nghiep_${className}_${new Date().toISOString().slice(0, 10)}.xlsx`
  XLSX.writeFile(workbook, fileName)
}
