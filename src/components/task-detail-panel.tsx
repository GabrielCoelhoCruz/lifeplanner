import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PriorityBadge } from './priority-badge'
import { StatusBadge } from './status-badge'
import { ItemRow } from './item-row'
import { useTask, useUpdateTask, useDeleteTask } from '@/hooks/use-tasks'
import { useItems, useCreateItem, useUpdateItem, useDeleteItem, itemKeys } from '@/hooks/use-items'
import { toInputDate } from '@/lib/date'
import { api } from '@/lib/api'
import { Plus, Trash, ArrowsClockwise, Timer } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { usePomodoro } from '@/lib/pomodoro'
import type { Task } from '@/server/db/schema'

interface TaskDetailPanelProps {
  taskId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailPanel({ taskId, open, onOpenChange }: TaskDetailPanelProps) {
  const queryClient = useQueryClient()
  const { data: task } = useTask(taskId ?? '')
  const { data: items = [] } = useItems(taskId ?? '')
  const { start: startPomodoro, isRunning: pomodoroRunning } = usePomodoro()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const createItem = useCreateItem()
  const updateItem = useUpdateItem()
  const deleteItem = useDeleteItem()

  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [priority, setPriority] = React.useState<Task['priority']>('medium')
  const [status, setStatus] = React.useState<Task['status']>('todo')
  const [dueDate, setDueDate] = React.useState('')
  const [recurrence, setRecurrence] = React.useState<string>('none')
  const [newItemTitle, setNewItemTitle] = React.useState('')

  const recurrenceOptions = [
    { value: 'none', label: 'Sem repetição' },
    { value: 'daily', label: 'Diariamente' },
    { value: 'weekdays', label: 'Dias úteis (Seg-Sex)' },
    { value: 'weekly', label: 'Semanalmente' },
    { value: 'monthly', label: 'Mensalmente' },
  ]

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const itemIds = React.useMemo(() => items.map((i) => i.id), [items])

  React.useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description ?? '')
      setPriority(task.priority)
      setStatus(task.status)
      setDueDate(toInputDate(task.dueDate))
      setRecurrence(task.recurrence || 'none')
    }
  }, [task])

  function handleSave() {
    if (!taskId) return
    updateTask.mutate(
      {
        id: taskId,
        data: {
          title,
          description,
          priority,
          status,
          dueDate: dueDate ? new Date(dueDate + 'T00:00:00') : null,
          recurrence: recurrence as Task['recurrence'],
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          toast.success('Tarefa salva')
        },
        onError: () => {
          toast.error('Erro ao salvar tarefa. Tente novamente.')
        },
      }
    )
  }

  function handleDeleteTask() {
    if (!taskId || !task) return
    const confirmed = window.confirm('Tem certeza? Esta ação não pode ser desfeita.')
    if (!confirmed) return
    deleteTask.mutate(
      { id: taskId, projectId: task.projectId },
      {
        onSuccess: () => {
          onOpenChange(false)
          toast.success('Tarefa excluída')
        },
        onError: () => {
          toast.error('Erro ao excluir tarefa. Tente novamente.')
        },
      }
    )
  }

  function handleAddItem() {
    if (!newItemTitle.trim() || !taskId) return
    createItem.mutate(
      { taskId, title: newItemTitle.trim() },
      {
        onSuccess: () => {
          toast.success('Item adicionado')
        },
        onError: () => {
          toast.error('Erro ao adicionar item. Tente novamente.')
        },
      }
    )
    setNewItemTitle('')
  }

  async function handleItemDragEnd(event: DragEndEvent) {
    if (!taskId) return
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(items, oldIndex, newIndex)

    // Optimistic update
    queryClient.setQueryData(itemKeys.byTask(taskId), reordered.map((item, i) => ({ ...item, position: i })))

    const orderItems = reordered.map((item, i) => ({ id: item.id, position: i }))
    try {
      await api.items.reorder(orderItems)
    } catch {
      toast.error('Erro ao reordenar itens. Tente novamente.')
      queryClient.invalidateQueries({ queryKey: itemKeys.byTask(taskId) })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto p-0">
        <div className="p-6 pt-10 flex flex-col gap-6">
          <SheetHeader>
            <SheetTitle className="sr-only">Detalhes da tarefa</SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="detail-title" className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Título
              </label>
              <Input
                id="detail-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="detail-description" className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Descrição
              </label>
              <textarea
                id="detail-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
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
                Status
              </label>
              <div className="mt-1 flex gap-1">
                {(['todo', 'in_progress', 'done'] as const).map((s) => (
                  <StatusBadge
                    key={s}
                    status={s}
                    selected={status === s}
                    onClick={() => setStatus(s)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="detail-due-date" className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Data de entrega
              </label>
              <Input
                id="detail-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider flex items-center gap-1">
                <ArrowsClockwise size={14} />
                Repetição
              </label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {recurrenceOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Checklist
            </label>
            <div className="mt-2 border border-border rounded-md overflow-hidden">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleItemDragEnd}
              >
                <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center group">
                      <div className="flex-1">
                        <ItemRow
                          item={item}
                          onToggle={() =>
                            updateItem.mutate({
                              id: item.id,
                              data: { isCompleted: !item.isCompleted },
                            })
                          }
                          sortable
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          deleteItem.mutate(
                            { id: item.id, taskId: item.taskId },
                            {
                              onSuccess: () => {
                                toast.success('Item removido')
                              },
                              onError: () => {
                                toast.error('Erro ao remover item. Tente novamente.')
                              },
                            }
                          )
                        }
                        aria-label="Remover item"
                        className="pr-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-text-muted hover:text-priority-high cursor-pointer"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                </SortableContext>
              </DndContext>
              <div className="flex items-center gap-2 px-4 py-2 border-t border-border">
                <Plus size={14} className="text-text-muted shrink-0" />
                <input
                  type="text"
                  placeholder="Adicionar item..."
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleDeleteTask}
              className="flex items-center gap-2 text-sm text-priority-high hover:text-red-700 transition-colors"
            >
              <Trash size={16} />
              Excluir tarefa
            </button>
            <div className="flex items-center gap-3">
              {task && (
                <button
                  type="button"
                  onClick={() => startPomodoro({ id: task.id, title: task.title, projectId: task.projectId })}
                  disabled={pomodoroRunning}
                  className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors disabled:opacity-40"
                >
                  <Timer size={16} />
                  {pomodoroRunning ? 'Foco ativo' : 'Iniciar foco'}
                </button>
              )}
              <Button onClick={handleSave} disabled={!title.trim()}>
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
