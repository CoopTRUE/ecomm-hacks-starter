import { createMutation } from '@tanstack/svelte-query'
import { goto } from '$app/navigation'
import { resolve } from '$app/paths'
import { api } from '$lib/api'
import imageCompression from 'browser-image-compression'

export function useCreateStore() {
  return createMutation(() => ({
    mutationFn: async (data: { files: File[]; urls: string[] }) => {
      const compressedFiles = await Promise.all(
        data.files.map(async (file) => {
          const compressed = await imageCompression(file, {
            maxSizeMB: 1.5,
            useWebWorker: true,
            fileType: 'image/jpeg',
          })
          return compressed
        })
      )
      const formData = new FormData()
      compressedFiles.forEach((file, index) => formData.append(`files[${index}]`, file))
      data.urls.forEach((url, index) => formData.append(`urls[${index}]`, url))

      const response = await api.post<{ id: string }>('/store/create', formData)
      goto(resolve(`/app/${response.data.id}`))
    },
  }))
}
