import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useProject } from '@/hooks/use-projects'
import { useTasks, useUpdateTask } from '@/hooks/use-tasks'
import { TaskRow } from '@/components/task-row'
import { KanbanBoard } from '@/components/kanban-board'
import { ViewToggle } from '@/components/view-toggle'
import { SearchBar } from '@/components/search-bar'
import { Fab } from '@/components/fab'
import { CreateTaskDialog } from '@/components/create-task-dialog'
import { TaskDetailPanel } from '@/components/task-detail-panel'
import { CaretLeft } from '@phosphor-icons/react'
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
  const { data: project, isLoading: projectLoading } = useProject(projectId)
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(projectId)
  const updateTask = useUpdateTask()

  const [createOpen, setCreateOpen] = React.useState(false)
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const currentView: View = view ?? 'list'

  const filteredTasks = React.useMemo(() => {
    if (!search.trim()) return tasks
    const query = search.toLowerCase()
    return tasks.filter((t) => t.title.toLowerCase().includes(query))
  }, [tasks, search])

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
        <h1 className="text-3xl md:text-4xl font-normal text-text-primary tracking-tight truncate">
          {project.name}
        </h1>
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
          <div className="border border-border rounded-lg overflow-hidden bg-bg-elevated">
            {filteredTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onClick={handleTaskClick}
              />
            ))}
          </div>
        ) : (
          <KanbanBoard tasks={filteredTasks} onTaskClick={handleTaskClick} />
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
    </div>
  )
}
