import { createMutation } from '@tanstack/svelte-query'
import { api } from '$lib/api'

export function useCreateInspection() {
  return createMutation(() => ({
    mutationFn: async (data: { files: File[]; urls: string[] }) => {
      const formData = new FormData()
      data.files.forEach((file, index) => formData.append(`files[${index}]`, file))
      data.urls.forEach((url, index) => formData.append(`urls[${index}]`, url))

      const response = await api.post<{ id: string }>('/inspection/create', formData)
      return response.data
    },
  }))
}
