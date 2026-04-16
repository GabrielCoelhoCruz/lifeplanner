import { ListBullets, Kanban } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

type View = 'list' | 'kanban'

interface ViewToggleProps {
  value: View
  onChange: (view: View) => void
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-bg-secondary rounded-full p-1">
      <button
        type="button"
        onClick={() => onChange('list')}
        aria-label="Visualização em lista"
        className={cn(
          'flex items-center justify-center w-11 h-11 rounded-full transition-all cursor-pointer',
          value === 'list'
            ? 'bg-bg-elevated shadow-sm text-text-primary'
            : 'text-text-muted hover:text-text-secondary'
        )}
      >
        <ListBullets size={18} />
      </button>
      <button
        type="button"
        onClick={() => onChange('kanban')}
        aria-label="Visualização em kanban"
        className={cn(
          'flex items-center justify-center w-11 h-11 rounded-full transition-all cursor-pointer',
          value === 'kanban'
            ? 'bg-bg-elevated shadow-sm text-text-primary'
            : 'text-text-muted hover:text-text-secondary'
        )}
      >
        <Kanban size={18} />
      </button>
    </div>
  )
}
