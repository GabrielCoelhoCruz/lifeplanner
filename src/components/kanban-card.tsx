import type { Task } from '@/server/db/schema'
import { formatDatePt } from '@/lib/date'
import { cn } from '@/lib/utils'

interface KanbanCardProps {
  task: Task
  onClick: (task: Task) => void
}

const priorityColors: Record<string, string> = {
  high: 'bg-priority-high',
  medium: 'bg-priority-medium',
  low: 'bg-priority-low',
}

export function KanbanCard({ task, onClick }: KanbanCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(task)}
      className="w-full text-left bg-bg-elevated rounded-md border border-border p-3 hover:shadow-md transition-shadow cursor-pointer"
    >
      <p className="text-sm font-medium text-text-primary line-clamp-2">
        {task.title}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <span className={cn('w-2 h-2 rounded-full', priorityColors[task.priority])} />
        {task.dueDate && (
          <span className="text-xs font-mono text-text-muted">
            {formatDatePt(task.dueDate)}
          </span>
        )}
      </div>
    </button>
  )
}
