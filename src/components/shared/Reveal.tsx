import { motion, useInView, type HTMLMotionProps } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  delay?: number
  y?: number
}

/** Fade + slide-up when the block enters the viewport. */
export function Reveal({ children, delay = 0, y = 20, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface InViewProps {
  children: ReactNode
  className?: string
  /** Placeholder height to avoid layout shift before the chart mounts */
  minHeight?: number
}

/**
 * Mounts children only once visible, so Recharts' built-in draw animation
 * plays when the chart actually appears on screen.
 */
export function InViewMount({ children, className, minHeight = 0 }: InViewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <div ref={ref} className={className} style={{ minHeight }}>
      {inView ? children : null}
    </div>
  )
}
