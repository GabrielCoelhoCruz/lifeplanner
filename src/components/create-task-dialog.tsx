import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PriorityBadge } from './priority-badge'
import { useCreateTask } from '@/hooks/use-tasks'
import type { Task } from '@/server/db/schema'

interface CreateTaskDialogProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTaskDialog({ projectId, open, onOpenChange }: CreateTaskDialogProps) {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [priority, setPriority] = React.useState<Task['priority']>('medium')
  const [dueDate, setDueDate] = React.useState('')
  const createTask = useCreateTask()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    createTask.mutate(
      {
        projectId,
        title: title.trim(),
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate + 'T00:00:00') : undefined,
      },
      {
        onSuccess: () => {
          setTitle('')
          setDescription('')
          setPriority('medium')
          setDueDate('')
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
          <DialogDescription>Adicione uma nova tarefa ao projeto.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Título
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Finalizar relatório..."
              className="mt-1"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opcional"
              rows={2}
              className="mt-1 flex w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Prioridade
            </label>
            <div className="mt-1 flex gap-1">
              {(['high', 'medium', 'low'] as const).map((p) => (
                <PriorityBadge
                  key={p}
                  priority={p}
                  selected={priority === p}
                  onClick={() => setPriority(p)}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Data de entrega
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Criar tarefa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
