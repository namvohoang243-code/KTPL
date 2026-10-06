import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileSpreadsheet,
  RefreshCw,
  Settings,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Users,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ClipboardPaste,
  Link2,
  Info,
  Upload,
  Download,
  PlusCircle,
  FileCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { exportClassToExcel, parseExcelOrCsvFile } from '@/services/excelService'
import { parseGoogleSheetCsv } from '@/services/googleService'
import { useApp } from '@/store/AppContext'
import type { PersonalityCode, ScoreMap, Student } from '@/types'

export function GoogleSheetSyncBar() {
  const {
    students,
    isSyncing,
    lastSyncedAt,
    syncError,
    syncFromGoogleSheet,
    googleSheetUrl,
    setGoogleSheetUrl,
    classSize,
    setClassSize,
    importStudents,
  } = useApp()

  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'excel' | 'paste' | 'manual' | 'url'>('excel')
  const [inputUrl, setInputUrl] = useState(
    googleSheetUrl || 'https://docs.google.com/spreadsheets/d/1Yw0TwDjlsKrFmAoglOyPOT5iFls_b4JjaQSKcPb45xs/edit?gid=1773219797'
  )
  const [inputSize, setInputSize] = useState(String(classSize || 30))
  const [pasteContent, setPasteContent] = useState('')
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null)
  const [isFileLoading, setIsFileLoading] = useState(false)

  // Manual student add state
  const [manualName, setManualName] = useState('')
  const [manualClass, setManualClass] = useState('10A1')
  const [manualGroup, setManualGroup] = useState<PersonalityCode>('R')
  const [manualCareer, setManualCareer] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const isConnected = Boolean(googleSheetUrl?.trim())
  const completedCount = students.length
  const pct = Math.min(100, Math.round((completedCount / (classSize || 30)) * 100))

  const handleSaveAndSync = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaveFeedback(null)
    const cleaned = inputUrl.trim()
    setGoogleSheetUrl(cleaned)
    const numSize = parseInt(inputSize, 10) || 30
    setClassSize(numSize)

    if (cleaned) {
      const ok = await syncFromGoogleSheet(cleaned)
      if (ok) {
        setSaveFeedback('Đã kết nối và đồng bộ dữ liệu từ Google Sheet thành công!')
        setTimeout(() => setIsOpen(false), 1400)
      }
    } else {
      setSaveFeedback('Đã lưu cấu hình!')
    }
  }

  // 1. Handle Excel / CSV File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsFileLoading(true)
    setSaveFeedback(null)
    try {
      const parsed = await parseExcelOrCsvFile(file)
      if (parsed.length === 0) {
        setSaveFeedback('Không đọc được dữ liệu học sinh từ file này. Hãy đảm bảo file có các cột Tên, Lớp, Điểm R, I, A, S, E, C.')
        setIsFileLoading(false)
        return
      }
      await importStudents(parsed, 'replace')
      setSaveFeedback(`🎉 Nạp thành công ${parsed.length} học sinh từ file "${file.name}"!`)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setTimeout(() => setIsOpen(false), 1600)
    } catch (err) {
      setSaveFeedback('Lỗi khi đọc file Excel/CSV: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setIsFileLoading(false)
    }
  }

  // 2. Handle Paste from Google Sheet
  const handlePasteImport = async () => {
    if (!pasteContent.trim()) return
    setSaveFeedback(null)
    try {
      const parsed = parseGoogleSheetCsv(pasteContent)
      if (parsed.length === 0) {
        setSaveFeedback('Không nhận diện được dòng dữ liệu hợp lệ. Vui lòng copy cả dòng tiêu đề và các hàng học sinh.')
        return
      }
      await importStudents(parsed, 'replace')
      setSaveFeedback(`🎉 Đã đồng bộ thành công ${parsed.length} học sinh từ bảng dữ liệu dán vào!`)
      setPasteContent('')
      setTimeout(() => setIsOpen(false), 1400)
    } catch {
      setSaveFeedback('Lỗi định dạng khi phân tích dữ liệu dán vào.')
    }
  }

  // 3. Handle Add Student Manually
  const handleAddManualStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = manualName.trim()
    if (!trimmed) return

    const mockRaw: ScoreMap = {
      R: manualGroup === 'R' ? 45 : 20,
      I: manualGroup === 'I' ? 45 : 20,
      A: manualGroup === 'A' ? 45 : 20,
      S: manualGroup === 'S' ? 45 : 20,
      E: manualGroup === 'E' ? 45 : 20,
      C: manualGroup === 'C' ? 45 : 20,
    }

    const newStudent: Student = {
      id: `manual_${Date.now()}`,
      name: trimmed,
      nickname: trimmed,
      className: manualClass.trim() || '10A1',
      personality: {
        R: manualGroup === 'R' ? 90 : 30,
        I: manualGroup === 'I' ? 90 : 30,
        A: manualGroup === 'A' ? 90 : 30,
        S: manualGroup === 'S' ? 90 : 30,
        E: manualGroup === 'E' ? 90 : 30,
        C: manualGroup === 'C' ? 90 : 30,
      },
      rawScores: mockRaw,
      topType: `${manualGroup}IE`,
      careers: ['technology'],
      primaryCareerName: manualCareer.trim() || 'Chuyên viên đa ngành',
      demo: false,
      submittedAt: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN'),
    }

    await importStudents([newStudent, ...students], 'replace')
    setSaveFeedback(`Đã thêm thành công bạn ${trimmed} vào danh sách lớp!`)
    setManualName('')
    setManualCareer('')
    setTimeout(() => setIsOpen(false), 1400)
  }

  // 4. Handle Export to Excel
  const handleExportExcel = () => {
    exportClassToExcel(students, students[0]?.className || '10A1')
  }

  return (
    <div className="surface mb-8 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0a1128]/90 backdrop-blur-xl shadow-lift">
      {/* Top Banner Row */}
      <div className="p-4 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md">
            <FileSpreadsheet className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold-400" />
                TRUNG TÂM QUẢN LÝ DỮ LIỆU
              </span>

              {lastSyncedAt && (
                <span className="text-[0.7rem] sm:text-[0.72rem] text-slate-400 dark:text-slate-500">
                  • Cập nhật {lastSyncedAt}
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              Thống kê kết quả định hướng nghề nghiệp cả lớp
            </h2>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto w-full md:w-auto">
          {/* Export to Excel */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            className="flex-1 sm:flex-none gap-1.5 border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-200 text-xs"
            title="Tải toàn bộ kết quả của lớp về máy dưới dạng file Excel .xlsx"
          >
            <Download className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="hidden sm:inline">Xuất file Excel (.xlsx)</span>
            <span className="sm:hidden">Xuất Excel</span>
          </Button>

          {/* Quick Refresh */}
          {isConnected && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => syncFromGoogleSheet()}
              disabled={isSyncing}
              className="gap-1.5 border-slate-300 dark:border-white/15 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-cobalt-500' : ''}`} />
              <span>{isSyncing ? 'Đang tải...' : 'Làm mới'}</span>
            </Button>
          )}

          {/* Open Hub Settings */}
          <Button
            variant="cobalt"
            size="sm"
            onClick={() => {
              setIsOpen((prev) => !prev)
            }}
            className="flex-1 sm:flex-none gap-1.5 shadow-sm text-xs"
          >
            <Settings className="h-3.5 w-3.5 shrink-0" />
            <span>Quản lý & Nhập liệu</span>
            {isOpen ? <ChevronUp className="h-3.5 w-3.5 ml-0.5" /> : <ChevronDown className="h-3.5 w-3.5 ml-0.5" />}
          </Button>
        </div>
      </div>

      {/* Progress & Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 px-4 sm:px-7 py-3 sm:py-4 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-cobalt-500" />
              Tiến độ cả lớp
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {completedCount} / {classSize || 30} bạn ({pct}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cobalt-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl bg-white/60 dark:bg-white/5 p-2.5 sm:p-0 sm:bg-transparent sm:dark:bg-transparent">
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {completedCount}
          </div>
          <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-tight">
            đã có tên<br />trong bảng
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl bg-white/60 dark:bg-white/5 p-2.5 sm:p-0 sm:bg-transparent sm:dark:bg-transparent">
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {Math.max(0, (classSize || 30) - completedCount)}
          </div>
          <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-tight">
            bạn còn lại<br />chưa nộp
          </div>
        </div>
      </div>

      {/* Helpful Solution Notification when Google Sheet has 404 */}
      {syncError && (
        <div className="mx-4 sm:mx-7 mt-4 p-3.5 sm:p-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                Google chặn quyền truy cập ẩn danh (HTTP 404):
              </p>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                Tài khoản Google của bạn đang đặt file ở chế độ bảo mật riêng tư nên máy chủ không thể đọc link tự động.
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setIsOpen(true)
                    setActiveTab('excel')
                  }}
                  className="gap-1.5 text-xs py-1.5 h-auto font-bold"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Kéo thả file Excel (.xlsx) lên
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(true)
                    setActiveTab('paste')
                  }}
                  className="gap-1.5 text-xs py-1.5 h-auto"
                >
                  <ClipboardPaste className="h-3.5 w-3.5" />
                  Dán nhanh bảng tính (Ctrl+V)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Config Drawer / Modal with 4-in-1 Tabs */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 dark:border-white/10 p-4 sm:p-7 bg-white dark:bg-[#060b18]/60"
          >
            {/* 4 Tabs switcher */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 border-b border-slate-100 dark:border-white/5 pb-3 sm:pb-4 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('excel')}
                className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'excel'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Upload className="h-3.5 w-3.5" />
                <span className="sm:hidden">1. File Excel</span>
                <span className="hidden sm:inline">1. Tải lên File Excel / CSV (Khuyên dùng)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'paste'
                    ? 'bg-cobalt-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <ClipboardPaste className="h-3.5 w-3.5" />
                <span className="sm:hidden">2. Dán Sheet</span>
                <span className="hidden sm:inline">2. Dán từ Sheet (Ctrl+V)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'manual'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sm:hidden">3. Thêm bạn</span>
                <span className="hidden sm:inline">3. Thêm học sinh trực tiếp</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'url'
                    ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Link2 className="h-3.5 w-3.5" />
                <span className="sm:hidden">4. Link Sheet</span>
                <span className="hidden sm:inline">4. Kết nối Link Google Sheet</span>
              </button>
            </div>

            {/* TAB 1: KÉO THẢ FILE EXCEL (.XLSX / .CSV) */}
            {activeTab === 'excel' && (
              <div className="space-y-4 max-w-2xl">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold block mb-1">
                    💡 Hướng dẫn 2 bước siêu nhanh:
                  </strong>
                  1. Mở file Google Sheet khảo sát của bạn → bấm <strong>Tệp (File)</strong> → <strong>Tải xuống (Download)</strong> → chọn <strong>Microsoft Excel (.xlsx)</strong> hoặc <strong>CSV (.csv)</strong>.<br />
                  2. Kéo thả file tải về vào khung bên dưới, web sẽ tự động nhận diện và cập nhật toàn bộ lớp ngay lập tức!
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 rounded-3xl p-8 text-center cursor-pointer bg-slate-50/50 dark:bg-white/[0.02] hover:bg-emerald-500/[0.03] transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-sm">
                      {isFileLoading ? <RefreshCw className="h-7 w-7 animate-spin" /> : <Upload className="h-7 w-7" />}
                    </span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                      {isFileLoading ? 'Đang đọc và xử lý file...' : 'Bấm để chọn file hoặc Kéo thả file Excel (.xlsx / .csv) vào đây'}
                    </p>
                    <p className="text-xs text-slate-400">
                      Hỗ trợ định dạng file tải về từ Google Form / Google Sheet (.xlsx, .csv)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DÁN BẢNG DỮ LIỆU TỪ SHEET */}
            {activeTab === 'paste' && (
              <div className="space-y-4 max-w-3xl">
                <div className="p-3.5 rounded-2xl bg-cobalt-500/10 border border-cobalt-500/20 text-xs text-slate-700 dark:text-slate-300">
                  <strong>💡 Mẹo:</strong> Trên file Google Sheet, nhấn <code>Ctrl + A</code> (chọn tất cả) rồi <code>Ctrl + C</code> (sao chép), sau đó dán vào ô bên dưới rồi nhấn nút cập nhật.
                </div>

                <div>
                  <textarea
                    rows={5}
                    value={pasteContent}
                    onChange={(e) => setPasteContent(e.target.value)}
                    placeholder="Dán các cột Timestamp, Tên, Lớp, Mã Holland, R, I, A, S, E, C..."
                    className="w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-black/30 p-3.5 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition focus:border-cobalt-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="cobalt"
                    onClick={handlePasteImport}
                    disabled={!pasteContent.trim()}
                    className="shadow-sm gap-2"
                  >
                    <FileCheck className="h-4 w-4" />
                    Cập nhật danh sách học sinh ngay
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 3: THÊM HỌC SINH TRỰC TIẾP */}
            {activeTab === 'manual' && (
              <form onSubmit={handleAddManualStudent} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Họ và tên học sinh <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      placeholder="Ví dụ: Hoàng Tuấn Kiệt"
                      className="w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-black/30 px-4 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Lớp học
                    </label>
                    <input
                      type="text"
                      value={manualClass}
                      onChange={(e) => setManualClass(e.target.value)}
                      placeholder="10A1"
                      className="w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-black/30 px-4 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Nhóm tính cách chủ đạo
                    </label>
                    <select
                      value={manualGroup}
                      onChange={(e) => setManualGroup(e.target.value as PersonalityCode)}
                      className="w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#0a1128] px-4 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="R">Realistic (R) – Người Kiến tạo</option>
                      <option value="I">Investigative (I) – Người Khám phá</option>
                      <option value="A">Artistic (A) – Người Sáng tạo</option>
                      <option value="S">Social (S) – Người Kết nối</option>
                      <option value="E">Enterprising (E) – Người Dẫn đầu</option>
                      <option value="C">Conventional (C) – Người Tổ chức</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Nghề nghiệp gợi ý
                    </label>
                    <input
                      type="text"
                      value={manualCareer}
                      onChange={(e) => setManualCareer(e.target.value)}
                      placeholder="Ví dụ: Kỹ sư Phần mềm"
                      className="w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-black/30 px-4 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button type="submit" variant="primary" className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Thêm vào danh sách lớp
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                    Đóng
                  </Button>
                </div>
              </form>
            )}

            {/* TAB 4: KẾT NỐI QUA LINK GOOGLE SHEET */}
            {activeTab === 'url' && (
              <form onSubmit={handleSaveAndSync} className="space-y-4 max-w-3xl">
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                    <Info className="h-3.5 w-3.5 text-cobalt-500" /> Lưu ý để link Google Sheet không bị lỗi 404:
                  </p>
                  <p>Trên Google Sheet, bạn bắt buộc phải bấm nút <strong>Chia sẻ (Share)</strong> ở góc phải trên → chọn <strong>Bất kỳ ai có đường liên kết đều có thể xem (Viewer)</strong> thì máy chủ mới đọc được link.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Đường link Google Sheet của lớp
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                      className="flex-1 rounded-2xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-black/30 px-4 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition focus:border-cobalt-500"
                    />
                    {inputUrl && (
                      <a
                        href={inputUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-3 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        title="Mở Google Sheet trên tab mới"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Sĩ số học sinh cả lớp
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      value={inputSize}
                      onChange={(e) => setInputSize(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-black/30 px-4 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white outline-none transition focus:border-cobalt-500"
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <Button
                      type="submit"
                      variant="cobalt"
                      disabled={isSyncing}
                      className="flex-1 shadow-sm gap-2"
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Đang đồng bộ...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Lưu & Thử kết nối lại
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsOpen(false)}
                    >
                      Đóng
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {saveFeedback && (
              <p className="mt-4 text-xs text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                {saveFeedback}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
