import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="px-5 py-7 md:px-16 md:py-12">
      <h1 className="text-4xl md:text-5xl font-normal text-text-primary tracking-tight">
        Meus Projetos
      </h1>
      <p className="mt-2 text-base text-text-secondary">
        Organize sua vida em um só lugar
      </p>
    </div>
  )
}
