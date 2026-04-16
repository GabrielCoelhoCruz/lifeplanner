import { createFileRoute, Link } from '@tanstack/react-router'
import { CalendarBlank, Warning, Clock } from '@phosphor-icons/react'
import { useTodayTasks, useUpcomingTasks } from '@/hooks/use-tasks'
import { formatDatePt, isOverdue } from '@/lib/date'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/empty-state'
import { IllustrationToday } from '@/components/illustrations'
import type { TaskWithProject } from '@/lib/api'

export const Route = createFileRoute('/today')({
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

function TodayTaskRow({ task, projectName, projectColor }: TaskWithProject) {
  const overdue = isOverdue(task.dueDate)

  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: task.projectId }}
      className="flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-bg-secondary/50 transition-colors"
    >
      {/* Project color dot */}
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: projectColor ?? '#6366F1' }}
      />

      {/* Project name */}
      <span className="text-xs text-text-muted shrink-0 font-mono w-24 truncate">
        {projectName ?? 'Sem projeto'}
      </span>

      {/* Task title */}
      <span className="flex-1 text-sm text-text-primary truncate">
        {task.title}
      </span>

      {/* Priority dot */}
      <span className={cn('w-2 h-2 rounded-full shrink-0', priorityColors[task.priority])} />

      {/* Due date */}
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
    </Link>
  )
}

function TodayPage() {
  const { data: todayData, isLoading: todayLoading } = useTodayTasks()
  const { data: upcomingData, isLoading: upcomingLoading } = useUpcomingTasks()

  const isLoading = todayLoading || upcomingLoading

  // Split today data into overdue vs actually today
  const now = new Date()
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)

  const overdueTasks = (todayData ?? []).filter(
    (item) => item.task.dueDate && new Date(item.task.dueDate) < startOfToday
  )
  const todayTasks = (todayData ?? []).filter(
    (item) => !item.task.dueDate || new Date(item.task.dueDate) >= startOfToday
  )
  const upcomingTasks = upcomingData ?? []

  const formattedDate = formatTodayDate()

  return (
    <div className="px-5 py-7 md:px-16 md:py-12 animate-fade-in-up">
      <h1 className="text-3xl md:text-4xl font-normal text-text-primary tracking-tight">
        Hoje
      </h1>
      <p className="mt-1 text-sm text-text-secondary font-mono">
        {formattedDate}
      </p>

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
          {/* Overdue section */}
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

          {/* Today section */}
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

          {/* Upcoming section */}
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
