import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Context, NewContext } from '@/server/db/schema'

export const contextKeys = {
  all: ['contexts'] as const,
  active: ['contexts', 'active'] as const,
  detail: (id: string) => ['contexts', id] as const,
}

export const useContexts = () =>
  useQuery({ queryKey: contextKeys.all, queryFn: api.contexts.list })

export const useActiveContexts = () =>
  useQuery({ queryKey: contextKeys.active, queryFn: api.contexts.listActive })

export const useContext = (id: string) =>
  useQuery({
    queryKey: contextKeys.detail(id),
    queryFn: () => api.contexts.get(id),
    enabled: Boolean(id),
  })

export const useCreateContext = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      data: Pick<NewContext, 'name' | 'color'> & Partial<NewContext>,
    ) => api.contexts.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: contextKeys.all }),
  })
}

export const useUpdateContext = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Context> }) =>
      api.contexts.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: contextKeys.all })
      queryClient.invalidateQueries({ queryKey: contextKeys.detail(id) })
    },
  })
}

export const useArchiveContext = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.contexts.archive,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: contextKeys.all }),
  })
}