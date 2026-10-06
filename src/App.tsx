import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { BackgroundSystem } from '@/components/shared/BackgroundSystem'
import { CustomCursor } from '@/components/shared/CustomCursor'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { PageTransition } from '@/components/shared/PageTransition'
import { AdminPage } from '@/pages/AdminPage'
import { CareersPage } from '@/pages/CareersPage'
import { ClassPage } from '@/pages/ClassPage'
import { HomePage } from '@/pages/HomePage'
import { IntroPage } from '@/pages/IntroPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { QuizPage } from '@/pages/QuizPage'
import { ResultPage } from '@/pages/ResultPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  const isQuiz = location.pathname === '/quiz'

  return (
    <div className="relative flex min-h-screen flex-col selection:bg-electric-500/30">
      <ScrollToTop />
      {/* Ambient Multi-Layer Background & Cursor Spotlight */}
      <BackgroundSystem />
      {/* Desktop Luxury Custom Cursor */}
      <CustomCursor />

      <Navbar />

      <main className="flex-1">
        <ErrorBoundary>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/intro" element={<PageTransition><IntroPage /></PageTransition>} />
            <Route path="/quiz" element={<PageTransition><QuizPage /></PageTransition>} />
            <Route path="/result" element={<PageTransition><ResultPage /></PageTransition>} />
            <Route path="/careers" element={<PageTransition><CareersPage /></PageTransition>} />
            <Route path="/class" element={<PageTransition><ClassPage /></PageTransition>} />
            <Route path="/admin" element={<PageTransition><AdminPage /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </ErrorBoundary>
    </main>

      {!isQuiz && <Footer />}
    </div>
  )
}
