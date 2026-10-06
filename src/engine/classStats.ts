import { CAREER_CLUSTERS } from '@/data/careers'
import { PERSONALITIES, PERSONALITY_CODES } from '@/data/personalities'
import { rankCodes } from '@/engine/scoring'
import type { PersonalityCode, Student } from '@/types'

export interface DistributionItem {
  code: PersonalityCode
  count: number
  /** 0-100 */
  pct: number
}

export interface AverageItem {
  code: PersonalityCode
  avg: number
}

export interface CareerCountItem {
  clusterId: string
  count: number
  pct: number
}

export interface MatrixData {
  rows: PersonalityCode[]
  cols: string[]
  /** cells[rowIndex][colIndex] = number of students */
  cells: number[][]
  max: number
}

export interface ClassStats {
  participants: number
  personalityGroups: number
  careerClusters: number
  topPersonality: DistributionItem | null
  topCareer: CareerCountItem | null
  distribution: DistributionItem[]
  averages: AverageItem[]
  careerCounts: CareerCountItem[]
  matrix: MatrixData
  /** Average score across the whole class per group, keyed by code */
  averageMap: Record<PersonalityCode, number>
}

const pct = (count: number, total: number) => (total === 0 ? 0 : (count / total) * 100)

export const dominantCode = (s: Student): PersonalityCode => rankCodes(s.personality)[0] as PersonalityCode
export const primaryCareer = (s: Student): string | undefined => s.careers[0]

/** All class statistics are derived here from the `students` array — nothing is hard-coded. */
export function computeClassStats(students: Student[], matrixColumns = 6): ClassStats {
  const n = students.length

  const distCount = new Map<PersonalityCode, number>(PERSONALITY_CODES.map((c) => [c, 0]))
  for (const s of students) distCount.set(dominantCode(s), (distCount.get(dominantCode(s)) ?? 0) + 1)
  const distribution: DistributionItem[] = PERSONALITY_CODES.map((code) => ({
    code,
    count: distCount.get(code) ?? 0,
    pct: pct(distCount.get(code) ?? 0, n),
  })).sort((a, b) => b.count - a.count || PERSONALITY_CODES.indexOf(a.code) - PERSONALITY_CODES.indexOf(b.code))

  const averages: AverageItem[] = PERSONALITY_CODES.map((code) => ({
    code,
    avg: n === 0 ? 0 : Math.round(students.reduce((sum, s) => sum + s.personality[code], 0) / n),
  }))
  const averageMap = Object.fromEntries(averages.map((a) => [a.code, a.avg])) as Record<PersonalityCode, number>

  const careerCount = new Map<string, number>()
  for (const s of students) {
    const c = primaryCareer(s)
    if (c) careerCount.set(c, (careerCount.get(c) ?? 0) + 1)
  }
  const orderOf = (id: string) => CAREER_CLUSTERS.findIndex((c) => c.id === id)
  const careerCounts: CareerCountItem[] = [...careerCount.entries()]
    .map(([clusterId, count]) => ({ clusterId, count, pct: pct(count, n) }))
    .sort((a, b) => b.count - a.count || orderOf(a.clusterId) - orderOf(b.clusterId))

  // Matrix: the N most popular clusters; padded with remaining clusters if the data has fewer.
  const cols = [
    ...careerCounts.map((c) => c.clusterId),
    ...CAREER_CLUSTERS.map((c) => c.id).filter((id) => !careerCount.has(id)),
  ].slice(0, matrixColumns)
  const rows = PERSONALITY_CODES
  const cells = rows.map(() => cols.map(() => 0))
  for (const s of students) {
    const r = rows.indexOf(dominantCode(s))
    const c = cols.indexOf(primaryCareer(s) ?? '')
    if (r >= 0 && c >= 0) (cells[r] as number[])[c] = ((cells[r] as number[])[c] ?? 0) + 1
  }
  const max = Math.max(0, ...cells.flat())

  return {
    participants: n,
    personalityGroups: PERSONALITIES.length,
    careerClusters: CAREER_CLUSTERS.length,
    topPersonality: distribution[0] && distribution[0].count > 0 ? distribution[0] : null,
    topCareer: careerCounts[0] ?? null,
    distribution,
    averages,
    averageMap,
    careerCounts,
    matrix: { rows, cols, cells, max },
  }
}
