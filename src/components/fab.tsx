import { Plus } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { usePomodoro } from '@/lib/pomodoro'

interface FabProps {
  onClick: () => void
  className?: string
}

export function Fab({ onClick, className }: FabProps) {
  const { isRunning, isPaused } = usePomodoro()
  const pomodoroActive = isRunning || isPaused

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Criar novo"
      className={cn(
        'fixed right-5 md:right-8 z-40 transition-all duration-200',
        pomodoroActive ? 'bottom-20' : 'bottom-5 md:bottom-8',
        'w-14 h-14 rounded-full bg-accent text-white',
        'flex items-center justify-center',
        'shadow-lg hover:scale-110 hover:bg-accent-hover',
        'transition-all duration-200 cursor-pointer',
        'animate-scale-in',
        className
      )}
      style={{ animationDelay: '300ms' }}
    >
      <Plus size={24} weight="bold" />
    </button>
  )
}
