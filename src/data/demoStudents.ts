import { normalizeScores } from '@/services/googleService'
import type { ScoreMap, Student } from '@/types'

export interface SheetStudentSeed {
  name: string
  className: string
  mainGroup: string
  hollandCode: string
  rawScores: ScoreMap
  career: string
  submittedAt: string
}

/**
 * 5 Actual student submissions directly synchronized from the official Google Sheet:
 * https://docs.google.com/spreadsheets/d/1Yw0TwDjlsKrFmAoglOyPOT5iFls_b4JjaQSKcPb45xs/edit?gid=1773219797
 */
export const REAL_GOOGLE_SHEET_STUDENTS: SheetStudentSeed[] = [
  {
    name: 'Vo Hoang Nam',
    className: '10CTIN',
    mainGroup: 'Phân tích – The Thinker',
    hollandCode: 'IEC',
    rawScores: { R: 1, I: 11, A: 2, S: 0, E: 2, C: 4 },
    career: 'Chuyên gia Phân tích Dữ liệu / AI',
    submittedAt: '10/5/2026 20:10:05',
  },
  {
    name: 'orz',
    className: '10A111',
    mainGroup: 'Phân tích – The Thinker',
    hollandCode: 'IAR',
    rawScores: { R: 3, I: 6, A: 4, S: 2, E: 1, C: 2 },
    career: 'Nghiên cứu Sinh học / Dữ liệu',
    submittedAt: '10/5/2026 20:36:37',
  },
  {
    name: 'Nam',
    className: '10A1',
    mainGroup: 'I-A-E',
    hollandCode: 'IAE',
    rawScores: { R: 1, I: 9, A: 4, S: 0, E: 3, C: 1 },
    career: 'Chuyên viên Phân tích Hệ thống',
    submittedAt: '10/5/2026 20:37:58',
  },
  {
    name: 'Nguyen Hai Nam',
    className: '10A1',
    mainGroup: 'R-I-A',
    hollandCode: 'RIA',
    rawScores: { R: 6, I: 4, A: 3, S: 3, E: 2, C: 2 },
    career: 'Kỹ sư Cơ khí – Tự động hóa',
    submittedAt: '10/5/2026 21:22:44',
  },
  {
    name: 'Nam',
    className: '10A1',
    mainGroup: 'A-S-E',
    hollandCode: 'ASE',
    rawScores: { R: 40, I: 44, A: 45, S: 45, E: 42, C: 36 },
    career: 'Giám đốc Sáng tạo / Truyền thông Đa phương tiện',
    submittedAt: '10/5/2026 22:41:40',
  },
]

export function generateStudentsFromSheet(): Student[] {
  return REAL_GOOGLE_SHEET_STUDENTS.map((item, idx) => {
    const personality = normalizeScores(item.rawScores)
    return {
      id: `gs_sheet_${idx + 1}`,
      name: item.name,
      nickname: item.name,
      className: item.className,
      personality,
      rawScores: item.rawScores,
      topType: item.hollandCode,
      careers: ['technology'],
      primaryCareerName: item.career,
      demo: false,
      submittedAt: item.submittedAt,
    }
  })
}

export const DEMO_STUDENTS: Student[] = generateStudentsFromSheet()
