import { Link } from '@tanstack/react-router'
import { MagnifyingGlass } from '@phosphor-icons/react'

export function Header() {
  return (
    <header className="flex items-center justify-between px-5 py-4 md:px-16 bg-bg-elevated border-b border-border">
      <Link to="/" className="text-2xl font-normal text-text-primary tracking-tight">
        LifePlanner
      </Link>
      <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-bg-secondary rounded-full">
        <MagnifyingGlass size={16} className="text-text-muted" />
        <span className="text-sm text-text-muted">Buscar tarefas...</span>
      </div>
    </header>
  )
}
