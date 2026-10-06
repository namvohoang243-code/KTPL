import React, { useRef, useState } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

interface TiltCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  tiltAmount?: number
  glow?: boolean
}

export function TiltCard({
  children,
  className = '',
  tiltAmount = 2.5,
  glow = true,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotX = ((y - centerY) / centerY) * -tiltAmount
    const rotY = ((x - centerX) / centerX) * tiltAmount

    setRotateX(rotX)
    setRotateY(rotY)
    setMousePos({ x, y })
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={cardRef}
      {...props}
      onMouseMove={(e) => {
        handleMouseMove(e)
        props.onMouseMove?.(e)
      }}
      onMouseEnter={(e) => {
        handleMouseEnter()
        props.onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        handleMouseLeave()
        props.onMouseLeave?.(e)
      }}
      animate={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 260 }}
      className={`relative overflow-hidden ${className}`}
      style={{ transformStyle: 'preserve-3d', ...props.style }}
    >
      {glow && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.12), transparent 70%)`,
          }}
        />
      )}
      {children}
    </motion.div>
  )
}
