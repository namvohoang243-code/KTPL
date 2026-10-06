import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import type { QuizResult } from '@/types'
import { PERSONALITY_MAP } from '@/data/personalities'
import { Button } from '@/components/ui/button'

interface ShareableResultCardProps {
  result: QuizResult
}

export function ShareableResultCard({ result }: ShareableResultCardProps) {
  const [copied, setCopied] = useState(false)
  const top1 = result.topCodes[0] || 'I'
  const topTrait = PERSONALITY_MAP[top1]
  const hollandCode = result.topCodes.join('')

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Hồ sơ Holland của tôi: Mã ${hollandCode} (${topTrait.name}) - Điểm cao nhất: ${result.scores[top1]}%. Khám phá bản thân tại Career Map!`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="surface overflow-hidden p-6 sm:p-10 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl">
      <div className="flex flex-col gap-2 border-b border-slate-200 dark:border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="eyebrow">Shareable Badge</span>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Thẻ hồ sơ cá nhân — My Career Profile
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Lưu lại hoặc chia sẻ với thầy cô, phụ huynh và bạn bè để cùng thảo luận định hướng tương lai.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2 border-slate-300 dark:border-white/15"
          >
            {copied ? <Check className="h-4 w-4 text-teal-400" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Đã sao chép!' : 'Sao chép tóm tắt'}
          </Button>
        </div>
      </div>

      {/* Luxury Social Badge Card */}
      <div className="mt-8 flex justify-center">
        <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/15 bg-gradient-to-br from-slate-950 via-[#0b1736] to-cobalt-950 p-8 text-white shadow-lift">
          <div className="bg-grid-tech pointer-events-none absolute inset-0 opacity-20" aria-hidden />
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cobalt-500/25 blur-[70px]" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-teal-500/20 blur-[70px]" />

          <div className="relative">
            {/* Top Brand Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-electric-400 font-mono text-xs font-black text-slate-950">
                  CM
                </span>
                <span className="font-mono text-xs font-bold tracking-widest text-slate-300">
                  CAREER MAP • VERIFIED
                </span>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-0.5 text-[0.68rem] font-semibold text-teal-300 backdrop-blur">
                RIASEC Standard
              </span>
            </div>

            {/* Core Holland Code */}
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-electric-400">
                  MÃ ĐỊNH DANH HOLLAND
                </p>
                <p className="mt-1 font-mono text-4xl font-black tracking-widest text-white sm:text-5xl">
                  {hollandCode}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-gold-400">
                  ĐIỂM NHÓM NỔI TRỘI
                </p>
                <p className="mt-1 font-mono text-3xl font-extrabold text-gold-300">
                  {result.scores[top1]}%
                </p>
              </div>
            </div>

            {/* Trait & Archetype Details */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Nhóm tính cách dẫn đầu:
              </p>
              <p className="mt-1 text-base font-bold text-white">
                {topTrait.name} ({top1})
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                "{topTrait.tagline}"
              </p>
            </div>

            {/* Top 3 Traits Badges */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              {result.topCodes.map((c, i) => (
                <div key={c} className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5 text-center">
                  <span className="text-[0.65rem] font-semibold text-slate-400">#0{i + 1}</span>
                  <p className="font-mono text-sm font-bold text-white">{c}</p>
                  <p className="text-[0.7rem] font-semibold text-electric-400">{result.scores[c]}%</p>
                </div>
              ))}
            </div>

            {/* Footer stamp */}
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[0.68rem] text-slate-400">
              <span>Được xác nhận bởi hệ thống Career Map</span>
              <span className="font-mono">ID: {result.topCodes.join('')}-2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
