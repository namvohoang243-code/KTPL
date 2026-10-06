import { motion } from 'framer-motion'
import { Briefcase, Layers, Sparkles, Trophy, Users } from 'lucide-react'
import { CountUp } from '@/components/shared/CountUp'
import { getIcon } from '@/components/shared/icons'
import { CLUSTER_MAP } from '@/data/careers'
import { PERSONALITY_MAP } from '@/data/personalities'
import type { ClassStats } from '@/engine/classStats'

export function ClassOverview({ stats }: { stats: ClassStats }) {
  const topP = stats.topPersonality ? PERSONALITY_MAP[stats.topPersonality.code] : undefined
  const topC = stats.topCareer ? CLUSTER_MAP[stats.topCareer.clusterId] : undefined
  const TopCareerIcon = getIcon(topC?.icon ?? 'briefcase')

  const numbers = [
    { icon: Users, value: stats.participants, label: 'Participants', tone: 'bg-cobalt-50 text-cobalt-600' },
    { icon: Layers, value: stats.personalityGroups, label: 'Personality groups', tone: 'bg-teal-50 text-teal-600' },
    { icon: Briefcase, value: stats.careerClusters, label: 'Career clusters', tone: 'bg-gold-100 text-[#9a6a0a]' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-6">
      {numbers.map((n, i) => (
        <motion.div
          key={n.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -4 }}
          className="surface p-6 md:col-span-2"
        >
          <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${n.tone}`}>
            <n.icon className="h-5 w-5" />
          </span>
          <p className="mt-5 text-5xl font-semibold tracking-tight tabular-nums">
            <CountUp value={n.value} />
          </p>
          <p className="mt-1 text-sm font-medium text-navy-500">{n.label}</p>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.24, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -4 }}
        className="relative overflow-hidden rounded-3xl bg-navy-900 p-7 text-white shadow-lift md:col-span-3"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl" style={{ background: `${topP?.color ?? '#2f5bff'}66` }} />
        <p className="relative flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">
          <Trophy className="h-4 w-4" /> Top personality
        </p>
        <p className="relative mt-4 text-4xl font-semibold tracking-tight">{topP?.name ?? '—'}</p>
        {stats.topPersonality && topP && (
          <p className="relative mt-2 text-sm text-navy-200">
            {topP.title} · {stats.topPersonality.count} học sinh ({Math.round(stats.topPersonality.pct)}%)
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.32, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -4 }}
        className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-white to-cobalt-50 p-7 shadow-soft md:col-span-3"
      >
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cobalt-600">
          <Sparkles className="h-4 w-4" /> Top career
        </p>
        <div className="mt-4 flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-white">
            <TopCareerIcon className="h-7 w-7" />
          </span>
          <div>
            <p className="text-4xl font-semibold tracking-tight">{topC?.shortLabel ?? '—'}</p>
            {stats.topCareer && (
              <p className="mt-1 text-sm text-navy-500">
                {stats.topCareer.count} học sinh quan tâm ({Math.round(stats.topCareer.pct)}%)
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
