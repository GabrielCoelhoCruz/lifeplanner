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
import { useCreateProject } from '@/hooks/use-projects'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PRESET_COLORS = [
  '#6366F1', '#0EA5E9', '#14B8A6', '#F59E0B',
  '#EC4899', '#8B5CF6', '#EF4444', '#84CC16',
]

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [color, setColor] = React.useState(PRESET_COLORS[0])
  const createProject = useCreateProject()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    createProject.mutate(
      { name: name.trim(), description, color },
      {
        onSuccess: () => {
          setName('')
          setDescription('')
          setColor(PRESET_COLORS[0])
          onOpenChange(false)
          toast.success('Projeto criado')
        },
        onError: () => {
          toast.error('Erro ao criar projeto. Tente novamente.')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
          <DialogDescription>Crie um novo projeto para organizar suas tarefas.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="project-name" className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Nome
            </label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Trabalho, Estudos..."
              className="mt-1"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="project-description" className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Descrição
            </label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opcional"
              rows={2}
              className="mt-1 flex w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Cor
            </label>
            <div className="mt-2 flex gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Cor ${c}`}
                  className={cn(
                    'w-10 h-10 rounded-full transition-all cursor-pointer',
                    color === c
                      ? 'ring-2 ring-offset-2 ring-accent scale-110'
                      : 'hover:scale-110'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Criar projeto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
