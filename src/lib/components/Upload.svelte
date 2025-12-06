<script lang="ts">
  import { fade, slide } from 'svelte/transition'
  import PhCloudArrowUp from '~icons/ph/cloud-arrow-up'
  import PhX from '~icons/ph/x'
  import PhFile from '~icons/ph/file'
  import PhLink from '~icons/ph/link'
  import PhCheck from '~icons/ph/check'
  import { cn } from '$lib/utils'

  interface Props {
    uploadUrl?: string
    acceptedFiles?: string
    maxFiles?: number
    onUploadSuccess?: (data: { file: File; response: any }) => void
    onUploadError?: (data: { file: File; error: any }) => void
    onFileAdded?: (data: { file: File }) => void
    onFileRemoved?: (data: { file: File }) => void
    onUrlAdded?: (data: { url: string }) => void
    onContinue?: (data: { files: File[]; urls: string[] }) => void
  }

  let {
    uploadUrl = '/api/upload',
    acceptedFiles = 'image/*',
    maxFiles = 10,
    onUploadSuccess,
    onUploadError,
    onFileAdded,
    onFileRemoved,
    onUrlAdded,
    onContinue,
  }: Props = $props()

  let files = $state<File[]>([])
  let urls = $state<string[]>([])
  let isDragging = $state(false)
  let urlInput = $state('')
  let fileInput: HTMLInputElement
  let isUploading = $state(false)

  function handleDragEnter(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    isDragging = true
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    isDragging = false
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    isDragging = true
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    isDragging = false

    const droppedFiles = e.dataTransfer?.files
    if (droppedFiles) {
      handleFiles(Array.from(droppedFiles))
    }
  }

  function handleFileInput(e: Event) {
    const target = e.target as HTMLInputElement
    if (target.files) {
      handleFiles(Array.from(target.files))
    }
    target.value = '' // Reset input
  }

  function handleFiles(newFiles: File[]) {
    // Filter by maxFiles
    const availableSlots = maxFiles - files.length
    if (availableSlots <= 0) return

    const filesToAdd = newFiles.slice(0, availableSlots)

    // Basic validation could be added here based on acceptedFiles

    filesToAdd.forEach((file) => {
      files = [...files, file]
      onFileAdded?.({ file })
    })
  }

  function removeFile(index: number) {
    const file = files[index]
    files = files.filter((_, i) => i !== index)
    onFileRemoved?.({ file })
  }

  function handleUrlSubmit() {
    if (!urlInput) return
    try {
      new URL(urlInput)
      urls = [...urls, urlInput]
      onUrlAdded?.({ url: urlInput })
      urlInput = ''
    } catch (e) {
      console.error('Invalid URL')
    }
  }

  function removeUrl(index: number) {
    urls = urls.filter((_, i) => i !== index)
  }

  async function handleContinue() {
    if (files.length === 0 && urls.length === 0) return

    // If we have files and an uploadUrl, we could upload them here
    // For this implementation, we'll assume the user wants to handle the logic
    // or we upload if requested.

    if (files.length > 0 && uploadUrl) {
      isUploading = true
      try {
        const formData = new FormData()
        files.forEach((file) => {
          formData.append('files', file)
        })

        // Simple upload implementation
        // In a real app, you might want progress tracking per file
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

<div class="w-full space-y-6">
  <div
    role="button"
    tabindex="0"
    aria-label="Drop files here or click to upload"
    class={cn(
      'group relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out',
      isDragging
        ? 'scale-[1.02] border-primary bg-primary/5 shadow-lg'
        : 'border-muted-foreground/25 bg-card hover:border-primary/50 hover:bg-muted/30'
    )}
    ondragenter={handleDragEnter}
    ondragleave={handleDragLeave}
    ondragover={handleDragOver}
    ondrop={handleDrop}
    onclick={() => fileInput?.click()}
    onkeydown={(e) => e.key === 'Enter' && fileInput?.click()}
  >
    <input
      bind:this={fileInput}
      type="file"
      multiple
      accept={acceptedFiles}
      class="hidden"
      onchange={handleFileInput}
    />

    <!-- Background Gradient Effect -->
    <div
      class={cn(
        'absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500',
        isDragging && 'opacity-100'
      )}
    ></div>

    <div class="relative z-10 flex flex-col items-center gap-4 p-8 text-center">
      <div
        class={cn(
          'rounded-full bg-background p-4 shadow-sm ring-1 ring-border transition-all duration-300',
          isDragging
            ? 'scale-110 text-primary ring-primary'
            : 'text-muted-foreground group-hover:text-foreground'
        )}
      >
        <PhCloudArrowUp class="h-10 w-10" />
      </div>

      <div class="space-y-1">
        <p class="text-lg font-medium">
          <span class="text-primary">Click to upload</span> or drag and drop
        </p>
        <p class="text-sm text-muted-foreground">
          PNG, JPG, PDF (max. {maxFiles} files)
        </p>
      </div>
    </div>
  </div>

  {#if files.length > 0 || urls.length > 0}
    <div class="space-y-3" transition:slide>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-muted-foreground">Selected Items</h3>
        <span class="text-xs text-muted-foreground">{files.length + urls.length} item(s)</span>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        {#each files as file, i}
          <div
            class="group relative flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            transition:fade
          >
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
            >
              <PhFile class="h-5 w-5" />
            </div>
            <div class="flex-1 truncate">
              <p class="truncate text-sm font-medium">{file.name}</p>
              <p class="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              onclick={(e) => {
                e.stopPropagation()
                removeFile(i)
              }}
              class="rounded-md p-1 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
            >
              <PhX class="h-4 w-4" />
            </button>
          </div>
        {/each}

        {#each urls as url, i}
          <div
            class="group relative flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            transition:fade
          >
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
            >
              <PhLink class="h-5 w-5" />
            </div>
            <div class="flex-1 truncate">
              <p class="truncate text-sm font-medium">{url}</p>
              <p class="text-xs text-muted-foreground">External URL</p>
            </div>
            <button
              onclick={(e) => {
                e.stopPropagation()
                removeUrl(i)
              }}
              class="rounded-md p-1 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
            >
              <PhX class="h-4 w-4" />
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div class="relative flex items-center py-2">
    <div class="grow border-t border-border"></div>
    <span class="mx-4 shrink-0 text-xs font-medium text-muted-foreground uppercase"
      >Or add from URL</span
    >
    <div class="grow border-t border-border"></div>
  </div>

  <div class="flex gap-3">
    <input
      type="url"
      bind:value={urlInput}
      placeholder="https://example.com/image.png"
      onkeydown={(e) => e.key === 'Enter' && handleUrlSubmit()}
      class="flex-1 rounded-md border border-input bg-background px-4 py-2 text-foreground transition-all placeholder:text-muted-foreground focus:border-input focus:ring-2 focus:ring-ring focus:outline-none"
    />
    <button
      onclick={handleUrlSubmit}
      disabled={!urlInput}
      class="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-6 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
    >
      Add URL
    </button>
  </div>

  {#if files.length > 0 || urls.length > 0}
    <div class="flex justify-end pt-4" transition:slide>
      <button
        onclick={handleContinue}
        disabled={isUploading}
        class="inline-flex h-11 min-w-[120px] items-center justify-center gap-2 rounded-md bg-primary px-8 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        {#if isUploading}
          <span
            class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          ></span>
          Uploading...
        {:else}
          Continue
          <span class="text-lg">→</span>
        {/if}
      </button>
    </div>
  {/if}
</div>
