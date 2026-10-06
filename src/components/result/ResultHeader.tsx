import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { getIcon } from '@/components/shared/icons'
import { Badge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button'
import { PERSONALITY_MAP } from '@/data/personalities'
import { describeProfile } from '@/engine/strengths'
import type { QuizResult } from '@/types'

export function ResultHeader({ result }: { result: QuizResult }) {
  const topCode = (result.topCodes?.[0] || 'I') as keyof typeof PERSONALITY_MAP
  const top = PERSONALITY_MAP[topCode] || PERSONALITY_MAP.I
  const Icon = getIcon(top.icon)

  return (
    <section className="container-page pt-4 sm:pt-10" aria-labelledby="result-title">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-white/15 bg-gradient-to-br from-slate-950 via-[#0a1128] to-cobalt-950 px-4 py-8 sm:px-14 sm:py-16 text-white shadow-lift">
        <div className="bg-grid-tech pointer-events-none absolute inset-0 opacity-20" aria-hidden />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full blur-[110px]" style={{ background: `${top.color}66` }} aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-teal-500/20 blur-[100px]" aria-hidden />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Badge variant="dark" className="tracking-[0.16em]">
                {result.name ? `${result.name.toUpperCase()} • ${result.className || 'LỚP 10A1'}` : 'KẾT QUẢ CỦA BẠN'}
              </Badge>
            </motion.div>
            <motion.h1
              id="result-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 sm:mt-6 text-lg font-medium text-navy-200 sm:text-2xl"
            >
              {result.name ? `Hồ sơ định hướng nghề nghiệp của ${result.name}` : 'Kết quả khám phá của bạn'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 sm:mt-3 text-2xl font-semibold leading-[1.15] tracking-[-0.03em] sm:text-5xl"
            >
              Bạn có xu hướng thuộc nhóm
              <span className="mt-1 sm:mt-2 block bg-gradient-to-r from-white via-white to-teal-400 bg-clip-text text-3xl uppercase tracking-tight text-transparent sm:text-5xl md:text-7xl">
                {top.name}
              </span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-4 sm:mt-6 max-w-xl text-sm leading-relaxed text-navy-200 sm:text-lg"
            >
              {describeProfile(result.scores)}
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-6 sm:mt-8">
              <ButtonLink to="/quiz?retake=true" variant="glass" size="sm" className="w-full sm:w-auto justify-center">
                <RotateCcw className="h-4 w-4" />
                Làm lại bài test
              </ButtonLink>
            </motion.div>
          </div>

          {/* Personality badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 160, damping: 16 }}
            className="relative mx-auto flex h-44 w-44 items-center justify-center sm:h-64 sm:w-64"
          >
            <span className="absolute inset-0 animate-pulse-ring rounded-full border" style={{ borderColor: `${top.color}99` }} />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="2" />
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke={top.color === '#0E2A57' ? '#5a7fff' : top.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: result.scores[top.code] / 100 }}
                transition={{ delay: 0.7, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
            <div className="relative flex h-[78%] w-[78%] flex-col items-center justify-center rounded-full border border-white/15 bg-white/[0.06] backdrop-blur">
              <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-gold-400" />
              <span className="mt-1 text-4xl sm:text-6xl font-semibold tracking-tight">{top.code}</span>
              <span className="mt-1 text-[0.65rem] sm:text-xs font-semibold tracking-[0.25em] text-teal-400">{result.topType}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
