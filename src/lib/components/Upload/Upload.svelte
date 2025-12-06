<script lang="ts">
  import DropZone from './DropZone.svelte'
  import FileList from './FileList.svelte'
  import UrlInput from './UrlInput.svelte'
  import PhArrowRight from '~icons/ph/arrow-right'
  import { Button } from '$lib/components/ui/button'
  import { MAX_FILES } from '$lib/constants'
  import { useCreateInspection } from '$lib/hooks/useCreateInspection.svelte'
  import { slide } from 'svelte/transition'

  interface Props {
    acceptedFiles?: string
    onFileAdded?: (data: { file: File }) => void
    onFileRejected?: (data: { file: File }) => void
    onFileRemoved?: (data: { file: File }) => void
    onUrlAdded?: (data: { url: string }) => void
  }

  let {
    acceptedFiles = 'image/*',
    onFileAdded,
    onFileRejected,
    onFileRemoved,
    onUrlAdded,
  }: Props = $props()

  let files = $state<File[]>([])
  let urls = $state<string[]>([])

  function handleFilesAdded(newFiles: File[]) {
    const uniqueNewFiles = newFiles.filter(
      (newFile) => !files.some((existingFile) => existingFile.name === newFile.name)
    )

    const availableSlots = MAX_FILES - files.length
    if (availableSlots <= 0) return

    const filesToAdd = uniqueNewFiles.slice(0, availableSlots)

    filesToAdd.forEach((file) => {
      files.push(file)
      onFileAdded?.({ file })
    })
  }

  function handleFileRejected(file: File) {
    onFileRejected?.({ file })
  }

  function removeFile(index: number) {
    const file = files[index]
    files.splice(index, 1)
    onFileRemoved?.({ file })
  }

  function handleUrlAdded(url: string) {
    if (urls.includes(url)) return
    urls.push(url)
    onUrlAdded?.({ url })
  }

  function removeUrl(index: number) {
    urls.splice(index, 1)
  }

  const createInspectionMutation = useCreateInspection()
</script>

<div class="w-3xl space-y-6">
  <DropZone
    {acceptedFiles}
    disabled={createInspectionMutation.isPending}
    onFileRejected={handleFileRejected}
    onFilesAdded={handleFilesAdded}
  />

  <FileList {files} onRemoveFile={removeFile} onRemoveUrl={removeUrl} {urls} />

  <UrlInput onUrlAdd={handleUrlAdded} />

  {#if files.length > 0 || urls.length > 0}
    <div class="flex justify-end pt-4" transition:slide>
      <Button
        class="h-11 min-w-[120px] gap-2 text-base"
        disabled={createInspectionMutation.isPending}
        onclick={() => createInspectionMutation.mutate({ files, urls })}
        size="lg"
      >
        {#if createInspectionMutation.isPending}
          <span
            class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          ></span>
          Submitting...
        {:else}
          Continue
          <PhArrowRight class="h-5 w-5" />
        {/if}
      </Button>
    </div>
  {/if}
</div>
