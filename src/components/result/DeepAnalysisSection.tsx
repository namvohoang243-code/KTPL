import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronRight,
  Flame,
  GraduationCap,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react'

import { AICareerAdvisor } from '@/components/result/AICareerAdvisor'
import { Badge } from '@/components/ui/badge'
import type { DeepPersonalityAnalysis } from '@/engine/aiAnalysis'
import type { QuizResult } from '@/types'

interface DeepAnalysisSectionProps {
  result: QuizResult
  analysis: DeepPersonalityAnalysis
}

export function DeepAnalysisSection({ result, analysis }: DeepAnalysisSectionProps) {
  return (
    <div className="space-y-12">
      {/* 1. Executive Archetype Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-[#0a1128] to-cobalt-950 p-8 text-white shadow-lift sm:p-12 border border-white/10">
        <div className="bg-grid-tech pointer-events-none absolute inset-0 opacity-25" aria-hidden />
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cobalt-500/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-teal-500/20 blur-[90px]" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-teal-300">
              <Sparkles className="h-3.5 w-3.5" /> HỒ SƠ ĐỊNH HƯỚNG TƯƠNG LAI
            </span>
            <Badge variant="gold">Hình mẫu: {analysis.archetype}</Badge>
          </div>

          <h3 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-4xl">
            {analysis.headline}
          </h3>

          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {analysis.executiveSummary}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-400">Văn hóa làm việc</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-white">{analysis.workplaceFit.idealCulture}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wider text-electric-300">Nhịp độ tối ưu</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-white">{analysis.workplaceFit.preferredPace}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-400">Tương tác đội ngũ</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-white">{analysis.workplaceFit.teamDynamics}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Động lực nội tại: Energizers vs Drainers */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="surface p-7 sm:p-8 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Flame className="h-6 w-6" />
            </span>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Nguồn năng lượng thúc đẩy (Energizers)</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Những điều khiến bạn hào hứng và say mê cống hiến</p>
            </div>
          </div>
          <ul className="mt-6 space-y-3.5">
            {analysis.intrinsicDrivers.energizers.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="surface p-7 sm:p-8 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="h-6 w-6" />
            </span>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Yếu tố gây tiêu hao năng lượng (Drainers)</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Những tình huống làm bạn mệt mỏi, cần chủ động phòng tránh</p>
            </div>
          </div>
          <ul className="mt-6 space-y-3.5">
            {analysis.intrinsicDrivers.drainers.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Lợi thế cạnh tranh & Điểm mù (Blind spots & Remedies) */}
      <div className="surface p-7 sm:p-9 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl">
        <div className="flex flex-col gap-2 border-b border-slate-200 dark:border-white/10 pb-6">
          <span className="eyebrow">Strategic Self-Awareness</span>
          <h4 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Lợi thế cạnh tranh & Điểm mù cần khắc phục
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hiểu rõ điểm mạnh độc bản để phát huy tối đa, đồng thời nhận diện cạm bẫy tư duy để tránh trượt dốc.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Competitive edge */}
          <div>
            <h5 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-cobalt-600 dark:text-electric-400">
              <Zap className="h-4 w-4" /> 3 Vũ khí cạnh tranh vượt trội của bạn:
            </h5>
            <div className="mt-4 space-y-3">
              {analysis.competitiveEdge.map((edge, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.03] p-4 text-sm font-medium text-slate-800 dark:text-slate-200">
                  <span className="font-bold text-cobalt-600 dark:text-electric-400 mr-2">0{idx + 1}.</span>
                  {edge}
                </div>
              ))}
            </div>
          </div>

          {/* Blind spots */}
          <div>
            <h5 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4" /> Điểm mù hành vi & Phương pháp hóa giải:
            </h5>
            <div className="mt-4 space-y-4">
              {analysis.blindSpots.map((spot, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.03] p-4">
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    Cạm bẫy: <span className="font-medium text-slate-800 dark:text-slate-200">{spot.pitfall}</span>
                  </p>
                  <p className="mt-2 text-xs font-semibold text-teal-600 dark:text-teal-400 border-t border-slate-200 dark:border-white/10 pt-2">
                    Giải pháp: <span className="font-normal text-slate-700 dark:text-slate-300">{spot.remedy}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Định hướng xét tuyển Đại học Việt Nam */}
      <div className="surface p-7 sm:p-9 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl">
        <div className="flex flex-col gap-2 border-b border-slate-200 dark:border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="eyebrow">Academic Roadmap Vietnam</span>
            <h4 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Khối ngành & Tổ hợp môn xét tuyển Đại học
            </h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Dữ liệu cập nhật sát với quy chế tuyển sinh các trường Đại học trọng điểm tại Việt Nam.
            </p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cobalt-50 dark:bg-cobalt-500/10 text-cobalt-600 dark:text-electric-400 shadow-soft">
            <GraduationCap className="h-6 w-6" />
          </span>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {analysis.collegeMajors.map((major) => (
            <motion.div
              key={major.name}
              whileHover={{ y: -4 }}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] p-6 shadow-soft hover:border-cobalt-400/40"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h5 className="text-lg font-bold text-slate-900 dark:text-white">{major.name}</h5>
                  <div className="flex gap-1">
                    {major.clusters.map((c) => (
                      <span key={c} className="rounded-md bg-cobalt-100 dark:bg-cobalt-500/20 px-2 py-0.5 font-mono text-[0.7rem] font-bold text-cobalt-700 dark:text-electric-300">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{major.description}</p>

                <div className="mt-4 border-t border-slate-200 dark:border-white/10 pt-4">
                  <p className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Tổ hợp môn xét tuyển</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {major.examSubjects.map((sub) => (
                      <span key={sub} className="rounded-lg bg-teal-50 dark:bg-teal-500/10 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-200 dark:border-white/10 pt-4">
                <p className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Trường đào tạo hàng đầu</p>
                <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">{major.topUniversities.join(' • ')}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5. Lộ trình phát triển 4 giai đoạn */}
      <div className="surface p-7 sm:p-9 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl">
        <div className="flex flex-col gap-2 border-b border-slate-200 dark:border-white/10 pb-6">
          <span className="eyebrow">Actionable Career Roadmap</span>
          <h4 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Lộ trình phát triển toàn diện 4 giai đoạn
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Từ những bước chuẩn bị ở bậc THPT đến vị trí chuyên gia độc lập trong ngành.
          </p>
        </div>

        <div className="relative mt-8 space-y-8 before:absolute before:bottom-0 before:left-5 before:top-4 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10 sm:before:left-7">
          {analysis.roadmap.map((step, idx) => (
            <div key={step.phase} className="relative flex items-start gap-4 sm:gap-6">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 dark:bg-cobalt-600 text-sm font-bold text-white shadow-soft sm:h-14 sm:w-14 sm:text-base">
                0{idx + 1}
              </span>
              <div className="flex-1 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] p-6 shadow-soft sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-cobalt-600 dark:text-electric-400">
                    {step.phase} ({step.ageGroup})
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-teal-600 dark:text-teal-400">
                    <Award className="h-3.5 w-3.5" /> Cột mốc then chốt
                  </span>
                </div>

                <h5 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{step.title}</h5>

                <ul className="mt-4 space-y-2">
                  {step.actionItems.map((act, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cobalt-500" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 rounded-xl bg-teal-50/60 dark:bg-teal-500/10 p-3 text-xs font-medium text-teal-800 dark:text-teal-300">
                  <span className="font-bold">Mục tiêu cốt lõi: </span>
                  {step.keyMilestone}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Trợ lý Cố vấn Nghề nghiệp Tương tác (Interactive Advisor) */}
      <AICareerAdvisor result={result} analysis={analysis} />
    </div>
  )
}
