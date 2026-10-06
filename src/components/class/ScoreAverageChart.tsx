import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { InViewMount } from '@/components/shared/Reveal'
import { TooltipCard } from '@/components/shared/TooltipCard'
import { PERSONALITY_MAP } from '@/data/personalities'
import type { ClassStats } from '@/engine/classStats'

/** Average score per personality group across the class. */
export function ScoreAverageChart({ stats }: { stats: ClassStats }) {
  const data = stats.averages.map((a) => ({ ...a, name: PERSONALITY_MAP[a.code].name }))

  return (
    <InViewMount minHeight={320}>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 28, right: 8, bottom: 0, left: -24 }} barCategoryGap="22%">
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={{ fontSize: 11, fill: '#7488ab', fontWeight: 500 }}
              tickFormatter={(v: string) => (v.length > 9 ? `${v.slice(0, 8)}…` : v)}
            />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#a3b0c7' }} ticks={[0, 25, 50, 75, 100]} />
            <Tooltip
              cursor={{ fill: 'rgb(10 26 51 / 0.04)', radius: 12 }}
              content={({ active, payload }) => {
                const d = payload?.[0]?.payload as (typeof data)[number] | undefined
                if (!active || !d) return null
                return <TooltipCard title={d.name} rows={[{ label: 'Điểm trung bình lớp', value: `${d.avg}%`, color: PERSONALITY_MAP[d.code].color }]} />
              }}
            />
            <Bar dataKey="avg" radius={[12, 12, 4, 4]} animationDuration={1200} animationEasing="ease-out">
              {data.map((d) => (
                <Cell key={d.code} fill={PERSONALITY_MAP[d.code].color} />
              ))}
              <LabelList dataKey="avg" position="top" style={{ fontSize: 12, fontWeight: 700, fill: '#0a1a33' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </InViewMount>
  )
}
