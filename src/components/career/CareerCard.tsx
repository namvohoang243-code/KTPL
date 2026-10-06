import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { getIcon } from '@/components/shared/icons'
import { CountUp } from '@/components/shared/CountUp'
import { occupationsOfCluster } from '@/data/careers'
import { explainFit, rankOccupations } from '@/engine/matching'
import type { CareerCluster, Occupation, ScoreMap } from '@/types'

interface CareerCardProps {
  cluster: CareerCluster
  rank?: number
  compatibility?: number
  scores?: ScoreMap | null
  onOpenOccupation: (o: Occupation) => void
  delay?: number
}

function CompatRing({ value }: { value: number }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <div className="relative h-[4.5rem] w-[4.5rem] shrink-0">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-slate-200 dark:text-white/10" />
        <motion.circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="url(#compat-grad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - value / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        />
        <defs>
          <linearGradient id="compat-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-base font-bold tabular-nums text-slate-900 dark:text-white">
        <CountUp value={value} suffix="%" duration={1.2} />
      </span>
    </div>
  )
}

export function CareerCard({ cluster, rank, compatibility, scores, onOpenOccupation, delay = 0 }: CareerCardProps) {
  const Icon = getIcon(cluster.icon)
  const hasProfile = Boolean(scores)
  const occupations = scores
    ? rankOccupations(scores, cluster.id)
        .slice(0, 5)
        .map((m) => m.item)
    : occupationsOfCluster(cluster.id).slice(0, 5)

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="surface group relative flex h-full flex-col overflow-hidden p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white/85 dark:bg-[#0a1128]/85 backdrop-blur-xl shadow-lift hover:border-electric-400/50 transition-colors"
    >
      {rank !== undefined && (
        <span className="absolute right-4 sm:right-6 top-3 sm:top-4 select-none font-mono text-5xl sm:text-6xl font-black tracking-tighter text-slate-100 dark:text-white/[0.04] transition-colors group-hover:text-cobalt-500/10">
          {String(rank).padStart(2, '0')}
        </span>
      )}

      <div className="relative flex items-start justify-between gap-3 sm:gap-4">
        <span className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-tr from-cobalt-600 to-electric-500 text-white shadow-soft transition-transform duration-300 group-hover:scale-105">
          <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
        </span>
        {compatibility !== undefined && (
          <div className="flex flex-col items-center gap-1">
            <CompatRing value={compatibility} />
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Độ tương thích
            </span>
          </div>
        )}
      </div>

      <div className="relative mt-4 sm:mt-5">
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-cobalt-600 dark:text-electric-400">
          {cluster.shortLabel}
        </p>
        <h3 className="mt-1 text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {cluster.name}
        </h3>
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {cluster.description}
        </p>
      </div>

      {hasProfile && scores && (
        <div className="relative mt-3.5 sm:mt-4 rounded-xl sm:rounded-2xl border border-teal-500/20 bg-teal-50/70 dark:bg-teal-500/10 p-3 sm:p-4">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-300">
            Lý do phù hợp với bạn
          </p>
          <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {explainFit(scores, cluster.code)}
          </p>
        </div>
      )}

      <div className="relative mt-auto pt-5 sm:pt-6">
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
          Nghề nghiệp tiêu biểu
        </p>
        <ul className="mt-2.5 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
          {occupations.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => onOpenOccupation(o)}
                id={`occ-${o.id}`}
                className="group/chip inline-flex cursor-pointer items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 transition-all hover:border-electric-400 hover:bg-electric-400/10 hover:text-electric-400"
              >
                {o.name}
                <ChevronRight className="h-3.5 w-3.5 -ml-0.5 opacity-0 transition-all group-hover/chip:ml-0 group-hover/chip:opacity-100" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  )
}
