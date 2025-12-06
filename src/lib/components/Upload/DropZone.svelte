<script lang="ts">
  import PhCloudArrowUp from '~icons/ph/cloud-arrow-up'
  import { MAX_FILES } from '$lib/constants'
  import { cn } from '$lib/utils'

  interface Props {
    acceptedFiles?: string
    disabled?: boolean
    onFilesAdded: (files: File[]) => void
    onFileRejected?: (file: File) => void
  }

  let {
    acceptedFiles = 'image/*',
    disabled = false,
    onFilesAdded,
    onFileRejected,
  }: Props = $props()

  let isDragging = $state(false)
  let fileInput: HTMLInputElement

  function validateFile(file: File): boolean {
    if (!acceptedFiles || acceptedFiles === '*') return true
    return acceptedFiles.split(',').some((accept) => {
      accept = accept.trim()
      if (accept.startsWith('.')) {
        return file.name.toLowerCase().endsWith(accept.toLowerCase())
      }
      if (accept.endsWith('/*')) {
        return file.type.startsWith(accept.replace('/*', ''))
      }
      return file.type === accept
    })
  }

  function handleDragEnter(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) isDragging = true
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    isDragging = false
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) isDragging = true
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    isDragging = false
    if (disabled) return

    const droppedFiles = e.dataTransfer?.files
    if (droppedFiles) {
      const validFiles: File[] = []
      Array.from(droppedFiles).forEach((file) => {
        if (validateFile(file)) {
          validFiles.push(file)
        } else {
          onFileRejected?.(file)
        }
      })

      if (validFiles.length > 0) {
        onFilesAdded(validFiles)
      }
    }
  }

  function handleFileInput(e: Event) {
    const target = e.target as HTMLInputElement
    if (target.files) {
      const validFiles: File[] = []
      Array.from(target.files).forEach((file) => {
        if (validateFile(file)) {
          validFiles.push(file)
        } else {
          onFileRejected?.(file)
        }
      })

      if (validFiles.length > 0) {
        onFilesAdded(validFiles)
      }
    }
    target.value = ''
  }
</script>

<div
  class={cn(
    'group relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out',
    isDragging
      ? 'scale-[1.02] border-primary bg-primary/5 shadow-lg'
      : 'border-muted-foreground/25 bg-card/80 backdrop-blur-xs hover:border-primary/50 hover:bg-muted/30 focus-visible:border-primary/50 focus-visible:bg-muted/30',
    disabled && 'cursor-not-allowed opacity-60'
  )}
  aria-label="Drop files here or click to upload"
  onclick={() => !disabled && fileInput?.click()}
  ondragenter={handleDragEnter}
  ondragleave={handleDragLeave}
  ondragover={handleDragOver}
  ondrop={handleDrop}
  onkeydown={(e) => !disabled && e.key === 'Enter' && fileInput?.click()}
  role="button"
  tabindex="0"
>
  <input
    bind:this={fileInput}
    class="hidden"
    accept={acceptedFiles}
    {disabled}
    multiple
    onchange={handleFileInput}
    type="file"
  />

  <div class="relative z-10 flex flex-col items-center gap-4 p-8 text-center">
    <div
      class={cn(
        'rounded-full bg-background p-4 shadow-sm ring-1 ring-border transition-all duration-300',
        isDragging
          ? 'scale-110 text-primary ring-primary'
          : 'text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground'
      )}
    >
      <PhCloudArrowUp class="h-10 w-10" />
    </div>

    <div class="space-y-1">
      <p class="text-lg font-medium">
        <span class="text-primary">Click to upload</span> or drag and drop
      </p>
      <p class="text-sm text-muted-foreground">
        SVG, PNG, or JPG (max. {MAX_FILES} files)
      </p>
    </div>
  </div>
</div>
