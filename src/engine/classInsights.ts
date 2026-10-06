import { CLUSTER_MAP } from '@/data/careers'
import { PERSONALITY_MAP } from '@/data/personalities'
import type { ClassStats } from '@/engine/classStats'

export interface ClassInsight {
  icon: string
  text: string
}

const joinNames = (names: string[]) =>
  names.length <= 1 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} và ${names[names.length - 1]}`

/** Natural-language insights computed from class statistics (never hard-coded conclusions). */
export function generateClassInsights(stats: ClassStats): ClassInsight[] {
  if (stats.participants === 0) return []
  const insights: ClassInsight[] = []
  const n = stats.participants

  // 1. Dominant personality
  const top = stats.topPersonality
  if (top) {
    const tied = stats.distribution.filter((d) => d.count === top.count)
    const names = tied.map((d) => PERSONALITY_MAP[d.code].name)
    insights.push({
      icon: 'users',
      text:
        tied.length > 1
          ? `Nhóm ${joinNames(names)} có tỷ lệ cao nhất, mỗi nhóm ${Math.round(top.pct)}% (${top.count}/${n} học sinh).`
          : `Nhóm ${names[0]} chiếm tỷ lệ cao nhất: ${Math.round(top.pct)}% lớp (${top.count}/${n} học sinh).`,
    })
  }

  // 2. Top careers
  const topCareers = stats.careerCounts.slice(0, 2)
  if (topCareers.length === 2) {
    const share = Math.round(topCareers[0]!.pct + topCareers[1]!.pct)
    insights.push({
      icon: 'briefcase',
      text: `${joinNames(topCareers.map((c) => CLUSTER_MAP[c.clusterId]?.shortLabel ?? c.clusterId))} là hai nhóm nghề được quan tâm nhiều nhất, chiếm ${share}% lớp.`,
    })
  } else if (topCareers[0]) {
    insights.push({
      icon: 'briefcase',
      text: `${CLUSTER_MAP[topCareers[0].clusterId]?.shortLabel ?? topCareers[0].clusterId} là nhóm nghề được quan tâm nhiều nhất (${topCareers[0].count} học sinh).`,
    })
  }

  // 3. Analytical vs social orientation
  const avg = stats.averageMap
  const analytical = Math.round((avg.I + avg.R) / 2)
  const social = Math.round((avg.S + avg.E) / 2)
  const diff = analytical - social
  insights.push({
    icon: 'scale',
    text:
      Math.abs(diff) < 4
        ? `Lớp khá cân bằng giữa tư duy phân tích (${analytical}) và giao tiếp xã hội (${social}).`
        : diff > 0
          ? `Lớp có xu hướng thiên về tư duy phân tích – thực hành (${analytical} điểm) hơn giao tiếp xã hội (${social} điểm).`
          : `Lớp có xu hướng thiên về giao tiếp & dẫn dắt (${social} điểm) hơn tư duy phân tích – thực hành (${analytical} điểm).`,
  })

  // 4. Diversity
  const represented = stats.distribution.filter((d) => d.count > 0).length
  insights.push({
    icon: 'layers',
    text:
      represented === stats.personalityGroups && (top?.pct ?? 0) < 35
        ? `Cả ${represented}/${stats.personalityGroups} nhóm tính cách đều có đại diện và không nhóm nào chiếm quá 35% — một lớp học khá đa dạng.`
        : `${represented}/${stats.personalityGroups} nhóm tính cách xuất hiện trong lớp, tập trung nhiều ở ${PERSONALITY_MAP[top?.code ?? 'I'].name}.`,
  })

  // 5. Strongest personality × career pairing
  const { rows, cols, cells, max } = stats.matrix
  if (max > 0) {
    for (let r = 0; r < rows.length; r++) {
      const c = (cells[r] ?? []).indexOf(max)
      if (c >= 0) {
        insights.push({
          icon: 'link',
          text: `Cặp kết hợp phổ biến nhất là ${PERSONALITY_MAP[rows[r]!].name} → ${CLUSTER_MAP[cols[c]!]?.shortLabel ?? cols[c]} (${max} học sinh).`,
        })
        break
      }
    }
  }

  // 6. Lowest average
  const lowest = [...stats.averages].sort((a, b) => a.avg - b.avg)[0]
  const highest = [...stats.averages].sort((a, b) => b.avg - a.avg)[0]
  if (lowest && highest && lowest.code !== highest.code) {
    insights.push({
      icon: 'trending',
      text: `Điểm trung bình cao nhất thuộc nhóm ${PERSONALITY_MAP[highest.code].name} (${highest.avg}), thấp nhất là ${PERSONALITY_MAP[lowest.code].name} (${lowest.avg}).`,
    })
  }

  return insights
}
