import * as React from 'react'
import { useActiveContexts } from '@/hooks/use-contexts'
import { cn } from '@/lib/utils'

interface ContextSelectProps {
  value: string | null
  onChange: (contextId: string | null) => void
  placeholder?: string
}

export function ContextSelect({
  value,
  onChange,
  placeholder = 'Selecionar contexto',
}: ContextSelectProps) {
  const { data: contexts = [], isLoading } = useActiveContexts()
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  const selected = contexts.find((c) => c.id === value)

  React.useEffect(() => {
    if (!value && contexts.length > 0) onChange(contexts[0].id)
  }, [contexts, onChange, value])

  // Close on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-2 w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm text-left transition-colors',
          'hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          !selected && 'text-text-muted',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected && (
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: selected.color }}
          />
        )}
        <span className="flex-1 truncate">
          {isLoading ? 'Carregando…' : selected?.name ?? placeholder}
        </span>
        <svg
          className={cn('w-4 h-4 text-text-muted transition-transform', open && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && contexts.length > 0 && (
        <div
          className="absolute z-20 mt-1 w-full rounded-md border border-border bg-bg-elevated shadow-lg max-h-60 overflow-y-auto"
          role="listbox"
        >
          {contexts.map((ctx) => (
            <button
              key={ctx.id}
              type="button"
              role="option"
              aria-selected={ctx.id === value}
              onClick={() => {
                onChange(ctx.id)
                setOpen(false)
              }}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-2.5 text-sm text-left transition-colors',
                'hover:bg-bg-secondary focus-visible:outline-none focus-visible:bg-bg-secondary',
                ctx.id === value && 'bg-bg-secondary font-medium',
              )}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: ctx.color }}
              />
              <span className="flex-1 truncate">{ctx.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
