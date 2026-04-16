import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { NewItem, Item } from '@/server/db/schema'

export const itemKeys = {
  byTask: (taskId: string) => ['items', 'task', taskId] as const,
}

export function useItems(taskId: string) {
  return useQuery({
    queryKey: itemKeys.byTask(taskId),
    queryFn: () => api.items.listByTask(taskId),
    enabled: !!taskId,
  })
}

export function useCreateItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<NewItem>) => api.items.create(data),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: itemKeys.byTask(result.taskId) })
    },
  })
}

export function useUpdateItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Item> }) => api.items.update(id, data),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: itemKeys.byTask(result.taskId) })
    },
  })
}

export function useDeleteItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string; taskId: string }) => api.items.delete(id),
    onSuccess: (_, { taskId }) => {
      qc.invalidateQueries({ queryKey: itemKeys.byTask(taskId) })
    },
  })
}
