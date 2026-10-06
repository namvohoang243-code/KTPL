import { useState } from 'react'
import { motion } from 'framer-motion'

interface NodeData {
  code: string
  name: string
  vnName: string
  score: number
  angle: number // in degrees
  color: string
  accent: string
}

const NODES: NodeData[] = [
  { code: 'R', name: 'REALISTIC', vnName: 'Kỹ thuật & Thực tế', score: 84, angle: 0, color: '#38bdf8', accent: 'from-sky-400 to-blue-600' },
  { code: 'I', name: 'INVESTIGATIVE', vnName: 'Nghiên cứu & Tư duy', score: 92, angle: 60, color: '#818cf8', accent: 'from-indigo-400 to-indigo-600' },
  { code: 'A', name: 'ARTISTIC', vnName: 'Sáng tạo & Nghệ thuật', score: 78, angle: 120, color: '#f472b6', accent: 'from-pink-400 to-rose-600' },
  { code: 'S', name: 'SOCIAL', vnName: 'Xã hội & Giáo dục', score: 86, angle: 180, color: '#2dd4bf', accent: 'from-teal-400 to-emerald-600' },
  { code: 'E', name: 'ENTERPRISING', vnName: 'Quản lý & Kinh doanh', score: 80, angle: 240, color: '#fbbf24', accent: 'from-amber-400 to-yellow-600' },
  { code: 'C', name: 'CONVENTIONAL', vnName: 'Quy trình & Tổ chức', score: 75, angle: 300, color: '#a78bfa', accent: 'from-violet-400 to-purple-600' },
]

export function CareerOrb() {
  const [activeNode, setActiveNode] = useState<NodeData | null>(NODES[1] ?? null) // Default to Investigative (92%)
  const radius = 145 // Orbit radius px

  return (
    <div className="relative flex aspect-square w-full max-w-[480px] items-center justify-center mx-auto select-none">
      {/* Outer ambient glow */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cobalt-600/20 via-electric-400/20 to-teal-400/15 blur-[65px] animate-pulse-ring" />

      {/* Orbit Track Rings */}
      <div className="absolute h-[290px] w-[290px] rounded-full border border-slate-300/40 dark:border-white/10" />
      <div className="absolute h-[380px] w-[380px] rounded-full border border-dashed border-slate-300/30 dark:border-white/5 animate-[spin_120s_linear_infinite]" />

      {/* SVG Connecting Lines & Animated Particles */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="-240 -240 480 480">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Lines from Center (0,0) to each Node */}
        {NODES.map((node) => {
          const rad = (node.angle * Math.PI) / 180
          const x = radius * Math.cos(rad)
          const y = radius * Math.sin(rad)
          const isActive = activeNode?.code === node.code

          return (
            <g key={node.code}>
              <line
                x1="0"
                y1="0"
                x2={x}
                y2={y}
                stroke={isActive ? node.color : 'currentColor'}
                strokeOpacity={isActive ? 0.8 : 0.15}
                strokeWidth={isActive ? 2 : 1}
                className="text-slate-400 dark:text-slate-600 transition-colors duration-300"
              />
              {/* Traveling energy particle along the line */}
              <circle r={isActive ? 3 : 2} fill={node.color} filter="url(#glow)">
                <animateMotion
                  path={`M0,0 L${x},${y} Z`}
                  dur={`${3 + (node.angle % 3)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          )
        })}

        {/* Connecting perimeter polygon lines between consecutive nodes */}
        {NODES.map((node, i) => {
          const next = NODES[(i + 1) % NODES.length]!
          const rad1 = (node.angle * Math.PI) / 180
          const rad2 = (next.angle * Math.PI) / 180
          const x1 = radius * Math.cos(rad1)
          const y1 = radius * Math.sin(rad1)
          const x2 = radius * Math.cos(rad2)
          const y2 = radius * Math.sin(rad2)

          return (
            <line
              key={`poly-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeDasharray="4 4"
              className="text-slate-400 dark:text-slate-600"
            />
          )
        })}
      </svg>

      {/* Center "YOU" Node */}
      <motion.div
        className="relative z-20 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gradient-to-tr from-cobalt-600 to-electric-400 p-[2px] shadow-glow cursor-pointer"
        whileHover={{ scale: 1.08 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#060b18] text-white">
          <span className="text-[0.65rem] font-bold tracking-[0.2em] text-electric-400 uppercase">
            Core
          </span>
          <span className="text-xl font-extrabold tracking-wider text-white">
            YOU
          </span>
          <span className="text-[0.6rem] text-slate-400">
            6 Chiều
          </span>
        </div>
      </motion.div>

      {/* 6 RIASEC Orbiting Nodes */}
      {NODES.map((node) => {
        const rad = (node.angle * Math.PI) / 180
        const x = radius * Math.cos(rad)
        const y = radius * Math.sin(rad)
        const isActive = activeNode?.code === node.code

        return (
          <div
            key={node.code}
            className="absolute z-30 transition-transform duration-300"
            style={{
              transform: `translate3d(${x}px, ${y}px, 0)`,
            }}
          >
            <motion.button
              type="button"
              onMouseEnter={() => setActiveNode(node)}
              onFocus={() => setActiveNode(node)}
              whileHover={{ scale: 1.22 }}
              className="relative flex h-13 w-13 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl cursor-pointer focus:outline-none"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${node.color}, #060b18)`
                  : 'rgba(15, 23, 42, 0.8)',
                border: `1.5px solid ${isActive ? node.color : 'rgba(255, 255, 255, 0.15)'}`,
                boxShadow: isActive ? `0 0 25px ${node.color}66` : '0 4px 12px rgba(0,0,0,0.3)',
              }}
              aria-label={`Nhóm ${node.name}`}
            >
              <span className="text-base font-black text-white">{node.code}</span>
            </motion.button>
          </div>
        )
      })}

      {/* Active Node Floating HUD Tooltip */}
      {activeNode && (
        <motion.div
          key={activeNode.code}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute -bottom-8 z-40 rounded-2xl border border-white/10 dark:border-white/15 bg-white/90 dark:bg-[#0a1128]/90 px-4 py-2.5 shadow-lift backdrop-blur-xl"
        >
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-lg text-xs font-black text-white"
              style={{ backgroundColor: activeNode.color }}
            >
              {activeNode.code}
            </span>
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-slate-900 dark:text-white">
                {activeNode.name}
              </p>
              <p className="text-[0.7rem] text-slate-500 dark:text-slate-400">
                {activeNode.vnName} • <span className="font-semibold text-electric-400">{activeNode.score}%</span> tương thích
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
