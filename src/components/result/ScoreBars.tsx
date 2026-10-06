import { motion } from 'framer-motion'
import { getIcon } from '@/components/shared/icons'
import { CountUp } from '@/components/shared/CountUp'
import { PERSONALITY_MAP } from '@/data/personalities'
import { rankCodes } from '@/engine/scoring'
import type { ScoreMap } from '@/types'

/** 6 horizontal progress bars, strongest first, with zoom hover and crisp contrast. */
export function ScoreBars({ scores }: { scores: ScoreMap }) {
  const ranked = rankCodes(scores)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {ranked.map((code, i) => {
        const p = PERSONALITY_MAP[code]
        const Icon = getIcon(p.icon)
        return (
          <motion.article
            key={code}
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="surface p-5 sm:p-6 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl shadow-soft hover:border-electric-400/40 transition-colors cursor-default"
          >
            <div className="flex items-start gap-4">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-soft"
                style={{ background: `${p.color}20`, color: p.color }}
              >
                <Icon className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-bold tracking-tight text-base sm:text-lg text-slate-900 dark:text-white">
                    {p.name}{' '}
                    <span className="ml-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      ({p.title})
                    </span>
                  </h3>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-xl font-black text-slate-900 dark:text-white tabular-nums">
                      <CountUp value={scores[code]} suffix="%" duration={1.2} />
                    </span>
                    <span className="block text-[0.7rem] font-mono text-slate-400 font-semibold">
                      {Math.round((scores[code] / 100) * 40) + 10}/50 điểm
                    </span>
                  </div>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {p.tagline}
                </p>
              </div>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${p.color}, #38bdf8)` }}
                initial={{ width: 0 }}
                whileInView={{ width: `${scores[code]}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.06, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </motion.article>
        )
      })}
    </div>
  )
}
