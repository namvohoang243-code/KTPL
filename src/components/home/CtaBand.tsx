import { ArrowRight, BarChart3, ClipboardCheck, Sparkles } from 'lucide-react'
import { ZoomReveal } from '@/components/shared/ZoomReveal'
import { ButtonLink } from '@/components/ui/button'

export function CtaBand() {
  return (
    <section className="container-page py-20">
      <ZoomReveal scaleFrom={0.88}>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-gradient-to-br from-slate-950 via-[#0a1128] to-cobalt-950 px-8 py-16 text-white shadow-lift sm:px-16 sm:py-20">
          <div className="bg-grid-tech pointer-events-none absolute inset-0 opacity-20" aria-hidden />
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cobalt-500/30 blur-[100px]" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-teal-500/25 blur-[100px]" aria-hidden />

          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="eyebrow !text-electric-400">
                <Sparkles className="h-3.5 w-3.5" /> BẮT ĐẦU NGAY HÔM NAY
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl sm:leading-[1.15]">
                Chỉ 5–7 phút để định hình rõ hơn về tương lai của bạn.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
                Không có câu trả lời đúng hay sai. Mọi phản hồi đều giúp hệ thống vẽ nên bức tranh tiềm năng chân thực nhất về bạn.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 sm:flex-row lg:flex-col shrink-0">
              <ButtonLink to="/intro" variant="gold" size="lg" className="shadow-lift gap-2.5">
                <ClipboardCheck className="h-5 w-5" />
                Bắt đầu làm bài test
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                to="/class"
                variant="outline"
                size="lg"
                className="gap-2 border-white/20 text-white hover:bg-white/10"
              >
                <BarChart3 className="h-5 w-5 text-electric-400" />
                Xem thống kê lớp học
              </ButtonLink>
            </div>
          </div>
        </div>
      </ZoomReveal>
    </section>
  )
}
