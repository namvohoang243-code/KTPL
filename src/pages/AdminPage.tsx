import { motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  Search,
  Upload,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Link2,
  Trash2,
  Lock,
} from 'lucide-react'
import { useId, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { HostGate } from '@/components/auth/HostGate'
import { CLUSTER_MAP } from '@/data/careers'
import { PERSONALITY_MAP } from '@/data/personalities'
import { CSV_TEMPLATE, parseStudentsCsv, studentsToCsv, type CsvParseResult } from '@/engine/csv'
import { getGoogleConfig, saveGoogleConfig } from '@/services/googleService'
import { DemoBadge, Disclaimer } from '@/components/shared/Disclaimer'
import { Reveal } from '@/components/shared/Reveal'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { useApp } from '@/store/AppContext'
import type { Student } from '@/types'

export function AdminPage() {
  const {
    students,
    isDemo,
    importStudents,
    resetToDemo,
    deleteStudent,
    restoreDeletedStudents,
    deletedCount,
    googleSheetUrl,
    setGoogleSheetUrl,
    syncFromGoogleSheet,
    isSyncing,
    syncError,
    lastSyncedAt,
    classSize,
    setClassSize,
    isHostAuthenticated,
    logoutHost,
  } = useApp()
  const fileInputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [rawText, setRawText] = useState('')
  const [parseResult, setParseResult] = useState<CsvParseResult | null>(null)
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace')
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState<'googlesheet' | 'upload' | 'table'>('googlesheet')

  // Google Sheet Tab State
  const [sheetInput, setSheetInput] = useState(googleSheetUrl)
  const [formConfig, setFormConfig] = useState(() => getGoogleConfig())
  const [showAdvancedFormConfig, setShowAdvancedFormConfig] = useState(false)

  const handleFileProcess = (content: string) => {
    setRawText(content)
    const res = parseStudentsCsv(content)
    setParseResult(res)
    setStatusMessage(null)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      handleFileProcess(text)
    }
    reader.readAsText(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        handleFileProcess(text)
      }
      reader.readAsText(file)
    }
  }

  const handleApplyImport = async () => {
    if (!parseResult || parseResult.students.length === 0) return
    try {
      await importStudents(parseResult.students, importMode)
      setStatusMessage({
        type: 'success',
        text: `Đã ${importMode === 'replace' ? 'thay thế toàn bộ dữ liệu bằng' : 'thêm'} ${parseResult.students.length} học sinh thành công! Dữ liệu thống kê lớp đã được tự động cập nhật.`,
      })
      setParseResult(null)
      setRawText('')
      setActiveTab('table')
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại.',
      })
    }
  }

  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'career_map_students_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportCurrent = () => {
    const csvContent = studentsToCsv(students)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `career_map_export_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleResetDemo = async () => {
    if (window.confirm('Khôi phục danh sách về 30 học sinh demo chuẩn?')) {
      await resetToDemo()
      setStatusMessage({
        type: 'success',
        text: 'Đã khôi phục lại dữ liệu mẫu 30 học sinh chuẩn.',
      })
    }
  }

  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return students
    return students.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.topType.toLowerCase().includes(q) ||
        s.careers.some((c) => {
          const cluster = CLUSTER_MAP[c]
          return c.toLowerCase().includes(q) || (cluster && cluster.shortLabel.toLowerCase().includes(q))
        }),
    )
  }, [students, searchQuery])

  if (!isHostAuthenticated) {
    return (
      <HostGate
        title="Quản trị dữ liệu & Lớp"
        subtitle="Website đang ở chế độ công khai. Nhập mật khẩu Host (6767) để truy cập trang quản trị và nhập xuất dữ liệu học sinh."
      />
    )
  }

  return (
    <div className="relative overflow-hidden pb-16">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[28rem]" aria-hidden />

      <section className="container-page relative pt-12 sm:pt-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="cobalt" className="tracking-[0.16em]">
              ADMIN &amp; DATA MANAGEMENT
            </Badge>
            <Badge variant="default" className="text-teal-600 dark:text-teal-400 border-teal-500/20 bg-teal-500/10 font-bold">
              🔓 Quyền Host
            </Badge>
            {isDemo && <DemoBadge />}
            <button
              type="button"
              onClick={logoutHost}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-slate-500 hover:text-red-500 hover:bg-red-500/10 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
              title="Khóa lại phần quản trị khi rời máy"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Khóa lại (Đăng xuất)</span>
            </button>
          </div>
          <h1 className="mt-3 sm:mt-4 text-3xl font-semibold leading-[1.12] sm:leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            Quản trị &amp; <span className="text-cobalt-500">Import dữ liệu lớp</span>
          </h1>
          <p className="mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-navy-500">
            Import tệp CSV điểm RIASEC của cả lớp. Hệ thống tự động tính toán lại tất cả biểu đồ, phân bố tính cách và ma trận nghề nghiệp ngay lập tức.
          </p>
        </motion.div>

        {/* Quick Toolbar */}
        <Reveal className="mt-8 sm:mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('googlesheet')}
              className={`shrink-0 rounded-full px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'googlesheet' ? 'bg-navy-900 text-white shadow-sm' : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
              }`}
            >
              <FileSpreadsheet className="mr-1.5 inline h-4 w-4 text-teal-400" />
              <span className="sm:hidden">Google Sheet</span>
              <span className="hidden sm:inline">Đồng bộ Google Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`shrink-0 rounded-full px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'upload' ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
              }`}
            >
              <Upload className="mr-1.5 inline h-4 w-4" />
              Import CSV
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`shrink-0 rounded-full px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'table' ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
              }`}
            >
              <FileSpreadsheet className="mr-1.5 inline h-4 w-4" />
              Danh sách ({students.length})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate} id="btn-download-template" className="text-xs">
              <Download className="h-3.5 w-3.5" />
              CSV mẫu
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCurrent} id="btn-export-csv" className="text-xs">
              <FileText className="h-3.5 w-3.5" />
              Xuất CSV ({students.length})
            </Button>
            <Button variant="ghost" size="sm" onClick={handleResetDemo} id="btn-reset-demo" className="text-navy-500 hover:text-navy-900 text-xs">
              <RotateCcw className="h-3.5 w-3.5 text-[#9a6a0a]" />
              Reset Demo
            </Button>
            <ButtonLink to="/class" variant="cobalt" size="sm" id="btn-view-class" className="text-xs gap-1">
              Xem thống kê
              <ArrowRight className="h-3.5 w-3.5" />
            </ButtonLink>
          </div>
        </Reveal>

        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 flex items-start gap-3 rounded-2xl p-4 text-sm font-medium ${
              statusMessage.type === 'success' ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            )}
            <span>{statusMessage.text}</span>
          </motion.div>
        )}

        {/* Tab 0: Google Sheet & Google Form Live Sync */}
        {activeTab === 'googlesheet' && (
          <div className="mt-8 space-y-8">
            <div className="surface p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-line">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600">
                  <FileSpreadsheet className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-navy-900">
                    Kết nối Google Sheet để tự động cập nhật thống kê lớp
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-navy-500">
                    Khi học sinh hoàn thành bài test, kết quả sẽ gửi về Google Form và tự động cập nhật vào Google Sheet. Trang Thống kê lớp sẽ đọc dữ liệu trực tiếp từ đây.
                  </p>
                </div>
              </div>

              {/* Status and Last Synced */}
              <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {googleSheetUrl ? 'Đã liên kết Google Sheet' : 'Đang dùng dữ liệu nội bộ (15 bạn mẫu)'}
                  </span>
                </div>
                {lastSyncedAt && (
                  <span className="text-xs text-slate-400">
                    • Lần đồng bộ gần nhất: <strong>{lastSyncedAt}</strong>
                  </span>
                )}
                <span className="text-xs text-slate-500 ml-auto">
                  Tổng số học sinh: <strong>{students.length} bạn</strong>
                </span>
              </div>

              {/* URL Input Form */}
              <div className="mt-5 sm:mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5 flex items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5 text-cobalt-500" /> Đường link Google Sheet của lớp (URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={sheetInput}
                      onChange={(e) => setSheetInput(e.target.value)}
                      placeholder="Dán link Google Sheet vào đây: https://docs.google.com/spreadsheets/d/.../edit"
                      className="flex-1 rounded-2xl border border-line bg-navy-50/40 px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-navy-900 outline-none transition focus:border-cobalt-500 focus:bg-white"
                    />
                    {sheetInput && (
                      <a
                        href={sheetInput}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-3.5 sm:px-4 rounded-2xl border border-line text-navy-600 hover:text-navy-900"
                        title="Mở Google Sheet trên tab mới"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1.5">
                      Sĩ số dự kiến của lớp (bạn)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      value={classSize}
                      onChange={(e) => setClassSize(parseInt(e.target.value, 10) || 30)}
                      className="w-full rounded-2xl border border-line bg-navy-50/40 px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-navy-900 outline-none transition focus:border-cobalt-500 focus:bg-white"
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <Button
                      variant="cobalt"
                      size="md"
                      disabled={isSyncing}
                      onClick={async () => {
                        const cleaned = sheetInput.trim()
                        setGoogleSheetUrl(cleaned)
                        if (!cleaned) {
                          setStatusMessage({ type: 'error', text: 'Vui lòng nhập đường link Google Sheet.' })
                          return
                        }
                        const ok = await syncFromGoogleSheet(cleaned)
                        if (ok) {
                          setStatusMessage({
                            type: 'success',
                            text: 'Đồng bộ dữ liệu học sinh từ Google Sheet thành công!',
                          })
                        } else {
                          setStatusMessage({
                            type: 'error',
                            text: syncError || 'Không thể đồng bộ từ Google Sheet. Vui lòng kiểm tra quyền chia sẻ.',
                          })
                        }
                      }}
                      className="flex-1 shadow-glow-cobalt gap-2"
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Đang tải dữ liệu...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          Lưu & Tải số liệu từ Sheet
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction Box */}
            <div className="surface p-6 sm:p-8 rounded-3xl border border-line bg-slate-50/60 dark:bg-white/[0.02]">
              <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold-400" />
                Hướng dẫn liên kết Google Form với Google Sheet (3 bước đơn giản)
              </h3>
              <ol className="mt-4 space-y-3 text-sm text-navy-600 dark:text-slate-300 list-decimal pl-5">
                <li>
                  <strong>Tạo và liên kết Google Form:</strong> Trong Google Form của bạn (hoặc form mặc định được cung cấp), vào tab <strong>Câu trả lời (Responses)</strong> → Bấm vào biểu tượng <strong>Liên kết với Trang tính (Google Sheets)</strong> để tạo bảng tính tự động lưu kết quả.
                </li>
                <li>
                  <strong>Mở quyền truy cập Google Sheet:</strong> Trong Google Sheet vừa tạo, chọn nút <strong>Chia sẻ (Share)</strong> ở góc trên bên phải → Đổi quyền thành <strong>"Bất kỳ ai có đường liên kết đều có thể xem" (Anyone with the link can view)</strong>.
                </li>
                <li>
                  <strong>Dán link vào ô trên:</strong> Sao chép đường link Google Sheet từ thanh địa chỉ trình duyệt (dạng <code>https://docs.google.com/spreadsheets/d/.../edit</code>) hoặc link <strong>Xuất bản lên web (Publish to web) dạng CSV</strong>, dán vào ô bên trên và bấm <em>Lưu &amp; Tải số liệu</em>.
                </li>
              </ol>
            </div>

            {/* Collapsible Advanced Form Config */}
            <div className="surface p-6 sm:p-8 rounded-3xl border border-line">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-navy-900">Cấu hình điểm gửi Google Form (Nâng cao)</h4>
                  <p className="text-xs text-navy-500">Mã các câu hỏi (entry IDs) mà hệ thống gửi về Google Form khi học sinh nộp bài.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFormConfig(!showAdvancedFormConfig)}
                >
                  {showAdvancedFormConfig ? 'Thu gọn' : 'Xem cấu hình'}
                </Button>
              </div>

              {showAdvancedFormConfig && (
                <div className="mt-6 space-y-4 pt-4 border-t border-line text-xs font-mono">
                  <div>
                    <label className="block font-bold text-navy-700 mb-1">FORM_RESPONSE_URL:</label>
                    <input
                      type="text"
                      value={formConfig.formUrl}
                      onChange={(e) => {
                        const updated = saveGoogleConfig({ formUrl: e.target.value })
                        setFormConfig(updated)
                      }}
                      className="w-full rounded-xl border border-line bg-navy-50/50 p-2.5 text-xs text-navy-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(formConfig.entries).map(([key, entryId]) => (
                      <div key={key} className="rounded-xl border border-line p-2 bg-slate-50 dark:bg-black/20">
                        <span className="font-bold text-navy-700">{key}:</span>
                        <input
                          type="text"
                          value={entryId}
                          onChange={(e) => {
                            const newEntries = { ...formConfig.entries, [key]: e.target.value }
                            const updated = saveGoogleConfig({ entries: newEntries })
                            setFormConfig(updated)
                          }}
                          className="w-full mt-1 rounded border border-line p-1 text-[0.7rem]"
                        />
                      </div>
                    ))}
                  </div>

                  <p className="text-[0.75rem] text-slate-400 font-sans">
                    Cấu hình này đã được nạp sẵn chuẩn từ file <code>khao-sat-huong-nghiep.html</code>.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 1: Upload / Import */}
        {activeTab === 'upload' && (
          <div className="mt-8 space-y-8">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`surface flex flex-col items-center justify-center border-2 border-dashed p-10 text-center transition-all ${
                isDragging ? 'border-cobalt-500 bg-cobalt-50/50' : 'border-line hover:border-navy-300'
              }`}
            >
              <input
                id={fileInputId}
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cobalt-50 text-cobalt-600">
                <Upload className="h-8 w-8" />
              </span>
              <h2 className="mt-5 text-xl font-semibold tracking-tight text-navy-900">
                Kéo thả file CSV vào đây hoặc tải lên từ máy
              </h2>
              <p className="mt-2 max-w-md text-sm text-navy-500">
                File cần chứa các cột: <code className="rounded bg-navy-100 px-1.5 py-0.5 text-xs text-navy-800">student_id,R,I,A,S,E,C,top_type,career</code>
              </p>

              <div className="mt-6 flex gap-3">
                <label
                  htmlFor={fileInputId}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cobalt-600 to-electric-500 px-6 py-2.5 text-sm font-semibold text-white shadow-glow-cobalt transition hover:from-cobalt-500 hover:to-electric-400"
                >
                  Chọn file CSV
                </label>
                <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                  Xem định dạng mẫu
                </Button>
              </div>
            </div>

            {/* Quick manual paste / sample loader */}
            <div className="surface p-6 sm:p-8">
              <h3 className="text-lg font-semibold tracking-tight">Hoặc dán trực tiếp nội dung CSV</h3>
              <p className="mt-1 text-sm text-navy-500">Bạn có thể sao chép bảng từ Excel hoặc Google Sheets rồi dán vào đây.</p>
              <textarea
                value={rawText}
                onChange={(e) => handleFileProcess(e.target.value)}
                placeholder={CSV_TEMPLATE}
                rows={6}
                className="mt-4 w-full rounded-2xl border border-line bg-navy-50/30 p-4 font-mono text-xs leading-relaxed text-navy-900 outline-none transition focus:border-cobalt-500 focus:bg-white"
              />
            </div>

            {/* Parse result preview */}
            {parseResult && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="surface overflow-hidden p-6 sm:p-8">
                <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">Kết quả kiểm tra dữ liệu</h3>
                    <p className="mt-1 text-sm text-navy-500">
                      Tìm thấy <strong className="text-navy-900">{parseResult.students.length}</strong> học sinh hợp lệ.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-navy-700">
                      <span>Chế độ:</span>
                      <select
                        value={importMode}
                        onChange={(e) => setImportMode(e.target.value as 'replace' | 'append')}
                        className="rounded-full border border-line bg-white px-3 py-1.5 text-sm font-semibold outline-none"
                      >
                        <option value="replace">Thay thế toàn bộ lớp</option>
                        <option value="append">Thêm vào lớp hiện tại</option>
                      </select>
                    </label>

                    <Button
                      variant="cobalt"
                      size="md"
                      onClick={handleApplyImport}
                      disabled={parseResult.students.length === 0}
                      id="btn-apply-import"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Áp dụng import ({parseResult.students.length} hs)
                    </Button>
                  </div>
                </div>

                {parseResult.warnings.length > 0 && (
                  <div className="mt-4 rounded-xl bg-amber-50 p-4 text-xs text-amber-800">
                    <p className="font-semibold">Lưu ý quyền riêng tư:</p>
                    <ul className="mt-1 list-inside list-disc">
                      {parseResult.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {parseResult.errors.length > 0 && (
                  <div className="mt-4 rounded-xl bg-red-50 p-4 text-xs text-red-800">
                    <p className="font-semibold">Một số lỗi cần sửa trong file:</p>
                    <ul className="mt-1 max-h-32 list-inside list-disc overflow-y-auto">
                      {parseResult.errors.map((err, i) => (
                        <li key={i}>
                          Dòng {err.line}: {err.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Preview Table */}
                {parseResult.students.length > 0 && (
                  <div className="mt-6 overflow-x-auto">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-navy-400">Xem trước 5 học sinh đầu tiên:</p>
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-line bg-navy-50/50 text-xs font-semibold uppercase text-navy-500">
                        <tr>
                          <th className="px-4 py-3">Mã HS</th>
                          <th className="px-2 py-3 text-center">R</th>
                          <th className="px-2 py-3 text-center">I</th>
                          <th className="px-2 py-3 text-center">A</th>
                          <th className="px-2 py-3 text-center">S</th>
                          <th className="px-2 py-3 text-center">E</th>
                          <th className="px-2 py-3 text-center">C</th>
                          <th className="px-4 py-3">Top Type</th>
                          <th className="px-4 py-3">Nhóm nghề</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {parseResult.students.slice(0, 5).map((s) => (
                          <tr key={s.id} className="hover:bg-navy-50/40">
                            <td className="px-4 py-2.5 font-semibold text-navy-900">{s.id}</td>
                            <td className="px-2 py-2.5 text-center tabular-nums">{s.personality.R}</td>
                            <td className="px-2 py-2.5 text-center tabular-nums">{s.personality.I}</td>
                            <td className="px-2 py-2.5 text-center tabular-nums">{s.personality.A}</td>
                            <td className="px-2 py-2.5 text-center tabular-nums">{s.personality.S}</td>
                            <td className="px-2 py-2.5 text-center tabular-nums">{s.personality.E}</td>
                            <td className="px-2 py-2.5 text-center tabular-nums">{s.personality.C}</td>
                            <td className="px-4 py-2.5 font-medium text-cobalt-600">{s.topType}</td>
                            <td className="px-4 py-2.5 text-navy-700">
                              {CLUSTER_MAP[s.careers[0] ?? '']?.shortLabel ?? s.careers[0]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* Tab 2: Existing Students Table */}
        {activeTab === 'table' && (
          <div className="mt-8 space-y-6">
            <div className="surface p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    Danh sách học sinh trong lớp ({filteredStudents.length} / {students.length})
                  </h3>
                  <p className="mt-1 text-sm text-navy-500">Dữ liệu được lưu ẩn danh trên trình duyệt.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {deletedCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        await restoreDeletedStudents()
                        setStatusMessage({
                          type: 'success',
                          text: 'Đã khôi phục toàn bộ học sinh đã xóa vào lớp.',
                        })
                      }}
                      className="gap-1.5 text-xs text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Khôi phục {deletedCount} bạn đã xóa
                    </Button>
                  )}
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm theo mã HS, nhóm, nghề..."
                      className="h-10 w-full rounded-full border border-line bg-navy-50/50 pl-10 pr-4 text-base sm:text-sm outline-none transition focus:border-cobalt-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Table Swipe Hint */}
              <div className="sm:hidden mt-4 px-3 py-1.5 bg-navy-50/80 rounded-xl text-[11px] text-navy-500 flex items-center justify-between">
                <span>👉 Vuốt ngang bảng để xem điểm R-I-A-S-E-C</span>
                <span className="font-mono text-[10px] text-cobalt-500 font-bold">KÉO SANG →</span>
              </div>

              <div className="mt-4 sm:mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-line bg-navy-50/60 text-xs font-semibold uppercase text-navy-500">
                    <tr>
                      <th className="px-4 py-3">Mã học sinh</th>
                      <th className="px-2 py-3 text-center" style={{ color: PERSONALITY_MAP.R.color }}>R</th>
                      <th className="px-2 py-3 text-center" style={{ color: PERSONALITY_MAP.I.color }}>I</th>
                      <th className="px-2 py-3 text-center" style={{ color: PERSONALITY_MAP.A.color }}>A</th>
                      <th className="px-2 py-3 text-center" style={{ color: PERSONALITY_MAP.S.color }}>S</th>
                      <th className="px-2 py-3 text-center" style={{ color: PERSONALITY_MAP.E.color }}>E</th>
                      <th className="px-2 py-3 text-center" style={{ color: PERSONALITY_MAP.C.color }}>C</th>
                      <th className="px-4 py-3">Top Type</th>
                      <th className="px-4 py-3">Nhóm nghề chính</th>
                      <th className="px-4 py-3 text-right">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {filteredStudents.map((s: Student) => (
                      <tr key={s.id} className="hover:bg-navy-50/40">
                        <td className="px-4 py-3 font-semibold text-navy-900">
                          {s.name || s.id}
                          {s.demo && <span className="ml-2 text-[0.65rem] text-[#9a6a0a] font-normal">(demo)</span>}
                        </td>
                        <td className="px-2 py-3 text-center tabular-nums">{s.personality.R}</td>
                        <td className="px-2 py-3 text-center tabular-nums">{s.personality.I}</td>
                        <td className="px-2 py-3 text-center tabular-nums">{s.personality.A}</td>
                        <td className="px-2 py-3 text-center tabular-nums">{s.personality.S}</td>
                        <td className="px-2 py-3 text-center tabular-nums">{s.personality.E}</td>
                        <td className="px-2 py-3 text-center tabular-nums">{s.personality.C}</td>
                        <td className="px-4 py-3 font-medium text-cobalt-600">{s.topType}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-700">
                            {CLUSTER_MAP[s.careers[0] ?? '']?.shortLabel ?? s.careers[0]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={async () => {
                              const name = s.name || s.id
                              if (window.confirm(`Xóa học sinh "${name}" khỏi thống kê lớp? Sĩ số sẽ giảm từ ${students.length} xuống còn ${students.length - 1} bạn.`)) {
                                await deleteStudent(s)
                                setStatusMessage({
                                  type: 'success',
                                  text: `Đã xóa học sinh "${name}". Thống kê lớp hiện còn ${students.length - 1} bạn.`,
                                })
                              }
                            }}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-xl text-navy-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title={`Xóa học sinh ${s.name || s.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <Disclaimer className="mt-12 max-w-3xl" />
      </section>
    </div>
  )
}
