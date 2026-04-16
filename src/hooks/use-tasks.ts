import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { TaskWithCounts } from '@/lib/api'
import type { NewTask, Task } from '@/server/db/schema'

export const taskKeys = {
  byProject: (projectId: string) => ['tasks', 'project', projectId] as const,
  detail: (id: string) => ['tasks', id] as const,
}

export const viewKeys = {
  today: ['views', 'today'] as const,
  upcoming: ['views', 'upcoming'] as const,
}

export function useTodayTasks() {
  return useQuery({
    queryKey: viewKeys.today,
    queryFn: api.views.today,
  })
}

export function useUpcomingTasks() {
  return useQuery({
    queryKey: viewKeys.upcoming,
    queryFn: api.views.upcoming,
  })
}

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: taskKeys.byProject(projectId),
    queryFn: () => api.tasks.listByProject(projectId),
  })
}

export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => api.tasks.get(id),
    enabled: !!id,
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<NewTask>) => api.tasks.create(data),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: taskKeys.byProject(result.projectId) })
    },
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) => api.tasks.update(id, data),
    onSuccess: (result, { id }) => {
      qc.invalidateQueries({ queryKey: taskKeys.byProject(result.projectId) })
      qc.invalidateQueries({ queryKey: taskKeys.detail(id) })
    },
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, projectId }: { id: string; projectId: string }) => api.tasks.delete(id),
    onSuccess: (_, { projectId }) => {
      qc.invalidateQueries({ queryKey: taskKeys.byProject(projectId) })
    },
  })
}
