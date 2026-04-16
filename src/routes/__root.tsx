/// <reference types="vite/client" />
import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/header'
import { ErrorBoundary } from '@/components/error-boundary'
import { ThemeProvider } from '@/lib/theme'
import { PomodoroProvider } from '@/lib/pomodoro'
import { useNotificationChecker } from '@/hooks/use-notification-checker'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { ShortcutsHelp } from '@/components/shortcuts-help'
import { PomodoroBar } from '@/components/pomodoro-bar'
import appCss from '@/index.css?url'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 },
  },
})

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'LifePlanner' },
      { name: 'description', content: 'Organize sua vida em um só lugar' },
      { name: 'theme-color', content: '#FAFAF9' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/icons/icon.svg', type: 'image/svg+xml' },
      { rel: 'manifest', href: '/manifest.webmanifest' },
    ],
    scripts: [
      {
        children: `(function(){var t=localStorage.getItem('settings:theme');if(!t){t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)})()`,
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <PomodoroProvider>
              <RootLayout>{children}</RootLayout>
              <PomodoroBar />
              <Toaster position="bottom-right" richColors closeButton />
            </PomodoroProvider>
          </ThemeProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout({ children }: { children: ReactNode }) {
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  useNotificationChecker()
  useKeyboardShortcuts({
    onShowHelp: () => setShortcutsOpen(true),
    onFocusSearch: () => {
      const el = document.getElementById('search-input') as HTMLInputElement | null
      el?.focus()
    },
  })

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header onShowShortcuts={() => setShortcutsOpen(true)} />
      <main>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <ShortcutsHelp open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
  )
}
