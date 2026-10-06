import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

interface ZoomRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  delay?: number
  duration?: number
  scaleFrom?: number
  className?: string
}

export function ZoomReveal({
  children,
  delay = 0,
  duration = 0.6,
  scaleFrom = 0.88,
  className = '',
  ...props
}: ZoomRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: scaleFrom, y: 24, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
