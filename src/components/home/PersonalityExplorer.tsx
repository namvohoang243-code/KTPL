import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { getIcon } from '@/components/shared/icons'
import { ZoomReveal } from '@/components/shared/ZoomReveal'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { PERSONALITIES } from '@/data/personalities'
import { cn } from '@/lib/utils'

/** Interactive overview of the 6 RIASEC groups with zoom animations and crisp contrast. */
export function PersonalityExplorer() {
  const [activeCode, setActiveCode] = useState(PERSONALITIES[1]?.code ?? 'I')
  const active = PERSONALITIES.find((p) => p.code === activeCode) ?? PERSONALITIES[0]!
  const Icon = getIcon(active.icon)

  return (
    <section className="container-page py-16" aria-labelledby="riasec-title">
      <ZoomReveal>
        <SectionHeading
          eyebrow="Mô hình RIASEC"
          title={<span id="riasec-title">6 Nhóm Tính Cách & Định Hướng Nghề Nghiệp</span>}
          description="Chuẩn hóa theo lý thuyết tâm lý học John Holland — giải mã các thiên hướng tư duy tự nhiên để chọn đúng ngành nghề."
        />
      </ZoomReveal>

      <ZoomReveal className="mt-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div role="tablist" aria-label="Nhóm tính cách" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
          {PERSONALITIES.map((p) => {
            const PIcon = getIcon(p.icon)
            const selected = p.code === activeCode
            return (
              <motion.button
                key={p.code}
                role="tab"
                aria-selected={selected}
                id={`riasec-tab-${p.code}`}
                onClick={() => setActiveCode(p.code)}
                onMouseEnter={() => setActiveCode(p.code)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', damping: 20, stiffness: 350 }}
                className={cn(
                  'group relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border p-3 sm:p-4 text-left transition-all duration-300',
                  selected
                    ? 'border-cobalt-500 bg-cobalt-600 text-white shadow-glow-cobalt'
                    : 'border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a1128]/80 text-slate-800 dark:text-slate-200 hover:border-electric-400/50 hover:bg-slate-50 dark:hover:bg-white/[0.06]',
                )}
              >
                <span
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl transition-colors shadow-soft"
                  style={{
                    background: selected ? 'rgba(255, 255, 255, 0.2)' : `${p.color}1a`,
                    color: selected ? '#ffffff' : p.color,
                  }}
                >
                  <PIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <p className="mt-3 sm:mt-4 font-mono text-xs font-black tracking-[0.2em] opacity-80">{p.code}</p>
                <p className="mt-0.5 font-bold leading-tight text-sm sm:text-base">{p.name}</p>
                <p className={cn('mt-0.5 text-xs line-clamp-1', selected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400')}>
                  {p.title}
                </p>
              </motion.button>
            )
          })}
        </div>

        {/* Right Preview Card with Zoom In/Out Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.code}
            initial={{ opacity: 0, scale: 0.92, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -14 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            role="tabpanel"
            aria-labelledby={`riasec-tab-${active.code}`}
            className="surface relative overflow-hidden p-4 sm:p-9 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0a1128]/90 backdrop-blur-2xl"
          >
            <div
              className="absolute -right-12 -top-12 h-52 w-52 rounded-full opacity-[0.16] blur-3xl pointer-events-none"
              style={{ background: active.color }}
            />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <span
                  className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl text-white shadow-lift shrink-0"
                  style={{ background: active.color }}
                >
                  <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
                </span>
                <div>
                  <span
                    className="font-mono text-[11px] sm:text-xs font-black uppercase tracking-wider"
                    style={{ color: active.color }}
                  >
                    NHÓM {active.code} • {active.title}
                  </span>
                  <h3 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {active.name}
                  </h3>
                </div>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <Sparkles className="h-3 w-3 text-gold-400" />
                Đặc tính tiêu biểu
              </span>
            </div>

            <p className="mt-5 text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {active.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Thế mạnh cốt lõi
                </p>
                <ul className="mt-2.5 space-y-1.5">
                  {active.strengths.slice(0, 3).map((st, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Môi trường làm việc ưa thích
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {active.environments.join(' • ')}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-200 dark:border-white/10 pt-4">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Nghề nghiệp điển hình:</span>
              {active.examples.map((c) => (
                <span
                  key={c}
                  className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  {c}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </ZoomReveal>
    </section>
  )
}
