import * as React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '@/server/db/schema'
import type { TaskWithCounts } from '@/lib/api'
import { ArrowsClockwise } from '@phosphor-icons/react'
import { formatDatePt } from '@/lib/date'
import { cn } from '@/lib/utils'

type TaskMaybeWithCounts = Task & Partial<Pick<TaskWithCounts, 'itemCount' | 'itemDoneCount'>>

interface KanbanCardProps {
  task: TaskMaybeWithCounts
  onClick: (task: TaskMaybeWithCounts) => void
}

const priorityColors: Record<string, string> = {
  high: 'bg-priority-high',
  medium: 'bg-priority-medium',
  low: 'bg-priority-low',
}

export function KanbanCard({ task, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
  }

  return (
    <button
      ref={setNodeRef}
      style={style}
      type="button"
      onClick={() => onClick(task)}
      className="w-full text-left bg-bg-elevated rounded-md border border-border p-3 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing touch-none"
      {...attributes}
      {...listeners}
    >
      <p className="text-sm font-medium text-text-primary line-clamp-2">
        {task.title}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <span className={cn('w-2 h-2 rounded-full', priorityColors[task.priority])} />
        {task.recurrence && task.recurrence !== 'none' && (
          <ArrowsClockwise size={14} className="text-text-muted shrink-0" title="Tarefa recorrente" />
        )}
        {task.dueDate && (
          <span className="text-xs font-mono text-text-muted">
            {formatDatePt(task.dueDate)}
          </span>
        )}
      </div>
      {(task.itemCount ?? 0) > 0 && (
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex-1 h-1 bg-bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-status-done rounded-full"
              style={{ width: `${((task.itemDoneCount ?? 0) / task.itemCount!) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono text-text-muted">
            {task.itemDoneCount ?? 0}/{task.itemCount}
          </span>
        </div>
      )}
    </button>
  )
}

/** Lightweight clone rendered inside DragOverlay for kanban */
export function KanbanCardOverlay({ task }: { task: Task }) {
  return (
    <div className="w-[280px] text-left bg-bg-elevated rounded-md border border-border p-3 shadow-lg">
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
    </div>
  )
}
