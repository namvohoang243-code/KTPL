import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { getIcon } from '@/components/shared/icons'
import { generateStrengths } from '@/engine/strengths'
import type { ScoreMap } from '@/types'

export function StrengthsSection({ scores }: { scores: ScoreMap }) {
  const strengths = useMemo(() => generateStrengths(scores), [scores])

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {strengths.map((s, i) => {
        const Icon = getIcon(s.icon)
        return (
          <motion.article
            key={`${s.title}-${i}`}
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.04, y: -6 }}
            className="surface group p-7 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl shadow-soft hover:border-electric-400/40 transition-colors cursor-default"
          >
            <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-cobalt-500/10 text-cobalt-600 dark:text-electric-400 shadow-soft transition-colors duration-300 group-hover:bg-cobalt-600 group-hover:text-white">
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {s.title}
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {s.text}
            </p>
          </motion.article>
        )
      })}
    </div>
  )
}
