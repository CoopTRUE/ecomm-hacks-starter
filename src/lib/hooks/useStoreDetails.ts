import { createQuery } from '@tanstack/svelte-query'
import { api } from '$lib/api'
import type { StoreDetails } from '$lib/types'

export function useStoreDetails(storeId: string) {
  return createQuery(() => ({
    queryKey: ['store-details', storeId],
    queryFn: async () => {
      const response = await api.get<StoreDetails>(`/store/${storeId}/details`)
      return response.data
    },
    enabled: !!storeId,
  }))
}
