import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'

const STEPS = ['Chuẩn hóa câu trả lời', 'Tính điểm 6 nhóm RIASEC', 'So khớp nhóm nghề nghiệp']

/** Full-screen loading state shown for ~1.6s after the last question. */
export function AnalyzingScreen() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = STEPS.map((_, i) => window.setTimeout(() => setStep(i + 1), 450 * (i + 1)))
    return () => timers.forEach(window.clearTimeout)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container-page flex min-h-[70vh] flex-col items-center justify-center text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-40 w-40 items-center justify-center">
        <span className="absolute inset-0 animate-pulse-ring rounded-full border border-cobalt-400/60" />
        <span className="absolute inset-0 animate-pulse-ring rounded-full border border-teal-400/60 [animation-delay:0.8s]" />
        <motion.svg viewBox="0 0 100 100" className="absolute inset-0" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}>
          <circle cx="50" cy="50" r="44" fill="none" stroke="#e5e9f1" strokeWidth="1.5" strokeDasharray="2 5" />
          <circle cx="50" cy="6" r="4" fill="#f5b544" />
          <circle cx="88" cy="72" r="3" fill="#14b8a6" />
          <circle cx="12" cy="72" r="3" fill="#2f5bff" />
        </motion.svg>
        <motion.span
          className="flex h-20 w-20 items-center justify-center rounded-3xl bg-navy-900 shadow-lift"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        >
          <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 17 9 9l4 5 6-9" stroke="#2dd4bf" />
            <circle cx="19" cy="5" r="1.8" fill="#f5b544" stroke="none" />
          </svg>
        </motion.span>
      </div>

      <h1 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">Đang phân tích hồ sơ tính cách...</h1>

      <ul className="mt-8 space-y-3 text-left">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-3 text-sm font-medium">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-line bg-white">
              <AnimatePresence mode="wait">
                {step > i ? (
                  <motion.span key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex h-full w-full items-center justify-center rounded-full bg-teal-500 text-white">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </motion.span>
                ) : (
                  <motion.span key="wait" className="h-2 w-2 rounded-full bg-navy-200" />
                )}
              </AnimatePresence>
            </span>
            <span className={step > i ? 'text-navy-900' : 'text-navy-400'}>{s}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
