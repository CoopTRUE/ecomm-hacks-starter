<script lang="ts">
  import PhArrowsOut from '~icons/ph/arrows-out'
  import { fade } from 'svelte/transition'

  let {
    src,
    alt,
    label,
    class: className,
  }: {
    src: string | null
    alt: string
    label: string
    class?: string
  } = $props()

  let isEnlarged = $state(false)

  function toggleEnlarge() {
    if (!src) return
    isEnlarged = !isEnlarged
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isEnlarged) {
      isEnlarged = false
    }
  }

  function handleModalKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      isEnlarged = false
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class={className}>
  <div class="mb-2 flex items-center justify-between">
    <span class="text-xs font-medium text-muted-foreground uppercase">{label}</span>
    {#if src}
      <button
        class="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Enlarge image"
        onclick={toggleEnlarge}
        title="Enlarge image"
      >
        <PhArrowsOut class="h-3.5 w-3.5" />
      </button>
    {/if}
  </div>

  {#if src}
    <button
      class="group relative w-full overflow-hidden rounded-md bg-muted/30 focus:ring-2 focus:ring-primary/50 focus:outline-none"
      aria-label="Enlarge image"
      onclick={toggleEnlarge}
    >
      <img
        class="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
        {alt}
        {src}
      />
      <div
        class="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10"
      ></div>
    </button>
  {:else}
    <div
      class="flex aspect-square w-full items-center justify-center rounded-md bg-muted text-xs text-muted-foreground"
    >
      {alt === 'Original' ? 'Missing' : 'Generating...'}
    </div>
  {/if}
</div>

{#if isEnlarged && src}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm"
    aria-label="Close enlarged image"
    onclick={() => (isEnlarged = false)}
    onkeydown={handleModalKeydown}
    role="button"
    tabindex="0"
    transition:fade={{ duration: 200 }}
  >
    <div class="relative max-h-[90vh] max-w-[90vw]">
      <img class="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl" {alt} {src} />
      <div class="absolute -bottom-8 left-0 text-sm text-white/80">
        {label} - Press ESC to close
      </div>
    </div>
  </div>
{/if}
