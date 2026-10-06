import { useState } from 'react'
import { CareerCard } from '@/components/career/CareerCard'
import { CareerDetail } from '@/components/career/CareerDetail'
import type { CareerCluster, CareerMatch, Occupation, ScoreMap } from '@/types'

interface CareerGridProps {
  /** Clusters to show. When `scores` is provided they should already be sorted by compatibility. */
  matches: CareerMatch<CareerCluster>[]
  scores?: ScoreMap | null
  showRank?: boolean
  showCompatibility?: boolean
}

/** Grid of career cards + the occupation detail modal. */
export function CareerGrid({ matches, scores, showRank = true, showCompatibility = true }: CareerGridProps) {
  const [selected, setSelected] = useState<Occupation | null>(null)

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {matches.map((m, i) => (
          <CareerCard
            key={m.item.id}
            cluster={m.item}
            rank={showRank ? i + 1 : undefined}
            compatibility={showCompatibility ? m.compatibility : undefined}
            scores={scores}
            onOpenOccupation={setSelected}
            delay={(i % 3) * 0.08}
          />
        ))}
      </div>
      <CareerDetail occupation={selected} scores={scores} onClose={() => setSelected(null)} />
    </>
  )
}
