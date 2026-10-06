import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide', {
  variants: {
    variant: {
      default: 'border-navy-100 bg-white text-navy-700',
      cobalt: 'border-cobalt-200 bg-cobalt-50 text-cobalt-700',
      teal: 'border-teal-100 bg-teal-50 text-teal-600',
      gold: 'border-gold-100 bg-gold-100/60 text-[#9a6a0a]',
      dark: 'border-white/15 bg-white/10 text-white',
    },
  },
  defaultVariants: { variant: 'default' },
})

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
