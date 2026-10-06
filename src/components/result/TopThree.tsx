import { motion } from 'framer-motion'
import { CountUp } from '@/components/shared/CountUp'
import { PERSONALITY_MAP } from '@/data/personalities'
import type { PersonalityCode, ScoreMap } from '@/types'

export function TopThree({ codes, scores }: { codes: PersonalityCode[]; scores: ScoreMap }) {
  return (
    <ol className="space-y-3">
      {codes.slice(0, 3).map((code, i) => {
        const p = PERSONALITY_MAP[code]
        return (
          <motion.li
            key={code}
            initial={{ opacity: 0, x: 20, scale: 0.94 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.03, x: 6 }}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a1128]/80 p-4 shadow-soft backdrop-blur-xl transition-colors hover:border-electric-400/40 cursor-default"
          >
            <span className="font-mono text-sm font-black text-slate-400 dark:text-slate-500 tabular-nums">
              0{i + 1}
            </span>
            <span className="h-10 w-1 rounded-full shadow-sm" style={{ background: p.color }} />
            <div className="min-w-0 flex-1">
              <p className="font-bold tracking-tight text-slate-900 dark:text-white text-base">
                {p.name}
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {p.title}
              </p>
            </div>
            <span className="font-mono text-2xl font-black tabular-nums tracking-tight text-slate-900 dark:text-white">
              <CountUp value={scores[code]} suffix="%" />
            </span>
          </motion.li>
        )
      })}
    </ol>
  )
}
