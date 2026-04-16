import * as React from 'react'
import { Circle, CheckCircle, DotsSixVertical, ArrowsClockwise } from '@phosphor-icons/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '@/server/db/schema'
import type { TaskWithCounts } from '@/lib/api'
import { formatDatePt, isOverdue } from '@/lib/date'
import { cn } from '@/lib/utils'

type TaskMaybeWithCounts = Task & Partial<Pick<TaskWithCounts, 'itemCount' | 'itemDoneCount'>>

interface TaskRowProps {
  task: TaskMaybeWithCounts
  onToggle: (task: TaskMaybeWithCounts) => void
  onClick: (task: TaskMaybeWithCounts) => void
  sortable?: boolean
}

const priorityColors: Record<string, string> = {
  high: 'bg-priority-high',
  medium: 'bg-priority-medium',
  low: 'bg-priority-low',
}

export function TaskRow({ task, onToggle, onClick, sortable = false }: TaskRowProps) {
  const isDone = task.status === 'done'
  const overdue = !isDone && isOverdue(task.dueDate)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: !sortable })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
    position: 'relative' as const,
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-bg-secondary/50 transition-colors cursor-pointer"
      onClick={() => onClick(task)}
    >
      {sortable && (
        <button
          type="button"
          className="shrink-0 cursor-grab active:cursor-grabbing text-text-muted hover:text-text-secondary touch-none"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <DotsSixVertical size={16} />
        </button>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggle(task)
        }}
        aria-label={isDone ? 'Reabrir tarefa' : 'Marcar como concluída'}
        className="shrink-0 cursor-pointer"
      >
        {isDone ? (
          <CheckCircle size={20} weight="fill" className="text-status-done animate-check-pop" />
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

      {task.recurrence && task.recurrence !== 'none' && (
        <ArrowsClockwise size={14} className="text-text-muted shrink-0" />
      )}

      {(task.itemCount ?? 0) > 0 && (
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-16 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-status-done rounded-full transition-all duration-300"
              style={{ width: `${((task.itemDoneCount ?? 0) / task.itemCount!) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono text-text-muted">
            {task.itemDoneCount ?? 0}/{task.itemCount}
          </span>
        </div>
      )}

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

/** Lightweight clone rendered inside DragOverlay */
export function TaskRowOverlay({ task }: { task: Task }) {
  const isDone = task.status === 'done'
  const overdue = !isDone && isOverdue(task.dueDate)

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-bg-elevated border border-border rounded-lg shadow-lg">
      <DotsSixVertical size={16} className="text-text-muted shrink-0" />

      {isDone ? (
        <CheckCircle size={20} weight="fill" className="text-status-done shrink-0" />
      ) : (
        <Circle size={20} className="text-text-muted shrink-0" />
      )}

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
