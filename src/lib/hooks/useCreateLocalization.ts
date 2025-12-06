import { createMutation } from '@tanstack/svelte-query'
import { api } from '$lib/api'
import type { CountryCode } from '$lib/server/prisma'

export function useCreateLocalization() {
  return createMutation(() => ({
    mutationFn: async ({ storeId, regions }: { storeId: string; regions: CountryCode[] }) => {
      await api.post(`/store/${storeId}/localize`, { regions })
      return true
    },
  }))
}
