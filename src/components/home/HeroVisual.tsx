import { motion } from 'framer-motion'
import { Brain, Code2, FlaskConical, Search, Cog } from 'lucide-react'
import { PERSONALITY_CODES } from '@/data/personalities'

/** Decorative sample profile for the hero illustration only. */
const SAMPLE: Record<string, number> = { R: 72, I: 91, A: 48, S: 60, E: 35, C: 52 }

function polar(index: number, value: number, r: number, cx: number, cy: number) {
  const angle = (Math.PI * 2 * index) / PERSONALITY_CODES.length - Math.PI / 2
  const dist = (value / 100) * r
  return [cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist] as const
}

function MiniRadar() {
  const cx = 50
  const cy = 50
  const r = 38
  const rings = [0.33, 0.66, 1]
  const poly = PERSONALITY_CODES.map((c, i) => polar(i, SAMPLE[c] ?? 0, r, cx, cy).join(',')).join(' ')
  return (
    <svg viewBox="0 0 100 100" className="h-28 w-28 shrink-0" aria-hidden>
      {rings.map((k) => (
        <polygon
          key={k}
          points={PERSONALITY_CODES.map((_, i) => polar(i, 100 * k, r, cx, cy).join(',')).join(' ')}
          fill="none"
          stroke="#cdd5e3"
          strokeWidth="0.7"
        />
      ))}
      {PERSONALITY_CODES.map((c, i) => {
        const [x, y] = polar(i, 100, r, cx, cy)
        const [lx, ly] = polar(i, 100, r + 9, cx, cy)
        return (
          <g key={c}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="#e5e9f1" strokeWidth="0.6" />
            <text x={lx} y={ly + 2.5} textAnchor="middle" fontSize="7" fontWeight="700" fill="#7488ab">
              {c}
            </text>
          </g>
        )
      })}
      <motion.polygon
        points={poly}
        fill="rgba(47,91,255,0.18)"
        stroke="#2f5bff"
        strokeWidth="1.6"
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ transformOrigin: '50px 50px' }}
        transition={{ delay: 0.9, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  )
}

const cardMotion = (delay: number) => ({
  initial: { opacity: 0, y: 28, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
})

/** Personality → Strengths → Career abstract node diagram. */
export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[34rem]" aria-hidden>
      <div className="absolute inset-[6%] rounded-full border border-dashed border-navy-200/70" />
      <div className="absolute inset-[22%] rounded-full border border-navy-100" />

      {/* connectors */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" fill="none">
        {['M28 35 C 28 47, 38 50, 48 50', 'M76 62 C 76 78, 76 84, 66 84'].map((d, i) => (
          <motion.path
            key={d}
            d={d}
            stroke="#2f5bff"
            strokeOpacity="0.55"
            strokeWidth="0.7"
            strokeDasharray="1.4 1.8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.7 + i * 0.4, duration: 0.9 }}
          />
        ))}
        {[
          [28, 35],
          [48, 50],
          [76, 62],
          [66, 84],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill="#2f5bff" />
        ))}
      </svg>

      {/* Personality */}
      <motion.div {...cardMotion(0.2)} className="absolute left-0 top-[4%] w-[62%]">
        <div className="animate-float surface-glass p-4 shadow-lift">
          <div className="flex items-center gap-1">
            <span className="rounded-full bg-cobalt-50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-cobalt-600">01 · Personality</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <MiniRadar />
            <div>
              <p className="text-2xl font-semibold tracking-tight text-navy-900">I-R-C</p>
              <p className="text-xs text-navy-400">Investigative</p>
              <p className="mt-1 text-xs font-semibold text-teal-600">91%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Strengths */}
      <motion.div {...cardMotion(0.45)} className="absolute right-0 top-[36%] w-[54%]">
        <div className="animate-float surface-glass p-4 shadow-lift [animation-delay:-2s]">
          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-teal-600">02 · Strengths</span>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              [Brain, 'Analytical'],
              [Search, 'Curious'],
              [Cog, 'Systematic'],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Brain
              return (
                <span key={label as string} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-xs font-medium text-navy-700">
                  <I className="h-3.5 w-3.5 text-cobalt-500" />
                  {label as string}
                </span>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Career */}
      <motion.div {...cardMotion(0.7)} className="absolute bottom-[2%] left-[4%] w-[62%]">
        <div className="animate-float rounded-3xl bg-navy-900 p-4 text-white shadow-lift [animation-delay:-4s]">
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-gold-400">03 · Career</span>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cobalt-500">
              <Code2 className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">Công nghệ &amp; Phần mềm</p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 to-gold-400"
                  initial={{ width: 0 }}
                  animate={{ width: '92%' }}
                  transition={{ delay: 1.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-teal-400">92%</span>
          </div>
        </div>
      </motion.div>

      {/* floating nodes */}
      <motion.span
        className="absolute right-[10%] top-[10%] flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-white shadow-soft"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, type: 'spring' }}
      >
        <FlaskConical className="h-5 w-5 text-teal-500" />
      </motion.span>
      <motion.span
        className="absolute bottom-[34%] left-[0%] h-3.5 w-3.5 rounded-full bg-gold-500"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3, type: 'spring' }}
      />
      <motion.span
        className="absolute right-[4%] top-[82%] h-5 w-5 rounded-full border-2 border-cobalt-500 bg-white"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, type: 'spring' }}
      />
    </div>
  )
}
