import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import type { Task } from '@/server/db/schema'
import { KanbanCard, KanbanCardOverlay } from './kanban-card'
import { QuickAddTask } from './quick-add-task'
import { taskKeys } from '@/hooks/use-tasks'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface KanbanBoardProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
  projectId: string
}

type ColumnKey = 'todo' | 'in_progress' | 'done'

const columns: { key: ColumnKey; label: string; color: string }[] = [
  { key: 'todo', label: 'A fazer', color: 'bg-status-todo' },
  { key: 'in_progress', label: 'Em progresso', color: 'bg-status-progress' },
  { key: 'done', label: 'Concluído', color: 'bg-status-done' },
]

function DroppableColumn({
  id,
  col,
  tasks,
  onTaskClick,
  projectId,
}: {
  id: string
  col: (typeof columns)[number]
  tasks: Task[]
  onTaskClick: (task: Task) => void
  projectId?: string
}) {
  const { setNodeRef, isOver } = useDroppable({ id })
  const taskIds = tasks.map((t) => t.id)

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-w-[280px] md:min-w-0 bg-bg-secondary rounded-md p-3 flex flex-col gap-2 transition-colors snap-start',
        isOver && 'ring-2 ring-accent/40'
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={cn('w-2.5 h-2.5 rounded-full', col.color)} />
        <span className="text-sm font-medium text-text-primary">{col.label}</span>
        <span className="text-xs font-mono text-text-muted ml-auto">
          {tasks.length}
        </span>
      </div>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 min-h-[40px]">
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </div>
      </SortableContext>
      {id === 'todo' && projectId && (
        <QuickAddTask projectId={projectId} />
      )}
    </div>
  )
}

export function KanbanBoard({ tasks, onTaskClick, projectId }: KanbanBoardProps) {
  const queryClient = useQueryClient()
  const [activeTask, setActiveTask] = React.useState<Task | null>(null)
  const [localTasks, setLocalTasks] = React.useState<Task[]>(tasks)

  // Keep local copy in sync with server data
  React.useEffect(() => {
    setLocalTasks(tasks)
  }, [tasks])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const tasksByColumn = React.useMemo(() => {
    const map: Record<ColumnKey, Task[]> = { todo: [], in_progress: [], done: [] }
    for (const t of localTasks) {
      const col = map[t.status as ColumnKey]
      if (col) col.push(t)
    }
    return map
  }, [localTasks])

  function findColumn(taskId: string): ColumnKey | undefined {
    for (const key of Object.keys(tasksByColumn) as ColumnKey[]) {
      if (tasksByColumn[key].some((t) => t.id === taskId)) return key
    }
    return undefined
  }

  function handleDragStart(event: DragStartEvent) {
    const dragged = localTasks.find((t) => t.id === event.active.id)
    setActiveTask(dragged ?? null)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeCol = findColumn(activeId)
    // Determine target column: if overId is a column key, use it; otherwise find the column of the task
    let overCol: ColumnKey | undefined
    if (['todo', 'in_progress', 'done'].includes(overId)) {
      overCol = overId as ColumnKey
    } else {
      overCol = findColumn(overId)
    }

    if (!activeCol || !overCol || activeCol === overCol) return

    // Move task to new column optimistically
    setLocalTasks((prev) =>
      prev.map((t) => (t.id === activeId ? { ...t, status: overCol as Task['status'] } : t))
    )
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeCol = findColumn(activeId)
    let overCol: ColumnKey | undefined
    if (['todo', 'in_progress', 'done'].includes(overId)) {
      overCol = overId as ColumnKey
    } else {
      overCol = findColumn(overId)
    }

    if (!activeCol || !overCol) return

    const colTasks = [...tasksByColumn[overCol]]

    if (activeCol === overCol) {
      // Reorder within same column
      const oldIndex = colTasks.findIndex((t) => t.id === activeId)
      const newIndex = colTasks.findIndex((t) => t.id === overId)
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return
      const reordered = arrayMove(colTasks, oldIndex, newIndex)
      const orderItems = reordered.map((t, i) => ({ id: t.id, position: i }))

      // Optimistic local update
      setLocalTasks((prev) => {
        const updated = [...prev]
        for (const item of orderItems) {
          const idx = updated.findIndex((t) => t.id === item.id)
          if (idx !== -1) updated[idx] = { ...updated[idx], position: item.position }
        }
        return updated
      })

      try {
        await api.tasks.reorder(orderItems)
        queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) })
      } catch {
        toast.error('Erro ao reordenar tarefas. Tente novamente.')
        queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) })
      }
    } else {
      // Moved to different column — status already changed in handleDragOver
      // Calculate new positions for the target column
      const targetTasks = colTasks
      const activeIndex = targetTasks.findIndex((t) => t.id === activeId)

      // If over a specific task, place before/after it
      let finalTasks: Task[]
      if (overId !== overCol && activeIndex !== -1) {
        const overIndex = targetTasks.findIndex((t) => t.id === overId)
        if (overIndex !== -1 && activeIndex !== overIndex) {
          finalTasks = arrayMove(targetTasks, activeIndex, overIndex)
        } else {
          finalTasks = targetTasks
        }
      } else {
        finalTasks = targetTasks
      }

      const orderItems = finalTasks.map((t, i) => ({
        id: t.id,
        position: i,
        status: overCol as string,
      }))

      // Optimistic local update
      setLocalTasks((prev) => {
        const updated = [...prev]
        for (const item of orderItems) {
          const idx = updated.findIndex((t) => t.id === item.id)
          if (idx !== -1) {
            updated[idx] = {
              ...updated[idx],
              position: item.position,
              status: item.status as Task['status'],
            }
          }
        }
        return updated
      })

      try {
        await api.tasks.reorder(orderItems)
        queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) })
      } catch {
        toast.error('Erro ao reordenar tarefas. Tente novamente.')
        queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) })
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:snap-none">
        {columns.map((col) => (
          <DroppableColumn
            key={col.key}
            id={col.key}
            col={col}
            tasks={tasksByColumn[col.key]}
            onTaskClick={onTaskClick}
            projectId={projectId}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeTask ? <KanbanCardOverlay task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
