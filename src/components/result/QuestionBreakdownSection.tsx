import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Zap,
  GitMerge,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { HOLLAND_TYPES } from '@/data/hollandData'
import { HOLLAND_GROUP_METAS, LIKERT_OPTIONS, QUESTIONS } from '@/data/questions'
import type { PersonalityCode, QuizResult } from '@/types'

interface QuestionBreakdownSectionProps {
  result: QuizResult
}

// Synergy insights for common RIASEC 2-letter combos
const SYNERGY_MAP: Record<string, { title: string; desc: string }> = {
  RI: {
    title: 'Kỹ thuật Nghiên cứu & Tự động hóa',
    desc: 'Sự kết hợp giữa tư duy chế tạo thực tế và phân tích logic sâu sắc — lý tưởng cho Robotics, AI phần cứng và nghiên cứu R&D.',
  },
  RA: {
    title: 'Thiết kế Công nghiệp & Kiến trúc',
    desc: 'Bàn tay khéo léo kết hợp óc thẩm mỹ độc đáo — phù hợp với kiến trúc cảnh quan, thiết kế sản phẩm vật lý và tạo hình 3D.',
  },
  RS: {
    title: 'Huấn luyện Kỹ thuật & Y tế Thực hành',
    desc: 'Khả năng thao tác thực tế kết hợp lòng quan tâm con người — phù hợp với kỹ thuật viên y tế, huấn luyện viên thể thao.',
  },
  RE: {
    title: 'Quản lý Sản xuất & Dự án Kỹ thuật',
    desc: 'Tư duy thực hành kết hợp bản lĩnh lãnh đạo — lý tưởng cho giám sát công trường, founder công nghệ phần cứng.',
  },
  RC: {
    title: 'Vận hành Hạ tầng & Kiểm định Kỹ thuật',
    desc: 'Thực hành chuẩn xác kết hợp tính kỷ luật hệ thống — tuyệt vời cho logistics kho vận, bảo trì thiết bị hàng không.',
  },
  IR: {
    title: 'Khoa học Ứng dụng & Kỹ thuật Dữ liệu',
    desc: 'Mổ xẻ bản chất vấn đề và biến thuật toán thành giải pháp phần cứng/phần mềm vận hành thực tế.',
  },
  IA: {
    title: 'Khoa học Sáng tạo & UX Researcher',
    desc: 'Tư duy phân tích phản biện đi cùng trực giác nhạy cảm — phù hợp cho thiết kế trải nghiệm người dùng, viết sách khoa học.',
  },
  IS: {
    title: 'Y học Lâm sàng & Tâm lý Trị liệu',
    desc: 'Nghiên cứu nguyên nhân gốc rễ và thấu cảm nỗi đau con người — hình mẫu lý tưởng của bác sĩ, chuyên gia tâm lý học.',
  },
  IE: {
    title: 'Chiến lược Dữ liệu & Tư vấn Công nghệ',
    desc: 'Sử dụng dữ liệu và bằng chứng logic để thuyết phục và định hình chiến lược kinh doanh lớn.',
  },
  IC: {
    title: 'Phân tích Tài chính & An ninh Mạng',
    desc: 'Tư duy logic sắc bén phối hợp với tính tỉ mỉ, kiểm soát — phù hợp kiểm toán số, điều tra an ninh mạng.',
  },
  AI: {
    title: 'Thiết kế Tương tác & Nghệ thuật Số',
    desc: 'Trí tưởng tượng không giới hạn kết hợp tư duy logic công nghệ — dẫn đầu trong Game Design, VFX, AI Art.',
  },
  AS: {
    title: 'Giáo dục Nghệ thuật & Truyền thông Xã hội',
    desc: 'Tài năng biểu đạt cảm xúc giúp lan tỏa thông điệp nhân văn, chữa lành tâm hồn qua nghệ thuật.',
  },
  AE: {
    title: 'Giám đốc Sáng tạo & Khởi nghiệp Nội dung',
    desc: 'Ý tưởng đột phá đi cùng bản lĩnh thương mại hóa — phù hợp cho Founder Media, Creative Director, Marketing.',
  },
  AC: {
    title: 'Biên tập Chuyên sâu & Xuất bản',
    desc: 'Gu thẩm mỹ tinh tế phối hợp cùng sự chỉn chu văn bản — phù hợp thiết kế ấn phẩm, biên tập viên cao cấp.',
  },
  SI: {
    title: 'Tham vấn Tâm lý & Giáo dục Học',
    desc: 'Sự thấu cảm con người được củng cố bằng phương pháp nghiên cứu khoa học vững chắc.',
  },
  SA: {
    title: 'Công tác Xã hội & Trị liệu Nghệ thuật',
    desc: 'Dùng nghệ thuật và sự ấm áp để kết nối những tâm hồn dễ bị tổn thương trong cộng đồng.',
  },
  SE: {
    title: 'Lãnh đạo Đào tạo & Quan hệ Công chúng',
    desc: 'Truyền cảm hứng, kết nối con người và dẫn dắt tập thể hướng đến những mục tiêu xã hội cao cả.',
  },
  SC: {
    title: 'Quản trị Nhân sự & Dịch vụ Khách hàng',
    desc: 'Chu đáo với con người và chuẩn chỉ trong quy trình phúc lợi, chính sách nhân viên.',
  },
  EI: {
    title: 'Phân tích Đầu tư & Chiến lược Thị trường',
    desc: 'Bản lĩnh chớp thời cơ kinh doanh dựa trên các phân tích dữ liệu thị trường sắc sảo.',
  },
  ES: {
    title: 'Phát triển Doanh nghiệp & Quản trị Nhân tài',
    desc: 'Tài thuyết phục đi liền với sự thấu hiểu tâm lý nhân sự — phù hợp CEO, Giám đốc Nhân sự.',
  },
  EA: {
    title: 'Xây dựng Thương hiệu & Marketing Đột phá',
    desc: 'Dám nghĩ lớn, dám làm khác biệt và biết cách truyền thông bùng nổ đến công chúng.',
  },
  EC: {
    title: 'Quản trị Vận hành & Giám đốc Tài chính',
    desc: 'Khát vọng chinh phục mục tiêu doanh số được kiểm soát chặt chẽ bằng kỷ luật ngân sách.',
  },
  CI: {
    title: 'Kiểm toán Điều tra & Khoa học Dữ liệu',
    desc: 'Sự tỉ mỉ và nguyên tắc phối hợp cùng năng lực phân tích mô hình dữ liệu phức tạp.',
  },
  CE: {
    title: 'Quản trị Rủi ro & Pháp chế Doanh nghiệp',
    desc: 'Kỷ luật và hiểu biết pháp lý giúp doanh nghiệp phát triển bền vững mà không phạm luật.',
  },
  CS: {
    title: 'Quản trị Tiền lương (C&B) & Chăm sóc Khách hàng',
    desc: 'Đảm bảo sự chính xác tuyệt đối trong quyền lợi nhân viên và sự hài lòng của đối tác.',
  },
  CR: {
    title: 'Quản lý Chuỗi Cung ứng & Logistics Kỹ thuật',
    desc: 'Thiết lập quy trình chuẩn xác để quản lý hàng triệu chuyến xe và kiện hàng luân chuyển trơn tru.',
  },
}

export function QuestionBreakdownSection({ result }: QuestionBreakdownSectionProps) {
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<PersonalityCode | 'ALL'>('ALL')
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)

  const answers = result.answers || {}

  // 1. Extract Top Signature Drivers (Questions rated 5/5 or 4/5)
  const topRated = QUESTIONS.filter((q) => (answers[q.id] || 0) === 5)
  const displayDrivers = (topRated.length >= 3 ? topRated : QUESTIONS.filter((q) => (answers[q.id] || 0) >= 4)).slice(0, 4)

  // 2. Synergy Analysis between Top 1st and Top 2nd codes
  const topCode = result.topCodes[0] || 'R'
  const subCode = result.topCodes[1] || 'I'
  const comboKey = `${topCode}${subCode}`
  const synergy = SYNERGY_MAP[comboKey] || {
    title: `${HOLLAND_TYPES[topCode]?.name} kết hợp ${HOLLAND_TYPES[subCode]?.name}`,
    desc: `Sự kết hợp cân bằng giữa thế mạnh ${HOLLAND_TYPES[topCode]?.tagline} và ${HOLLAND_TYPES[subCode]?.tagline} giúp bạn phát triển năng lực liên ngành độc đáo.`,
  }

  // 3. Filtered questions for the full 60 questions review
  const filteredQuestions = selectedGroupFilter === 'ALL'
    ? QUESTIONS
    : QUESTIONS.filter((q) => q.code === selectedGroupFilter)

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <span className="eyebrow flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-gold-400" /> PHÂN TÍCH TÂM LÝ HỌC HÀNH VI
        </span>
        <h3 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Chân dung năng lực qua đối soát 60 câu hỏi
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Hệ thống giải mã các phản xạ tự nhiên của bạn dựa trên các câu hỏi có mức độ tương thích cao nhất.
        </p>
      </div>

      {/* Grid: Signature Drivers & Synergy Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Signature Drivers (Điểm chạm bản năng 5/5) */}
        <div className="lg:col-span-7 surface p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0a1128]/90 backdrop-blur-xl shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400 fill-current" /> Điểm chạm bản năng (Điểm 5 Tuyệt đối)
              </span>
              <span className="text-[0.72rem] font-mono font-bold text-slate-400">
                {displayDrivers.length} phản xạ nổi bật
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Những phát biểu bạn chấm điểm 5/5 ("Rất giống tôi") chính là những thói quen tư duy và phản xạ tự nhiên mạnh mẽ nhất của bạn:
            </p>

            <div className="space-y-3">
              {displayDrivers.map((q) => {
                const meta = HOLLAND_GROUP_METAS[q.code]
                return (
                  <div
                    key={q.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 flex items-start gap-3"
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-black text-white mt-0.5"
                      style={{ backgroundColor: meta.color }}
                    >
                      {q.code}{q.number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                        "{q.text}"
                      </p>
                      <span className="inline-block mt-1 text-[0.68rem] font-medium text-slate-400">
                        {meta.title} • {meta.name}
                      </span>
                    </div>
                    <span className="rounded-full px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold shrink-0">
                      5/5
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Cross-Group Synergy (Tư duy kết hợp Đa ngành) */}
        <div className="lg:col-span-5 surface p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0a1128]/90 backdrop-blur-xl shadow-soft flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cobalt-600 dark:text-electric-400 flex items-center gap-1.5 mb-2">
              <GitMerge className="h-3.5 w-3.5" /> Năng lực phối hợp Đa ngành ({comboKey})
            </span>

            <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {synergy.title}
            </h4>

            <div className="my-4 flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-xl text-xs font-bold"
                style={{ backgroundColor: `${HOLLAND_GROUP_METAS[topCode]?.color}20`, color: HOLLAND_GROUP_METAS[topCode]?.color }}
              >
                {HOLLAND_GROUP_METAS[topCode]?.name} ({topCode})
              </span>
              <span className="text-slate-400 font-bold">+</span>
              <span
                className="px-3 py-1 rounded-xl text-xs font-bold"
                style={{ backgroundColor: `${HOLLAND_GROUP_METAS[subCode]?.color}20`, color: HOLLAND_GROUP_METAS[subCode]?.color }}
              >
                {HOLLAND_GROUP_METAS[subCode]?.name} ({subCode})
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {synergy.desc}
            </p>
          </div>

          <div className="mt-6 rounded-2xl p-4 bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
            💡 <strong className="text-slate-800 dark:text-slate-200">Gợi ý phát triển:</strong> Trong thị trường việc làm hiện đại, những cá nhân sở hữu mã đôi ({comboKey}) có lợi thế lớn nhờ khả năng làm cầu nối giữa các phòng ban chuyên môn khác nhau.
          </div>
        </div>
      </div>

      {/* Collapsible Accordion: Review all 60 questions */}
      <div className="surface rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0a1128]/90 backdrop-blur-xl overflow-hidden shadow-lift">
        <button
          type="button"
          onClick={() => setIsOpenAccordion(!isOpenAccordion)}
          className="w-full p-6 sm:p-7 flex items-center justify-between text-left transition hover:bg-slate-50/50 dark:hover:bg-white/[0.02] cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cobalt-500/10 text-cobalt-600 dark:text-electric-400 font-mono font-black text-sm">
              60
            </span>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Bảng đối soát chi tiết toàn bộ 60 câu hỏi
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Xem lại điểm số tự đánh giá của bạn (thang 1–5) theo 6 nhóm tính cách RIASEC.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-cobalt-600 dark:text-electric-400">
            <span>{isOpenAccordion ? 'Thu gọn' : 'Xem chi tiết'}</span>
            {isOpenAccordion ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>

        <AnimatePresence>
          {isOpenAccordion && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-slate-100 dark:border-white/5 p-6 sm:p-8"
            >
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs font-semibold text-slate-400 mr-1">Lọc theo nhóm:</span>
                <button
                  type="button"
                  onClick={() => setSelectedGroupFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedGroupFilter === 'ALL'
                      ? 'bg-cobalt-600 text-white'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  Tất cả (60 câu)
                </button>
                {(['R', 'I', 'A', 'S', 'E', 'C'] as PersonalityCode[]).map((code) => {
                  const meta = HOLLAND_GROUP_METAS[code]
                  const isActive = selectedGroupFilter === code
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setSelectedGroupFilter(code)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.color }} />
                      <span>{code} • {meta.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {filteredQuestions.map((q) => {
                  const meta = HOLLAND_GROUP_METAS[q.code]
                  const score = answers[q.id] || 3
                  const opt = LIKERT_OPTIONS.find((o) => o.score === score)

                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-black text-white mt-0.5"
                          style={{ backgroundColor: meta.color }}
                        >
                          {q.code}{q.number}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                            {q.text}
                          </p>
                          <span className="text-[0.68rem] text-slate-400">
                            {meta.title} • {meta.name}
                          </span>
                        </div>
                      </div>

                      {/* Selected Rating */}
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <span
                          className={`rounded-xl px-3 py-1 text-xs font-bold ${
                            score >= 4
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : score === 3
                              ? 'bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {score}/5 – {opt?.text || 'Trung lập'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
