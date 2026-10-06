import { SearchX } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-navy-500 shadow-lift">
        <SearchX className="h-9 w-9" />
      </span>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">Không tìm thấy trang</h1>
      <p className="mt-3 text-navy-500">Đường dẫn này không tồn tại hoặc đã được di chuyển.</p>
      <ButtonLink to="/" size="lg" className="mt-8">
        Về trang chủ
      </ButtonLink>
    </section>
  )
}
