import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useMemo } from 'react'
import { getIcon } from '@/components/shared/icons'
import { generateClassInsights } from '@/engine/classInsights'
import type { ClassStats } from '@/engine/classStats'

/** "AI-style" summary — every sentence is computed from the live dataset. */
export function InsightCard({ stats }: { stats: ClassStats }) {
  const insights = useMemo(() => generateClassInsights(stats), [stats])

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-navy-900 p-7 text-white sm:p-12">
      <div className="bg-grid-dark pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-500/25 blur-[100px]" aria-hidden />

      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-[0.16em] text-gold-400">
          <Sparkles className="h-3.5 w-3.5" />
          CLASS INSIGHT · TỰ ĐỘNG TỔNG HỢP
        </span>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Điều thú vị về lớp bạn</h2>

        {insights.length === 0 ? (
          <p className="mt-6 text-navy-200">Chưa có dữ liệu để tổng hợp. Hãy import CSV ở trang quản trị.</p>
        ) : (
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {insights.map((ins, i) => {
              const Icon = getIcon(ins.icon)
              return (
                <motion.li
                  key={`${i}-${ins.text}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur transition-colors hover:bg-white/[0.09]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-teal-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="pt-0.5 text-[0.95rem] leading-relaxed text-navy-100">{ins.text}</p>
                </motion.li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
