import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-bg-secondary text-text-muted mb-6">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-text-primary text-center">{title}</h3>
      <p className="mt-2 text-sm text-text-muted text-center max-w-xs">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
