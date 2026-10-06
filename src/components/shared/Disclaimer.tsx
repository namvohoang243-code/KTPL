import { FlaskConical, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export const DISCLAIMER =
  'Kết quả chỉ phản ánh xu hướng sở thích tại thời điểm thực hiện và không phải là chẩn đoán tâm lý hay quyết định nghề nghiệp tuyệt đối.'

export function Disclaimer({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <p
      className={cn(
        'flex items-start gap-2.5 text-sm leading-relaxed',
        dark ? 'text-navy-300' : 'text-navy-400',
        className,
      )}
    >
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{DISCLAIMER}</span>
    </p>
  )
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <Badge variant="gold" className={className}>
      <FlaskConical className="h-3.5 w-3.5" />
      Demo data
    </Badge>
  )
}
