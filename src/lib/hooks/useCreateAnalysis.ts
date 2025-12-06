// import { createMutation, useQueryClient } from '@tanstack/svelte-query'
// import { api } from '$lib/api'

// export function useCreateAnalysis(storeId: string) {
//   const queryClient = useQueryClient()
//   return createMutation(() => ({
//     mutationFn: async () => {
//       await api.post(`/store/${storeId}/analyze`)
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['job', storeId] })
//     },
//   }))
// }
