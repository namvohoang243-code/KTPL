import type { ReactNode } from 'react'

interface TooltipRow {
  color?: string
  label: ReactNode
  value: ReactNode
}

/** Shared glassy tooltip card for Recharts and custom charts. */
export function TooltipCard({ title, rows, footer }: { title?: ReactNode; rows?: TooltipRow[]; footer?: ReactNode }) {
  return (
    <div className="min-w-36 rounded-2xl border border-white/10 bg-navy-900/95 px-4 py-3 text-white shadow-lift backdrop-blur">
      {title && <p className="text-sm font-semibold">{title}</p>}
      {rows && (
        <ul className={title ? 'mt-2 space-y-1' : 'space-y-1'}>
          {rows.map((r, i) => (
            <li key={i} className="flex items-center justify-between gap-5 text-xs text-navy-200">
              <span className="flex items-center gap-2">
                {r.color && <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />}
                {r.label}
              </span>
              <span className="font-semibold tabular-nums text-white">{r.value}</span>
            </li>
          ))}
        </ul>
      )}
      {footer && <p className="mt-2 text-xs text-navy-300">{footer}</p>}
    </div>
  )
}
