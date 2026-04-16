import * as React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
      className="w-full text-left bg-bg-elevated rounded-md border border-border p-3 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing touch-none"
      {...attributes}
      {...listeners}
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
