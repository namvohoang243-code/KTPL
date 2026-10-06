import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Check, Minus, UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PersonalityRadar } from '@/components/result/PersonalityRadar'
import { CountUp } from '@/components/shared/CountUp'
import { Button, ButtonLink } from '@/components/ui/button'
import { PERSONALITY_MAP } from '@/data/personalities'
import { rankClusters } from '@/engine/matching'
import { rankCodes } from '@/engine/scoring'
import { useApp } from '@/store/AppContext'
import type { ScoreMap } from '@/types'

const ME = '__me__'

export function StudentComparison() {
  const { result, students, stats, addMyResultToClass } = useApp()
  const [source, setSource] = useState<string>(result ? ME : (students[0]?.id ?? ''))
  const [added, setAdded] = useState<string | null>(null)

  const profile = useMemo<{ scores: ScoreMap; label: string } | null>(() => {
    if (source === ME && result) return { scores: result.scores, label: 'Hồ sơ của bạn' }
    const s = students.find((st) => st.id === source) ?? students[0]
    return s ? { scores: s.personality, label: `Hồ sơ ${s.id}` } : null
  }, [source, result, students])

  if (!profile || students.length === 0) return null

  const ranked = rankCodes(profile.scores)
  const focus = ranked[0]!
  const focusInfo = PERSONALITY_MAP[focus]
  const you = profile.scores[focus]
  const avg = stats.averageMap[focus]
  const maxBar = Math.max(you, avg, 1)

  const handleAdd = async () => {
    if (!result) return
    const topCluster = rankClusters(result.scores)[0]?.item.id ?? 'technology'
    setAdded(await addMyResultToClass(topCluster))
  }

  return (
    <div className="surface overflow-hidden border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Vị trí tương quan trong tập thể lớp
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            So sánh xu hướng thiên hướng — tôn trọng sự đa dạng, không xếp hạng hay phân loại giỏi kém.
          </p>
        </div>
        <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <span className="sr-only sm:not-sr-only">Hồ sơ:</span>
          <select
            id="compare-source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="h-11 cursor-pointer rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#060b18] px-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition hover:border-electric-400 focus:border-electric-400"
          >
            {result && <option value={ME}>Hồ sơ của tôi</option>}
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id.replace(/^([A-Za-z]+)(\d+)$/, (_, a: string, b: string) => `${a === 'ST' ? 'Học sinh' : a} ${b}`)} ({s.topType})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <PersonalityRadar
            scores={profile.scores}
            compare={stats.averageMap}
            label={profile.label}
            compareLabel="Trung bình lớp"
            height={340}
          />
          <div className="mt-3 flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <span className="h-1 w-5 rounded bg-cobalt-500" /> {profile.label}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1 w-5 rounded border-t-2 border-dashed border-teal-500" /> Trung bình lớp
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.03] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Nhóm tính cách dẫn đầu
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {focusInfo.name}
            </p>

            <div className="mt-6 space-y-5">
              {[
                { label: 'Cá nhân', value: you, color: '#38bdf8' },
                { label: 'Trung bình lớp', value: avg, color: '#14b8a6' },
              ].map((b, i) => (
                <div key={b.label}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">{b.label}</span>
                    <span className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                      <CountUp value={b.value} suffix="%" key={`${source}-${b.label}`} />
                    </span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                    <motion.div
                      key={`${source}-${b.label}`}
                      className="h-full rounded-full"
                      style={{ background: b.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(b.value / maxBar) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + i * 0.12, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ul className="space-y-2">
            {ranked.map((code) => {
              const diff = profile.scores[code] - stats.averageMap[code]
              const same = Math.abs(diff) < 3
              const Icon = same ? Minus : diff > 0 ? ArrowUpRight : ArrowDownRight
              return (
                <li
                  key={code}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/40 dark:bg-white/[0.02] px-4 py-2.5 text-xs sm:text-sm transition hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: PERSONALITY_MAP[code].color }} />
                  <span className="flex-1 font-bold text-slate-800 dark:text-slate-200">
                    {PERSONALITY_MAP[code].name}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {same ? 'Gần mức trung bình' : diff > 0 ? `Cao hơn ${diff} điểm` : `Thấp hơn ${-diff} điểm`}
                  </span>
                  <Icon className={`h-4 w-4 shrink-0 ${same ? 'text-slate-400' : diff > 0 ? 'text-cobalt-500' : 'text-teal-400'}`} />
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        {result ? (
          added ? (
            <p className="flex items-center gap-2 text-sm font-semibold text-teal-600 dark:text-teal-400">
              <Check className="h-4 w-4" /> Đã đóng góp ẩn danh vào dữ liệu lớp với mã {added}. Các biểu đồ đã được cập nhật.
            </p>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Muốn đóng góp hồ sơ của bạn vào thống kê lớp? Chỉ lưu điểm số, tuyệt đối không lưu thông tin cá nhân.
              </p>
              <Button variant="outline" size="sm" onClick={handleAdd} id="compare-add-me" className="shrink-0 gap-1.5 border-slate-300 dark:border-white/15">
                <UserPlus className="h-4 w-4" />
                Đóng góp ẩn danh vào lớp
              </Button>
            </>
          )
        ) : (
          <>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Đang xem hồ sơ mẫu ẩn danh. Hãy làm bài test để đối chiếu hồ sơ của chính bạn.
            </p>
            <ButtonLink to="/intro" size="sm" variant="cobalt" className="shrink-0">
              Làm bài test ngay
            </ButtonLink>
          </>
        )}
      </div>
    </div>
  )
}
