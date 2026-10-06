import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Compass, Sparkles, Box, Orbit } from 'lucide-react'
import { CareerOrb } from '@/components/home/CareerOrb'
import { ThreeCareerSphere } from '@/components/home/ThreeCareerSphere'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}

export function Hero() {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d')

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative overflow-hidden pt-8 pb-20 sm:pt-14 lg:pb-28" aria-labelledby="hero-title">
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl">
          <motion.div variants={item}>
            <Badge variant="cobalt" className="gap-2 py-1.5 pl-3 pr-3.5 tracking-[0.16em]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-electric-400" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-400" />
              </span>
              PERSONALITY × CAREER DISCOVERY
            </Badge>
          </motion.div>

          <motion.h1
            id="hero-title"
            variants={item}
            className="mt-5 sm:mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[4.2rem] lg:leading-[1.08]"
          >
            Hiểu chính mình.
            <br />
            <span className="bg-gradient-to-r from-cobalt-600 via-electric-400 to-teal-400 bg-clip-text text-transparent">
              Thiết kế tương lai.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 sm:mt-6 text-base sm:text-xl leading-relaxed text-slate-600 dark:text-slate-300"
          >
            Khám phá tính cách, thế mạnh và những hướng nghề nghiệp có thể phù hợp với bạn thông qua hệ thống đánh giá chuẩn hóa RIASEC.
          </motion.p>

          <motion.div variants={item} className="mt-7 sm:mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/intro" size="lg" id="hero-cta-start" className="shadow-glow-cobalt gap-2.5 w-full sm:w-auto justify-center">
              <Sparkles className="h-5 w-5 text-gold-400" />
              Bắt đầu khám phá
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToHowItWorks}
              id="hero-cta-how"
              className="gap-2 border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 w-full sm:w-auto justify-center"
            >
              <Compass className="h-5 w-5 text-electric-400" />
              Xem cách hoạt động
            </Button>
          </motion.div>

          {/* Grounded & Scientific Trust Metrics */}
          <motion.div
            variants={item}
            className="mt-10 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-6 border-t border-slate-200 dark:border-white/10 pt-6 sm:pt-8"
          >
            {[
              { value: '60 Câu', label: 'Chuẩn O*NET & RMIT', desc: 'Thang đo Holland RIASEC' },
              { value: '7–10 Phút', label: 'Thời gian hoàn thành', desc: 'Thang đo Likert 1–5' },
              { value: '8 Cụm ngành', label: 'Đại học Việt Nam', desc: 'Gợi ý khối thi A, B, D' },
            ].map((stat) => (
              <div key={stat.label} className="min-w-0">
                <p className="text-lg sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                  {stat.value}
                </p>
                <p className="mt-0.5 sm:mt-1 text-[0.68rem] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                  {stat.label}
                </p>
                <p className="text-[0.62rem] sm:text-[0.7rem] text-slate-500 dark:text-slate-400 truncate hidden xs:block">
                  {stat.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Interactive 3D Holographic Sphere or 2D Constellation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center justify-center"
        >
          {/* 3D / 2D Switcher Buttons */}
          <div className="mb-3 flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#060b18]/70 p-1 backdrop-blur-xl shadow-soft">
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                viewMode === '3d'
                  ? 'bg-cobalt-600 text-white shadow-glow'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Box className="h-3.5 w-3.5" />
              <span>3D Hologram</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('2d')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                viewMode === '2d'
                  ? 'bg-cobalt-600 text-white shadow-glow'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Orbit className="h-3.5 w-3.5" />
              <span>Sơ đồ 2D</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === '3d' ? (
              <motion.div
                key="3d"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <ThreeCareerSphere />
              </motion.div>
            ) : (
              <motion.div
                key="2d"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <CareerOrb />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
