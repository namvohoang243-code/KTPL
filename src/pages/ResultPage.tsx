import { useState } from 'react'
import {
  ArrowRight,
  ClipboardList,
  Box,
  Radar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCw,
  Users,
} from 'lucide-react'
import { HollandCareersSection } from '@/components/result/HollandCareersSection'
import { PersonalityCareerReport } from '@/components/result/PersonalityCareerReport'
import { PersonalityRadar } from '@/components/result/PersonalityRadar'
import { ResultHeader } from '@/components/result/ResultHeader'
import { ScoreBars } from '@/components/result/ScoreBars'
import { ThreeResultCrystal } from '@/components/result/ThreeResultCrystal'
import { TopThree } from '@/components/result/TopThree'
import { Disclaimer } from '@/components/shared/Disclaimer'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Button, ButtonLink } from '@/components/ui/button'
import { useApp } from '@/store/AppContext'

function EmptyResult() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white dark:bg-white/10 text-cobalt-500 shadow-lift">
        <ClipboardList className="h-9 w-9" />
      </span>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
        Bạn chưa có kết quả nào
      </h1>
      <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
        Hoàn thành bài trắc nghiệm 60 câu chuẩn O*NET & RMIT để nhận diện hồ sơ tính cách và gợi ý nghề nghiệp phù hợp.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink to="/quiz" size="lg" variant="primary">
          Bắt đầu làm bài test
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
        <ButtonLink to="/careers" size="lg" variant="outline">
          Xem vũ trụ nghề nghiệp
        </ButtonLink>
      </div>
    </section>
  )
}

export function ResultPage() {
  const { result, formSubmitStatus, submitResultToGoogleForm } = useApp()
  const [chartMode, setChartMode] = useState<'3d' | '2d'>('3d')

  if (!result) return <EmptyResult />

  return (
    <div className="pb-16">
      <ResultHeader result={result} />

      {/* Google Sheet Sync / Submission Status Banner */}
      <section className="container-page mt-4 sm:mt-6">
        <div className="surface p-3.5 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            {formSubmitStatus === 'sending' ? (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cobalt-500/10 text-cobalt-500">
                <Loader2 className="h-5 w-5 animate-spin" />
              </span>
            ) : formSubmitStatus === 'failed' ? (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                <AlertCircle className="h-5 w-5" />
              </span>
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500">
                <CheckCircle2 className="h-5 w-5" />
              </span>
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate sm:text-clip">
                {formSubmitStatus === 'sending'
                  ? 'Đang gửi kết quả về Google Form của giáo viên...'
                  : formSubmitStatus === 'failed'
                  ? 'Chưa gửi được kết quả về Google Sheet do lỗi mạng'
                  : 'Đã gửi kết quả về Google Sheet của lớp học!'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formSubmitStatus === 'failed'
                  ? 'Bạn có thể bấm Gửi lại để đồng bộ kết quả vào thống kê chung của lớp.'
                  : `Học sinh: ${result.name || 'Ẩn danh'} • Lớp: ${result.className || '10A1'} • Nghề gợi ý: ${result.primaryCareer || 'Đã phân tích'}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0 justify-end">
            {formSubmitStatus === 'failed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => submitResultToGoogleForm(result)}
                className="gap-1.5 flex-1 sm:flex-none justify-center"
              >
                <RotateCw className="h-3.5 w-3.5" />
                Gửi lại
              </Button>
            )}
            <ButtonLink to="/class" variant="cobalt" size="sm" className="gap-1.5 shadow-sm flex-1 sm:flex-none justify-center">
              <Users className="h-3.5 w-3.5" />
              Xem thống kê cả lớp
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 1. Radar Chart / 3D Crystal & Top 3 Highlights */}
      <section className="container-page mt-8 sm:mt-16" aria-labelledby="chart-title">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Personality Hologram"
              title={<span id="chart-title">Mô hình tính cách Holland của bạn</span>}
              description="Điểm số 6 chiều RIASEC phản chiếu xu hướng tư duy và năng khiếu tự nhiên."
            />

            {/* 3D / 2D Switcher */}
            <div className="flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#060b18]/80 p-1 backdrop-blur-xl shadow-soft self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setChartMode('3d')}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  chartMode === '3d'
                    ? 'bg-gradient-to-r from-cobalt-600 to-electric-500 text-white shadow-glow'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Box className="h-3.5 w-3.5" />
                <span>3D Crystal</span>
              </button>
              <button
                type="button"
                onClick={() => setChartMode('2d')}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  chartMode === '2d'
                    ? 'bg-gradient-to-r from-cobalt-600 to-electric-500 text-white shadow-glow'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Radar className="h-3.5 w-3.5" />
                <span>Biểu đồ 2D Radar</span>
              </button>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 sm:mt-8 grid items-center gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="surface p-2 sm:p-7 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl">
            {chartMode === '3d' ? (
              <ThreeResultCrystal scores={result.scores} topCodes={result.topCodes} />
            ) : (
              <PersonalityRadar scores={result.scores} label="Bạn" height={320} />
            )}
          </Reveal>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-gold-400" /> Top 3 nhóm năng lực nổi trội
            </p>
            <TopThree codes={result.topCodes} scores={result.scores} />
          </div>
        </div>
      </section>

      {/* 2. Comprehensive Personality & Career Match Report */}
      <section className="container-page mt-20" aria-labelledby="personality-career-report-title">
        <Reveal>
          <PersonalityCareerReport result={result} />
        </Reveal>
      </section>

      {/* 3. Detailed Scores Breakdown Bars */}
      <section className="container-page mt-20" aria-labelledby="breakdown-title">
        <Reveal>
          <SectionHeading
            eyebrow="Detailed Breakdown"
            title={<span id="breakdown-title">Chi tiết phân bổ điểm 6 chiều tính cách</span>}
            description="Điểm số đánh giá chi tiết (thang điểm 10–50) và phần trăm độ tương đồng theo từng nhóm tính cách Holland."
          />
        </Reveal>
        <div className="mt-8">
          <ScoreBars scores={result.scores} />
        </div>
      </section>

      {/* 4. Recommended Practical Careers from O*NET & RMIT */}
      <section className="container-page mt-20" aria-labelledby="holland-careers-title">
        <Reveal>
          <HollandCareersSection result={result} />
        </Reveal>
      </section>

      {/* Disclaimer */}
      <section className="container-page mt-16">
        <Disclaimer className="max-w-3xl mx-auto" />
      </section>
    </div>
  )
}
