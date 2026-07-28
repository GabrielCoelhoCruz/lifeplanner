import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { CalendarBlank, Warning, Clock, Circle, CheckCircle } from '@phosphor-icons/react'
import { useTodayTasks, useUpcomingTasks, useUpdateTask } from '@/hooks/use-tasks'
import { useContexts } from '@/hooks/use-contexts'
import {
  validateContextSearch,
  useContextFilter,
} from '@/hooks/use-context-filter'
import { formatDatePt, isOverdue } from '@/lib/date'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/empty-state'
import { IllustrationToday } from '@/components/illustrations'
import { Button } from '@/components/ui/button'
import type { TaskWithProject } from '@/lib/api'
import { toast } from 'sonner'

export const Route = createFileRoute('/today')({
  validateSearch: validateContextSearch,
  component: TodayPage,
})

const WEEKDAYS_PT = [
  'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira',
  'quinta-feira', 'sexta-feira', 'sábado',
]

const MONTHS_FULL_PT = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

function formatTodayDate(): string {
  const now = new Date()
  const weekday = WEEKDAYS_PT[now.getDay()]
  const day = now.getDate()
  const month = MONTHS_FULL_PT[now.getMonth()]
  return `${weekday}, ${day} de ${month}`
}

const priorityColors: Record<string, string> = {
  high: 'bg-priority-high',
  medium: 'bg-priority-medium',
  low: 'bg-priority-low',
}

function TodayTaskRow({ task, projectName, projectColor, projectContext }: TaskWithProject) {
  const overdue = isOverdue(task.dueDate)
  const updateTask = useUpdateTask()

  function completeTask() {
    updateTask.mutate(
      { id: task.id, data: { status: 'done' } },
      {
        onSuccess: () => toast.success('Tarefa concluída'),
        onError: () => toast.error('Não foi possível concluir a tarefa'),
      },
    )
  }

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-bg-secondary/50 transition-colors"
    >
      <button
        type="button"
        onClick={completeTask}
        disabled={updateTask.isPending}
        className="rounded-full text-text-muted hover:text-status-done focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
        aria-label={`Concluir ${task.title}`}
      >
        {updateTask.isPending ? (
          <CheckCircle size={20} className="animate-pulse" />
        ) : (
          <Circle size={20} />
        )}
      </button>

      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: projectColor ?? '#6366F1' }}
      />

      <Link
        to="/projects/$projectId"
        params={{ projectId: task.projectId }}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span className="text-xs text-text-muted shrink-0 font-mono w-24 truncate">
          {projectName ?? 'Sem projeto'}
        </span>
        <span className="hidden sm:inline-flex max-w-28 shrink-0 truncate rounded-full bg-bg-secondary px-2 py-1 text-[11px] text-text-muted">
          {projectContext}
        </span>
        <span className="flex-1 text-sm text-text-primary truncate">
          {task.title}
        </span>
        <span className={cn('w-2 h-2 rounded-full shrink-0', priorityColors[task.priority])} />
        {task.dueDate && (
          <span
            className={cn(
              'text-xs font-mono shrink-0',
              overdue ? 'text-priority-high' : 'text-text-muted',
            )}
          >
            {formatDatePt(task.dueDate)}
          </span>
        )}
      </Link>
    </div>
  )
}

interface ContextInfo {
  id: string
  name: string
  color: string
}

function TodayPage() {
  const { data: todayData, isLoading: todayLoading } = useTodayTasks()
  const { data: upcomingData, isLoading: upcomingLoading } = useUpcomingTasks()
  const { data: allContexts = [] } = useContexts()

  const search = Route.useSearch()
  const navigate = useNavigate()
  const { selectedContextId, setSelectedContextId } =
    useContextFilter(search, navigate)

  const isLoading = todayLoading || upcomingLoading

  const now = new Date()
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)

  // Build context lookup map
  const contextMap = React.useMemo(() => {
    const map = new Map<string, ContextInfo>()
    for (const c of allContexts) map.set(c.id, { id: c.id, name: c.name, color: c.color })
    return map
  }, [allContexts])

  const allTasks = [...(todayData ?? []), ...(upcomingData ?? [])]
  const usedContextIds = new Set<string>()
  for (const item of allTasks) if (item.projectContextId) usedContextIds.add(item.projectContextId)
  const usedContexts = Array.from(usedContextIds)
    .map((id) => contextMap.get(id)!)
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name))

  const matchesContext = (item: TaskWithProject) =>
    !selectedContextId || item.projectContextId === selectedContextId

  const overdueTasks = (todayData ?? []).filter(
    (item) => item.task.dueDate && new Date(item.task.dueDate) < startOfToday,
  ).filter(matchesContext)
  const todayTasks = (todayData ?? []).filter(
    (item) => !item.task.dueDate || new Date(item.task.dueDate) >= startOfToday,
  ).filter(matchesContext)
  const upcomingTasks = (upcomingData ?? []).filter(matchesContext)

  const formattedDate = formatTodayDate()

  return (
    <div className="max-w-7xl mx-auto px-5 py-7 pb-24 md:px-16 md:py-12 md:pb-32 animate-fade-in-up">
      <h1 className="text-3xl md:text-4xl font-normal text-text-primary tracking-tight">
        Hoje
      </h1>
      <p className="mt-1 text-sm text-text-secondary font-mono">
        {formattedDate}
      </p>
      <div className="mt-5 flex flex-wrap gap-2" aria-label="Filtrar por empresa ou contexto">
        <Button
          type="button"
          variant={selectedContextId === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedContextId(null)}
        >
          Todos
        </Button>
        {usedContexts.map((ctx) => (
          <Button
            key={ctx.id}
            type="button"
            variant={selectedContextId === ctx.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedContextId(ctx.id)}
            className="flex items-center gap-1.5"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: ctx.color }}
            />
            {ctx.name}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-bg-secondary rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          {overdueTasks.length > 0 && (
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-sm font-medium text-priority-high uppercase tracking-wider">
                <Warning size={16} /> Atrasadas ({overdueTasks.length})
              </h2>
              <div className="mt-3 space-y-0">
                {overdueTasks.map((item) => (
                  <TodayTaskRow key={item.task.id} {...item} />
                ))}
              </div>
            </section>
          )}

          <section className="mt-8">
            <h2 className="flex items-center gap-2 text-sm font-medium text-text-muted uppercase tracking-wider">
              <CalendarBlank size={16} /> Hoje ({todayTasks.length})
            </h2>
            {todayTasks.length === 0 ? (
              <EmptyState
                icon={<IllustrationToday />}
                title="Nada para hoje"
                description="Nenhuma tarefa pendente. Aproveite o dia!"
              />
            ) : (
              <div className="mt-3 space-y-0">
                {todayTasks.map((item) => (
                  <TodayTaskRow key={item.task.id} {...item} />
                ))}
              </div>
            )}
          </section>

          {upcomingTasks.length > 0 && (
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-sm font-medium text-text-muted uppercase tracking-wider">
                <Clock size={16} /> Próximos 7 dias ({upcomingTasks.length})
              </h2>
              <div className="mt-3 space-y-0">
                {upcomingTasks.map((item) => (
                  <TodayTaskRow key={item.task.id} {...item} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
