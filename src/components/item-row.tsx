import * as React from 'react'
import { Square, CheckSquare, DotsSixVertical } from '@phosphor-icons/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Item } from '@/server/db/schema'
import { cn } from '@/lib/utils'

interface ItemRowProps {
  item: Item
  onToggle: (item: Item) => void
  sortable?: boolean
}

export function ItemRow({ item, onToggle, sortable = false }: ItemRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: !sortable })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
    position: 'relative' as const,
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 pr-4 py-2 cursor-pointer',
        sortable ? 'pl-2' : 'pl-10',
        item.isCompleted && 'opacity-50'
      )}
      onClick={() => onToggle(item)}
    >
      {sortable && (
        <button
          type="button"
          className="shrink-0 cursor-grab active:cursor-grabbing text-text-muted hover:text-text-secondary touch-none px-1"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <DotsSixVertical size={14} />
        </button>
      )}

      {item.isCompleted ? (
        <CheckSquare size={16} weight="fill" className="text-status-done shrink-0" />
      ) : (
        <Square size={16} className="text-text-muted shrink-0" />
      )}
      <span
        className={cn(
          'text-sm',
          item.isCompleted && 'line-through text-text-muted'
        )}
      >
        {item.title}
      </span>
    </div>
  )
}
