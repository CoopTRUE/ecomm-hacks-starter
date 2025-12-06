import { createMutation } from '@tanstack/svelte-query'
import { goto } from '$app/navigation'
import { resolve } from '$app/paths'
import { api } from '$lib/api'
import type { CountryCode } from '$lib/server/prisma'

export function useCreateLocalization(storeId: string) {
  return createMutation(() => ({
    mutationFn: async (regions: CountryCode[]) => {
      await api.post(`/store/${storeId}/localize`, { regions })
    },
    onSuccess: () => {
      goto(resolve(`/app/${storeId}/variants`))
    },
  }))
}
