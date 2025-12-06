<script>
  import Globe from '$lib/components/Globe'
  import Hero from '$lib/components/Hero.svelte'
  import KeyedMount from '$lib/components/KeyedMount.svelte'
  import { Button } from '$lib/components/ui/button'
  import Upload from '$lib/components/Upload'
  import { onMount } from 'svelte'
  import { cubicInOut, cubicOut, expoOut, quartOut } from 'svelte/easing'
  import { fly, scale, slide } from 'svelte/transition'

  let mounted = $state(false)
  onMount(() => (mounted = true))
</script>

<div class="container mx-auto flex flex-col items-center gap-5">
  <Hero />
  <KeyedMount>
    <div in:scale={{ delay: 1000, start: 0.7, duration: 1000, easing: expoOut }}>
      <Upload />
    </div>
  </KeyedMount>
  <!-- <Button variant="outline">Button</Button> -->
  <Globe />
</div>
