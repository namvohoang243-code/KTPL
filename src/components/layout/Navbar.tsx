import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Sparkles, Sun, X, Lock, Unlock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '@/components/shared/ThemeContext'
import { ButtonLink } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useApp } from '@/store/AppContext'

const NAV_ITEMS = [
  { to: '/', label: 'Khám phá', end: true },
  { to: '/intro', label: 'Bài test' },
  { to: '/result', label: 'Kết quả' },
  { to: '/careers', label: 'Vũ trụ nghề' },
  { to: '/class', label: 'Thống kê lớp' },
]

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="Career Map — trang chủ">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cobalt-600 via-cobalt-500 to-teal-400 p-[1px] shadow-glow transition-transform duration-300 group-hover:scale-105">
        <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#060b18] dark:bg-[#060b18]">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {/* Personality node */}
            <circle cx="6" cy="18" r="2.2" fill="#38bdf8" stroke="none" />
            {/* Connection path */}
            <path d="M7.8 16.5 C 10 14, 13 15, 17 8" stroke="#60a5fa" strokeDasharray="30" strokeDashoffset="0" />
            {/* Career star */}
            <circle cx="18" cy="7" r="2.5" fill="#f59e0b" stroke="none" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className={cn('text-sm font-extrabold tracking-[0.16em]', light ? 'text-white' : 'text-slate-900 dark:text-white')}>
          CAREER MAP
        </span>
        <span className="text-[0.65rem] font-semibold tracking-wider text-slate-500 dark:text-slate-400">
          EDTECH DISCOVERY
        </span>
      </div>
    </Link>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { isHostAuthenticated } = useApp()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const hideCta = pathname === '/quiz'

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled || open
          ? 'border-b border-line-dark dark:border-white/10 bg-white/75 dark:bg-[#060b18]/80 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.4)] backdrop-blur-2xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="container-page flex h-[4.25rem] sm:h-[4.75rem] items-center justify-between gap-3 sm:gap-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="relative px-4 py-2 text-[0.875rem] font-medium transition-colors"
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'relative z-10 transition-colors inline-flex items-center gap-1.5',
                      isActive
                        ? 'font-semibold text-cobalt-600 dark:text-electric-400'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    {item.label}
                    {item.to === '/class' && (
                      isHostAuthenticated ? (
                        <span title="Host đã mở khóa"><Unlock className="h-3.5 w-3.5 text-teal-500" /></span>
                      ) : (
                        <span title="Cần mã bảo mật Host"><Lock className="h-3.5 w-3.5 text-slate-400 opacity-70" /></span>
                      )
                    )}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-x-2 -bottom-2 h-[2px] rounded-full bg-gradient-to-r from-cobalt-500 to-electric-400 dark:from-electric-400 dark:to-teal-400"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-white/5 text-slate-700 dark:text-slate-200 transition hover:bg-slate-200/60 dark:hover:bg-white/10"
            aria-label="Chuyển chế độ sáng / tối"
            title={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-4 w-4 text-gold-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-4 w-4 text-cobalt-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {!hideCta && (
            <ButtonLink
              to="/intro"
              size="sm"
              className="hidden sm:inline-flex shadow-glow-cobalt transition-transform hover:-translate-y-0.5"
              id="nav-start-test"
            >
              <Sparkles className="h-4 w-4 text-gold-400" />
              Khám phá bản thân
            </ButtonLink>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-white/5 text-slate-800 dark:text-slate-200 transition hover:bg-slate-200 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={open}
            id="nav-mobile-toggle"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="max-h-[calc(100vh-4.25rem)] overflow-y-auto border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#060b18]/95 px-4 pb-6 backdrop-blur-2xl lg:hidden"
            aria-label="Điều hướng di động"
          >
            <div className="flex flex-col gap-1.5 pt-3">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i }}
                >
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between rounded-xl px-4 py-3.5 min-h-[44px] text-base font-medium transition',
                        isActive
                          ? 'bg-cobalt-500/10 text-cobalt-600 dark:text-electric-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                      )
                    }
                  >
                    <span>{item.label}</span>
                    {item.to === '/class' && (
                      isHostAuthenticated ? (
                        <Unlock className="h-4 w-4 text-teal-500" />
                      ) : (
                        <Lock className="h-4 w-4 text-slate-400" />
                      )
                    )}
                  </NavLink>
                </motion.div>
              ))}
              {!hideCta && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
                  <ButtonLink to="/intro" size="lg" className="w-full justify-center min-h-[48px]">
                    <Sparkles className="h-4 w-4 text-gold-400" />
                    Khám phá bản thân ngay
                  </ButtonLink>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
