import { useState, useRef, useEffect, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  Eye,
  EyeOff,
  Home,
  Compass,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useApp } from '@/store/AppContext'

interface HostGateProps {
  title?: string
  subtitle?: string
}

export function HostGate({
  title = 'Thống kê lớp học',
  subtitle = 'Khu vực bảo mật dành riêng cho Giáo viên / Host phụ trách lớp.',
}: HostGateProps) {
  const { loginHost } = useApp()
  const [passcode, setPasscode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!passcode.trim()) {
      setError('Vui lòng nhập mật khẩu Host.')
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }

    const success = loginHost(passcode)
    if (!success) {
      setError('Mật khẩu bảo mật không chính xác. Vui lòng thử lại!')
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      inputRef.current?.select()
    }
  }

  return (
    <div className="relative min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6">
      {/* Background decorations */}
      <div className="bg-grid pointer-events-none absolute inset-0 -top-20 h-full opacity-60" aria-hidden />
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-cobalt-500/10 blur-[90px]" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="surface overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/15 bg-white/95 dark:bg-[#0a1128]/95 p-7 sm:p-10 shadow-2xl backdrop-blur-xl">
          {/* Header icon badge */}
          <div className="flex flex-col items-center text-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-cobalt-600 via-cobalt-500 to-electric-400 p-[1px] shadow-glow">
              <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-slate-900 text-white">
                <Lock className="h-7 w-7 text-electric-400 animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white shadow-sm ring-2 ring-white dark:ring-navy-900">
                <KeyRound className="h-3 w-3" />
              </span>
            </div>

            <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-cobalt-500/10 px-3 py-1 text-[0.72rem] font-bold tracking-wider uppercase text-cobalt-600 dark:text-cobalt-400">
              <Sparkles className="h-3 w-3 text-gold-400" />
              Khu vực bảo mật • Quyền Host
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              {subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <motion.div
              animate={isShaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="space-y-2"
            >
              <label
                htmlFor="host-passcode"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Mật khẩu Host (Mã bảo mật)
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>

                <input
                  id="host-passcode"
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value)
                    if (error) setError(null)
                  }}
                  placeholder="Nhập mã bảo mật Host..."
                  autoComplete="current-password"
                  maxLength={20}
                  className={`w-full rounded-2xl border bg-slate-50/80 dark:bg-black/25 py-3.5 pl-11 pr-12 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition focus:bg-white dark:focus:bg-black/40 ${
                    error
                      ? 'border-red-500 ring-2 ring-red-500/20'
                      : 'border-slate-200 dark:border-white/15 focus:border-cobalt-500 focus:ring-2 focus:ring-cobalt-500/20'
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 pt-1"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <Button
              type="submit"
              variant="cobalt"
              size="lg"
              className="w-full shadow-glow-cobalt gap-2 text-sm font-bold mt-2"
            >
              <Unlock className="h-4 w-4" />
              Mở khóa xem & quản lý lớp
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Privacy Note */}
          <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 p-4 text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
              Quyền riêng tư & An toàn thông tin
            </p>
            <p className="leading-relaxed">
              Trang web đang ở chế độ công khai để học sinh toàn trường có thể làm bài test. Chỉ Host có mã khóa mới có quyền xem danh sách cả lớp và thực hiện quyền xóa học sinh.
            </p>
          </div>

          {/* Alternative navigation for students */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              Về Trang chủ
            </Link>

            <Link
              to="/quiz"
              className="inline-flex items-center gap-1.5 text-cobalt-600 dark:text-electric-400 font-semibold hover:underline"
            >
              <Compass className="h-3.5 w-3.5" />
              Làm bài test hướng nghiệp
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
