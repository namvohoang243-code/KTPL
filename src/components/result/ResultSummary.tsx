import { motion } from 'framer-motion'
import { ArrowRight, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { CLUSTER_MAP } from '@/data/careers'
import { PERSONALITY_MAP } from '@/data/personalities'
import { rankClusters } from '@/engine/matching'
import type { QuizResult } from '@/types'

const row = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
})

export function ResultSummary({ result }: { result: QuizResult }) {
  const top = PERSONALITY_MAP[result.topCodes[0]!]
  const second = PERSONALITY_MAP[result.topCodes[1]!]
  // Top traits: two from the strongest group, one from the runner-up
  const traits = [...top.traits.slice(0, 2), ...(second.traits.slice(0, 1))]
  const areas = rankClusters(result.scores)
    .slice(0, 3)
    .map((m) => CLUSTER_MAP[m.item.id]?.shortLabel ?? m.item.id)

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-gradient-to-br from-slate-950 via-[#0a1128] to-cobalt-950 p-7 text-white shadow-lift sm:p-12">
      <div className="bg-grid-tech pointer-events-none absolute inset-0 opacity-20" aria-hidden />
      <div className="pointer-events-none absolute -left-20 -top-24 h-80 w-80 rounded-full bg-cobalt-500/35 blur-[100px]" aria-hidden />

      <div className="relative">
        <motion.div {...row(0)}>
          <Badge variant="cobalt" className="tracking-[0.16em]">YOUR CAREER PROFILE</Badge>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">Your Career Profile</h2>
        </motion.div>

        <dl className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Personality', values: [top.name], accent: 'text-gold-400' },
            { label: 'Top traits', values: traits, accent: 'text-teal-400' },
            { label: 'Top career areas', values: areas, accent: 'text-cobalt-200' },
          ].map((block, i) => (
            <motion.div key={block.label} {...row(0.1 + i * 0.1)} className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur">
              <dt className={`text-xs font-semibold uppercase tracking-[0.18em] ${block.accent}`}>{block.label}</dt>
              <dd className="mt-4 space-y-1.5">
                {block.values.map((v) => (
                  <p key={v} className="text-lg font-medium text-white">
                    {v}
                  </p>
                ))}
              </dd>
            </motion.div>
          ))}
        </dl>

        <motion.div {...row(0.4)} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="glass"
            size="lg"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            id="result-review"
            className="gap-2"
          >
            <Eye className="h-5 w-5" />
            Xem lại kết quả
          </Button>
          <ButtonLink to="/class" variant="gold" size="lg" id="result-class" className="gap-2">
            Xem thống kê lớp
            <ArrowRight className="h-5 w-5" />
          </ButtonLink>
        </motion.div>
      </div>
    </div>
  )
}
