import { Link } from 'react-router-dom'
import { Logo } from '@/components/layout/Navbar'
import { Disclaimer } from '@/components/shared/Disclaimer'

const LINKS = [
  { to: '/', label: 'Khám phá' },
  { to: '/intro', label: 'Bài test' },
  { to: '/careers', label: 'Nghề nghiệp' },
  { to: '/class', label: 'Thống kê' },
  { to: '/admin', label: 'Quản trị dữ liệu' },
]

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-navy-950 text-white">
      <div className="bg-grid-dark pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="container-page relative py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo light />
            <p className="mt-5 text-lg font-medium text-white/90">Discover yourself. Design your future.</p>
            <p className="mt-3 text-sm leading-relaxed text-navy-300">
              Công cụ khám phá xu hướng sở thích nghề nghiệp dựa trên mô hình RIASEC / Holland.
            </p>
          </div>
          <nav aria-label="Liên kết chân trang">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-navy-200 transition-colors hover:text-teal-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6">
          <Disclaimer dark className="max-w-3xl" />
          <p className="mt-5 text-xs tracking-wide text-navy-400">Career Map — Personality &amp; Career Discovery Project</p>
        </div>
      </div>
    </footer>
  )
}
