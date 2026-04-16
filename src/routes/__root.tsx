import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/header'
import { ErrorBoundary } from '@/components/error-boundary'
import { ThemeProvider } from '@/lib/theme'
import { useNotificationChecker } from '@/hooks/use-notification-checker'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  useNotificationChecker()

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-bg-primary">
        <Header />
        <main>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Toaster position="bottom-right" richColors closeButton />
      </div>
    </ThemeProvider>
  )
}
