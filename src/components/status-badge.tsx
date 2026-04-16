import { cn } from '@/lib/utils'

type Status = 'todo' | 'in_progress' | 'done'

interface StatusBadgeProps {
  status: Status
  selected?: boolean
  onClick?: () => void
}

const config: Record<Status, { label: string; dot: string; selectedBg: string; selectedBorder: string }> = {
  todo: {
    label: 'A fazer',
    dot: 'bg-status-todo',
    selectedBg: 'bg-status-todo/20',
    selectedBorder: 'border-text-muted',
  },
  in_progress: {
    label: 'Em progresso',
    dot: 'bg-status-progress',
    selectedBg: 'bg-status-progress/10',
    selectedBorder: 'border-status-progress',
  },
  done: {
    label: 'Concluído',
    dot: 'bg-status-done',
    selectedBg: 'bg-status-done/10',
    selectedBorder: 'border-status-done',
  },
}

export function StatusBadge({ status, selected = false, onClick }: StatusBadgeProps) {
  const c = config[status]
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
