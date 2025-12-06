import { createQuery } from '@tanstack/svelte-query'
// import { goto } from '$app/navigation'
// import { resolve } from '$app/paths'
import { api } from '$lib/api'
import type { CountryCode, StoreStatus } from '$lib/server/prisma'

export function useJob(storeId: string) {
  return createQuery(() => ({
    queryKey: ['job', storeId],
    queryFn: async () => {
      const response = await api.get<{
        status: StoreStatus
        info?: {
          regions: CountryCode[]
        }
      }>(`/store/${storeId}/status`)
      return response.data
    },
    refetchInterval: ({ state: { data } }) => {
      if (!data) return false
      if (data.status === 'LOCALIZATION_FAILED' || data.status === 'LOCALIZED') {
        return false
      }
      // if (data.status === 'ANALYSIS_FAILED' || data.status === 'LOCALIZATION_FAILED') {
      //   return false
      // }
      // if (data.status === 'ANALYZED' || data.status === 'LOCALIZED') {
      //   return false
      // }
      return 1000
    },
    refetchOnMount: true,
  }))
}
