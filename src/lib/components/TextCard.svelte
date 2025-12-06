<script lang="ts">
  import PhCopy from '~icons/ph/copy'
  import Button from '$lib/components/ui/button/button.svelte'
  import { toast } from 'svelte-sonner'

  interface TextContent {
    category: string
    text_content: string
    location: string
  }

  let {
    textData,
    index,
  }: {
    textData: string | TextContent
    index: number
  } = $props()

  let content = $derived.by(() => {
    if (typeof textData === 'string') {
      // Try to parse if it's a JSON string, otherwise fallback
      try {
        return JSON.parse(textData) as TextContent
      } catch {
        return { category: 'General', text_content: textData, location: '' }
      }
    }
    return textData
  })

  function copyText() {
    navigator.clipboard.writeText(content.text_content)
    toast.success('Copied to clipboard')
  }
</script>

<div class="relative rounded-lg border bg-card p-4 shadow-sm">
  <div class="mb-3 flex items-start justify-between gap-2">
    <div class="flex flex-col gap-1">
      <span class="text-xs font-medium text-muted-foreground uppercase">
        {content.category || `Block ${index + 1}`}
      </span>
      {#if content.location}
        <span class="text-[10px] text-muted-foreground/70">
          Location: {content.location}
        </span>
      {/if}
    </div>
    <Button
      class="h-8 w-8 shrink-0 p-0"
      onclick={copyText}
      size="sm"
      title="Copy text"
      variant="ghost"
    >
      <PhCopy class="h-4 w-4" />
    </Button>
  </div>
  <p class="text-sm leading-relaxed whitespace-pre-wrap">{content.text_content}</p>
</div>
