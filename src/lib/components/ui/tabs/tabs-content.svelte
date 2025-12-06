<script lang="ts">
  import { cn } from '$lib/utils.js'
  import { Tabs as TabsPrimitive } from 'bits-ui'

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: TabsPrimitive.ContentProps = $props()
</script>

<TabsPrimitive.Content
  class={cn('flex-1 outline-none', className)}
  data-slot="tabs-content"
  bind:ref
  {...restProps}
/>
