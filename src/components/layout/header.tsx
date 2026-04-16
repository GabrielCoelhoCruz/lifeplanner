import { Link } from '@tanstack/react-router'
import { Gear, CalendarBlank, Keyboard } from '@phosphor-icons/react'

interface HeaderProps {
  onShowShortcuts?: () => void
}

export function Header({ onShowShortcuts }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-4 md:px-16 bg-bg-elevated border-b border-border">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-2xl font-normal text-text-primary tracking-tight">
          LifePlanner
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <Link
            to="/today"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors [&.active]:text-accent"
          >
            Hoje
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onShowShortcuts}
          className="hidden md:flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors"
          title="Atalhos de teclado"
        >
          <Keyboard size={14} />
          <kbd className="px-1 py-0.5 text-[10px] font-mono bg-bg-secondary rounded border border-border">
            ?
          </kbd>
        </button>
        <Link
          to="/today"
          className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors"
          aria-label="Tarefas de hoje"
        >
          <CalendarBlank size={22} />
        </Link>
        <Link
          to="/settings"
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors"
          aria-label="Configurações"
        >
          <Gear size={22} />
        </Link>
      </div>
    </header>
  )
}
