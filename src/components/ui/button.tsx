import { cva, type VariantProps } from 'class-variance-authority'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { Link, type LinkProps } from 'react-router-dom'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-cobalt-600 via-cobalt-500 to-electric-500 text-white shadow-glow-cobalt hover:from-cobalt-500 hover:to-electric-400 hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0',
        cobalt:
          'bg-cobalt-600 text-white shadow-glow-cobalt hover:bg-cobalt-500 hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0',
        outline:
          'border border-slate-300 dark:border-white/15 bg-white/80 dark:bg-white/5 text-slate-800 dark:text-slate-100 backdrop-blur hover:bg-slate-100 dark:hover:bg-white/15 hover:border-slate-400 dark:hover:border-white/30 shadow-soft',
        ghost:
          'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10',
        gold:
          'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lift hover:from-amber-300 hover:to-amber-400 hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0',
        light:
          'bg-white text-slate-900 shadow-soft hover:bg-slate-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700',
        glass:
          'border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:border-white/30 shadow-soft',
        dark:
          'bg-slate-950 text-white border border-white/15 hover:bg-slate-900 shadow-lift',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-[0.95rem]',
        lg: 'h-13 px-8 text-base font-semibold',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type Variants = VariantProps<typeof buttonVariants>
const motionProps = { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, transition: { type: 'spring', stiffness: 400, damping: 22 } } as const

export interface ButtonProps extends HTMLMotionProps<'button'>, Variants {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <motion.button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...motionProps} {...props} />
))
Button.displayName = 'Button'

export interface ButtonLinkProps extends LinkProps, Variants {
  className?: string
}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(({ className, variant, size, ...props }, ref) => (
  <Link
    ref={ref}
    className={cn(
      buttonVariants({ variant, size }),
      'transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
      className,
    )}
    {...props}
  />
))
ButtonLink.displayName = 'ButtonLink'
