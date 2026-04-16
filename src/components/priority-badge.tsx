import { cn } from '@/lib/utils'

type Priority = 'high' | 'medium' | 'low'

interface PriorityBadgeProps {
  priority: Priority
  selected?: boolean
  onClick?: () => void
}

const config: Record<Priority, { label: string; dot: string; selectedBg: string; selectedBorder: string }> = {
  high: {
    label: 'Alta',
    dot: 'bg-priority-high',
    selectedBg: 'bg-priority-high/10',
    selectedBorder: 'border-priority-high',
  },
  medium: {
    label: 'Média',
    dot: 'bg-priority-medium',
    selectedBg: 'bg-priority-medium/10',
    selectedBorder: 'border-priority-medium',
  },
  low: {
    label: 'Baixa',
    dot: 'bg-priority-low',
    selectedBg: 'bg-priority-low/10',
    selectedBorder: 'border-priority-low',
  },
}

export function PriorityBadge({ priority, selected = false, onClick }: PriorityBadgeProps) {
  const c = config[priority]
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-colors cursor-pointer',
        selected
          ? `${c.selectedBg} ${c.selectedBorder} text-text-primary`
          : 'bg-transparent border-transparent text-text-muted hover:bg-bg-secondary'
      )}
    >
      <span className={cn('w-2 h-2 rounded-full', c.dot)} />
      {c.label}
    </button>
  )
}
