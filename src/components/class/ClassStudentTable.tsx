import { useState, useMemo } from 'react'
import {
  Search,
  Eye,
  EyeOff,
  Sparkles,
  Filter,
  Trash2,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react'
import { PERSONALITY_MAP } from '@/data/personalities'
import { rankCodes } from '@/engine/scoring'
import { useApp } from '@/store/AppContext'
import type { Student } from '@/types'

export function ClassStudentTable() {
  const {
    students,
    showStudentNames,
    setShowStudentNames,
    deleteStudent,
    restoreDeletedStudents,
    deletedCount,
  } = useApp()
  const [search, setSearch] = useState('')
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'info'; text: string } | null>(null)

  const classList = useMemo(() => {
    const set = new Set<string>()
    students.forEach((s) => {
      if (s.className) set.add(s.className)
    })
    return Array.from(set)
  }, [students])

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        search === '' ||
        (s.name && s.name.toLowerCase().includes(search.toLowerCase())) ||
        (s.nickname && s.nickname.toLowerCase().includes(search.toLowerCase())) ||
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        (s.primaryCareerName && s.primaryCareerName.toLowerCase().includes(search.toLowerCase()))
      const matchClass = selectedClass === 'all' || s.className === selectedClass
      return matchSearch && matchClass
    })
  }, [students, search, selectedClass])

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return
    const name = studentToDelete.name || studentToDelete.id
    const prevCount = students.length
    const ok = await deleteStudent(studentToDelete)
    if (ok) {
      setFeedback({
        type: 'success',
        text: `Đã xóa "${name}" thành công! Thống kê lớp đã giảm từ ${prevCount} xuống còn ${prevCount - 1} bạn.`,
      })
    }
    setStudentToDelete(null)
    setTimeout(() => setFeedback(null), 5000)
  }

  const handleRestore = async () => {
    await restoreDeletedStudents()
    setFeedback({
      type: 'info',
      text: 'Đã khôi phục lại tất cả học sinh đã xóa vào thống kê lớp.',
    })
    setTimeout(() => setFeedback(null), 5000)
  }

  return (
    <div className="surface relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0a1128]/90 backdrop-blur-xl shadow-lift">
      {/* Header & Controls */}
      <div className="p-4 sm:p-8 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow">ROSTER & SUBMISSIONS</span>
            <span className="rounded-full bg-cobalt-500/10 px-2.5 py-0.5 text-[0.7rem] font-bold text-cobalt-600 dark:text-cobalt-400">
              Quyền Host: Quản lý danh sách
            </span>
          </div>
          <h3 className="mt-1 text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Bảng kết quả từng bạn trong lớp
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Dữ liệu tổng hợp từ các bài làm đã gửi về Google Sheet ({students.length} bạn).
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          {/* Search box */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên, nghề, mã..."
              className="h-10 w-full sm:w-52 rounded-2xl border border-slate-200 dark:border-white/15 bg-slate-50/80 dark:bg-black/20 pl-9 pr-3.5 text-base sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition focus:border-cobalt-500"
            />
          </div>

          {/* Class Filter */}
          {classList.length > 1 && (
            <div className="relative flex items-center">
              <Filter className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-400" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="h-10 cursor-pointer rounded-2xl border border-slate-200 dark:border-white/15 bg-slate-50/80 dark:bg-black/20 pl-8 pr-4 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none"
              >
                <option value="all">Tất cả lớp ({students.length})</option>
                {classList.map((cls) => (
                  <option key={cls} value={cls}>
                    Lớp {cls}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Anonymize Toggle */}
          <button
            type="button"
            onClick={() => setShowStudentNames(!showStudentNames)}
            className="flex h-10 items-center gap-1.5 rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 px-3 sm:px-3.5 text-xs font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-white/10 cursor-pointer"
            title={showStudentNames ? 'Chuyển sang chế độ ẩn danh' : 'Hiện họ tên học sinh'}
          >
            {showStudentNames ? (
              <>
                <Eye className="h-3.5 w-3.5 text-teal-500" />
                <span>Hiện tên</span>
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                <span>Ẩn tên</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden px-4 py-2 bg-slate-100/70 dark:bg-white/[0.04] border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>👉 Vuốt ngang bảng để xem điểm Holland & nghề</span>
        <span className="font-mono text-[10px] text-cobalt-500">KÉO SANG →</span>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`mx-6 sm:mx-8 mt-4 flex items-center justify-between rounded-2xl p-3.5 text-xs font-medium ${
          feedback.type === 'success' ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20' : 'bg-cobalt-500/10 text-cobalt-700 dark:text-cobalt-300 border border-cobalt-500/20'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-500" />
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Roster Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3.5 pl-6 pr-3">STT</th>
              <th className="py-3.5 px-3">Học sinh</th>
              <th className="py-3.5 px-3">Lớp</th>
              <th className="py-3.5 px-3">Nhóm tính cách chủ đạo</th>
              <th className="py-3.5 px-3">Mã Holland</th>
              <th className="py-3.5 px-3">Nghề nghiệp gợi ý chính</th>
              <th className="py-3.5 pr-6 pl-3 text-right">Host xóa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                  Không tìm thấy học sinh nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              filtered.map((s, idx) => {
                const ranked = rankCodes(s.personality || {})
                const dominant = (ranked[0] || 'I') as keyof typeof PERSONALITY_MAP
                const info = PERSONALITY_MAP[dominant] || PERSONALITY_MAP.I
                const displayName = showStudentNames
                  ? s.name || s.nickname || `Bạn ${idx + 1}`
                  : `Bạn ${idx + 1}`

                return (
                  <tr
                    key={s.id || idx}
                    className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="py-3.5 pl-6 pr-3 font-mono text-xs text-slate-400">
                      {String(idx + 1).padStart(2, '0')}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span>{displayName}</span>
                        {s.demo && (
                          <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-[0.68rem] font-bold text-slate-500 dark:text-slate-400">
                            mẫu
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <span className="rounded-md bg-slate-100 dark:bg-white/10 px-2 py-1">
                        {s.className || '10A1'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
                        style={{
                          backgroundColor: `${info.color}18`,
                          color: info.color,
                        }}
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: info.color }}
                        />
                        {info.name} ({dominant})
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-xs font-bold tracking-wider text-slate-700 dark:text-slate-300">
                      {s.topType || ranked.slice(0, 3).join('')}
                    </td>

                    <td className="py-3.5 px-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {s.primaryCareerName || 'Kỹ thuật / Công nghệ'}
                    </td>

                    <td className="py-3.5 pr-6 pl-3 text-right">
                      <button
                        type="button"
                        onClick={() => setStudentToDelete(s)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title={`Host xóa ${s.name || 'học sinh này'} khỏi thống kê`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info & Restore bar */}
      <div className="p-3.5 px-4 sm:px-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span>Hiển thị {filtered.length} / {students.length} học sinh</span>
          {deletedCount > 0 && (
            <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium bg-amber-500/10 px-2.5 py-1 rounded-xl">
              <span>Đã loại trừ {deletedCount} bạn</span>
              <button
                type="button"
                onClick={handleRestore}
                className="underline hover:text-amber-700 dark:hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer font-bold"
              >
                <RotateCcw className="h-3 w-3" /> Khôi phục lại
              </button>
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-[11px] sm:text-xs">
          <Sparkles className="h-3 w-3 text-gold-400 shrink-0" />
          Số liệu và biểu đồ tự động cập nhật ngay khi Host xóa học sinh
        </span>
      </div>

      {/* Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="surface max-w-sm sm:max-w-md w-full rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0c142c] shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <span className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Xác nhận xóa học sinh?
                </h4>
                <p className="text-xs text-slate-500">Thao tác dành cho Host / Giáo viên</p>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/10 space-y-2 text-sm">
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                Bạn sắp xóa kết quả của học sinh:
              </p>
              <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between text-sm sm:text-base">
                <span>{studentToDelete.name || studentToDelete.nickname || studentToDelete.id}</span>
                <span className="text-xs text-slate-500 font-normal">Lớp: {studentToDelete.className || '10A1'}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-white/10 leading-relaxed">
                ⚡ <strong>Hiệu lực tức thì:</strong> Sĩ số thống kê lớp sẽ giảm từ <strong className="text-red-500">{students.length}</strong> xuống còn <strong className="text-teal-500">{students.length - 1}</strong> bạn. Mọi biểu đồ phân bố và điểm số tự cập nhật lại.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer min-h-[42px]"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-1.5 min-h-[42px]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
