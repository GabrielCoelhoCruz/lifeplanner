import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="px-5 py-7 md:px-16 md:py-12">
      <Link to="/" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
        ← Meus Projetos
      </Link>
      <h1 className="mt-6 text-3xl md:text-4xl font-normal text-text-primary tracking-tight">
        Configurações
      </h1>
    </div>
  )
}
