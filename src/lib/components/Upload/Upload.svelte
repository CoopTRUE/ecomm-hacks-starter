<script lang="ts">
  import DropZone from './DropZone.svelte'
  import FileList from './FileList.svelte'
  import UrlInput from './UrlInput.svelte'
  import PhArrowRight from '~icons/ph/arrow-right'
  import { Button } from '$lib/components/ui/button'
  import { slide } from 'svelte/transition'
  import { MAX_FILES } from '$lib/constants'

  interface Props {
    uploadUrl?: string
    acceptedFiles?: string
    onUploadSuccess?: (data: { file: File; response: any }) => void
    onUploadError?: (data: { file: File; error: any }) => void
    onFileAdded?: (data: { file: File }) => void
    onFileRejected?: (data: { file: File }) => void
    onFileRemoved?: (data: { file: File }) => void
    onUrlAdded?: (data: { url: string }) => void
    onContinue?: (data: { files: File[]; urls: string[] }) => void
  }

  let {
    uploadUrl = '/api/upload',
    acceptedFiles = 'image/*',
    onUploadSuccess,
    onUploadError,
    onFileAdded,
    onFileRejected,
    onFileRemoved,
    onUrlAdded,
    onContinue,
  }: Props = $props()

  let files = $state<File[]>([])
  let urls = $state<string[]>([])
  let isUploading = $state(false)

  function handleFilesAdded(newFiles: File[]) {
    const uniqueNewFiles = newFiles.filter(
      (newFile) => !files.some((existingFile) => existingFile.name === newFile.name)
    )

    const availableSlots = MAX_FILES - files.length
    if (availableSlots <= 0) return

    const filesToAdd = uniqueNewFiles.slice(0, availableSlots)

    filesToAdd.forEach((file) => {
      files = [...files, file]
      onFileAdded?.({ file })
    })
  }

  function handleFileRejected(file: File) {
    onFileRejected?.({ file })
  }

  function removeFile(index: number) {
    const file = files[index]
    files = files.filter((_, i) => i !== index)
    onFileRemoved?.({ file })
  }

  function handleUrlAdded(url: string) {
    if (urls.includes(url)) return
    urls = [...urls, url]
    onUrlAdded?.({ url })
  }

  function removeUrl(index: number) {
    urls = urls.filter((_, i) => i !== index)
  }

  async function handleContinue() {
    if (files.length === 0 && urls.length === 0) return

    if (files.length > 0 && uploadUrl) {
      isUploading = true
      try {
        const formData = new FormData()
        files.forEach((file) => {
          formData.append('files', file)
        })

        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          files.forEach((file) => onUploadSuccess?.({ file, response: result }))
        } else {
          throw new Error('Upload failed')
        }
      } catch (err) {
        console.error(err)
        files.forEach((file) => onUploadError?.({ file, error: err }))
      } finally {
        isUploading = false
      }
    }

    onContinue?.({ files, urls })
  }
</script>

<div class="w-3xl space-y-6">
  <DropZone
    {acceptedFiles}
    disabled={isUploading}
    onFileRejected={handleFileRejected}
    onFilesAdded={handleFilesAdded}
  />

  <FileList {files} onRemoveFile={removeFile} onRemoveUrl={removeUrl} {urls} />

  <UrlInput onUrlAdd={handleUrlAdded} />

  {#if files.length > 0 || urls.length > 0}
    <div class="flex justify-end pt-4" transition:slide>
      <Button
        class="h-11 min-w-[120px] gap-2 text-base"
        disabled={isUploading}
        onclick={handleContinue}
        size="lg"
      >
        {#if isUploading}
          <span
            class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          ></span>
          Uploading...
        {:else}
          Continue
          <PhArrowRight class="h-5 w-5" />
        {/if}
      </Button>
    </div>
  {/if}
</div>
