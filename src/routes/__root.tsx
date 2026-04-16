/// <reference types="vite/client" />
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react'
import { authClient } from '@/lib/auth-client'
import { Header } from '@/components/layout/header'
import { ErrorBoundary } from '@/components/error-boundary'
import { ThemeProvider } from '@/lib/theme'
import { PomodoroProvider } from '@/lib/pomodoro'
import { useNotificationChecker } from '@/hooks/use-notification-checker'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { CommandPalette } from '@/components/command-palette'
import { PomodoroBar } from '@/components/pomodoro-bar'
import appCss from '@/index.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Taski — Suas tarefas. Seu ritmo.' },
      { name: 'description', content: 'Suas tarefas. Seu ritmo. Seu dia organizado.' },
      { name: 'theme-color', content: '#FAFAF9' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/icons/icon.svg', type: 'image/svg+xml' },
      { rel: 'manifest', href: '/manifest.webmanifest' },
    ],
    scripts: [
      {
        children: `(function(){var t=localStorage.getItem('settings:theme');if(!t){t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)})();(function(){if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister()})}).catch(function(){});if(window.caches&&caches.keys){caches.keys().then(function(ks){ks.forEach(function(k){caches.delete(k)})}).catch(function(){})}}})()`,
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
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 } },
  }))

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <NeonAuthUIProvider authClient={authClient}>
            <ThemeProvider>
              <PomodoroProvider>
                <RootLayout>{children}</RootLayout>
                <PomodoroBar />
                <Toaster position="bottom-right" richColors closeButton />
              </PomodoroProvider>
            </ThemeProvider>
          </NeonAuthUIProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const navigate = useNavigate()
  const isFullBleedRoute = pathname === '/login'

  // Session guard: redirect unauthenticated users to /login
  const { data: session, isPending } = authClient.useSession()
  useEffect(() => {
    if (isPending) return
    if (!session && !isFullBleedRoute) {
      navigate({ to: '/login', replace: true })
    }
  }, [session, isPending, isFullBleedRoute, navigate])

  useNotificationChecker()
  useKeyboardShortcuts({
    onCommandPalette: () => setPaletteOpen(prev => !prev),
    onShowHelp: () => setPaletteOpen(true),
    onFocusSearch: () => {
      const el = document.getElementById('search-input') as HTMLInputElement | null
      el?.focus()
    },
  })

  if (isFullBleedRoute) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    )
  }

  // Show nothing while checking session or while redirecting
  if (isPending || !session) {
    return <div className="min-h-screen bg-bg-primary" />
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header onShowShortcuts={() => setPaletteOpen(true)} />
      <main>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  )
}
