import { useEffect, useRef } from 'react'

export function BackgroundSystem() {
  const spotlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animationFrameId: number
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let currentX = mouseX
    let currentY = mouseY

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      // Smooth linear interpolation for the mouse glow
      currentX += (mouseX - currentX) * 0.08
      currentY += (mouseY - currentY) * 0.08

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    animationFrameId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden" aria-hidden="true">
      {/* Layer 1: Base is handled by html.dark/light in body */}

      {/* Layer 2: Soft slow glowing orbs in corners */}
      <div className="absolute -top-[20%] -left-[10%] h-[55vw] w-[55vw] rounded-full bg-cobalt-600/10 dark:bg-cobalt-500/12 blur-[140px] animate-float" />
      <div className="absolute top-[35%] -right-[15%] h-[50vw] w-[50vw] rounded-full bg-teal-500/8 dark:bg-teal-400/10 blur-[130px] animate-float [animation-delay:3s]" />
      <div className="absolute -bottom-[20%] left-[20%] h-[45vw] w-[45vw] rounded-full bg-electric-500/8 dark:bg-electric-400/10 blur-[150px] animate-float [animation-delay:5s]" />

      {/* Layer 3: Ambient mesh radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.12),transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.18),transparent_70%)]" />

      {/* Layer 4: Fine micro-dot tech grid */}
      <div className="bg-grid-tech absolute inset-0 opacity-40 dark:opacity-35" />

      {/* Layer 5: Subtle floating ambient particles */}
      <div className="absolute inset-0">
        {[
          { top: '15%', left: '12%', size: 'w-1.5 h-1.5', delay: '0s', opacity: 'opacity-40' },
          { top: '28%', left: '82%', size: 'w-1 h-1', delay: '2s', opacity: 'opacity-30' },
          { top: '48%', left: '25%', size: 'w-2 h-2', delay: '4s', opacity: 'opacity-25' },
          { top: '65%', left: '75%', size: 'w-1.5 h-1.5', delay: '1s', opacity: 'opacity-35' },
          { top: '80%', left: '40%', size: 'w-1 h-1', delay: '3s', opacity: 'opacity-30' },
          { top: '92%', left: '88%', size: 'w-1.5 h-1.5', delay: '5s', opacity: 'opacity-25' },
        ].map((pt, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-electric-400 dark:bg-electric-300 blur-[0.5px] animate-float ${pt.size} ${pt.opacity}`}
            style={{
              top: pt.top,
              left: pt.left,
              animationDelay: pt.delay,
              animationDuration: '9s',
            }}
          />
        ))}
      </div>

      {/* Layer 6: Mouse Follow Spotlight (Radial glow 450px) */}
      <div
        ref={spotlightRef}
        className="absolute -top-[225px] -left-[225px] h-[450px] w-[450px] rounded-full bg-electric-400/10 dark:bg-cobalt-400/12 blur-[90px] will-change-transform"
      />
    </div>
  )
}
