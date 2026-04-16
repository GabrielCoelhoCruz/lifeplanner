import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useDeleteProject } from '@/hooks/use-projects'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

interface DeleteProjectDialogProps {
  projectId: string
  projectName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteProjectDialog({ projectId, projectName, open, onOpenChange }: DeleteProjectDialogProps) {
  const deleteProject = useDeleteProject()
  const navigate = useNavigate()

  function handleDelete() {
    deleteProject.mutate(projectId, {
      onSuccess: () => {
        onOpenChange(false)
        navigate({ to: '/' })
      },
      onError: () => {
        toast.error('Erro ao excluir projeto')
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir projeto</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir <strong>{projectName}</strong>? Todas as tarefas serão excluídas. Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteProject.isPending}
          >
            {deleteProject.isPending ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
