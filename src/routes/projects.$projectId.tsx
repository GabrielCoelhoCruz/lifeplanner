import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { useProject } from '@/hooks/use-projects'
import { useTasks, useUpdateTask, taskKeys } from '@/hooks/use-tasks'
import { TaskRow, TaskRowOverlay } from '@/components/task-row'
import { KanbanBoard } from '@/components/kanban-board'
import { ViewToggle } from '@/components/view-toggle'
import { SearchBar } from '@/components/search-bar'
import { Fab } from '@/components/fab'
import { CreateTaskDialog } from '@/components/create-task-dialog'
import { TaskDetailPanel } from '@/components/task-detail-panel'
import { EditProjectDialog } from '@/components/edit-project-dialog'
import { DeleteProjectDialog } from '@/components/delete-project-dialog'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { CaretLeft, DotsThree, PencilSimple, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Task } from '@/server/db/schema'

type View = 'list' | 'kanban'

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectDetailPage,
  validateSearch: (search: Record<string, unknown>): { view?: View } => ({
    view: search.view === 'kanban' ? 'kanban' : undefined,
  }),
})

function ProjectDetailPage() {
  const { projectId } = Route.useParams()
  const { view } = Route.useSearch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: project, isLoading: projectLoading } = useProject(projectId)
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(projectId)
  const updateTask = useUpdateTask()

  const [createOpen, setCreateOpen] = React.useState(false)
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [activeTask, setActiveTask] = React.useState<Task | null>(null)
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const currentView: View = view ?? 'list'

  const filteredTasks = React.useMemo(() => {
    if (!search.trim()) return tasks
    const query = search.toLowerCase()
    return tasks.filter((t) => t.title.toLowerCase().includes(query))
  }, [tasks, search])

  const taskIds = React.useMemo(() => filteredTasks.map((t) => t.id), [filteredTasks])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function setView(v: View) {
    navigate({
      to: '/projects/$projectId',
      params: { projectId },
      search: v === 'list' ? {} : { view: v },
      replace: true,
    })
  }

  function handleToggle(task: Task) {
    updateTask.mutate({
      id: task.id,
      data: { status: task.status === 'done' ? 'todo' : 'done' },
    })
  }

  function handleTaskClick(task: Task) {
    setSelectedTaskId(task.id)
    setDetailOpen(true)
  }

  function handleDragStart(event: DragStartEvent) {
    const dragged = filteredTasks.find((t) => t.id === event.active.id)
    setActiveTask(dragged ?? null)
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = filteredTasks.findIndex((t) => t.id === active.id)
    const newIndex = filteredTasks.findIndex((t) => t.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(filteredTasks, oldIndex, newIndex)

    // Optimistic update
    queryClient.setQueryData(taskKeys.byProject(projectId), (old: Task[] | undefined) => {
      if (!old) return old
      const reorderedIds = reordered.map((t) => t.id)
      const updated = old.map((t) => {
        const idx = reorderedIds.indexOf(t.id)
        if (idx !== -1) return { ...t, position: idx }
        return t
      })
      updated.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      return updated
    })

    const orderItems = reordered.map((t, i) => ({ id: t.id, position: i }))
    try {
      await api.tasks.reorder(orderItems)
    } catch {
      toast.error('Erro ao reordenar tarefas. Tente novamente.')
      queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) })
    }
  }

  if (projectLoading) {
    return (
      <div className="px-5 py-7 md:px-16 md:py-12">
        <div className="h-4 w-28 bg-bg-secondary rounded animate-pulse" />
        <div className="mt-6 h-8 w-48 bg-bg-secondary rounded animate-pulse" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-bg-secondary rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="px-5 py-7 md:px-16 md:py-12 text-center">
        <p className="text-text-muted">Projeto não encontrado.</p>
        <Link to="/" className="text-accent text-sm mt-2 inline-block">
          Voltar
        </Link>
      </div>
    )
  }

  return (
    <div className="px-5 py-7 md:px-16 md:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        <CaretLeft size={14} />
        Meus Projetos
      </Link>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-3xl md:text-4xl font-normal text-text-primary tracking-tight truncate">
            {project.name}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors flex-shrink-0"
              aria-label="Opções do projeto"
            >
              <DotsThree size={22} weight="bold" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <PencilSimple size={16} />
                Editar projeto
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-priority-high"
              >
                <Trash size={16} />
                Excluir projeto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ViewToggle value={currentView} onChange={setView} />
      </div>

      {project.description && (
        <p className="mt-2 text-sm text-text-secondary">
          {project.description}
        </p>
      )}

      {tasks.length > 0 && (
        <div className="mt-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar tarefas..."
          />
        </div>
      )}

      <div className="mt-6">
        {tasksLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-bg-secondary rounded animate-pulse" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-text-muted">
              Nenhuma tarefa ainda. Crie a primeira!
            </p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-text-muted">
              Nenhuma tarefa encontrada.
            </p>
          </div>
        ) : currentView === 'list' ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
              <div className="border border-border rounded-lg overflow-hidden bg-bg-elevated">
                {filteredTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={handleToggle}
                    onClick={handleTaskClick}
                    sortable
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay dropAnimation={null}>
              {activeTask ? <TaskRowOverlay task={activeTask} /> : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <KanbanBoard
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            projectId={projectId}
          />
        )}
      </div>

      <Fab onClick={() => setCreateOpen(true)} />
      <CreateTaskDialog
        projectId={projectId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
      <TaskDetailPanel
        taskId={selectedTaskId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
      <EditProjectDialog
        project={project}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteProjectDialog
        projectId={project.id}
        projectName={project.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  )
}
