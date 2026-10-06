import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { InViewMount } from '@/components/shared/Reveal'
import { TooltipCard } from '@/components/shared/TooltipCard'
import { CLUSTER_MAP } from '@/data/careers'
import type { ClassStats } from '@/engine/classStats'

const SHADES = ['#0a1a33', '#163463', '#2449d6', '#2f5bff', '#5a7fff', '#14b8a6', '#2dd4bf', '#7488ab']

/** Horizontal bars of the most popular career clusters in the class. */
export function CareerDistribution({ stats, limit = 8 }: { stats: ClassStats; limit?: number }) {
  const data = stats.careerCounts.slice(0, limit).map((c) => ({
    ...c,
    name: CLUSTER_MAP[c.clusterId]?.shortLabel ?? c.clusterId,
  }))
  const height = Math.max(220, data.length * 52 + 16)

  return (
    <InViewMount minHeight={height}>
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 36, bottom: 0, left: 0 }} barCategoryGap="28%">
            <XAxis type="number" hide domain={[0, 'dataMax']} />
            <YAxis
              type="category"
              dataKey="name"
              width={92}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 13, fill: '#163463', fontWeight: 600 }}
            />
            <Tooltip
              cursor={{ fill: 'rgb(10 26 51 / 0.04)', radius: 10 }}
              content={({ active, payload }) => {
                const d = payload?.[0]?.payload as (typeof data)[number] | undefined
                if (!active || !d) return null
                return (
                  <TooltipCard
                    title={d.name}
                    rows={[
                      { label: 'Số học sinh', value: d.count },
                      { label: 'Tỷ lệ', value: `${Math.round(d.pct)}%` },
                    ]}
                  />
                )
              }}
            />
            <Bar dataKey="count" radius={[4, 12, 12, 4]} animationDuration={1200} animationEasing="ease-out" background={{ fill: '#f3f5f9', radius: 12 }}>
              {data.map((d, i) => (
                <Cell key={d.clusterId} fill={SHADES[i % SHADES.length]} />
              ))}
              <LabelList dataKey="count" position="right" style={{ fontSize: 13, fontWeight: 700, fill: '#0a1a33' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </InViewMount>
  )
}
