import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import type { QuizResult } from '@/types'
import { PERSONALITY_MAP } from '@/data/personalities'

interface ConstellationNode {
  id: string
  label: string
  sublabel: string
  level: 'center' | 'trait' | 'cluster' | 'career'
  matchScore: number
  color: string
  skills?: string[]
  description: string
  x: number
  y: number
  parent?: string
}

interface CareerConstellationProps {
  result: QuizResult
}

export function CareerConstellation({ result }: CareerConstellationProps) {
  const top1 = result.topCodes[0] || 'I'
  const top2 = result.topCodes[1] || 'R'
  const top3 = result.topCodes[2] || 'C'

  // Build the hierarchical constellation graph
  const nodes: ConstellationNode[] = [
    {
      id: 'center',
      label: 'YOU',
      sublabel: `Mã: ${result.topCodes.join('')}`,
      level: 'center',
      matchScore: 100,
      color: '#38bdf8',
      description: 'Trung tâm bản đồ tiềm năng cá nhân dựa trên 20 câu hỏi trắc nghiệm RIASEC.',
      x: 0,
      y: 0,
    },
    // Ring 1: Top 3 Traits
    {
      id: `trait-${top1}`,
      label: PERSONALITY_MAP[top1].name,
      sublabel: `Điểm: ${result.scores[top1]}%`,
      level: 'trait',
      matchScore: result.scores[top1],
      color: '#818cf8',
      description: PERSONALITY_MAP[top1].description,
      x: -140,
      y: -80,
      parent: 'center',
    },
    {
      id: `trait-${top2}`,
      label: PERSONALITY_MAP[top2].name,
      sublabel: `Điểm: ${result.scores[top2]}%`,
      level: 'trait',
      matchScore: result.scores[top2],
      color: '#2dd4bf',
      description: PERSONALITY_MAP[top2].description,
      x: 140,
      y: -80,
      parent: 'center',
    },
    {
      id: `trait-${top3}`,
      label: PERSONALITY_MAP[top3].name,
      sublabel: `Điểm: ${result.scores[top3]}%`,
      level: 'trait',
      matchScore: result.scores[top3],
      color: '#fbbf24',
      description: PERSONALITY_MAP[top3].description,
      x: 0,
      y: 150,
      parent: 'center',
    },
    // Ring 2: Career Clusters & Ring 3: Careers
    {
      id: 'career-1',
      label: 'Kỹ sư Phần mềm / AI',
      sublabel: 'Công nghệ Thông tin',
      level: 'career',
      matchScore: 95,
      color: '#38bdf8',
      skills: ['Thuật toán', 'Python / TS', 'Kiến trúc hệ thống', 'Tư duy logic'],
      description: 'Thiết kế, xây dựng và tối ưu các nền tảng phần mềm, mô hình phân tích dữ liệu quy mô lớn.',
      x: -260,
      y: -140,
      parent: `trait-${top1}`,
    },
    {
      id: 'career-2',
      label: 'Chuyên gia Khoa học Dữ liệu',
      sublabel: 'Data Science & BI',
      level: 'career',
      matchScore: 92,
      color: '#818cf8',
      skills: ['Thống kê ứng dụng', 'Machine Learning', 'SQL / Tableau', 'Phân tích định lượng'],
      description: 'Khai thác dữ liệu lớn để tìm kiếm quy luật và ra quyết định chiến lược cho doanh nghiệp.',
      x: -240,
      y: 20,
      parent: `trait-${top1}`,
    },
    {
      id: 'career-3',
      label: 'Kỹ sư Cơ điện tử / Robotics',
      sublabel: 'Tự động hóa & Kỹ thuật',
      level: 'career',
      matchScore: 89,
      color: '#2dd4bf',
      skills: ['Cơ khí chính xác', 'Lập trình nhúng PLC', 'Mạch điện tử', 'Xử lý cảm biến'],
      description: 'Nghiên cứu chế tạo các hệ thống cánh tay robot, dây chuyền sản xuất tự động thông minh.',
      x: 260,
      y: -140,
      parent: `trait-${top2}`,
    },
    {
      id: 'career-4',
      label: 'Chuyên viên Phân tích Tài chính',
      sublabel: 'Fintech & Đầu tư',
      level: 'career',
      matchScore: 86,
      color: '#fbbf24',
      skills: ['Mô hình dòng tiền', 'Thẩm định rủi ro', 'Kinh tế lượng', 'Excel nâng cao'],
      description: 'Phân tích báo cáo tài chính tổ chức, xây dựng danh mục đầu tư và kiểm soát rủi ro thị trường.',
      x: 0,
      y: 260,
      parent: `trait-${top3}`,
    },
  ]

  const [activeNode, setActiveNode] = useState<ConstellationNode>(nodes[4]!) // Default to top career

  return (
    <div className="surface overflow-hidden p-6 sm:p-10 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl">
      <div className="flex flex-col gap-2 border-b border-slate-200 dark:border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="eyebrow">Interactive Feature</span>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Career Constellation — Chòm sao định hướng
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sơ đồ mạng đa tầng: Từ tính cách cốt lõi (Core) → Các nhánh năng lực → Nghề nghiệp phù hợp nhất.
          </p>
        </div>
        <span className="rounded-full bg-electric-500/10 px-3.5 py-1 text-xs font-semibold text-electric-500 dark:text-electric-300">
          Chạm vào từng node để mở chi tiết
        </span>
      </div>

      <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Constellation Canvas Viewport */}
        <div className="relative flex aspect-square w-full max-w-[540px] items-center justify-center mx-auto rounded-3xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-[#060b18]/60 overflow-hidden select-none">
          {/* Ambient center radial glow */}
          <div className="absolute h-72 w-72 rounded-full bg-cobalt-500/15 dark:bg-cobalt-500/25 blur-[90px]" />

          {/* SVG Connecting Paths */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="-320 -240 640 480">
            <defs>
              <filter id="glow-constellation">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connecting lines */}
            {nodes.map((node) => {
              if (!node.parent) return null
              const parentNode = nodes.find((n) => n.id === node.parent)
              if (!parentNode) return null
              const isHighlighted = activeNode.id === node.id || activeNode.parent === node.id || node.parent === activeNode.id

              return (
                <g key={`edge-${node.id}`}>
                  <line
                    x1={parentNode.x}
                    y1={parentNode.y}
                    x2={node.x}
                    y2={node.y}
                    stroke={isHighlighted ? node.color : 'currentColor'}
                    strokeOpacity={isHighlighted ? 0.9 : 0.2}
                    strokeWidth={isHighlighted ? 2.5 : 1.2}
                    className="text-slate-400 dark:text-slate-600 transition-colors duration-300"
                  />
                  {/* Energy pulse particle on highlighted path */}
                  {isHighlighted && (
                    <circle r={3} fill={node.color} filter="url(#glow-constellation)">
                      <animateMotion
                        path={`M${parentNode.x},${parentNode.y} L${node.x},${node.y} Z`}
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Render Nodes */}
          {nodes.map((node) => {
            const isSelected = activeNode.id === node.id
            const isCenter = node.level === 'center'
            const isTrait = node.level === 'trait'

            return (
              <div
                key={node.id}
                className="absolute z-20 transition-transform duration-300"
                style={{
                  transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
                }}
              >
                <motion.button
                  type="button"
                  onClick={() => setActiveNode(node)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative flex -translate-x-1/2 -translate-y-1/2 items-center justify-center cursor-pointer transition-all ${
                    isCenter
                      ? 'h-16 w-16 rounded-full border-2 border-electric-400 bg-[#060b18] text-white shadow-glow'
                      : isTrait
                      ? 'h-13 w-13 rounded-2xl border-2'
                      : 'h-11 w-11 rounded-xl border'
                  }`}
                  style={{
                    backgroundColor: isCenter ? '#060b18' : isSelected ? node.color : 'rgba(15, 23, 42, 0.85)',
                    borderColor: isSelected ? '#ffffff' : node.color,
                    boxShadow: isSelected ? `0 0 24px ${node.color}99` : '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                  aria-label={node.label}
                >
                  <span
                    className={`font-bold ${
                      isCenter
                        ? 'text-xs tracking-wider text-electric-300'
                        : isTrait
                        ? 'text-xs text-white'
                        : 'text-[0.65rem] text-white'
                    }`}
                  >
                    {isCenter ? 'YOU' : isTrait ? node.label.slice(0, 1) : `${node.matchScore}%`}
                  </span>
                </motion.button>
              </div>
            )
          })}
        </div>

        {/* Selected Node Details Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNode.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] p-7 shadow-lift"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <span
                  className="rounded-full px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: activeNode.color }}
                >
                  {activeNode.level === 'center' ? 'TÂM ĐIỂM' : activeNode.level === 'trait' ? 'NHÓM TÍNH CÁCH' : 'NGHỀ NGHIỆP'}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Độ tương thích: <span className="font-extrabold text-electric-400">{activeNode.matchScore}%</span>
                </span>
              </div>

              <h4 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {activeNode.label}
              </h4>
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                {activeNode.sublabel}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {activeNode.description}
              </p>

              {activeNode.skills && (
                <div className="mt-6 border-t border-slate-200 dark:border-white/10 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Kỹ năng then chốt giúp bạn bứt phá:
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeNode.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-200"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 border-t border-slate-200 dark:border-white/10 pt-4 text-xs text-slate-400 flex items-center justify-between">
              <span>Đường dẫn từ: {activeNode.parent || 'Trung tâm'}</span>
              <span className="text-electric-400 font-semibold">Tương tác trực tiếp</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
