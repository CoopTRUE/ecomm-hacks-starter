<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'

  interface Props {
    onUrlAdd: (url: string) => void
  }

  let { onUrlAdd }: Props = $props()
  let urlInput = $state('')

  function handleUrlSubmit() {
    if (!urlInput) return
    try {
      new URL(urlInput)
      onUrlAdd(urlInput)
      urlInput = ''
    } catch (e) {
      console.error('Invalid URL')
    }
  }
</script>

<div class="relative flex items-center py-2">
  <div class="grow border-t border-border"></div>
  <span class="mx-4 shrink-0 text-xs font-medium text-muted-foreground uppercase"
    >Or add from URL</span
  >
  <div class="grow border-t border-border"></div>
</div>

<div class="flex gap-3">
  <Input
    onkeydown={(e) => e.key === 'Enter' && handleUrlSubmit()}
    placeholder="https://example.com/image.png"
    type="url"
    bind:value={urlInput}
  />
  <Button disabled={!urlInput} onclick={handleUrlSubmit} variant="secondary">Add URL</Button>
</div>
