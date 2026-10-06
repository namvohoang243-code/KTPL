import { motion } from 'framer-motion'
import { Award, Compass, Cpu, Layers, Sparkles } from 'lucide-react'
import { TiltCard } from '@/components/shared/TiltCard'

const STEPS = [
  {
    num: '01',
    phase: 'DISCOVER',
    title: 'Làm bài đánh giá ngắn',
    desc: '60 câu hỏi tình huống chuẩn O*NET & RMIT theo mô hình Holland (RIASEC), giúp phản chiếu thiên hướng tự nhiên của bạn.',
    icon: Sparkles,
    color: '#38bdf8',
  },
  {
    num: '02',
    phase: 'ANALYZE',
    title: 'Phân tích đa chiều',
    desc: 'Hệ thống tính điểm chuẩn hóa từng nhóm tính cách, nhận diện mã 3 chữ số định danh (ví dụ IRC, ASE) và mức độ tương thích.',
    icon: Cpu,
    color: '#818cf8',
  },
  {
    num: '03',
    phase: 'UNDERSTAND',
    title: 'Thấu hiểu bản thân',
    desc: 'Bản đồ Radar trực quan, nhận diện nguồn năng lượng thúc đẩy, môi trường làm việc phù hợp cùng các điểm mù cần lưu tâm.',
    icon: Layers,
    color: '#2dd4bf',
  },
  {
    num: '04',
    phase: 'EXPLORE',
    title: 'Khám phá vũ trụ nghề nghiệp',
    desc: 'Kết nối trực tiếp tới 8 cụm ngành thực tế, tổ hợp môn thi THPT (A00, A01, D01...) và các vị trí nghề nghiệp tiêu biểu tại Việt Nam.',
    icon: Compass,
    color: '#fbbf24',
  },
  {
    num: '05',
    phase: 'PLAN',
    title: 'Lập kế hoạch hành động',
    desc: 'Lộ trình định hướng từ lớp 10, 11, 12 đến giảng đường đại học, giúp bạn tự tin đưa ra quyết định cho tương lai.',
    icon: Award,
    color: '#f472b6',
  },
]

export function HowItWorksTimeline() {
  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden" aria-labelledby="how-title">
      <div className="container-page relative">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow justify-center">METHODOLOGY</span>
          <h2 id="how-title" className="section-title mt-3">
            Hành trình 5 bước khám phá chính mình
          </h2>
          <p className="section-sub mx-auto">
            Quy trình được chuẩn hóa khoa học, đưa bạn từ câu hỏi trắc nghiệm đầu tiên đến bản kế hoạch nghề nghiệp rõ ràng.
          </p>
        </div>

        {/* Desktop & Mobile Timeline */}
        <div className="relative mt-16">
          {/* Animated Connecting Line */}
          <div className="hidden lg:block absolute top-[44px] left-[5%] right-[5%] h-[2px] bg-slate-200 dark:bg-white/10" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="hidden lg:block absolute top-[44px] left-[5%] right-[5%] h-[2px] origin-left bg-gradient-to-r from-cobalt-500 via-electric-400 to-teal-400"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((step, idx) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="flex flex-col"
                >
                  <TiltCard className="surface group flex-1 p-6 h-full flex flex-col justify-between border-slate-200/90 dark:border-white/10 hover:border-electric-400/50 transition-colors">
                    <div>
                      {/* Step Indicator Header */}
                      <div className="flex items-center justify-between">
                        <span
                          className="flex h-11 w-11 items-center justify-center rounded-2xl text-white font-bold text-sm shadow-lift transition-transform duration-300 group-hover:scale-110"
                          style={{
                            background: `linear-gradient(135deg, ${step.color}, #060b18)`,
                          }}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500">
                          {step.num}
                        </span>
                      </div>

                      <div className="mt-5">
                        <span
                          className="text-[0.68rem] font-bold tracking-[0.16em] uppercase"
                          style={{ color: step.color }}
                        >
                          {step.phase}
                        </span>
                        <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                          {step.title}
                        </h3>
                        <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-1.5 text-[0.7rem] font-semibold text-slate-500 dark:text-slate-400 group-hover:text-electric-400 transition-colors">
                      <span>Giai đoạn {step.num}</span>
                    </div>
                  </TiltCard>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
