import { createMutation } from '@tanstack/svelte-query'
import { goto } from '$app/navigation'
import { resolve } from '$app/paths'
import { api } from '$lib/api'

export function useCreateStore() {
  return createMutation(() => ({
    mutationFn: async (data: { files: File[]; urls: string[] }) => {
      const formData = new FormData()
      data.files.forEach((file, index) => formData.append(`files[${index}]`, file))
      data.urls.forEach((url, index) => formData.append(`urls[${index}]`, url))

      const response = await api.post<{ id: string }>('/store/create', formData)
      goto(resolve(`/app/${response.data.id}`))
    },
  }))
}
