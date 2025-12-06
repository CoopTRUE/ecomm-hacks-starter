<script lang="ts">
  import PhFile from '~icons/ph/file'
  import PhLink from '~icons/ph/link'
  import PhX from '~icons/ph/x'
  import { Button } from '$lib/components/ui/button'
  import { fade, slide } from 'svelte/transition'
  import { flip } from 'svelte/animate'

  interface Props {
    files: File[]
    urls: string[]
    onRemoveFile: (index: number) => void
    onRemoveUrl: (index: number) => void
  }

  let { files, urls, onRemoveFile, onRemoveUrl }: Props = $props()
</script>

{#if files.length > 0 || urls.length > 0}
  <div class="space-y-3" transition:slide>
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium text-muted-foreground">Selected Items</h3>
      <span class="text-xs text-muted-foreground">{files.length + urls.length} item(s)</span>
    </div>

    <div class="grid gap-3 sm:grid-cols-2">
      {#each files as file, i (file.name)}
        <div
          class="group relative flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
          transition:fade
          animate:flip={{ duration: 500 }}
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
          <Button
            class="text-muted-foreground opacity-0 transition-all group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus:opacity-100"
            aria-label="Remove file"
            onclick={(e) => {
              e.stopPropagation()
              onRemoveFile(i)
            }}
            size="icon-sm"
            variant="ghost"
          >
            <PhX class="h-4 w-4" />
          </Button>
        </div>
      {/each}

      {#each urls as url, i (url)}
        <div
          class="group relative flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
          transition:fade
          animate:flip={{ duration: 500 }}
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
          <Button
            class="text-muted-foreground opacity-0 transition-all group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus:opacity-100"
            aria-label="Remove URL"
            onclick={(e) => {
              e.stopPropagation()
              onRemoveUrl(i)
            }}
            size="icon-sm"
            variant="ghost"
          >
            <PhX class="h-4 w-4" />
          </Button>
        </div>
      {/each}
    </div>
  </div>
{/if}
