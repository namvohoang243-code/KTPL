import { PERSONALITY_MAP } from '@/data/personalities'
import { rankCodes } from '@/engine/scoring'
import type { ScoreMap, StrengthInsight } from '@/types'

/**
 * Builds the "Điều gì nổi bật ở bạn?" cards from the user's scores.
 * The selection depends on the top-3 groups, the gap between them and the
 * exact scores, so two people with different profiles never see the same text.
 */
export function generateStrengths(scores: ScoreMap): StrengthInsight[] {
  const [c1, c2, c3] = rankCodes(scores)
  if (!c1 || !c2 || !c3) return []

  const pick = (code: typeof c1, offset: number): StrengthInsight => {
    const pool = PERSONALITY_MAP[code].insights
    return pool[(scores[code] + offset) % pool.length] as StrengthInsight
  }

  const p1 = PERSONALITY_MAP[c1]
  const p2 = PERSONALITY_MAP[c2]
  const first = pick(c1, 0)
  let second = pick(c1, 1)
  if (second.title === first.title) second = p1.insights.find((i) => i.title !== first.title) ?? second

  const cards: StrengthInsight[] = [first, second, pick(c2, 2)]
  if (scores[c3] >= 40) cards.push(pick(c3, 3))

  const gap = scores[c1] - scores[c2]
  cards.push(
    gap >= 15
      ? {
          icon: 'target',
          title: 'Hồ sơ rõ nét',
          text: `Nhóm ${p1.name} nổi trội hơn hẳn (+${gap} điểm so với nhóm kế tiếp) — bạn có xu hướng khá rõ về môi trường và kiểu công việc mình thích.`,
        }
      : {
          icon: 'layers',
          title: 'Hồ sơ đa năng',
          text: `${p1.name} và ${p2.name} khá sát nhau (chênh ${gap} điểm), cho thấy bạn có thể linh hoạt giữa nhiều kiểu công việc.`,
        },
    {
      icon: 'link',
      title: `${p1.name} × ${p2.name}`,
      text: `Nhóm ${p1.title.toLowerCase()} dẫn đầu, cùng với nhóm ${p2.title.toLowerCase()} ${p2.support}.`,
    },
  )

  return cards.slice(0, 6)
}

/** Dynamic result headline subtitle — mentions close contenders when relevant. */
export function describeProfile(scores: ScoreMap): string {
  const [c1, c2] = rankCodes(scores)
  if (!c1 || !c2) return ''
  const base = PERSONALITY_MAP[c1].tagline
  return scores[c1] - scores[c2] <= 5
    ? `${base} Nhóm ${PERSONALITY_MAP[c2].name} cũng nổi bật gần ngang, nên bạn có thể kết hợp cả hai hướng.`
    : base
}
