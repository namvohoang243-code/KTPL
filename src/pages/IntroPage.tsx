import { motion } from 'framer-motion'
import { ArrowRight, Check, Clock, HelpCircle, ListChecks, MousePointerClick, Sparkles } from 'lucide-react'
import { Disclaimer } from '@/components/shared/Disclaimer'
import { ZoomReveal } from '@/components/shared/ZoomReveal'
import { ButtonLink } from '@/components/ui/button'
import { QUESTIONS } from '@/data/questions'

const STEPS = [
  {
    n: '01',
    title: 'Làm bài trắc nghiệm 60 câu',
    text: 'Đánh giá chân thực 6 chiều tính cách RIASEC qua 60 câu hỏi tình huống chuẩn O*NET & RMIT.',
    color: '#38bdf8',
  },
  {
    n: '02',
    title: 'Phân tích đa chiều RIASEC',
    text: 'Hệ thống chuẩn hóa điểm số, xác định mã 3 chữ số Holland và lập bản đồ Radar năng lực.',
    color: '#818cf8',
  },
  {
    n: '03',
    title: 'Định hình ngành & Khối thi',
    text: 'Nhận báo cáo chuyên sâu về khối thi THPT, các trường đại học hàng đầu và lộ trình hành động.',
    color: '#2dd4bf',
  },
]

export function IntroPage() {
  const facts = [
    { icon: ListChecks, text: `Chuẩn hóa ${QUESTIONS.length} câu hỏi RIASEC` },
    { icon: Clock, text: 'Thời gian hoàn thành khoảng 5–7 phút' },
    { icon: HelpCircle, text: 'Không có đáp án đúng hoặc sai' },
    { icon: MousePointerClick, text: 'Hãy chọn phương án gần với bạn nhất' },
  ]

  return (
    <div className="relative overflow-hidden pb-16">
      <section className="container-page relative pt-8 sm:pt-20" aria-labelledby="intro-title">
        <ZoomReveal>
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5 text-gold-400" /> HƯỚNG DẪN ĐÁNH GIÁ
          </span>
          <h1 id="intro-title" className="mt-3 sm:mt-4 max-w-3xl text-3xl font-extrabold leading-[1.12] sm:leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            Một bài đánh giá ngắn, <span className="bg-gradient-to-r from-cobalt-600 via-electric-400 to-teal-400 bg-clip-text text-transparent">một góc nhìn định hình tương lai.</span>
          </h1>
          <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Dựa trên mô hình tâm lý học John Holland (RIASEC) được các tổ chức giáo dục quốc tế công nhận, giúp bạn khám phá xu hướng thế mạnh và chọn đúng tổ hợp ngành nghề phù hợp.
          </p>
        </ZoomReveal>

        {/* 3 Step Cards with Zoom Hover */}
        <div className="relative mt-8 sm:mt-14 grid gap-4 sm:gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <ZoomReveal key={s.n} delay={i * 0.12} scaleFrom={0.9}>
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="surface relative p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl shadow-lift hover:border-electric-400/50 cursor-pointer h-full flex flex-col justify-between"
              >
                <div>
                  <span
                    className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl font-mono text-base sm:text-xl font-bold text-white shadow-lift"
                    style={{ background: `linear-gradient(135deg, ${s.color}, #060b18)` }}
                  >
                    {s.n}
                  </span>
                  <h2 className="mt-4 sm:mt-6 text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{s.title}</h2>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">{s.text}</p>
                </div>

                <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-slate-100 dark:border-white/5 text-[0.7rem] sm:text-[0.72rem] font-semibold text-slate-400">
                  Giai đoạn {s.n}
                </div>
              </motion.div>
            </ZoomReveal>
          ))}
        </div>

        {/* Facts Banner */}
        <ZoomReveal delay={0.3} className="surface-glass mt-8 sm:mt-10 grid gap-3 sm:gap-4 p-4 sm:p-9 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#0a1128]/70">
          {facts.map((f) => (
            <div key={f.text} className="flex items-start gap-3">
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <f.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <p className="pt-1 text-xs sm:text-sm font-semibold leading-snug text-slate-700 dark:text-slate-200">{f.text}</p>
            </div>
          ))}
        </ZoomReveal>

        {/* Start Action */}
        <ZoomReveal delay={0.4} className="mt-8 sm:mt-12 flex flex-col items-start gap-5 sm:gap-6 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 dark:border-white/10 pt-6 sm:pt-8">
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {['Kết quả được mã hóa và lưu trực tiếp trên thiết bị của bạn', 'Tuyệt đối không thu thập họ tên, email hay dữ liệu cá nhân'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-teal-400 shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <ButtonLink to="/quiz" size="lg" className="w-full sm:w-auto shadow-glow-cobalt gap-2.5 min-h-[48px]">
            Tôi đã sẵn sàng — Bắt đầu
            <ArrowRight className="h-5 w-5" />
          </ButtonLink>
        </ZoomReveal>

        <Disclaimer className="mt-12 max-w-3xl" />
      </section>
    </div>
  )
}
