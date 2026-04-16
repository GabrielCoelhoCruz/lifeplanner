import { Link } from '@tanstack/react-router'
import { CalendarBlank, MagnifyingGlass } from '@phosphor-icons/react'
import { TaskiLogo } from '@/components/taski-logo'
import { UserMenu } from '@/components/user-menu'

interface HeaderProps {
  onShowShortcuts?: () => void
}

export function Header({ onShowShortcuts }: HeaderProps) {
  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 md:px-16 bg-bg-elevated border-b border-border">
      <div className="flex items-center gap-6 justify-self-start">
        <Link
          to="/"
          className="flex items-center gap-2 group"
          aria-label="Taski — Dashboard"
        >
          <TaskiLogo size={22} strokeColor="var(--color-accent)" checkColor="var(--color-accent)" />
          <span
            className="text-xl font-semibold tracking-tight text-text-primary group-hover:text-accent transition-colors"
            style={{ letterSpacing: '-0.03em' }}
          >
            Taski
          </span>
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
      <button
        onClick={onShowShortcuts}
        className="hidden md:flex items-center gap-3 w-full max-w-xl px-4 py-2.5 text-sm text-text-muted hover:text-text-secondary bg-bg-secondary hover:bg-bg-secondary/80 rounded-lg border border-border transition-colors cursor-pointer justify-self-center"
        title="Command palette (⌘K)"
      >
        <MagnifyingGlass size={16} />
        <span className="text-sm">Buscar...</span>
        <kbd className="ml-auto px-2 py-0.5 text-[11px] font-mono bg-bg-elevated rounded border border-border">
          ⌘K
        </kbd>
      </button>
      <div className="flex items-center gap-2 justify-self-end">
        <Link
          to="/today"
          className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors"
          aria-label="Tarefas de hoje"
        >
          <CalendarBlank size={22} />
        </Link>
        <UserMenu />
      </div>
    </header>
  )
}
