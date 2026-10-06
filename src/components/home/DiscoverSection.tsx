import { motion } from 'framer-motion'
import { Brain, Compass, Gem, ArrowUpRight } from 'lucide-react'
import { ZoomReveal } from '@/components/shared/ZoomReveal'
import { SectionHeading } from '@/components/shared/SectionHeading'

const ITEMS = [
  {
    n: '01',
    icon: Brain,
    title: 'Thấu hiểu bản chất',
    english: 'Personality Blueprint',
    text: 'Giải mã cấu trúc 6 chiều tính cách, xu hướng hành vi và nguồn năng lượng thúc đẩy bạn tự nhiên nhất.',
    tone: 'bg-cobalt-500/10 text-cobalt-600 dark:text-electric-400',
    color: '#38bdf8',
  },
  {
    n: '02',
    icon: Gem,
    title: 'Định lượng thế mạnh',
    english: 'Unique Competitive Edge',
    text: 'Nhận diện những kỹ năng vượt trội độc bản và các điểm mù tâm lý cần chủ động phòng tránh để thăng tiến.',
    tone: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    color: '#2dd4bf',
  },
  {
    n: '03',
    icon: Compass,
    title: 'Vũ trụ nghề nghiệp',
    english: 'Career Universe & Majors',
    text: 'Kết nối trực tiếp tới 8 cụm ngành xét tuyển đại học tại Việt Nam, tổ hợp môn thi (A00, A01, D01...) và lộ trình chuẩn bị.',
    tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    color: '#fbbf24',
  },
]

export function DiscoverSection() {
  return (
    <section className="container-page py-20" aria-labelledby="discover-title">
      <ZoomReveal>
        <SectionHeading
          eyebrow="Khám phá bản thân"
          title={<span id="discover-title">3 Tầng Giá Trị Bạn Sẽ Khám Phá</span>}
          description="Hệ thống phân tích nhiều lớp — đưa bạn từ sự thấu hiểu nội tâm đến lộ trình học tập và hành động rõ ràng."
        />
      </ZoomReveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {ITEMS.map((item, i) => (
          <ZoomReveal key={item.n} delay={i * 0.12} scaleFrom={0.9}>
            <motion.article
              whileHover={{ scale: 1.04, y: -6 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="surface group relative h-full overflow-hidden p-8 border border-slate-200 dark:border-white/10 bg-white/85 dark:bg-[#0a1128]/85 backdrop-blur-xl shadow-lift hover:border-electric-400/50 cursor-pointer flex flex-col justify-between"
            >
              {/* Giant Background Number */}
              <span className="absolute right-6 top-4 select-none font-mono text-8xl font-black tracking-tighter text-slate-100 dark:text-white/[0.04] transition-colors group-hover:text-cobalt-100 dark:group-hover:text-electric-400/10">
                {item.n}
              </span>

              <div>
                <div className="flex items-center justify-between">
                  <span className={`relative flex h-13 w-13 items-center justify-center rounded-2xl ${item.tone} shadow-soft transition-transform group-hover:scale-110`}>
                    <item.icon className="h-6 w-6" />
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-400 group-hover:text-electric-400 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <p className="mt-8 font-mono text-[0.68rem] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {item.english}
                </p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-sm text-slate-600 dark:text-slate-300">
                  {item.text}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 text-[0.72rem] font-semibold text-slate-400 group-hover:text-electric-400 transition-colors">
                Xem chi tiết phân tích →
              </div>
            </motion.article>
          </ZoomReveal>
        ))}
      </div>
    </section>
  )
}
