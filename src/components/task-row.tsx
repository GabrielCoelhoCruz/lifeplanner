import { Circle, CheckCircle } from '@phosphor-icons/react'
import type { Task } from '@/server/db/schema'
import { formatDatePt, isOverdue } from '@/lib/date'
import { cn } from '@/lib/utils'

interface TaskRowProps {
  task: Task
  onToggle: (task: Task) => void
  onClick: (task: Task) => void
}

const priorityColors: Record<string, string> = {
  high: 'bg-priority-high',
  medium: 'bg-priority-medium',
  low: 'bg-priority-low',
}

export function TaskRow({ task, onToggle, onClick }: TaskRowProps) {
  const isDone = task.status === 'done'
  const overdue = !isDone && isOverdue(task.dueDate)

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-bg-secondary/50 transition-colors cursor-pointer"
      onClick={() => onClick(task)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggle(task)
        }}
        className="shrink-0 cursor-pointer"
      >
        {isDone ? (
          <CheckCircle size={20} weight="fill" className="text-status-done" />
        ) : (
          <Circle size={20} className="text-text-muted" />
        )}
      </button>

      <span
        className={cn(
          'flex-1 text-sm truncate',
          isDone && 'line-through text-text-muted'
        )}
      >
        {task.title}
      </span>

      <span className={cn('w-2 h-2 rounded-full shrink-0', priorityColors[task.priority])} />

      {task.dueDate && (
        <span
          className={cn(
            'text-xs font-mono shrink-0',
            overdue ? 'text-priority-high' : 'text-text-muted'
          )}
        >
          {formatDatePt(task.dueDate)}
        </span>
      )}
    </div>
  )
}
