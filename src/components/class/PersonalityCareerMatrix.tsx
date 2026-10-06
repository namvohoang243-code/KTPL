import { motion } from 'framer-motion'
import { MousePointer2 } from 'lucide-react'
import { useState } from 'react'
import { CLUSTER_MAP } from '@/data/careers'
import { PERSONALITY_MAP } from '@/data/personalities'
import type { ClassStats } from '@/engine/classStats'
import { cn } from '@/lib/utils'

/** Personality × career heatmap computed from class data. */
export function PersonalityCareerMatrix({ stats }: { stats: ClassStats }) {
  const { rows, cols, cells, max } = stats.matrix
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null)

  const hoverCount = hover ? (cells[hover.r]?.[hover.c] ?? 0) : 0
  const hoverRow = hover ? PERSONALITY_MAP[rows[hover.r]!] : null
  const hoverCol = hover ? CLUSTER_MAP[cols[hover.c]!] : null

  return (
    <div>
      <div className="flex min-h-12 items-center">
        {hover && hoverRow && hoverCol ? (
          <motion.p
            key={`${hover.r}-${hover.c}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 rounded-2xl bg-navy-900 px-5 py-2.5 text-sm text-white shadow-soft"
          >
            <span className="font-semibold">
              {hoverRow.name} → {hoverCol.shortLabel}
            </span>
            <span className="text-teal-400">
              {hoverCount} {hoverCount === 1 ? 'student' : 'students'}
            </span>
          </motion.p>
        ) : (
          <p className="inline-flex items-center gap-2 text-sm text-navy-400">
            <MousePointer2 className="h-4 w-4" /> Di chuột vào một ô để xem chi tiết
          </p>
        )}
      </div>

      <div className="-mx-2 mt-3 overflow-x-auto px-2 pb-2">
        <div className="min-w-[560px]">
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `4.5rem repeat(${cols.length}, minmax(0, 1fr))` }}>
            <div />
            {cols.map((c, ci) => (
              <div
                key={c}
                className={cn(
                  'truncate pb-2 text-center text-xs font-semibold transition-colors',
                  hover?.c === ci ? 'text-cobalt-600' : 'text-navy-500',
                )}
              >
                {CLUSTER_MAP[c]?.shortLabel ?? c}
              </div>
            ))}

            {rows.map((code, ri) => (
              <div key={code} className="contents">
                <div className={cn('flex items-center gap-2 pr-2 text-sm font-semibold transition-colors', hover?.r === ri ? 'text-cobalt-600' : 'text-navy-700')}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: PERSONALITY_MAP[code].color }} />
                  {code}
                </div>
                {cols.map((c, ci) => {
                  const count = cells[ri]?.[ci] ?? 0
                  const intensity = max === 0 ? 0 : count / max
                  const dark = intensity > 0.5
                  return (
                    <motion.button
                      type="button"
                      key={`${code}-${c}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (ri + ci) * 0.03, duration: 0.4 }}
                      whileHover={{ scale: 1.08 }}
                      onMouseEnter={() => setHover({ r: ri, c: ci })}
                      onFocus={() => setHover({ r: ri, c: ci })}
                      onMouseLeave={() => setHover(null)}
                      onBlur={() => setHover(null)}
                      aria-label={`${PERSONALITY_MAP[code].name} → ${CLUSTER_MAP[c]?.shortLabel ?? c}: ${count} học sinh`}
                      className={cn(
                        'relative flex aspect-[4/3] cursor-default items-center justify-center rounded-xl text-sm font-semibold tabular-nums outline-offset-2 transition-shadow',
                        count === 0 && 'border border-dashed border-navy-100 text-navy-200',
                        count > 0 && (dark ? 'text-white' : 'text-navy-900'),
                        hover?.r === ri && hover?.c === ci && 'z-10 shadow-lift ring-2 ring-navy-900',
                      )}
                      style={count > 0 ? { background: `rgb(47 91 255 / ${0.1 + intensity * 0.9})` } : undefined}
                    >
                      {count === 0 ? '·' : count}
                    </motion.button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 text-xs text-navy-400">
        <span>Ít</span>
        <span className="h-2 w-40 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(47 91 255 / 0.1), rgb(47 91 255 / 1))' }} />
        <span>Nhiều</span>
      </div>
    </div>
  )
}
