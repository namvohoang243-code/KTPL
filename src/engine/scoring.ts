import { PERSONALITY_CODES } from '@/data/personalities'
import type { PersonalityCode, Question, QuizResult, ScoreMap } from '@/types'

export const emptyScores = (): ScoreMap =>
  Object.fromEntries(PERSONALITY_CODES.map((c) => [c, 0])) as ScoreMap

/**
 * Compute raw score sum per RIASEC code (e.g. 10 to 50 for 10 questions rated 1-5).
 */
export function scoreRawAnswers(questions: Question[], answers: Record<string, number>): ScoreMap {
  const sum = emptyScores()

  for (const q of questions) {
    const val = answers[q.id]
    if (typeof val === 'number') {
      // Ensure score is 1-5
      const rating = val >= 1 && val <= 5 ? val : val === 0 ? 1 : Math.min(5, Math.max(1, val))
      sum[q.code] = (sum[q.code] || 0) + rating
    }
  }

  return sum
}

/**
 * Convert 1-5 Likert scale answers into a 0-100% normalized score per RIASEC group.
 * Uses linear scaling: 1 pt = 0%, 3 pts = 50%, 5 pts = 100%.
 */
export function scoreAnswers(questions: Question[], answers: Record<string, number>): ScoreMap {
  const codeSums = emptyScores()
  const codeCounts = emptyScores()

  for (const q of questions) {
    const val = answers[q.id]
    if (typeof val === 'number') {
      const rating = val >= 1 && val <= 5 ? val : val === 0 ? 1 : Math.min(5, Math.max(1, val))
      codeSums[q.code] += rating
      codeCounts[q.code] += 1
    }
  }

  const result = emptyScores()
  for (const c of PERSONALITY_CODES) {
    const count = codeCounts[c]
    if (count > 0) {
      const avg = codeSums[c] / count
      // Scale 1.0 -> 0%, 5.0 -> 100%
      const pct = Math.round(((avg - 1) / 4) * 100)
      result[c] = Math.min(100, Math.max(0, pct))
    } else {
      result[c] = 0
    }
  }

  return result
}

/** Codes ordered from strongest to weakest. Ties keep the canonical R-I-A-S-E-C order. */
export const rankCodes = (scores: ScoreMap): PersonalityCode[] =>
  [...PERSONALITY_CODES].sort(
    (a, b) => scores[b] - scores[a] || PERSONALITY_CODES.indexOf(a) - PERSONALITY_CODES.indexOf(b),
  )

export const formatTopType = (codes: PersonalityCode[]): string => codes.slice(0, 3).join('-')

export function buildResult(
  scores: ScoreMap,
  rawScores?: ScoreMap,
  meta?: { name?: string; className?: string; primaryCareer?: string; answers?: Record<string, number> },
): QuizResult {
  const ranked = rankCodes(scores)
  return {
    name: meta?.name,
    className: meta?.className,
    scores,
    rawScores,
    answers: meta?.answers,
    topCodes: ranked.slice(0, 3),
    topType: formatTopType(ranked),
    primaryCareer: meta?.primaryCareer,
    takenAt: new Date().toISOString(),
    formSubmitted: 'idle',
  }
}
