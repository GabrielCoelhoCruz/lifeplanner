import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  DragOverlay,
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
import { useTask, useUpdateTask } from '@/hooks/use-tasks'
import { useItems, useCreateItem, useUpdateItem, useDeleteItem, itemKeys } from '@/hooks/use-items'
import { toInputDate } from '@/lib/date'
import { api } from '@/lib/api'
import { Plus, Trash } from '@phosphor-icons/react'
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
  const updateTask = useUpdateTask()
  const createItem = useCreateItem()
  const updateItem = useUpdateItem()
  const deleteItem = useDeleteItem()

  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [priority, setPriority] = React.useState<Task['priority']>('medium')
  const [status, setStatus] = React.useState<Task['status']>('todo')
  const [dueDate, setDueDate] = React.useState('')
  const [newItemTitle, setNewItemTitle] = React.useState('')

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
    }
  }, [task])

  function handleSave() {
    if (!taskId) return
    updateTask.mutate({
      id: taskId,
      data: {
        title,
        description,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate + 'T00:00:00') : null,
      },
    })
    onOpenChange(false)
  }

  function handleAddItem() {
    if (!newItemTitle.trim() || !taskId) return
    createItem.mutate({ taskId, title: newItemTitle.trim() })
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
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Título
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Descrição
              </label>
              <textarea
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
                        onClick={() => deleteItem.mutate({ id: item.id, taskId: item.taskId })}
                        className="pr-3 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-priority-high cursor-pointer"
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

          <Button onClick={handleSave} className="w-full">
            Salvar alterações
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
