import { motion } from 'framer-motion'
import { Check, Compass, GraduationCap, Laptop, Sparkles, Trophy } from 'lucide-react'

const JOURNEY_STEPS = [
  {
    step: '01',
    phase: 'THPT Lớp 10–12',
    title: 'Khám phá thiên hướng tự nhiên',
    desc: 'Làm bài đánh giá RIASEC, nhận diện 3 mã tính cách chủ đạo, chọn tổ hợp khối thi xét tuyển tối ưu điểm số (A00, A01, D01...).',
    icon: Sparkles,
    color: '#38bdf8',
  },
  {
    step: '02',
    phase: 'Bổ trợ kỹ năng',
    title: 'Xây dựng năng lực cốt lõi',
    desc: 'Củng cố ngoại ngữ (IELTS/TOEIC), phát triển tư duy phản biện, kỹ năng làm việc nhóm và năng lực tự học qua các khóa học trực tuyến.',
    icon: Compass,
    color: '#818cf8',
  },
  {
    step: '03',
    phase: 'Dự án thực tế',
    title: 'Trải nghiệm qua dự án nhỏ',
    desc: 'Tham gia CLB học thuật, cuộc thi sáng tạo khoa học kỹ thuật hoặc làm các mini-project cá nhân để kiểm chứng niềm đam mê thực tế.',
    icon: Laptop,
    color: '#2dd4bf',
  },
  {
    step: '04',
    phase: 'Đại học & Cao đẳng',
    title: 'Đào tạo chuyên sâu & Cố vấn',
    desc: 'Học tập đúng ngành yêu thích tại trường Đại học phù hợp, tìm kiếm Mentor đi trước, tham gia thực tập sớm từ năm thứ 2–3.',
    icon: GraduationCap,
    color: '#fbbf24',
  },
  {
    step: '05',
    phase: 'Sự nghiệp vững chắc',
    title: 'Gia nhập thị trường lao động',
    desc: 'Tự tin ứng tuyển vị trí chuyên viên, kiến tạo giá trị thực tế cho xã hội và phát triển sự nghiệp bền vững lâu dài.',
    icon: Trophy,
    color: '#f472b6',
  },
]

export function CareerJourney() {
  return (
    <div className="surface p-6 sm:p-10 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl">
      <div className="flex flex-col gap-2 border-b border-slate-200 dark:border-white/10 pb-6">
        <span className="eyebrow">Action Pathway</span>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Your Possible Journey — Lộ trình từ lớp học đến sự nghiệp
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Từng bước đi rõ ràng, định vị tương lai một cách chủ động và tự tin.
        </p>
      </div>

      <div className="relative mt-10">
        {/* Connecting central line for desktop */}
        <div className="hidden lg:block absolute top-[36px] left-[5%] right-[5%] h-[2px] bg-slate-200 dark:bg-white/10" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {JOURNEY_STEPS.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] p-6 shadow-soft"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-soft"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}, #060b18)`,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="font-mono text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500">
                      BƯỚC {item.step}
                    </span>
                  </div>

                  <span
                    className="mt-5 inline-block text-[0.68rem] font-bold uppercase tracking-wider"
                    style={{ color: item.color }}
                  >
                    {item.phase}
                  </span>
                  <h4 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 border-t border-slate-200 dark:border-white/10 pt-3 text-[0.7rem] font-semibold text-teal-600 dark:text-teal-400">
                  <Check className="h-3.5 w-3.5" />
                  <span>Mục tiêu khả thi</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
