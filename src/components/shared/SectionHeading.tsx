import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  action?: ReactNode
  className?: string
}

export function SectionHeading({ eyebrow, title, description, align = 'left', action, className }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'items-center text-center sm:flex-col sm:items-center',
        className,
      )}
    >
      <div className={cn(align === 'center' && 'flex flex-col items-center')}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className={cn('section-title', eyebrow && 'mt-3')}>{title}</h2>
        {description && <p className={cn('section-sub', align === 'center' && 'mx-auto')}>{description}</p>}
      </div>
      {action}
    </div>
  )
}
