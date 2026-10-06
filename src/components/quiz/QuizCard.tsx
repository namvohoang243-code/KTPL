import { motion } from 'framer-motion'
import { Check, Sparkles, Layers } from 'lucide-react'
import { HOLLAND_GROUP_METAS, LIKERT_OPTIONS } from '@/data/questions'
import { cn } from '@/lib/utils'
import type { Question } from '@/types'

interface QuizCardProps {
  question: Question
  index: number
  totalQuestions: number
  selected: number | undefined
  onSelect: (score: number) => void
}

export function QuizCard({
  question,
  index,
  totalQuestions,
  selected,
  onSelect,
}: QuizCardProps) {
  const groupMeta = HOLLAND_GROUP_METAS[question.code]

  return (
    <div className="surface relative overflow-hidden p-4 sm:p-10 shadow-lift border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0a1128]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl">
      {/* Decorative ambient gradient backdrop */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: groupMeta.color }}
      />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-cobalt-500/15 blur-3xl" />

      {/* Header bar: Group title & Question Number */}
      <div className="flex items-center justify-between gap-2 pb-4 sm:pb-5 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <span
            className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black shadow-sm"
            style={{ backgroundColor: `${groupMeta.color}25`, color: groupMeta.color }}
          >
            {question.code}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white truncate">
                {groupMeta.name}
              </span>
              <span className="text-[0.65rem] sm:text-[0.68rem] px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 font-semibold shrink-0">
                {question.code}{question.number}
              </span>
            </div>
            <p className="text-[0.68rem] sm:text-[0.72rem] text-slate-500 dark:text-slate-400 truncate hidden xs:block">
              {groupMeta.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="text-xs font-mono font-bold text-cobalt-600 dark:text-electric-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold-400" />
            CÂU {String(index + 1).padStart(2, '0')}/{totalQuestions}
          </span>
        </div>
      </div>

      {/* Question statement */}
      <div className="my-4 sm:my-8">
        <span className="text-[0.68rem] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1.5">
          <Layers className="h-3 w-3" /> Mức độ phù hợp với bạn:
        </span>
        <h2 className="text-base sm:text-2xl font-bold leading-snug sm:leading-relaxed tracking-tight text-slate-900 dark:text-white">
          {question.text}
        </h2>
      </div>

      {/* 5-point Likert Options */}
      <div
        role="radiogroup"
        aria-label={question.text}
        className="grid grid-cols-1 gap-2 sm:gap-3"
      >
        {LIKERT_OPTIONS.map((opt) => {
          const active = selected === opt.score

          return (
            <motion.button
              key={opt.score}
              type="button"
              role="radio"
              aria-checked={active}
              id={`answer-${question.id}-${opt.score}`}
              onClick={() => onSelect(opt.score)}
              whileHover={{ x: 2, scale: 1.004 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className={cn(
                'group relative flex w-full cursor-pointer items-center justify-between gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border p-2.5 sm:p-4 text-left transition-all duration-200 min-h-[50px] sm:min-h-[56px]',
                active
                  ? 'border-cobalt-500 bg-gradient-to-r from-cobalt-600 to-electric-600 text-white shadow-glow-cobalt ring-2 ring-cobalt-400/30'
                  : 'border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] hover:border-cobalt-400/50 hover:bg-slate-100/90 dark:hover:bg-white/[0.07] text-slate-800 dark:text-slate-200',
              )}
            >
              {/* Left Score Badge & Label */}
              <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
                <span
                  className={cn(
                    'flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm sm:text-base font-black transition-all shadow-sm',
                    active
                      ? 'bg-white text-cobalt-700 shadow-md scale-105'
                      : 'bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/15 group-hover:border-cobalt-400 group-hover:text-cobalt-600 dark:group-hover:text-electric-400',
                  )}
                >
                  {active ? <Check className="h-4 w-4 sm:h-5 sm:w-5 text-cobalt-700 stroke-[3]" /> : opt.score}
                </span>

                <div className="min-w-0">
                  <span
                    className={cn(
                      'text-sm sm:text-base font-medium leading-normal block',
                      active ? 'text-white font-semibold' : 'text-slate-800 dark:text-slate-200',
                    )}
                  >
                    {opt.text}
                  </span>
                </div>
              </div>

              {/* Right: Keyboard Shortcut & Active Marker */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={cn(
                    'hidden sm:inline-block rounded-lg px-2 py-0.5 font-mono text-[0.68rem] font-bold transition-all',
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200/60 dark:bg-white/5 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300',
                  )}
                >
                  Phím {opt.score}
                </span>
                <span
                  className={cn(
                    'h-3.5 w-3.5 rounded-full border-2 transition-all',
                    active
                      ? 'border-white bg-white scale-110 shadow-sm'
                      : 'border-slate-300 dark:border-white/20 group-hover:border-cobalt-400',
                  )}
                />
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
