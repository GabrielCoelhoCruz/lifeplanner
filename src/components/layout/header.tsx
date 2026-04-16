import { Link } from '@tanstack/react-router'
import { Gear, CalendarBlank } from '@phosphor-icons/react'

export function Header() {
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
