import { motion } from 'framer-motion'
import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { InViewMount } from '@/components/shared/Reveal'
import { TooltipCard } from '@/components/shared/TooltipCard'
import { PERSONALITY_MAP } from '@/data/personalities'
import type { ClassStats } from '@/engine/classStats'
import { cn } from '@/lib/utils'

export function PersonalityDistribution({ stats }: { stats: ClassStats }) {
  const [hover, setHover] = useState<string | null>(null)
  const data = stats.distribution.filter((d) => d.count > 0).map((d) => ({ ...d, name: PERSONALITY_MAP[d.code].name }))
  const focus = stats.distribution.find((d) => d.code === hover)

  return (
    <div className="grid items-center gap-8 md:grid-cols-[1fr_0.9fr]">
      <InViewMount minHeight={300} className="relative mx-auto h-[300px] w-full max-w-[340px]">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              innerRadius="62%"
              outerRadius="96%"
              paddingAngle={3}
              cornerRadius={8}
              stroke="none"
              animationDuration={1300}
              onMouseEnter={(_, i) => setHover(data[i]?.code ?? null)}
              onMouseLeave={() => setHover(null)}
            >
              {data.map((d) => (
                <Cell
                  key={d.code}
                  fill={PERSONALITY_MAP[d.code].color}
                  fillOpacity={hover && hover !== d.code ? 0.35 : 1}
                  style={{ transition: 'fill-opacity 200ms', outline: 'none', cursor: 'pointer' }}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                const d = payload?.[0]?.payload as (typeof data)[number] | undefined
                if (!active || !d) return null
                return (
                  <TooltipCard
                    title={d.name}
                    rows={[
                      { label: 'Số học sinh', value: d.count, color: PERSONALITY_MAP[d.code].color },
                      { label: 'Tỷ lệ', value: `${Math.round(d.pct)}%` },
                    ]}
                  />
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-4xl font-semibold tracking-tight tabular-nums">{focus ? `${Math.round(focus.pct)}%` : stats.participants}</p>
          <p className="mt-1 text-xs font-medium text-navy-400">{focus ? PERSONALITY_MAP[focus.code].name : 'học sinh'}</p>
        </div>
      </InViewMount>

      <ul className="space-y-1.5">
        {stats.distribution.map((d, i) => {
          const p = PERSONALITY_MAP[d.code]
          return (
            <motion.li
              key={d.code}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.07 }}
              onMouseEnter={() => setHover(d.code)}
              onMouseLeave={() => setHover(null)}
              className={cn(
                'flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
                hover === d.code ? 'bg-navy-50' : 'hover:bg-navy-50/60',
              )}
            >
              <span className="h-3 w-3 rounded-full" style={{ background: p.color }} />
              <span className="flex-1 text-sm font-medium">{p.name}</span>
              <span className="text-xs tabular-nums text-navy-400">{d.count} hs</span>
              <span className="w-12 text-right text-sm font-semibold tabular-nums">{Math.round(d.pct)}%</span>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
