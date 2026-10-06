import { useState } from 'react'
import { CheckCircle2, AlertTriangle, Building2, BarChart2, PieChart as PieIcon, Award } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts'
import { HOLLAND_TYPES } from '@/data/hollandData'
import { PERSONALITY_CODES } from '@/data/personalities'
import type { PersonalityCode, QuizResult } from '@/types'

interface VisualChartsSectionProps {
  result: QuizResult
}

export function VisualChartsSection({ result }: VisualChartsSectionProps) {
  const [activeTab, setActiveTab] = useState<'donut' | 'bar'>('donut')

  const topCode = result.topCodes[0] as PersonalityCode
  const subCode1 = result.topCodes[1] as PersonalityCode
  const subCode2 = result.topCodes[2] as PersonalityCode

  const topDetail = HOLLAND_TYPES[topCode] || HOLLAND_TYPES.R
  const subDetail1 = subCode1 ? HOLLAND_TYPES[subCode1] : null
  const subDetail2 = subCode2 ? HOLLAND_TYPES[subCode2] : null

  // Raw score is out of 50 (10 questions * 5 pts)
  const rawScores = result.rawScores || {
    R: Math.round((result.scores.R / 100) * 40) + 10,
    I: Math.round((result.scores.I / 100) * 40) + 10,
    A: Math.round((result.scores.A / 100) * 40) + 10,
    S: Math.round((result.scores.S / 100) * 40) + 10,
    E: Math.round((result.scores.E / 100) * 40) + 10,
    C: Math.round((result.scores.C / 100) * 40) + 10,
  }

  const chartData = PERSONALITY_CODES.map((code) => {
    const detail = HOLLAND_TYPES[code]
    const rawVal = rawScores[code] || 0
    const pct = result.scores[code] ?? Math.min(100, Math.max(0, Math.round(((rawVal - 10) / 40) * 100)))

    return {
      code,
      name: detail.name,
      fullName: `${detail.name} (${code})`,
      rawScore: rawVal,
      pct,
      color: detail.color,
    }
  }).sort((a, b) => b.rawScore - a.rawScore)

  const topChartItem = chartData[0]!

  return (
    <div className="space-y-8">
      {/* 1. Charts & Ratio Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Card: Interactive Chart Box */}
        <div className="lg:col-span-7 surface p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0a1128]/90 backdrop-blur-xl shadow-lift flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="eyebrow flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-gold-400" /> PHÂN BỐ NĂNG LỰC 60 CÂU HỎI
              </span>
              <h3 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Biểu đồ tương quan 6 chiều RIASEC
              </h3>
            </div>

            {/* Toggle Donut vs Bar */}
            <div className="flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('donut')}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'donut'
                    ? 'bg-cobalt-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <PieIcon className="h-3.5 w-3.5" />
                <span>Tròn</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bar')}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'bar'
                    ? 'bg-cobalt-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart2 className="h-3.5 w-3.5" />
                <span>Cột</span>
              </button>
            </div>
          </div>

          {/* Chart Display Container */}
          <div className="my-6 relative min-h-[280px] sm:min-h-[320px] flex items-center justify-center">
            {activeTab === 'donut' ? (
              <div className="relative w-full h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="rawScore"
                      nameKey="fullName"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={105}
                      paddingAngle={3}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.code} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, _name: any, item: any) => [
                        `${value} / 50 điểm (${item.payload.pct}%)`,
                        item.payload.fullName,
                      ]}
                      contentStyle={{
                        backgroundColor: 'rgba(10, 17, 40, 0.95)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '16px',
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: '600',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Badge inside Donut */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-3xl font-black tracking-tight" style={{ color: topDetail.color }}>
                    {topChartItem.pct}%
                  </span>
                  <span className="text-[0.72rem] font-bold uppercase tracking-wider text-slate-400">
                    {topDetail.name} ({topCode})
                  </span>
                  <span className="text-[0.68rem] text-slate-500 font-mono">
                    {topChartItem.rawScore} / 50 điểm
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 15, bottom: 5 }}>
                    <XAxis type="number" domain={[0, 50]} stroke="#94a3b8" fontSize={11} />
                    <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={85} />
                    <Tooltip
                      formatter={(val: any, _n: any, item: any) => [
                        `${val} / 50 điểm (${item.payload.pct}%)`,
                        'Điểm đánh giá',
                      ]}
                      contentStyle={{
                        backgroundColor: 'rgba(10, 17, 40, 0.95)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '14px',
                        color: '#fff',
                        fontSize: '13px',
                      }}
                    />
                    <Bar dataKey="rawScore" radius={[0, 10, 10, 0]}>
                      {chartData.map((entry) => (
                        <Cell key={entry.code} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Legend Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4 border-t border-slate-100 dark:border-white/5">
            {chartData.map((item) => (
              <div
                key={item.code}
                className="flex items-center justify-between rounded-xl px-2.5 py-1.5 bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 text-xs font-semibold"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
                </span>
                <span className="font-mono text-slate-500 font-bold ml-1">
                  {item.rawScore}/50 ({item.pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Concise Holland Profile Breakdown */}
        <div className="lg:col-span-5 surface p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0a1128]/90 backdrop-blur-xl shadow-lift flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                style={{ backgroundColor: `${topDetail.color}20`, color: topDetail.color }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: topDetail.color }} />
                NHÓM NỔI TRỘI NHẤT
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                Mã: {result.topCodes.join('')}
              </span>
            </div>

            <h3 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {topDetail.name} <span className="text-lg font-bold" style={{ color: topDetail.color }}>({topDetail.title})</span>
            </h3>

            <p className="mt-1 text-xs font-mono uppercase tracking-wider text-slate-400">
              {topDetail.tagline}
            </p>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {topDetail.traits}
            </p>

            {/* Sub-groups badges */}
            {(subDetail1 || subDetail2) && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Nhóm phối hợp:</span>
                {subDetail1 && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold"
                    style={{ backgroundColor: `${subDetail1.color}18`, color: subDetail1.color }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: subDetail1.color }} />
                    {subDetail1.name} ({subCode1})
                  </span>
                )}
                {subDetail2 && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold"
                    style={{ backgroundColor: `${subDetail2.color}18`, color: subDetail2.color }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: subDetail2.color }} />
                    {subDetail2.name} ({subCode2})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quick Strengths, Weaknesses, and Environment */}
          <div className="mt-6 space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
            {/* Strengths */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="h-3.5 w-3.5" /> 3 Lợi thế năng lực cạnh tranh
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                {topDetail.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold shrink-0">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses / Points to watch */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="h-3.5 w-3.5" /> Điểm cần lưu tâm & bẫy hành vi
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {topDetail.weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold shrink-0">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Environment */}
            <div className="rounded-2xl p-3.5 bg-slate-100/80 dark:bg-white/5 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
              <Building2 className="h-4 w-4 shrink-0 text-cobalt-500 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white">Môi trường làm việc chuẩn O*NET:</strong> {topDetail.environment}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
