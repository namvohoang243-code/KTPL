import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'
import { InViewMount } from '@/components/shared/Reveal'
import { TooltipCard } from '@/components/shared/TooltipCard'
import { PERSONALITIES, PERSONALITY_MAP } from '@/data/personalities'
import type { PersonalityCode, ScoreMap } from '@/types'

interface PersonalityRadarProps {
  scores: ScoreMap
  /** Optional second series, e.g. the class average */
  compare?: ScoreMap
  label?: string
  compareLabel?: string
  height?: number
}

interface TickProps {
  x?: number | string
  y?: number | string
  cx?: number
  cy?: number
  payload?: { value: PersonalityCode }
}

function AxisTick({ x = 0, y = 0, cx = 0, cy = 0, payload }: TickProps) {
  const code = payload?.value
  if (!code) return null
  const numX = Number(x) || 0
  const numY = Number(y) || 0
  // push the label slightly outward from the centre
  const dx = numX - cx
  const dy = numY - cy
  const len = Math.hypot(dx, dy) || 1
  const ox = numX + (dx / len) * 12
  const oy = numY + (dy / len) * 12
  return (
    <g>
      <text
        x={ox}
        y={oy - 2}
        textAnchor="middle"
        fontSize={14}
        fontWeight={800}
        className="fill-slate-900 dark:fill-white"
      >
        {code}
      </text>
      <text
        x={ox}
        y={oy + 12}
        textAnchor="middle"
        fontSize={10}
        fontWeight={600}
        className="fill-slate-500 dark:fill-slate-400"
      >
        {PERSONALITY_MAP[code].name}
      </text>
    </g>
  )
}

export function PersonalityRadar({ scores, compare, label = 'Bạn', compareLabel = 'Trung bình lớp', height = 340 }: PersonalityRadarProps) {
  const data = PERSONALITIES.map((p) => ({
    code: p.code,
    you: scores[p.code],
    other: compare?.[p.code],
  }))

  return (
    <InViewMount minHeight={height} className="w-full">
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="58%" margin={{ top: 20, right: 32, bottom: 20, left: 32 }}>
            <PolarGrid gridType="polygon" stroke="currentColor" className="text-slate-200 dark:text-white/10" />
            <PolarAngleAxis dataKey="code" tick={(props: TickProps) => <AxisTick {...props} />} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            {compare && (
              <Radar
                name={compareLabel}
                dataKey="other"
                stroke="#14b8a6"
                strokeWidth={2}
                strokeDasharray="5 4"
                fill="#14b8a6"
                fillOpacity={0.1}
                animationDuration={1400}
                animationBegin={300}
              />
            )}
            <Radar
              name={label}
              dataKey="you"
              stroke="#2f5bff"
              strokeWidth={2.75}
              fill="#2f5bff"
              fillOpacity={0.2}
              dot={{ r: 4, fill: '#fff', stroke: '#2f5bff', strokeWidth: 2 }}
              animationDuration={1600}
              animationEasing="ease-out"
            />
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const code = (payload[0]?.payload as { code: PersonalityCode }).code
                return (
                  <TooltipCard
                    title={`${code} — ${PERSONALITY_MAP[code].name}`}
                    rows={payload.map((p) => ({
                      color: p.color as string,
                      label: p.name,
                      value: `${p.value}%`,
                    }))}
                  />
                )
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </InViewMount>
  )
}
