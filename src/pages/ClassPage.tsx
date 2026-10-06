import { motion } from 'framer-motion'
import { FileSpreadsheet, EyeOff, Upload, Sparkles, Lock, Users } from 'lucide-react'
import { useState } from 'react'
import { HostGate } from '@/components/auth/HostGate'
import { ClassPresentationBoard } from '@/components/class/ClassPresentationBoard'
import { ClassStudentTable } from '@/components/class/ClassStudentTable'
import { GoogleSheetSyncBar } from '@/components/class/GoogleSheetSyncBar'
import { DemoBadge, Disclaimer } from '@/components/shared/Disclaimer'
import { Reveal } from '@/components/shared/Reveal'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { useApp } from '@/store/AppContext'

export function ClassPage() {
  const {
    stats,
    isDemo,
    googleSheetUrl,
    resetToDemo,
    isHostAuthenticated,
    logoutHost,
    classSize,
  } = useApp()

  const [showRoster, setShowRoster] = useState(true)

  if (!isHostAuthenticated) {
    return (
      <HostGate
        title="Thống kê lớp học"
        subtitle="Website đang ở chế độ công khai. Nhập mật khẩu Host để mở khóa số liệu phân tích và quản lý danh sách học sinh."
      />
    )
  }

  return (
    <div className="relative overflow-hidden pb-12">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[32rem]" aria-hidden />
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-cobalt-500/10 blur-[100px]" aria-hidden />

      <section className="container-page relative pt-10 sm:pt-16" aria-labelledby="class-title">
        {/* Top Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Badge variant="cobalt" className="tracking-[0.14em] text-[0.68rem] sm:text-xs">
                <Sparkles className="h-3 w-3 mr-1 text-gold-400" />
                BẢNG LỚP HỌC
              </Badge>
              <Badge variant="default" className="text-teal-600 dark:text-teal-400 border-teal-500/20 bg-teal-500/10 font-bold text-[0.68rem] sm:text-xs">
                🔓 Host
              </Badge>
              {googleSheetUrl ? (
                <Badge variant="default" className="text-teal-600 dark:text-teal-400 border-teal-500/20 bg-teal-500/10 text-[0.68rem] sm:text-xs">
                  <FileSpreadsheet className="h-3 w-3 mr-1" /> Sheet Sync
                </Badge>
              ) : isDemo ? (
                <DemoBadge />
              ) : null}
              <Badge variant="default" className="text-[0.68rem] sm:text-xs">
                <EyeOff className="h-3 w-3 mr-1" /> Ẩn danh
              </Badge>
            </div>

            {/* Quick Action: Logout / Lock */}
            <button
              type="button"
              onClick={logoutHost}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-slate-500 hover:text-red-500 hover:bg-red-500/10 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
              title="Khóa lại phần thống kê khi rời máy"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Khóa lại</span>
            </button>
          </div>

          <div className="mt-4 sm:mt-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 id="class-title" className="text-2xl font-extrabold leading-tight tracking-[-0.03em] sm:text-4xl md:text-5xl text-slate-900 dark:text-white">
                Bức tranh năng lực & <span className="bg-gradient-to-r from-cobalt-500 to-teal-400 bg-clip-text text-transparent">định hướng cả lớp</span>
              </h1>
              <p className="mt-2 sm:mt-3 max-w-2xl text-sm sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Bản phân tích cô đọng 3 mục trọng tâm được chuẩn hóa cho màn hình máy chiếu, cập nhật trực tiếp theo dữ liệu nộp bài của học sinh.
              </p>
            </div>

            {/* Presentation quick toggle */}
            {stats.participants > 0 && (
              <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setShowRoster(!showRoster)}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl sm:rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                    showRoster
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm'
                      : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:bg-slate-50'
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  {showRoster ? 'Danh sách học sinh (Host)' : 'Mở danh sách học sinh'}
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Live Google Sheet Sync & Participation Bar */}
        <div className="mt-8">
          <GoogleSheetSyncBar />
        </div>

        {stats.participants === 0 ? (
          <div className="surface mt-10 flex flex-col items-center p-12 text-center rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0a1128]/90 backdrop-blur-xl shadow-lift">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cobalt-500/10 text-cobalt-500">
              <Upload className="h-7 w-7" />
            </span>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Chưa có kết quả học sinh nào</h2>
            <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              Chưa có bạn nào làm bài test hoặc chưa kết nối Google Sheet. Hãy làm bài test hoặc dán link Google Sheet để xem thống kê.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ButtonLink to="/quiz" size="lg" variant="primary">
                Tự làm bài test
              </ButtonLink>
              <Button
                variant="outline"
                size="lg"
                onClick={() => resetToDemo()}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4 text-gold-400" />
                Nạp 30 bạn mẫu để xem thử
              </Button>
              <ButtonLink to="/admin" variant="ghost" size="lg">
                Đến trang quản trị
              </ButtonLink>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {/* 3 CORE PRESENTATION SECTIONS */}
            <ClassPresentationBoard stats={stats} classSize={classSize} />

            {/* ROSTER TABLE WITH HOST DELETION PERMISSIONS */}
            {showRoster && (
              <Reveal className="pt-2">
                <ClassStudentTable />
              </Reveal>
            )}
          </div>
        )}

        <Disclaimer className="mt-12 max-w-3xl" />
      </section>
    </div>
  )
}
