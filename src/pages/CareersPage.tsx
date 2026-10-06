import { ArrowRight, Sparkles } from 'lucide-react'
import { useMemo } from 'react'
import { CareerGrid } from '@/components/career/CareerGrid'
import { Reveal } from '@/components/shared/Reveal'
import { ButtonLink } from '@/components/ui/button'
import { CAREER_CLUSTERS } from '@/data/careers'
import { rankClusters } from '@/engine/matching'
import { useApp } from '@/store/AppContext'
import type { CareerCluster, CareerMatch } from '@/types'

export function CareersPage() {
  const { result } = useApp()

  const matches = useMemo<CareerMatch<CareerCluster>[]>(
    () => (result ? rankClusters(result.scores) : CAREER_CLUSTERS.map((item) => ({ item, compatibility: 0 }))),
    [result],
  )

  return (
    <div className="relative overflow-hidden pb-10">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[30rem]" aria-hidden />
      <section className="container-page relative pt-12 sm:pt-20">
        <span className="eyebrow">Career clusters</span>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-6xl">
          {CAREER_CLUSTERS.length} nhóm nghề để <span className="text-cobalt-500">bắt đầu khám phá.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-500">
          {result
            ? 'Các nhóm nghề được sắp xếp theo mức độ phù hợp với hồ sơ tính cách của bạn.'
            : 'Làm bài test để thấy nhóm nghề nào phù hợp nhất. Bạn vẫn có thể xem tổng quan tất cả các nhóm nghề ngay bây giờ.'}
        </p>

        {!result && (
          <Reveal className="surface-glass mt-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="flex items-center gap-3 font-medium text-navy-700">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100 text-[#9a6a0a]">
                <Sparkles className="h-5 w-5" />
              </span>
              Chưa có kết quả — độ phù hợp (%) sẽ hiện sau khi bạn làm bài test.
            </p>
            <ButtonLink to="/intro" size="md" variant="cobalt">
              Làm bài test
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </Reveal>
        )}

        <div className="mt-12">
          <CareerGrid matches={matches} scores={result?.scores ?? null} showRank={Boolean(result)} showCompatibility={Boolean(result)} />
        </div>
      </section>
    </div>
  )
}
