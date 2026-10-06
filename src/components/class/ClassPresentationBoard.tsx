import { motion } from 'framer-motion'
import {
  Trophy,
  Briefcase,
  Sparkles,
  Users,
  Lightbulb,
  CheckCircle2,
  Award,
  Layers,
} from 'lucide-react'
import { CountUp } from '@/components/shared/CountUp'
import { getIcon } from '@/components/shared/icons'
import { CLUSTER_MAP } from '@/data/careers'
import { PERSONALITY_MAP } from '@/data/personalities'
import { generateClassInsights } from '@/engine/classInsights'
import type { ClassStats } from '@/engine/classStats'

interface ClassPresentationBoardProps {
  stats: ClassStats
  classSize?: number
}

export function ClassPresentationBoard({ stats, classSize = 30 }: ClassPresentationBoardProps) {
  const topP = stats.topPersonality ? PERSONALITY_MAP[stats.topPersonality.code] : undefined
  const topC = stats.topCareer ? CLUSTER_MAP[stats.topCareer.clusterId] : undefined
  const TopCareerIcon = getIcon(topC?.icon ?? 'briefcase')
  const insights = generateClassInsights(stats)

  const participationPct = Math.min(100, Math.round((stats.participants / classSize) * 100))

  return (
    <div className="space-y-8">
      {/* ─────────────────────────────────────────────────────────────
          TOP BANNER: SĨ SỐ THAM GIA & TỔNG QUAN NHANH CHO MÁY CHIẾU
          ───────────────────────────────────────────────────────────── */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
        {/* Card 1: Sĩ số lớp */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0c142c]/90 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-cobalt-500/10 text-cobalt-600 dark:text-electric-400">
              <Users className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-1 text-xs font-bold text-slate-600 dark:text-slate-300">
              {participationPct}% sĩ số
            </span>
          </div>

          <div className="mt-3.5 sm:mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Học sinh đã làm bài
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
                <CountUp value={stats.participants} />
              </span>
              <span className="text-sm font-semibold text-slate-400">
                / {classSize} bạn
              </span>
            </div>
          </div>

          {/* Mini progress bar */}
          <div className="mt-3 sm:mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${participationPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-cobalt-600 to-teal-400"
            />
          </div>
        </motion.div>

        {/* Card 2: Nhóm tính cách chủ đạo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="surface relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0c142c]/90 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <span
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl text-white shadow-sm"
              style={{ backgroundColor: topP?.color || '#2f5bff' }}
            >
              <Trophy className="h-5 w-5" />
            </span>
            {stats.topPersonality && (
              <span className="rounded-full bg-gold-400/10 px-2.5 py-1 text-xs font-bold text-[#9a6a0a] dark:text-gold-400 border border-gold-400/20">
                {stats.topPersonality.count} bạn ({Math.round(stats.topPersonality.pct)}%)
              </span>
            )}
          </div>

          <div className="mt-3.5 sm:mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Nhóm tính cách nổi trội nhất
            </p>
            <p className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
              {topP?.name || 'Đang cập nhật'}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
              {topP ? `${topP.title} (${topP.code})` : '—'}
            </p>
          </div>
        </motion.div>

        {/* Card 3: Top Nhóm nghề */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="surface relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0c142c]/90 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <TopCareerIcon className="h-5 w-5" />
            </span>
            {stats.topCareer && (
              <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-bold text-teal-700 dark:text-teal-300">
                {stats.topCareer.count} bạn ({Math.round(stats.topCareer.pct)}%)
              </span>
            )}
          </div>

          <div className="mt-3.5 sm:mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Ngành nghề được quan tâm nhất
            </p>
            <p className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
              {topC?.shortLabel || 'Đang cập nhật'}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
              {topC?.name || '—'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MỤC 1: PHÂN BỔ TÍNH CÁCH & NĂNG LỰC HOLLAND RIASEC (SPECTRUM)
          ───────────────────────────────────────────────────────────── */}
      <section className="surface overflow-hidden rounded-2xl sm:rounded-[2.2rem] border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0a1128]/95 p-4 sm:p-10 shadow-lift">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-5 sm:pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cobalt-500/10 px-3 py-1 text-[0.68rem] sm:text-xs font-bold uppercase tracking-wider text-cobalt-600 dark:text-electric-400">
              <Layers className="h-3.5 w-3.5" />
              MỤC 1 TRONG 3 • PHỔ TÍNH CÁCH
            </div>
            <h3 className="mt-2 text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Phân bổ 6 nhóm năng lực Holland RIASEC
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Tỷ lệ % học sinh chiếm ưu thế và điểm trung bình của cả lớp theo 6 nhóm tính cách.
            </p>
          </div>

          {stats.topPersonality && topP && (
            <div className="flex items-center gap-2 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-3 py-1.5 sm:px-4 sm:py-2 self-start sm:self-auto">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-amber-800 dark:text-amber-300">Nhóm chủ đạo: </span>
                <span className="font-semibold text-amber-900 dark:text-amber-200">
                  {topP.name} ({stats.topPersonality.count} bạn)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 6 RIASEC Groups Visual Grid */}
        <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.distribution.map((item, idx) => {
            const p = PERSONALITY_MAP[item.code]
            const isTop = idx === 0 && item.count > 0
            const avgScore = stats.averageMap[item.code] ?? 0

            return (
              <motion.div
                key={item.code}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className={`relative overflow-hidden rounded-2xl p-5 border transition-all ${
                  isTop
                    ? 'border-cobalt-500/40 bg-gradient-to-br from-cobalt-500/5 to-teal-500/5 dark:from-cobalt-500/15 dark:to-teal-500/10 shadow-md ring-1 ring-cobalt-500/30'
                    : 'border-slate-100 dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.02] hover:border-slate-200 dark:hover:border-white/10'
                }`}
              >
                {/* Top Badge */}
                {isTop && (
                  <span className="absolute top-3 right-3 rounded-full bg-gold-400 text-slate-900 px-2 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Trophy className="h-2.5 w-2.5" /> Dẫn đầu
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-black text-white shadow-sm"
                    style={{ backgroundColor: p.color }}
                  >
                    {item.code}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                      {p.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {p.title}
                    </p>
                  </div>
                </div>

                {/* Score & Student Metrics */}
                <div className="mt-4 flex items-end justify-between pt-3 border-t border-slate-200/60 dark:border-white/5">
                  <div>
                    <span className="text-2xl font-black tabular-nums text-slate-900 dark:text-white">
                      {item.count}
                    </span>
                    <span className="ml-1 text-xs text-slate-500 font-medium">học sinh</span>
                  </div>

                  <div className="text-right">
                    <span
                      className="text-lg font-extrabold tabular-nums"
                      style={{ color: p.color }}
                    >
                      {Math.round(item.pct)}%
                    </span>
                    <span className="block text-[0.7rem] text-slate-400">
                      ĐTB: {avgScore}đ
                    </span>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200/60 dark:bg-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.pct}%`,
                      backgroundColor: p.color,
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          MỤC 2: XU HƯỚNG NGHỀ NGHIỆP & NHÓM NGÀNH LỚP QUAN TÂM
          ───────────────────────────────────────────────────────────── */}
      <section className="surface overflow-hidden rounded-[1.8rem] sm:rounded-[2.2rem] border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0a1128]/95 p-4 sm:p-8 lg:p-10 shadow-lift">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-5 sm:pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-3 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              <Briefcase className="h-3.5 w-3.5" />
              MỤC 2 TRONG 3 • XU HƯỚNG NGHỀ NGHIỆP
            </div>
            <h3 className="mt-2 text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Định hướng ngành nghề cả lớp quan tâm nhất
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Thống kê thứ hạng nhóm ngành theo nguyện vọng và độ tương thích với điểm khảo sát của học sinh.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 dark:bg-white/5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-100 dark:border-white/5 self-start sm:self-auto">
            Tổng số nhóm ngành: <strong>{stats.careerCounts.length} nhóm</strong>
          </div>
        </div>

        {/* Top Career Clusters List */}
        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-3.5">
          {stats.careerCounts.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              Chưa có dữ liệu ngành nghề để thống kê.
            </p>
          ) : (
            stats.careerCounts.slice(0, 6).map((item, idx) => {
              const cluster = CLUSTER_MAP[item.clusterId]
              const Icon = getIcon(cluster?.icon ?? 'briefcase')
              const isTop = idx === 0

              return (
                <motion.div
                  key={item.clusterId}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07 }}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl p-3.5 sm:p-5 border transition-all ${
                    isTop
                      ? 'border-teal-500/30 bg-teal-500/5 dark:bg-teal-500/10 shadow-sm'
                      : 'border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.015] hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Left: Rank & Title */}
                  <div className="flex items-center gap-3 sm:gap-3.5 sm:min-w-[240px] flex-1">
                    <span
                      className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl text-xs sm:text-sm font-black ${
                        isTop
                          ? 'bg-gradient-to-tr from-teal-500 to-emerald-400 text-white shadow-sm'
                          : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
                          {cluster?.shortLabel || item.clusterId}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {cluster?.name || 'Ngành nghề định hướng'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Center: Visual Bar */}
                  <div className="flex-1 max-w-md hidden md:block px-4">
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.max(8, item.pct)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          isTop
                            ? 'bg-gradient-to-r from-teal-500 to-emerald-400'
                            : 'bg-gradient-to-r from-cobalt-500 to-indigo-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Right: Numbers */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <strong className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                        {item.count}
                      </strong>{' '}
                      bạn quan tâm
                    </span>

                    <span
                      className={`text-sm sm:text-base font-extrabold tabular-nums px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-xl ${
                        isTop
                          ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300'
                          : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {Math.round(item.pct)}%
                    </span>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          MỤC 3: BẢN NHẬN ĐỊNH DNA LỚP HỌC & LỜI KHUYÊN ĐỊNH HƯỚNG
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[1.8rem] sm:rounded-[2.2rem] bg-navy-900 text-white p-4 sm:p-8 lg:p-12 shadow-2xl">
        {/* Glow ambient */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cobalt-500/30 blur-[100px]" aria-hidden />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-teal-500/20 blur-[100px]" aria-hidden />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-[11px] sm:text-xs font-bold tracking-[0.12em] sm:tracking-[0.16em] uppercase text-gold-400">
                <Sparkles className="h-3.5 w-3.5" />
                MỤC 3 TRONG 3 • TỔNG KẾT & LỜI KHUYÊN
              </div>
              <h3 className="mt-2 text-xl sm:text-3xl font-extrabold tracking-tight text-white">
                Bản nhận định DNA tập thể & Định hướng lớp
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Phân tích chuyên sâu tự động được tính toán trực tiếp từ dữ liệu bài làm của lớp học.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl sm:rounded-2xl bg-white/10 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-medium text-slate-200 self-start sm:self-auto">
              <Lightbulb className="h-4 w-4 text-gold-400 shrink-0" />
              <span>Dành cho Giáo viên & Học sinh</span>
            </div>
          </div>

          {/* Insights Grid */}
          <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 md:grid-cols-2">
            {insights.map((ins, i) => {
              const Icon = getIcon(ins.icon)

              return (
                <motion.div
                  key={`${i}-${ins.text}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-3.5 sm:gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:p-6 backdrop-blur-md transition-all hover:bg-white/[0.1]"
                >
                  <span className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cobalt-500 to-teal-400 text-white shadow-glow">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </span>

                  <div className="space-y-1">
                    <p className="text-xs sm:text-base leading-relaxed text-slate-100 font-medium">
                      {ins.text}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Practical takeaway banner */}
          <div className="mt-5 sm:mt-6 rounded-2xl border border-teal-500/30 bg-teal-500/10 p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-teal-200">
            <div className="flex items-start sm:items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-teal-400 shrink-0 mt-0.5 sm:mt-0" />
              <span className="leading-relaxed">
                <strong>Gợi ý định hướng:</strong> Lớp học có thể dựa vào phân bổ RIASEC trên để định hướng các chuyên đề học tập, chọn tổ hợp môn tự chọn lớp 10-11-12 và tham gia ngày hội tư vấn tuyển sinh phù hợp nhất.
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
