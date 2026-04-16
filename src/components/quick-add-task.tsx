import { useState, useRef, useEffect } from 'react'
import { Plus } from '@phosphor-icons/react'
import { useCreateTask } from '@/hooks/use-tasks'
import { toast } from 'sonner'

interface QuickAddTaskProps {
  projectId: string
}

export function QuickAddTask({ projectId }: QuickAddTaskProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const createTask = useCreateTask()

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAdding])

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!title.trim()) return

    createTask.mutate(
      { projectId, title: title.trim() },
      {
        onSuccess: () => {
          setTitle('')
          inputRef.current?.focus()
        },
        onError: () => {
          toast.error('Erro ao criar tarefa')
        },
      }
    )
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setTitle('')
      setIsAdding(false)
    }
  }

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => setIsAdding(true)}
        className="flex items-center gap-2 w-full px-4 py-3 text-sm text-text-muted hover:text-text-secondary hover:bg-bg-secondary/50 transition-colors rounded-lg cursor-pointer"
      >
        <Plus size={18} />
        <span>Adicionar tarefa...</span>
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-2 border border-accent/30 rounded-lg bg-bg-elevated">
      <Plus size={18} className="text-accent shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (!title.trim()) setIsAdding(false)
        }}
        placeholder="Nome da tarefa... (Enter para criar, Esc para cancelar)"
        className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
      />
      {title.trim() && (
        <button
          type="submit"
          className="text-xs font-medium text-accent hover:text-accent-hover px-2 py-1 rounded transition-colors"
        >
          Criar
        </button>
      )}
    </form>
  )
}
