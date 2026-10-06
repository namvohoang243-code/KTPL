import { motion } from 'framer-motion'
import { HOLLAND_GROUP_METAS } from '@/data/questions'
import type { PersonalityCode } from '@/types'

interface ProgressBarProps {
  current: number
  total: number
  answered: number
  currentCode?: PersonalityCode
}

const STAGES: PersonalityCode[] = ['R', 'I', 'A', 'S', 'E', 'C']

export function ProgressBar({ current, total, answered, currentCode }: ProgressBarProps) {
  const percent = Math.round((answered / total) * 100)
  const currentStageIndex = Math.min(5, Math.floor((current - 1) / 10))
  const activeCode = currentCode || STAGES[currentStageIndex] || 'R'
  const activeMeta = HOLLAND_GROUP_METAS[activeCode]

  return (
    <div className="space-y-3">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-lg font-mono text-xs font-black text-white"
            style={{ backgroundColor: activeMeta.color }}
          >
            {activeCode}
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            Chặng {currentStageIndex + 1}/6: {activeMeta.title} ({activeMeta.name})
          </span>
          <span className="text-xs text-slate-400">
            • Câu {current}/{total}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-cobalt-600 dark:text-electric-400">
          <span>Đã hoàn thành {answered}/{total}</span>
          <span className="font-mono text-sm font-black">({percent}%)</span>
        </div>
      </div>

      {/* Main Continuous Progress Bar */}
      <div
        className="relative h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={`Tiến độ bài test: ${percent}%`}
      >
        <motion.div
          className="relative h-full rounded-full bg-gradient-to-r from-cobalt-500 via-teal-400 to-emerald-400"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>

      {/* 6 Stage Trackers */}
      <div className="grid grid-cols-6 gap-1.5 sm:gap-2 pt-1" aria-hidden>
        {STAGES.map((code, idx) => {
          const meta = HOLLAND_GROUP_METAS[code]
          const isDone = answered >= (idx + 1) * 10
          const isCurrent = currentStageIndex === idx

          return (
            <div
              key={code}
              className={`flex items-center justify-center py-1 sm:py-1.5 rounded-xl border text-[0.68rem] font-bold transition-all ${
                isCurrent
                  ? 'border-cobalt-500 bg-cobalt-500/15 text-cobalt-600 dark:text-electric-400 shadow-sm ring-1 ring-cobalt-400/40'
                  : isDone
                  ? 'border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400'
                  : 'border-slate-200 dark:border-white/5 bg-slate-100/60 dark:bg-white/[0.02] text-slate-400'
              }`}
            >
              <span className="truncate">
                <span className="font-mono font-black">{code}</span>
                <span className="hidden md:inline ml-1 font-normal">• {meta.name.replace('Người ', '')}</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
