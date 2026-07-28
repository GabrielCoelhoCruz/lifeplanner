import { useMemo, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { CalendarBlank } from '@phosphor-icons/react'
import { useProjects } from '@/hooks/use-projects'
import { useTasks } from '@/hooks/use-tasks'
import { useContexts } from '@/hooks/use-contexts'
import { useDebounce } from '@/hooks/use-debounce'
import {
  validateContextSearch,
  useContextFilter,
} from '@/hooks/use-context-filter'
import { ProjectCard } from '@/components/project-card'
import { SearchBar } from '@/components/search-bar'
import { Fab } from '@/components/fab'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { CreateProjectDialog } from '@/components/create-project-dialog'
import { EmptyState } from '@/components/empty-state'
import { IllustrationProjects, IllustrationSearch } from '@/components/illustrations'
import { Button } from '@/components/ui/button'
import type { ProjectWithContext } from '@/server/functions/projects'

export const Route = createFileRoute('/')({
  validateSearch: validateContextSearch,
  component: DashboardPage,
})

function ProjectCardWithCounts({ project }: { project: ProjectWithContext }) {
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

interface ContextInfo {
  id: string
  name: string
  color: string
}

function DashboardPage() {
  const { data: projects, isLoading } = useProjects()
  const { data: allContexts = [] } = useContexts()
  const [searchText, setSearchText] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const debouncedSearch = useDebounce(searchText, 300)

  const search = Route.useSearch()
  const navigate = useNavigate()
  const { selectedContextId, setSelectedContextId } =
    useContextFilter(search, navigate)

  useKeyboardShortcuts({
    onNewProject: () => setCreateOpen(true),
    onFocusSearch: () => document.getElementById('search-input')?.focus(),
  })

  // Build a lookup map and a list of contexts that are actually in use
  const contextMap = useMemo(() => {
    const map = new Map<string, ContextInfo>()
    for (const c of allContexts) map.set(c.id, { id: c.id, name: c.name, color: c.color })
    return map
  }, [allContexts])

  const usedContexts = useMemo(() => {
    const ids = new Set<string>()
    for (const p of projects ?? []) if (p.contextId) ids.add(p.contextId)
    return Array.from(ids)
      .map((id) => contextMap.get(id)!)
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [projects, contextMap])

  const filtered = useMemo(() => {
    if (!projects) return []
    const q = debouncedSearch.toLowerCase()
    return projects.filter(
      (p) =>
        (!selectedContextId || p.contextId === selectedContextId) &&
        (!q.trim() ||
          p.name.toLowerCase().includes(q) ||
          p.contextName.toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q)),
    )
  }, [projects, debouncedSearch, selectedContextId])

  const groupedProjects = useMemo(() => {
    const groups: { context: ContextInfo; projects: ProjectWithContext[] }[] = []
    for (const ctx of usedContexts) {
      const groupProjects = filtered.filter((p) => p.contextId === ctx.id)
      if (groupProjects.length > 0) {
        groups.push({ context: ctx, projects: groupProjects })
      }
    }
    // Projects with no contextId go into an "Other" group
    const noContext = filtered.filter((p) => !p.contextId)
    if (noContext.length > 0) {
      groups.push({
        context: { id: '', name: 'Outros', color: '#9CA3AF' },
        projects: noContext,
      })
    }
    return groups
  }, [usedContexts, filtered])

  return (
    <div className="max-w-7xl mx-auto px-5 py-7 pb-24 md:px-16 md:py-12 md:pb-32 animate-fade-in-up">
      <h1 className="text-4xl md:text-5xl font-normal text-text-primary tracking-tight">
        Meus Projetos
      </h1>
      <p className="mt-2 text-base text-text-secondary">
        Suas tarefas. Seu ritmo. Seu dia organizado.
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
          value={searchText}
          onChange={setSearchText}
          placeholder="Buscar projetos..."
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2" aria-label="Filtrar por empresa ou contexto">
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-36 bg-bg-secondary rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-8">
          {searchText ? (
            <EmptyState
              icon={<IllustrationSearch />}
              title="Nenhum resultado"
              description={`Nenhum projeto encontrado para "${searchText}".`}
            />
          ) : (
            <EmptyState
              icon={<IllustrationProjects />}
              title="Nenhum projeto ainda"
              description="Crie seu primeiro projeto para começar a organizar suas tarefas."
              action={
                <Button onClick={() => setCreateOpen(true)}>
                  Criar primeiro projeto
                </Button>
              }
            />
          )}
        </div>
      ) : (
        <div className="mt-8 space-y-8 animate-stagger">
          {groupedProjects.map((group) => (
            <section key={group.context.id || '_other'}>
              <h2 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-text-muted">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: group.context.color }}
                />
                {group.context.name} ({group.projects.length})
              </h2>
              <div
                className="mt-3 grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
              >
                {group.projects.map((project) => (
                  <ProjectCardWithCounts key={project.id} project={project} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <Fab onClick={() => setCreateOpen(true)} />
      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
