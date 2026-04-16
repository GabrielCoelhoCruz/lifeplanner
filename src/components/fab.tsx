import { Plus } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface FabProps {
  onClick: () => void
  className?: string
}

export function Fab({ onClick, className }: FabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Criar novo"
      className={cn(
        'fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40',
        'w-14 h-14 rounded-full bg-accent text-white',
        'flex items-center justify-center',
        'shadow-lg hover:scale-110 hover:bg-accent-hover',
        'transition-all duration-200 cursor-pointer',
        className
      )}
    >
      <Plus size={24} weight="bold" />
    </button>
  )
}
