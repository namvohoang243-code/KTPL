import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles, User, School, Play, CheckCircle2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CinematicAnalyzing } from '@/components/quiz/CinematicAnalyzing'
import { ProgressBar } from '@/components/quiz/ProgressBar'
import { QuizCard } from '@/components/quiz/QuizCard'
import { QuizNodes } from '@/components/quiz/QuizNodes'
import { Button } from '@/components/ui/button'
import { HOLLAND_TYPES } from '@/data/hollandData'
import { QUESTIONS } from '@/data/questions'
import { buildResult, rankCodes, scoreAnswers, scoreRawAnswers } from '@/engine/scoring'
import { useApp } from '@/store/AppContext'

const ANALYZE_MS = 2200

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -40 }),
}

export function QuizPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isRetake = searchParams.get('retake') === 'true'

  const {
    setResult,
    studentName,
    setStudentName,
    studentClass,
    setStudentClass,
    submitResultToGoogleForm,
  } = useApp()

  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    if (isRetake) return false
    return Boolean(studentName?.trim())
  })
  const [tempName, setTempName] = useState(studentName || '')
  const [tempClass, setTempClass] = useState(studentClass || '10A1')
  const [nameError, setNameError] = useState('')

  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [analyzing, setAnalyzing] = useState(false)
  const timer = useRef<number>(undefined)
  const autoAdvanceTimer = useRef<number>(undefined)
  const isCompleting = useRef(false)

  // Reset all states if URL specifies retake=true and clean URL
  useEffect(() => {
    if (isRetake) {
      setAnswers({})
      setIndex(0)
      setAnalyzing(false)
      isCompleting.current = false
      setHasStarted(Boolean(studentName?.trim()))
      navigate('/quiz', { replace: true })
    }
  }, [isRetake, navigate, studentName])

  const total = QUESTIONS.length
  const question = QUESTIONS[index]
  const isLast = index === total - 1
  const selected = question ? answers[question.id] : undefined
  const answered = Object.keys(answers).length

  useEffect(() => {
    return () => {
      window.clearTimeout(timer.current)
      window.clearTimeout(autoAdvanceTimer.current)
    }
  }, [])

  const handleStart = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = tempName.trim()
    if (!trimmed) {
      setNameError('Vui lòng nhập tên hoặc biệt danh của bạn')
      return
    }
    setNameError('')
    setStudentName(trimmed)
    setStudentClass(tempClass.trim() || '10A1')
    setHasStarted(true)
  }

  const completeQuiz = useCallback(
    (finalAnswers: Record<string, number>) => {
      if (isCompleting.current) return
      isCompleting.current = true
      if (autoAdvanceTimer.current) {
        window.clearTimeout(autoAdvanceTimer.current)
      }

      setAnalyzing(true)
      const rawScores = scoreRawAnswers(QUESTIONS, finalAnswers)
      const normalizedScores = scoreAnswers(QUESTIONS, finalAnswers)
      const ranked = rankCodes(normalizedScores)
      const topDominant = (ranked[0] || 'I') as keyof typeof HOLLAND_TYPES
      const topCareer = HOLLAND_TYPES[topDominant]?.careers?.[0]?.name || 'Chuyên gia đa ngành'

      const quizResult = buildResult(normalizedScores, rawScores, {
        name: tempName.trim() || studentName || 'Ẩn danh',
        className: tempClass.trim() || studentClass || '10A1',
        primaryCareer: topCareer,
        answers: finalAnswers,
      })

      // Submit in background to Google Form (catch errors so they never block redirect)
      submitResultToGoogleForm(quizResult).catch((err) => {
        console.error('Submit error:', err)
      })

      timer.current = window.setTimeout(() => {
        setResult(quizResult)
        navigate('/result')
      }, ANALYZE_MS)
    },
    [tempName, tempClass, studentName, studentClass, submitResultToGoogleForm, setResult, navigate],
  )

  const select = useCallback(
    (score: number) => {
      if (!question || isCompleting.current) return
      const nextAnswers = { ...answers, [question.id]: score }
      setAnswers(nextAnswers)

      // Clear any pending advance timer to avoid race conditions
      if (autoAdvanceTimer.current) {
        window.clearTimeout(autoAdvanceTimer.current)
      }

      autoAdvanceTimer.current = window.setTimeout(() => {
        if (!isLast) {
          setDirection(1)
          setIndex((i) => i + 1)
        } else {
          completeQuiz(nextAnswers)
        }
      }, 200)
    },
    [question, answers, isLast, completeQuiz],
  )

  const prev = useCallback(() => {
    if (index === 0 || isCompleting.current) return
    setDirection(-1)
    setIndex((i) => i - 1)
  }, [index])

  const next = useCallback(() => {
    if (selected === undefined || isCompleting.current) return
    if (!isLast) {
      setDirection(1)
      setIndex((i) => i + 1)
      return
    }
    completeQuiz(answers)
  }, [selected, isLast, answers, completeQuiz])

  const jumpTo = useCallback(
    (targetIdx: number) => {
      setDirection(targetIdx > index ? 1 : -1)
      setIndex(targetIdx)
    },
    [index],
  )

  // Keyboard navigation: 1-5 to rate, Left/Right arrows to move
  useEffect(() => {
    if (analyzing || !hasStarted) return
    const onKey = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return
      }
      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= 5) {
        select(num)
      } else if (e.key === 'ArrowLeft') {
        prev()
      } else if (e.key === 'ArrowRight') {
        next()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [analyzing, hasStarted, select, prev, next])

  if (analyzing) return <CinematicAnalyzing />

  // 1. Initial Step: Student Information
  if (!hasStarted) {
    return (
      <div className="relative min-h-[75vh] flex items-center justify-center py-8 sm:py-12 px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="surface w-full max-w-lg p-5 sm:p-10 border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0a1128]/90 backdrop-blur-2xl shadow-lift rounded-2xl sm:rounded-3xl"
        >
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-cobalt-600 dark:text-electric-400 uppercase">
            <Sparkles className="h-4 w-4 text-gold-400" />
            Khảo sát hướng nghiệp RIASEC (60 câu)
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Bắt đầu bài trắc nghiệm
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Bộ 60 câu hỏi chia đều cho 6 chiều tính cách RIASEC, đánh giá trên thang điểm 1 (Hoàn toàn không giống tôi) đến 5 (Rất giống tôi).
          </p>

          <form onSubmit={handleStart} className="mt-6 space-y-4">
            <div>
              <label htmlFor="student-name" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-cobalt-500" /> Tên hoặc biệt danh của bạn <span className="text-red-500">*</span>
              </label>
              <input
                id="student-name"
                type="text"
                maxLength={30}
                required
                value={tempName}
                onChange={(e) => {
                  setTempName(e.target.value)
                  if (nameError) setNameError('')
                }}
                placeholder="Ví dụ: Minh Anh"
                autoComplete="off"
                className="w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-black/30 px-4 py-3 text-base text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition focus:border-cobalt-500 focus:ring-2 focus:ring-cobalt-500/20"
              />
              {nameError && <p className="mt-1 text-xs text-red-500 font-medium">{nameError}</p>}
            </div>

            <div>
              <label htmlFor="student-class" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <School className="h-3.5 w-3.5 text-teal-500" /> Lớp học <span className="text-red-500">*</span>
              </label>
              <input
                id="student-class"
                type="text"
                maxLength={12}
                required
                value={tempClass}
                onChange={(e) => setTempClass(e.target.value)}
                placeholder="Ví dụ: 10A1"
                autoComplete="off"
                className="w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-black/30 px-4 py-3 text-base text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition focus:border-cobalt-500 focus:ring-2 focus:ring-cobalt-500/20"
              />
            </div>

            <div className="pt-2 sm:pt-3">
              <Button type="submit" size="lg" className="w-full shadow-glow-cobalt gap-2 text-base font-bold py-4 sm:py-5 min-h-[48px] justify-center">
                <Play className="h-4 w-4 fill-current" />
                Bắt đầu làm bài test
              </Button>
            </div>

            <p className="text-center text-[0.75rem] text-slate-400 dark:text-slate-500 pt-1">
              Dữ liệu sẽ được gửi trực tiếp đến hệ thống Google Sheet của lớp học.
            </p>
          </form>
        </motion.div>
      </div>
    )
  }

  if (!question) return null

  return (
    <div className="relative pb-32 md:pb-20">
      <div className="container-page relative max-w-3xl pt-4 sm:pt-10">
        <h1 className="sr-only">Bài trắc nghiệm RIASEC định hướng nghề nghiệp 60 câu</h1>

        {/* Student identification badge */}
        <div className="mb-3 sm:mb-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 sm:px-2">
          <span className="flex items-center gap-1.5 font-medium truncate pr-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 shrink-0" />
            <span className="truncate">
              Học sinh: <strong className="text-slate-800 dark:text-slate-200">{studentName}</strong> • Lớp <strong className="text-slate-800 dark:text-slate-200">{studentClass}</strong>
            </span>
          </span>
          <button
            type="button"
            onClick={() => setHasStarted(false)}
            className="text-cobalt-500 hover:underline cursor-pointer shrink-0 font-medium"
          >
            Đổi tên
          </button>
        </div>

        {/* Top Header: Progress bar + Stage node indicators */}
        <div className="surface p-4 sm:p-6 mb-6 sm:mb-8 border border-slate-200 dark:border-white/10 bg-white/75 dark:bg-[#0a1128]/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl">
          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <ProgressBar
                current={index + 1}
                total={total}
                answered={answered}
                currentCode={question.code}
              />
            </div>
            <div className="sm:border-l sm:border-slate-200 dark:sm:border-white/10 sm:pl-6 pt-1 sm:pt-0">
              <p className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 sm:text-right">
                10 câu nhóm {question.code}
              </p>
              <QuizNodes
                total={total}
                currentIndex={index}
                answers={answers}
                questions={QUESTIONS}
                onJumpTo={jumpTo}
              />
            </div>
          </div>
        </div>

        {/* Question Card with Smooth Slide */}
        <div className="mt-2 sm:mt-4">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={question.id}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <QuizCard
                question={question}
                index={index}
                totalQuestions={total}
                selected={selected}
                onSelect={select}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Action Bar */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#060b18]/95 px-3.5 sm:px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-2xl md:static md:mt-8 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.1)]">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-2.5 sm:gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={prev}
              disabled={index === 0}
              id="quiz-prev"
              className="flex-1 md:flex-none border-slate-300 dark:border-white/10 min-h-[46px] sm:min-h-[48px] justify-center"
            >
              <ArrowLeft className="h-4 w-4" />
              Câu trước
            </Button>

            <p className="hidden text-xs text-slate-400 lg:block font-medium">
              Phím 1–5 để chọn • Tự động chuyển câu
            </p>

            <Button
              variant={isLast ? 'cobalt' : 'primary'}
              size="lg"
              onClick={next}
              disabled={selected === undefined}
              id="quiz-next"
              className="flex-[1.3] md:flex-none shadow-glow-cobalt gap-2 min-h-[46px] sm:min-h-[48px] justify-center"
            >
              {isLast ? (
                <>
                  <Sparkles className="h-4 w-4 text-gold-400" />
                  Xem kết quả
                </>
              ) : (
                <>
                  Câu tiếp
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
