import { motion } from 'framer-motion'
import {
  Brain,
  Users,
  Compass,
  AlertTriangle,
  Sparkles,
  Briefcase,
  TrendingUp,
  Ban,
  Award,
} from 'lucide-react'
import { getHollandCodeSynergy, HOLLAND_ARCHETYPES } from '@/data/hollandProfiles'
import type { PersonalityCode, QuizResult } from '@/types'

interface PersonalityCareerReportProps {
  result: QuizResult
}

export function PersonalityCareerReport({ result }: PersonalityCareerReportProps) {
  const topCode = (result.topCodes[0] || 'R') as PersonalityCode
  const subCode1 = (result.topCodes[1] || 'I') as PersonalityCode
  const subCode2 = (result.topCodes[2] || 'A') as PersonalityCode
  const hollandCode = result.topCodes.slice(0, 3).join('')

  const archetype = HOLLAND_ARCHETYPES[topCode] || HOLLAND_ARCHETYPES.R
  const synergy = getHollandCodeSynergy(hollandCode)

  return (
    <div className="space-y-10" id="personality-career-report">
      {/* 1. SECTION HEADER: Chân dung tính cách & Mã Holland */}
      <div className="surface p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0a1128]/95 backdrop-blur-xl shadow-lift">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-5 sm:pb-6">
          <div>
            <span className="eyebrow flex items-center gap-1.5 text-cobalt-600 dark:text-electric-400">
              <Award className="h-3.5 w-3.5 text-gold-400" /> BÁO CÁO PHÂN TÍCH CHUYÊN SÂU 60 CÂU HỎI
            </span>
            <h3 className="mt-1 text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {synergy.headline}
            </h3>
            <p className="mt-1.5 text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {synergy.coreDescription}
            </p>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/5">
            <div>
              <span className="text-[0.68rem] uppercase font-mono tracking-widest text-slate-400 font-bold block">
                MÃ HOLLAND CỦA BẠN
              </span>
              <span className="text-[0.68rem] text-teal-500 dark:text-teal-400 font-semibold md:hidden">
                {topCode} • {subCode1}-{subCode2}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cobalt-600 via-indigo-600 to-electric-500 text-white font-mono text-xl sm:text-3xl font-black shadow-glow">
              {hollandCode}
            </div>
            <span className="mt-1 text-[0.72rem] text-teal-500 dark:text-teal-400 font-semibold hidden md:inline">
              Nhóm chính: {topCode} • Phối hợp: {subCode1}-{subCode2}
            </span>
          </div>
        </div>

        {/* Superpower Highlight Bar */}
        <div className="mt-5 sm:mt-6 rounded-2xl p-3.5 sm:p-5 bg-gradient-to-r from-amber-500/10 via-cobalt-500/10 to-teal-500/10 border border-amber-500/20 flex items-start gap-3 sm:gap-3.5">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <strong className="text-slate-900 dark:text-white font-bold block mb-0.5">
              Siêu năng lực nổi bật nhất:
            </strong>
            <span className="text-slate-700 dark:text-slate-200 leading-relaxed">
              {synergy.superpower}
            </span>
          </div>
        </div>
      </div>

      {/* 2. BỐN TRỤ CỘT TÍNH CÁCH CỐT LÕI (4 Cards) */}
      <div>
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5 text-cobalt-500" /> ĐẶC TRƯNG HÀNH VI & TÂM LÝ HỌC
          </span>
          <h4 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            4 Trụ cột tính cách giúp bạn định vị bản thân
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
          {/* Card 1: Tư duy */}
          <motion.div
            whileHover={{ y: -3 }}
            className="surface p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0a1128]/90 backdrop-blur-xl shadow-soft"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-cobalt-500/10 text-cobalt-600 dark:text-electric-400">
                <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <div>
                <h5 className="text-[0.68rem] sm:text-sm font-bold uppercase tracking-wider text-slate-400">Trụ cột 01</h5>
                <h6 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Phong cách Tư duy & Tiếp nhận</h6>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {archetype.thinkStyle}
            </p>
          </motion.div>

          {/* Card 2: Tương tác */}
          <motion.div
            whileHover={{ y: -3 }}
            className="surface p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0a1128]/90 backdrop-blur-xl shadow-soft"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <div>
                <h5 className="text-[0.68rem] sm:text-sm font-bold uppercase tracking-wider text-slate-400">Trụ cột 02</h5>
                <h6 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Phong cách Giao tiếp & Làm việc nhóm</h6>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {archetype.socialStyle}
            </p>
          </motion.div>

          {/* Card 3: Động lực */}
          <motion.div
            whileHover={{ y: -3 }}
            className="surface p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0a1128]/90 backdrop-blur-xl shadow-soft"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Compass className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <div>
                <h5 className="text-[0.68rem] sm:text-sm font-bold uppercase tracking-wider text-slate-400">Trụ cột 03</h5>
                <h6 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Động lực Nội tại & Giá trị theo đuổi</h6>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {archetype.innerDrive}
            </p>
          </motion.div>

          {/* Card 4: Bẫy hành vi & Điểm cần lưu ý */}
          <motion.div
            whileHover={{ y: -3 }}
            className="surface p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-amber-500/20 bg-amber-500/[0.03] backdrop-blur-xl shadow-soft"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <div>
                <h5 className="text-[0.68rem] sm:text-sm font-bold uppercase tracking-wider text-amber-500">Trụ cột 04 (Lưu ý)</h5>
                <h6 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Điểm mù hành vi & Cách khắc phục</h6>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {archetype.pitfall}
            </p>
          </motion.div>
        </div>
      </div>

      {/* 3. PHÂN TÍCH PHÙ HỢP LOẠI NGHỀ GÌ (3 Tiers: Natural Fits, Future/AI Era, and Caution Roles) */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-cobalt-500" /> MA TRẬN TƯƠNG THÍCH VIỆC LÀM
          </span>
          <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Phân tích mức độ phù hợp nghề nghiệp
          </h4>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Dựa trên kết quả tự chấm 60 câu hỏi, hệ thống phân loại 3 nhóm nghề để bạn có lộ trình lựa chọn an toàn và hiệu quả nhất.
          </p>
        </div>

        {/* Tier 1: Nghề tương thích bản năng cao nhất (95%+) */}
        <div className="surface p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-emerald-500/30 bg-emerald-500/[0.02] dark:bg-emerald-950/10 shadow-soft">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                ✓
              </span>
              <div>
                <h5 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Nhóm 1: Nghề tương thích tự nhiên cao nhất
                </h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden xs:block">
                  Làm việc năng suất cao mà không bị căng thẳng, nhanh thăng tiến.
                </p>
              </div>
            </div>
            <span className="rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[0.68rem] sm:text-xs font-bold shrink-0">
              92% – 99%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {archetype.naturalFits.map((job, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                      {job.matchPct}% Match
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <h6 className="text-sm font-bold text-slate-900 dark:text-white">
                    {job.title}
                  </h6>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {job.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2: Đón đầu làn sóng mới & Kỷ nguyên AI */}
        <div className="surface p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-cobalt-500/30 bg-cobalt-500/[0.02] dark:bg-cobalt-950/10 shadow-soft">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-cobalt-500/15 text-cobalt-600 dark:text-electric-400 font-bold shrink-0">
                <TrendingUp className="h-4 w-4" />
              </span>
              <div>
                <h5 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Nhóm 2: Nghề bứt phá & Đón đầu Kỷ nguyên AI
                </h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden xs:block">
                  Những vị trí mới có tốc độ tuyển dụng cao và thu nhập cạnh tranh.
                </p>
              </div>
            </div>
            <span className="rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 bg-cobalt-500/10 text-cobalt-600 dark:text-electric-400 font-mono text-[0.68rem] sm:text-xs font-bold shrink-0">
              Future-Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {archetype.futureFits.map((job, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-cobalt-600 dark:text-electric-400">
                      ⚡ {job.trend}
                    </span>
                  </div>
                  <h6 className="text-sm font-bold text-slate-900 dark:text-white">
                    {job.title}
                  </h6>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {job.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 3: Nhóm nghề cần cân nhắc kĩ (Tránh chọn nhầm) */}
        <div className="surface p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-rose-500/20 bg-rose-500/[0.02] dark:bg-rose-950/10 shadow-soft">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold shrink-0">
              <Ban className="h-4 w-4" />
            </span>
            <div>
              <h5 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Nhóm 3: Môi trường làm việc cần cân nhắc kĩ
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden xs:block">
                Những kiểu công việc đi ngược lại sở thích tự nhiên, dễ gây chán nản.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
            {archetype.cautionRoles.map((role, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5"
              >
                <h6 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-rose-500">⚠</span> {role.title}
                </h6>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {role.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
