<script lang="ts">
  import Hero from '$lib/components/Hero.svelte'
  import KeyedMount from '$lib/components/KeyedMount.svelte'
  import Upload from '$lib/components/Upload'
  import { cubicOut, expoOut } from 'svelte/easing'
  import { fade, scale } from 'svelte/transition'
</script>

<div class="container mx-auto flex flex-col items-center gap-5">
  <Hero />
  <KeyedMount>
    <div
      in:scale|global={{ delay: 1000, start: 0.7, duration: 1000, easing: expoOut }}
      out:fade|global={{ duration: 500 }}
    >
      <Upload />
    </div>
  </KeyedMount>
</div>
