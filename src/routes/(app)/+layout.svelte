<script lang="ts">
  import { page } from '$app/state'
  import Globe from '$lib/components/Globe'

  let { children } = $props()
</script>

{#if page.route.id === '/(app)/app/[storeId]/variants'}
  {@render children()}
{:else}
  <div class="container mx-auto flex flex-col items-center gap-5">
    {@render children()}
    <Globe />
  </div>
{/if}
