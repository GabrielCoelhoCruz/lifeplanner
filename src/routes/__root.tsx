import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/header'
import { ErrorBoundary } from '@/components/error-boundary'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <main>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  )
}
