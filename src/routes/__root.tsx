import { useState } from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/header'
import { ErrorBoundary } from '@/components/error-boundary'
import { ThemeProvider } from '@/lib/theme'
import { useNotificationChecker } from '@/hooks/use-notification-checker'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { ShortcutsHelp } from '@/components/shortcuts-help'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  useNotificationChecker()
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  useKeyboardShortcuts({
    onShowHelp: () => setShortcutsOpen(true),
    onFocusSearch: () => {
      const el = document.getElementById('search-input') as HTMLInputElement | null
      el?.focus()
    },
  })

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-bg-primary">
        <Header onShowShortcuts={() => setShortcutsOpen(true)} />
        <main>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Toaster position="bottom-right" richColors closeButton />
        <ShortcutsHelp open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      </div>
    </ThemeProvider>
  )
}
