import { Briefcase, ArrowRight, Sparkles, Compass, CheckCircle2 } from 'lucide-react'
import { HOLLAND_TYPES } from '@/data/hollandData'
import { ButtonLink } from '@/components/ui/button'
import type { PersonalityCode, QuizResult } from '@/types'

interface HollandCareersSectionProps {
  result: QuizResult
}

export function HollandCareersSection({ result }: HollandCareersSectionProps) {
  const topCode = result.topCodes[0] as PersonalityCode
  const subCode1 = result.topCodes[1] as PersonalityCode

  const topDetail = HOLLAND_TYPES[topCode] || HOLLAND_TYPES.R
  const subDetail1 = subCode1 ? HOLLAND_TYPES[subCode1] : null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="eyebrow flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-cobalt-500" /> BẢN ĐỒ NGHỀ NGHIỆP O*NET & RMIT
          </span>
          <h3 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Định hướng nghề nghiệp phù hợp ({topDetail.name} – {topDetail.title})
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Dữ liệu đối chiếu theo chuẩn phân loại việc làm quốc tế O*NET (Bộ Lao động Hoa Kỳ) và khung hướng nghiệp Đại học RMIT Việt Nam.
          </p>
        </div>

        <ButtonLink to="/careers" variant="outline" size="sm" className="self-start sm:self-auto gap-1.5">
          <span>Xem vũ trụ ngành nghề</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </ButtonLink>
      </div>

      {/* 3 Career Sectors (O*NET & RMIT) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {topDetail.sectors.map((sec, sIdx) => (
          <div
            key={sIdx}
            className="surface p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0a1128]/90 backdrop-blur-xl shadow-soft flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black"
                  style={{ backgroundColor: `${topDetail.color}25`, color: topDetail.color }}
                >
                  0{sIdx + 1}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {sec.title}
                </h4>
              </div>

              <ul className="space-y-2 mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {sec.careers.map((job, jIdx) => (
                  <li key={jIdx} className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold shrink-0">•</span>
                    <span className="leading-snug">{job}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-[0.68rem] text-slate-400 font-medium flex items-center gap-1">
              <Compass className="h-3 w-3 text-cobalt-500" /> Nhóm nghề mũi nhọn O*NET
            </div>
          </div>
        ))}
      </div>

      {/* Top 5 Highlighted Job Cards with Skill Pills */}
      <div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-teal-500" /> 5 Vị trí nghề nghiệp tiêu biểu & kỹ năng cốt lõi:
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {topDetail.careers.map((career, idx) => (
            <div
              key={idx}
              className="surface group relative p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0a1128]/90 backdrop-blur-xl shadow-soft hover:shadow-lift transition-all hover:border-cobalt-400/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cobalt-500/10 text-cobalt-600 dark:text-electric-400 font-mono text-xs font-bold">
                    #{idx + 1}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[0.68rem] font-bold"
                    style={{ backgroundColor: `${topDetail.color}20`, color: topDetail.color }}
                  >
                    {career.sector}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-cobalt-600 dark:group-hover:text-electric-400 transition-colors">
                  {career.name}
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {career.desc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5">
                <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Kỹ năng chìa khóa cần rèn luyện:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {career.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="rounded-full px-2.5 py-1 text-[0.72rem] font-semibold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Bonus Card: Cross-disciplinary from sub-group */}
          {subDetail1 && (
            <div className="surface p-6 rounded-3xl border border-dashed border-slate-300 dark:border-white/20 bg-slate-50/50 dark:bg-white/[0.02] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="flex items-center gap-1 text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">
                    <Sparkles className="h-3 w-3 text-gold-400" /> Ngành liên ngành nổi bật
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[0.68rem] font-bold"
                    style={{ backgroundColor: `${subDetail1.color}20`, color: subDetail1.color }}
                  >
                    {subDetail1.name} ({subCode1})
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {subDetail1.careers[0]?.name}
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {subDetail1.careers[0]?.desc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-white/5">
                <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Kỹ năng liên ngành:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {subDetail1.careers[0]?.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="rounded-full px-2.5 py-1 text-[0.72rem] font-semibold bg-slate-200/60 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
