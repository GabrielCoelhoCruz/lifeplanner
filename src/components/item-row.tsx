import { Square, CheckSquare } from '@phosphor-icons/react'
import type { Item } from '@/server/db/schema'
import { cn } from '@/lib/utils'

interface ItemRowProps {
  item: Item
  onToggle: (item: Item) => void
}

export function ItemRow({ item, onToggle }: ItemRowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 pl-10 pr-4 py-2 cursor-pointer',
        item.isCompleted && 'opacity-50'
      )}
      onClick={() => onToggle(item)}
    >
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
