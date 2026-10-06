import { motion } from 'framer-motion'
import { Bot, Loader2, Send, Sparkles, User } from 'lucide-react'
import { useState } from 'react'
import { PERSONALITY_MAP } from '@/data/personalities'
import type { DeepPersonalityAnalysis } from '@/engine/aiAnalysis'
import type { QuizResult } from '@/types'

interface Message {
  role: 'assistant' | 'user'
  text: string
  timestamp: string
}

interface AICareerAdvisorProps {
  result: QuizResult
  analysis: DeepPersonalityAnalysis
}

const QUICK_PROMPTS = [
  'Em nên chọn tổ hợp môn thi đại học nào?',
  'Điểm mù lớn nhất em cần khắc phục là gì?',
  'AI có nguy cơ thay thế ngành của em trong 10 năm tới không?',
  'Em phù hợp với môi trường công ty startup hay tập đoàn lớn?',
]

export function AICareerAdvisor({ result, analysis }: AICareerAdvisorProps) {
  const top1 = result.topCodes[0]!
  const p1 = PERSONALITY_MAP[top1]

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Xin chào bạn! Mình là AI Career Advisor. Phân tích từ 20 câu trả lời cho thấy bạn mang nhóm tính cách chủ đạo **${p1.name} (${p1.title})** với tư duy **${analysis.archetype}**.\n\nĐây là bước ngoặt quan trọng định hình con đường tương lai. Bạn có băn khoăn gì về ngành học, trường đại học tại Việt Nam, kỹ năng cần chuẩn bị hay cách đón đầu làn sóng AI không? Hãy đặt câu hỏi cho mình nhé!`,
      timestamp: 'Vừa xong',
    },
  ])

  const generateAnswer = (question: string): string => {
    const q = question.toLowerCase()

    if (q.includes('tổ hợp') || q.includes('khối') || q.includes('môn thi') || q.includes('xét tuyển')) {
      const majors = analysis.collegeMajors.slice(0, 2)
      return `Dựa trên điểm phân tích ${result.topType}, các ngành đào tạo đại học tương thích cao nhất với bạn gồm:
1. **${majors[0]?.name || 'Khoa học Máy tính & Kỹ thuật'}** (Xét tuyển qua tổ hợp: ${majors[0]?.examSubjects.join(', ')}).
2. **${majors[1]?.name || 'Công nghệ Dữ liệu & AI'}** (Xét tuyển qua tổ hợp: ${majors[1]?.examSubjects.join(', ')}).

💡 **Lời khuyên chiến lược**: Bạn nên dồn lực cho môn **Toán** làm môn hạt nhân (bởi Toán xuất hiện trong 95% các tổ hợp ngành công nghệ cao), kết hợp với **Tiếng Anh (IELTS)** để mở rộng cơ hội xét tuyển sớm vào các trường như ${majors[0]?.topUniversities.join(', ')}.`
    }

    if (q.includes('điểm mù') || q.includes('điểm yếu') || q.includes('khắc phục') || q.includes('hạn chế')) {
      const bs = analysis.blindSpots[0] ?? {
        pitfall: 'Có xu hướng phân tích quá mức trước khi hành động (Analysis Paralysis).',
        remedy: 'Áp dụng thử nghiệm nhỏ (MVP) trước khi cố gắng hoàn hảo 100%.',
      }
      return `⚠️ **Điểm mù lớn nhất cần lưu ý**: ${bs.pitfall}

🛠️ **Cách khắc phục thực chiến**: ${bs.remedy}


Ngoài ra, học sinh nhóm **${p1.name}** thường quá chú trọng vào tính đúng đắn logic mà đôi khi bỏ quên yếu tố *truyền thông và cảm xúc* của người nghe. Khi thuyết trình hoặc làm việc nhóm, hãy tập trả lời câu hỏi: *"Người nghe sẽ nhận được lợi ích gì từ giải pháp này?"* trước khi đi vào giải thích kỹ thuật.`
    }

    if (q.includes('ai') || q.includes('thay thế') || q.includes('robot') || q.includes('tự động hóa') || q.includes('tương lai')) {
      return `💼 **Về xu hướng phát triển dài hạn**:
Với thiên hướng thuộc nhóm **${p1.name}**, giá trị cốt lõi của bạn nằm ở tư duy phân tích độc lập và khả năng giải quyết vấn đề có chiều sâu.

🚀 **Lời khuyên hành động thực tế**:
• Tập trung làm chủ kiến thức nền tảng vững chắc ở ngành học đại học bạn theo đuổi.
• Trau dồi ngoại ngữ (IELTS/TOEIC) và kỹ năng làm việc nhóm để sẵn sàng hội nhập môi trường đa văn hóa.
• Chủ động thực hiện các đề tài nghiên cứu hoặc dự án nhỏ từ sớm để xây dựng hồ sơ năng lực (Portfolio) vượt trội.`
    }

    if (q.includes('môi trường') || q.includes('startup') || q.includes('tập đoàn') || q.includes('công ty')) {
      return `🏢 **Về môi trường làm việc phù hợp**:
- ${analysis.workplaceFit.idealCulture}
- **Startup công nghệ**: Rất phù hợp nếu bạn muốn thăng tiến nhanh, thích thử nghiệm cái mới và ghét thủ tục rườm rà.
- **Tập đoàn đa quốc gia / Viện R&D**: Phù hợp nếu bạn muốn môi trường có dữ liệu lớn, quy trình chuẩn mực và ngân sách dồi dào cho các nghiên cứu chuyên sâu.

Nhịp độ tối ưu cho bạn là: *${analysis.workplaceFit.preferredPace}*.`
    }

    // Default intelligent contextual answer
    return `Cảm ơn bạn đã hỏi. Với hồ sơ **${result.topType}**, thế mạnh nổi bật nhất của bạn là:
• ${analysis.competitiveEdge[0]}
• ${analysis.competitiveEdge[1]}

Trong giai đoạn này, bạn nên bám sát lộ trình:
📌 **${analysis.roadmap[0]?.title}**: ${analysis.roadmap[0]?.actionItems[0]}

Bạn có muốn mình giải thích chi tiết hơn về các cơ hội nghề nghiệp cụ thể trong nhóm ngành ${analysis.collegeMajors[0]?.name || 'này'} không?`
  }

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input
    if (!query.trim() || loading) return

    const userMsg: Message = {
      role: 'user',
      text: query,
      timestamp: 'Vừa xong',
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const reply = generateAnswer(query)
      const botMsg: Message = {
        role: 'assistant',
        text: reply,
        timestamp: 'Vừa xong',
      }
      setMessages((prev) => [...prev, botMsg])
      setLoading(false)
    }, 700)
  }

  return (
    <div className="surface overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a1128] shadow-lift">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 bg-gradient-to-r from-slate-950 via-[#0a1128] to-cobalt-950 p-6 text-white sm:px-8">
        <div className="flex items-center gap-3.5">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-cobalt-500 to-teal-400 text-white shadow-glow">
            <Bot className="h-6 w-6" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold tracking-tight text-white">AI Career Advisor</h3>
              <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-teal-300">
                Live Deep Analysis
              </span>
            </div>
            <p className="text-xs text-slate-300">Tư vấn chuyên sâu dựa trên hồ sơ {result.topType} &amp; dữ liệu tuyển sinh Việt Nam</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-h-[460px] min-h-[300px] space-y-4 overflow-y-auto p-6 sm:p-8 bg-slate-50/50 dark:bg-[#060b18]/40">
        {messages.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                m.role === 'user' ? 'bg-cobalt-600 text-white shadow-soft' : 'bg-cobalt-100 dark:bg-white/10 text-cobalt-600 dark:text-electric-400'
              }`}
            >
              {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </span>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-cobalt-600 to-electric-500 text-white shadow-soft'
                  : 'border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a1128] text-slate-800 dark:text-slate-100 shadow-soft'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin text-cobalt-500" />
            <span>AI đang phân tích đối chiếu hồ sơ và dữ liệu tuyển sinh...</span>
          </motion.div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="border-t border-slate-200/80 dark:border-white/10 bg-slate-100/60 dark:bg-[#060b18]/60 p-4 sm:px-8">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <Sparkles className="h-3.5 w-3.5 text-gold-500" /> Gợi ý câu hỏi nhanh:
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 transition hover:border-cobalt-400 hover:bg-cobalt-50 dark:hover:bg-white/10 hover:text-cobalt-700 dark:hover:text-white"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="flex items-center gap-2 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a1128] p-4 sm:px-8"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi AI về ngành học, trường đại học, tổ hợp môn, cơ hội việc làm..."
            className="h-12 w-full rounded-full border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#060b18] pl-5 pr-12 text-sm text-slate-900 dark:text-white outline-none transition focus:border-cobalt-500"
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-cobalt-600 to-electric-500 text-white shadow-soft transition hover:from-cobalt-500 hover:to-electric-400 disabled:opacity-40"
          aria-label="Gửi câu hỏi"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
