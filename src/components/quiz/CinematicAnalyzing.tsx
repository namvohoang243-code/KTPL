import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Sparkles } from 'lucide-react'

const PHASES = [
  'Đang phân tích các phản hồi của bạn...',
  'Lượng hóa 6 chiều năng lực RIASEC...',
  'Đối chiếu cơ sở dữ liệu nghề nghiệp & khối thi...',
  'Tổng hợp bản đồ thế mạnh & môi trường phù hợp...',
  'Hồ sơ của bạn đã sẵn sàng!',
]

const NODES = [
  { code: 'R', color: '#38bdf8' },
  { code: 'I', color: '#818cf8' },
  { code: 'A', color: '#f472b6' },
  { code: 'S', color: '#2dd4bf' },
  { code: 'E', color: '#fbbf24' },
  { code: 'C', color: '#a78bfa' },
]

export function CinematicAnalyzing() {
  const [phaseIndex, setPhaseIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev < PHASES.length - 1 ? prev + 1 : prev))
    }, 380)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex min-h-[75vh] flex-col items-center justify-center px-4 py-16 text-center select-none">
      {/* Background ambient glow */}
      <div className="absolute h-96 w-96 rounded-full bg-cobalt-600/15 dark:bg-cobalt-500/20 blur-[120px] animate-pulse-ring" />

      {/* Orbiting RIASEC constellation */}
      <div className="relative flex h-52 w-52 items-center justify-center">
        {/* Track Ring */}
        <div className="absolute inset-0 rounded-full border border-dashed border-slate-300 dark:border-white/10 animate-[spin_30s_linear_infinite]" />

        {/* Orbiting nodes */}
        {NODES.map((node, i) => {
          const angle = (i * 360) / NODES.length
          const rad = (angle * Math.PI) / 180
          const r = 90
          const x = r * Math.cos(rad)
          const y = r * Math.sin(rad)

          return (
            <motion.div
              key={node.code}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              className="absolute flex h-9 w-9 items-center justify-center rounded-xl font-mono text-xs font-black text-white shadow-lift"
              style={{
                transform: `translate3d(${x}px, ${y}px, 0)`,
                backgroundColor: node.color,
                boxShadow: `0 0 16px ${node.color}80`,
              }}
            >
              {node.code}
            </motion.div>
          )
        })}

        {/* Central Core Pulse */}
        <div className="relative z-10 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-gradient-to-tr from-cobalt-600 to-electric-400 p-[2px] shadow-glow">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#060b18]">
            <Sparkles className="h-7 w-7 text-electric-300 animate-spin [animation-duration:8s]" />
          </div>
        </div>
      </div>

      {/* Animated Texts */}
      <div className="relative z-20 mt-10 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Đang xây dựng hồ sơ cá nhân của bạn
        </h2>

        <div className="mt-4 flex items-center justify-center gap-2">
          {phaseIndex === PHASES.length - 1 ? (
            <CheckCircle2 className="h-4 w-4 text-teal-400" />
          ) : (
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-electric-400" />
            </span>
          )}
          <motion.p
            key={phaseIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            {PHASES[phaseIndex]}
          </motion.p>
        </div>

        {/* Progress bar line */}
        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cobalt-500 via-electric-400 to-teal-400"
            initial={{ width: '0%' }}
            animate={{ width: `${((phaseIndex + 1) / PHASES.length) * 100}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  )
}
