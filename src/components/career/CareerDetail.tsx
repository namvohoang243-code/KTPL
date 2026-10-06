import { motion } from 'framer-motion'
import { ArrowRight, Building2, Lock, Wrench, Sparkles } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { CLUSTER_MAP } from '@/data/careers'
import { PERSONALITY_MAP } from '@/data/personalities'
import { matchCode } from '@/engine/matching'
import type { Occupation, ScoreMap } from '@/types'

interface CareerDetailProps {
  occupation: Occupation | null
  scores?: ScoreMap | null
  onClose: () => void
}

export function CareerDetail({ occupation, scores, onClose }: CareerDetailProps) {
  const match = occupation && scores ? matchCode(scores, occupation.code) : undefined
  const cluster = occupation ? CLUSTER_MAP[occupation.clusterId] : undefined

  return (
    <Dialog open={Boolean(occupation)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        {occupation && (
          <div className="p-5 sm:p-10">
            <span className="eyebrow !text-cobalt-600 dark:!text-electric-400">
              <Sparkles className="h-3 w-3" /> {cluster?.name}
            </span>
            <DialogTitle className="mt-1.5 sm:mt-2 pr-10 sm:pr-12 text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {occupation.name}
            </DialogTitle>
            <DialogDescription className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {occupation.description}
            </DialogDescription>

            {/* Match Percentage Banner */}
            <div className="mt-5 sm:mt-7 rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-[#0a1128] to-cobalt-950 p-4 sm:p-6 text-white shadow-lift">
              {match !== undefined ? (
                <div className="flex items-center justify-between gap-4 sm:gap-6">
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.18em] text-teal-400">
                      Mức độ tương thích
                    </p>
                    <p className="mt-0.5 sm:mt-1 font-mono text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                      {match}%
                    </p>
                  </div>
                  <div className="h-3 sm:h-3.5 flex-1 overflow-hidden rounded-full bg-white/15">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-teal-400 to-electric-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${match}%` }}
                      transition={{ delay: 0.2, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gold-400 shrink-0" />
                    Làm bài test 60 câu để xem độ phù hợp của bạn với nghề này.
                  </p>
                  <ButtonLink to="/intro" variant="gold" size="sm" onClick={onClose} className="shrink-0 gap-1.5 self-start sm:self-auto">
                    Làm bài test
                    <ArrowRight className="h-4 w-4" />
                  </ButtonLink>
                </div>
              )}
            </div>

            <div className="mt-6 sm:mt-8 space-y-5 sm:space-y-7">
              <section>
                <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  Nhóm tính cách tương ứng (Holland)
                </h3>
                <ul className="mt-2.5 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                  {occupation.code.map((c) => {
                    const p = PERSONALITY_MAP[c]
                    return (
                      <li
                        key={c}
                        className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border px-3 sm:px-3.5 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"
                        style={{ borderColor: `${p.color}50`, background: `${p.color}15` }}
                      >
                        <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full" style={{ background: p.color }} />
                        {p.name}
                        {scores && (
                          <span className="font-mono font-bold text-electric-400">
                            {scores[c]}%
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </section>

              <section>
                <h3 className="flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  <Wrench className="h-3.5 w-3.5 text-cobalt-500" /> Kỹ năng then chốt cần rèn luyện
                </h3>
                <ul className="mt-2.5 sm:mt-3 grid gap-2 sm:grid-cols-2">
                  {occupation.skills.map((s) => (
                    <li
                      key={s}
                      className="flex items-center gap-2 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.04] px-3.5 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-electric-400 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  <Building2 className="h-3.5 w-3.5 text-teal-400" /> Môi trường làm việc tiêu biểu
                </h3>
                <ul className="mt-2.5 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                  {occupation.environments.map((e) => (
                    <li
                      key={e}
                      className="rounded-full border border-teal-500/20 bg-teal-50 dark:bg-teal-500/10 px-3 sm:px-3.5 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-300"
                    >
                      {e}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
