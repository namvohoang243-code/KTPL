import { motion } from 'framer-motion'
import type { PersonalityCode } from '@/types'

interface QuizNodesProps {
  total: number
  currentIndex: number
  answers: Record<string, number>
  questions: { id: string; code: PersonalityCode; number: number }[]
  onJumpTo?: (index: number) => void
}

export function QuizNodes({ currentIndex, answers, questions, onJumpTo }: QuizNodesProps) {
  const stageIndex = Math.floor(currentIndex / 10)
  const stageStart = stageIndex * 10
  const stageEnd = Math.min(questions.length, stageStart + 10)
  const stageQuestions = questions.slice(stageStart, stageEnd)

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center sm:justify-end">
      {stageQuestions.map((q, idxInStage) => {
        const globalIdx = stageStart + idxInStage
        const isAnswered = answers[q.id] !== undefined
        const isCurrent = globalIdx === currentIndex

        return (
          <button
            key={q.id}
            type="button"
            onClick={() => onJumpTo?.(globalIdx)}
            disabled={!onJumpTo}
            className="group relative flex h-6 w-6 sm:h-7 sm:w-7 cursor-pointer items-center justify-center rounded-lg sm:rounded-xl transition-all focus:outline-none"
            aria-label={`Câu ${q.code}${q.number}${isCurrent ? ' (hiện tại)' : isAnswered ? ' (đã trả lời)' : ''}`}
          >
            {isCurrent ? (
              <span className="relative flex h-6 w-6 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-lg bg-cobalt-500 opacity-60" />
                <span className="relative flex h-6 w-6 items-center justify-center rounded-lg bg-cobalt-600 font-mono text-[0.65rem] font-black text-white shadow-glow">
                  {q.number}
                </span>
              </span>
            ) : isAnswered ? (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex h-5 w-5 items-center justify-center rounded-lg bg-teal-500/80 font-mono text-[0.6rem] font-bold text-white shadow-sm"
              >
                {q.number}
              </motion.span>
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-lg border border-slate-300 dark:border-white/15 font-mono text-[0.6rem] text-slate-400 group-hover:border-cobalt-400">
                {q.number}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
