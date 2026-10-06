import { CAREER_CLUSTERS, OCCUPATIONS } from '@/data/careers'
import { PERSONALITY_MAP } from '@/data/personalities'
import { rankCodes } from '@/engine/scoring'
import type { CareerCluster, CareerMatch, Occupation, PersonalityCode, ScoreMap } from '@/types'

/** Weight of the 1st / 2nd / 3rd letter of a Holland code. */
const POSITION_WEIGHTS = [1, 0.65, 0.35]

/**
 * Compatibility (0-100) between a score profile and a Holland code.
 * Blends how strong the user's scores are on the required letters (60%)
 * with how well the user's top-3 ordering matches the code (40%).
 */
export function matchCode(scores: ScoreMap, code: PersonalityCode[]): number {
  const userTop = rankCodes(scores).slice(0, 3)
  let weighted = 0
  let positional = 0
  let total = 0

  code.slice(0, POSITION_WEIGHTS.length).forEach((letter, i) => {
    const w = POSITION_WEIGHTS[i] ?? 0
    total += w
    weighted += w * (scores[letter] / 100)
    positional += w * (userTop[i] === letter ? 1 : userTop.includes(letter) ? 0.6 : 0)
  })

  const raw = total === 0 ? 0 : 0.6 * (weighted / total) + 0.4 * (positional / total)
  return Math.max(20, Math.min(98, Math.round(25 + 73 * raw)))
}

export function rankClusters(scores: ScoreMap): CareerMatch<CareerCluster>[] {
  return CAREER_CLUSTERS.map((item) => ({ item, compatibility: matchCode(scores, item.code) })).sort(
    (a, b) => b.compatibility - a.compatibility,
  )
}

export function rankOccupations(scores: ScoreMap, clusterId?: string): CareerMatch<Occupation>[] {
  return OCCUPATIONS.filter((o) => !clusterId || o.clusterId === clusterId)
    .map((item) => ({ item, compatibility: matchCode(scores, item.code) }))
    .sort((a, b) => b.compatibility - a.compatibility)
}

/** Human readable "why it fits" sentence generated from the user's own scores. */
export function explainFit(scores: ScoreMap, code: PersonalityCode[]): string {
  const strong = code
    .filter((c) => scores[c] >= 55)
    .map((c) => `${PERSONALITY_MAP[c].name} (${scores[c]}%)`)

  if (strong.length >= 2) {
    return `Hồ sơ của bạn nổi bật ở ${strong.slice(0, -1).join(', ')} và ${strong[strong.length - 1]} — đúng những phẩm chất nhóm nghề này thường cần.`
  }
  if (strong.length === 1) {
    return `Điểm ${strong[0]} của bạn khớp với yêu cầu cốt lõi của nhóm nghề này, các yếu tố còn lại có thể được rèn luyện thêm.`
  }
  return 'Nhóm nghề này chưa trùng với điểm mạnh hiện tại của bạn, nhưng vẫn có thể là một hướng để thử nghiệm và khám phá.'
}
