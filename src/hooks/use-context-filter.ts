import { useCallback } from 'react'
import type { NavigateOptions } from '@tanstack/react-router'

export const CONTEXT_FILTER_KEY = 'selectedContextId'

export interface ContextSearchParams {
  context?: string
}

export const validateContextSearch = (
  search: Record<string, unknown>,
): ContextSearchParams => ({
  context:
    typeof search.context === 'string' && search.context.length > 0
      ? search.context
      : undefined,
})

/**
 * URL-localStorage bridge for the context filter.
 *
 * - URL (`?context=id`) is the primary source of truth.
 * - On first render the hook falls back to localStorage when no URL param is
 *   present, giving an instant value on cross-route navigation.
 * - Writing a context updates both the URL and localStorage atomically.
 * - Reading the URL-sourced context persists it to localStorage **during
 *   render** (not in an effect) so that the value survives `page.goto()`
 *   full-navigation hydration where effects may not fire.
 */
export function useContextFilter(
  search: ContextSearchParams,
  navigate: (opts: NavigateOptions) => void,
) {
  // Synchronous URL → localStorage sync (render-phase side effect).
  // TanStack Start's SSR hydration does not reliably fire useEffect on
  // full `page.goto()` navigations, so we write during render instead.
  if (search.context && typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(CONTEXT_FILTER_KEY, search.context)
    } catch {
      // localStorage unavailable
    }
  }

  // Fall back to localStorage when no URL param is present
  const initialLs: string | null =
    search.context === undefined && typeof window !== 'undefined'
      ? (() => {
          try {
            return window.localStorage.getItem(CONTEXT_FILTER_KEY)
          } catch {
            return null
          }
        })()
      : null

  const selectedContextId: string | null = search.context ?? initialLs

  const setSelectedContextId: (id: string | null) => void = useCallback(
    (id: string | null) => {
      try {
        if (id) {
          window.localStorage.setItem(CONTEXT_FILTER_KEY, id)
        } else {
          window.localStorage.removeItem(CONTEXT_FILTER_KEY)
        }
      } catch {
        // localStorage unavailable
      }
      navigate({
        search: { context: id ?? undefined } as Record<string, unknown>,
        replace: true,
      })
    },
    [navigate],
  )

  return { selectedContextId, setSelectedContextId }
}
