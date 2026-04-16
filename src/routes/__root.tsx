import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
