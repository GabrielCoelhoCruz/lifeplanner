import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  House,
  CalendarBlank,
  Gear,
  FolderSimple,
  CheckSquare,
  Plus,
  MagnifyingGlass,
  Moon,
  Sun,
  Timer,
  Keyboard,
  ArrowRight,
} from '@phosphor-icons/react'
import { useProjects } from '@/hooks/use-projects'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface CommandItem {
  id: string
  icon: ReactNode
  label: string
  description?: string
  shortcut?: string[]
  section: 'navigation' | 'actions' | 'projects' | 'shortcuts'
  onSelect: () => void
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { data: projects } = useProjects()
  const { theme, toggleTheme } = useTheme()

  const close = useCallback(() => {
    onOpenChange(false)
    setQuery('')
    setSelectedIndex(0)
  }, [onOpenChange])

  // All available commands
  const allItems = useMemo<CommandItem[]>(() => {
    const nav: CommandItem[] = [
      {
        id: 'nav-home',
        icon: <House size={18} />,
        label: 'Ir para Dashboard',
        description: 'Página inicial com projetos',
        shortcut: ['G', 'H'],
        section: 'navigation',
        onSelect: () => { navigate({ to: '/' }); close() },
      },
      {
        id: 'nav-today',
        icon: <CalendarBlank size={18} />,
        label: 'Ir para Hoje',
        description: 'Tarefas de hoje e atrasadas',
        shortcut: ['G', 'T'],
        section: 'navigation',
        onSelect: () => { navigate({ to: '/today' }); close() },
      },
      {
        id: 'nav-settings',
        icon: <Gear size={18} />,
        label: 'Ir para Configurações',
        description: 'Tema, notificações, dados',
        shortcut: ['G', 'S'],
        section: 'navigation',
        onSelect: () => { navigate({ to: '/settings' }); close() },
      },
    ]

    const actions: CommandItem[] = [
      {
        id: 'action-new-project',
        icon: <Plus size={18} />,
        label: 'Novo projeto',
        shortcut: ['P'],
        section: 'actions',
        onSelect: () => { close(); /* will be handled by parent */ },
      },
      {
        id: 'action-toggle-theme',
        icon: theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />,
        label: theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro',
        section: 'actions',
        onSelect: () => { toggleTheme(); close() },
      },
      {
        id: 'action-search',
        icon: <MagnifyingGlass size={18} />,
        label: 'Focar na busca',
        shortcut: ['/'],
        section: 'actions',
        onSelect: () => {
          close()
          setTimeout(() => {
            (document.getElementById('search-input') as HTMLInputElement | null)?.focus()
          }, 100)
        },
      },
    ]

    const projectItems: CommandItem[] = (projects || []).map(p => ({
      id: `project-${p.id}`,
      icon: (
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: p.color || '#6366F1' }}
        />
      ),
      label: p.name,
      description: p.description || undefined,
      section: 'projects' as const,
      onSelect: () => {
        navigate({ to: '/projects/$projectId', params: { projectId: p.id } })
        close()
      },
    }))

    const shortcutItems: CommandItem[] = [
      { id: 'sc-new-task', icon: <Keyboard size={18} />, label: 'Nova tarefa', shortcut: ['N'], section: 'shortcuts', onSelect: close },
      { id: 'sc-palette', icon: <Keyboard size={18} />, label: 'Command palette', shortcut: ['⌘', 'K'], section: 'shortcuts', onSelect: close },
      { id: 'sc-help', icon: <Keyboard size={18} />, label: 'Ver atalhos', shortcut: ['?'], section: 'shortcuts', onSelect: close },
    ]

    return [...nav, ...actions, ...projectItems, ...shortcutItems]
  }, [navigate, close, projects, theme, toggleTheme])

  // Filter by query
  const filtered = useMemo(() => {
    if (!query.trim()) return allItems
    const q = query.toLowerCase()
    return allItems.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.section.includes(q)
    )
  }, [allItems, query])

  // Group by section
  const sections = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    for (const item of filtered) {
      if (!groups[item.section]) groups[item.section] = []
      groups[item.section].push(item)
    }
    return groups
  }, [filtered])

  const flatItems = useMemo(() => filtered, [filtered])

  // Reset selection when filter changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, flatItems.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          flatItems[selectedIndex]?.onSelect()
          break
        case 'Escape':
          e.preventDefault()
          close()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, flatItems, selectedIndex, close])

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  if (!open) return null

  const sectionLabels: Record<string, string> = {
    navigation: 'Navegação',
    actions: 'Ações',
    projects: 'Projetos',
    shortcuts: 'Atalhos',
  }

  let flatIndex = -1

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm animate-fade-in"
        onClick={close}
      />

      {/* Palette */}
      <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg animate-scale-in">
        <div className="bg-bg-elevated border border-border rounded-xl shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <MagnifyingGlass size={20} className="text-text-muted shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar comandos, projetos, ações..."
              className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-sm"
            />
            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono bg-bg-secondary text-text-muted rounded border border-border">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
            {flatItems.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-text-muted">
                Nenhum resultado para &ldquo;{query}&rdquo;
              </div>
            ) : (
              Object.entries(sections).map(([section, items]) => (
                <div key={section}>
                  <div className="px-4 pt-2 pb-1">
                    <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                      {sectionLabels[section] || section}
                    </span>
                  </div>
                  {items.map(item => {
                    flatIndex++
                    const idx = flatIndex
                    const isSelected = idx === selectedIndex

                    return (
                      <button
                        key={item.id}
                        data-index={idx}
                        type="button"
                        onClick={() => item.onSelect()}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer',
                          isSelected
                            ? 'bg-accent/10 text-accent'
                            : 'text-text-primary hover:bg-bg-secondary'
                        )}
                      >
                        <span className={cn('shrink-0', isSelected ? 'text-accent' : 'text-text-muted')}>
                          {item.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium truncate block">{item.label}</span>
                          {item.description && (
                            <span className="text-xs text-text-muted truncate block">{item.description}</span>
                          )}
                        </div>
                        {item.shortcut && (
                          <div className="flex items-center gap-0.5 shrink-0">
                            {item.shortcut.map((k, i) => (
                              <kbd
                                key={i}
                                className="px-1.5 py-0.5 text-[10px] font-mono bg-bg-secondary text-text-muted rounded border border-border"
                              >
                                {k}
                              </kbd>
                            ))}
                          </div>
                        )}
                        {isSelected && (
                          <ArrowRight size={14} className="text-accent shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-bg-secondary/50">
            <div className="flex items-center gap-3 text-[10px] text-text-muted">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 font-mono bg-bg-secondary rounded border border-border">↑</kbd>
                <kbd className="px-1 py-0.5 font-mono bg-bg-secondary rounded border border-border">↓</kbd>
                navegar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 font-mono bg-bg-secondary rounded border border-border">↵</kbd>
                selecionar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 font-mono bg-bg-secondary rounded border border-border">esc</kbd>
                fechar
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
