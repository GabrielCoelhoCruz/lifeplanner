import type { Project } from '@/server/db/schema'
import { useNavigate } from '@tanstack/react-router'

interface ProjectCardProps {
  project: Project
  pendingCount: number
  doneCount: number
}

export function ProjectCard({ project, pendingCount, doneCount }: ProjectCardProps) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate({ to: '/projects/$projectId', params: { projectId: project.id } })}
      className="text-left w-full bg-bg-elevated border border-border rounded-lg overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div
        className="h-[3px] w-full"
        style={{ backgroundColor: project.color ?? '#6366F1' }}
      />
      <div className="p-5">
        <h3 className="text-xl font-normal text-text-primary truncate">
          {project.name}
        </h3>
        {project.description && (
          <p className="mt-1 text-sm text-text-secondary line-clamp-2">
            {project.description}
          </p>
        )}
        <div className="mt-4 flex items-center gap-4">
          <span className="text-xs font-mono text-text-muted">
            {pendingCount} pendentes
          </span>
          <span className="text-xs font-mono text-status-done">
            {doneCount} concluídas
          </span>
        </div>
      </div>
    </button>
  )
}
