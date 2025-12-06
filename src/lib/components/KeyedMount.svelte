<script lang="ts">
  import { loaded } from '$lib/stores.svelte'
  import { onMount, type Snippet } from 'svelte'

  let { children } = $props<{ children: Snippet }>()
  $inspect(loaded.loaded)
</script>

{#key loaded.loaded}
  {@render children()}
{/key}
