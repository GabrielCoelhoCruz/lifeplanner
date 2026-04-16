import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CalendarBlank } from '@phosphor-icons/react'
import { useProjects } from '@/hooks/use-projects'
import { useTasks } from '@/hooks/use-tasks'
import { ProjectCard } from '@/components/project-card'
import { SearchBar } from '@/components/search-bar'
import { useDebounce } from '@/hooks/use-debounce'
import { Fab } from '@/components/fab'
import { CreateProjectDialog } from '@/components/create-project-dialog'
import type { Project } from '@/server/db/schema'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function ProjectCardWithCounts({ project }: { project: Project }) {
  const { data: tasks = [] } = useTasks(project.id)
  const pendingCount = tasks.filter((t) => t.status !== 'done').length
  const doneCount = tasks.filter((t) => t.status === 'done').length

  return (
    <ProjectCard
      project={project}
      pendingCount={pendingCount}
      doneCount={doneCount}
    />
  )
}

function DashboardPage() {
  const { data: projects, isLoading } = useProjects()
  const [search, setSearch] = React.useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [createOpen, setCreateOpen] = React.useState(false)

  const filtered = React.useMemo(() => {
    if (!projects) return []
    if (!debouncedSearch.trim()) return projects
    const q = debouncedSearch.toLowerCase()
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q)
    )
  }, [projects, debouncedSearch])

  return (
    <div className="px-5 py-7 md:px-16 md:py-12">
      <h1 className="text-4xl md:text-5xl font-normal text-text-primary tracking-tight">
        Meus Projetos
      </h1>
      <p className="mt-2 text-base text-text-secondary">
        Organize sua vida em um só lugar
      </p>

      <div className="mt-4">
        <Link
          to="/today"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          <CalendarBlank size={18} />
          Ver tarefas de hoje
        </Link>
      </div>

      <div className="mt-6">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar projetos..."
        />
      </div>

      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-36 bg-bg-secondary rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-text-muted">
            {search
              ? 'Nenhum projeto encontrado.'
              : 'Nenhum projeto ainda. Crie o primeiro!'}
          </p>
        </div>
      ) : (
        <div
          className="mt-8 grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
        >
          {filtered.map((project) => (
            <ProjectCardWithCounts key={project.id} project={project} />
          ))}
        </div>
      )}

      <Fab onClick={() => setCreateOpen(true)} />
      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
