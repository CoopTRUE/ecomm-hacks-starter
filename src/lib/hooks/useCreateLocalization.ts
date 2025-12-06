import { createMutation, useQueryClient } from '@tanstack/svelte-query'
import { goto, invalidateAll } from '$app/navigation'
import { resolve } from '$app/paths'
import { api } from '$lib/api'
import type { CountryCode } from '$lib/server/prisma'

export function useCreateLocalization(storeId: string) {
  const queryClient = useQueryClient()
  return createMutation(() => ({
    mutationFn: async (regions: CountryCode[]) => {
      await api.post(`/store/${storeId}/localize`, { regions })
      return true
    },
    onSuccess: () => {
      invalidateAll()
      queryClient.invalidateQueries()
    },
  }))
}
