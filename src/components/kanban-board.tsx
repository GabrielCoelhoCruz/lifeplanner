import type { Task } from '@/server/db/schema'
import { KanbanCard } from './kanban-card'
import { cn } from '@/lib/utils'

interface KanbanBoardProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

const columns = [
  { key: 'todo' as const, label: 'A fazer', color: 'bg-status-todo' },
  { key: 'in_progress' as const, label: 'Em progresso', color: 'bg-status-progress' },
  { key: 'done' as const, label: 'Concluído', color: 'bg-status-done' },
]

export function KanbanBoard({ tasks, onTaskClick }: KanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key)
        return (
          <div
            key={col.key}
            className="min-w-[280px] md:min-w-0 bg-bg-secondary rounded-md p-3 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={cn('w-2.5 h-2.5 rounded-full', col.color)} />
              <span className="text-sm font-medium text-text-primary">{col.label}</span>
              <span className="text-xs font-mono text-text-muted ml-auto">
                {colTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {colTasks.map((task) => (
                <KanbanCard key={task.id} task={task} onClick={onTaskClick} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
