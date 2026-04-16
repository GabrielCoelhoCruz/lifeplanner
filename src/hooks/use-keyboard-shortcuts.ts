import { useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'

interface ShortcutHandlers {
  onNewTask?: () => void
  onNewProject?: () => void
  onFocusSearch?: () => void
  onShowHelp?: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers = {}) {
  const navigate = useNavigate()
  const pendingPrefix = useRef<string | null>(null)
  const prefixTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('[role="dialog"]') ||
        target.closest('[role="alertdialog"]')
      ) {
        return
      }

      const key = e.key.toLowerCase()

      // Handle "G then X" sequences
      if (pendingPrefix.current === 'g') {
        pendingPrefix.current = null
        if (prefixTimeout.current) clearTimeout(prefixTimeout.current)

        e.preventDefault()
        switch (key) {
          case 'h':
            navigate({ to: '/' })
            break
          case 't':
            navigate({ to: '/today' })
            break
          case 's':
            navigate({ to: '/settings' })
            break
        }
        return
      }

      // Single key shortcuts
      switch (key) {
        case 'g':
          e.preventDefault()
          pendingPrefix.current = 'g'
          prefixTimeout.current = setTimeout(() => {
            pendingPrefix.current = null
          }, 1000)
          break
        case 'n':
          e.preventDefault()
          if (handlersRef.current.onNewTask) {
            handlersRef.current.onNewTask()
          } else if (handlersRef.current.onNewProject) {
            handlersRef.current.onNewProject()
          }
          break
        case 'p':
          e.preventDefault()
          handlersRef.current.onNewProject?.()
          break
        case '/':
          e.preventDefault()
          handlersRef.current.onFocusSearch?.()
          break
        case '?':
          e.preventDefault()
          handlersRef.current.onShowHelp?.()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (prefixTimeout.current) clearTimeout(prefixTimeout.current)
    }
  }, [navigate])
}
