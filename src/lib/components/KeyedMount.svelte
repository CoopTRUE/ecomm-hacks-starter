<script lang="ts">
  import { loaded } from '$lib/stores.svelte'
  import { onMount, type Snippet } from 'svelte'

  let { children } = $props<{ children: Snippet }>()
  $inspect(loaded.loaded)
</script>

{#if loaded.loaded}
  {@render children()}
{/if}
