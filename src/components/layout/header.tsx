import { Link } from '@tanstack/react-router'
import { Gear } from '@phosphor-icons/react'

export function Header() {
  return (
    <header className="flex items-center justify-between px-5 py-4 md:px-16 bg-bg-elevated border-b border-border">
      <Link to="/" className="text-2xl font-normal text-text-primary tracking-tight">
        LifePlanner
      </Link>
      <Link
        to="/settings"
        className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors"
        aria-label="Configurações"
      >
        <Gear size={22} />
      </Link>
    </header>
  )
}
