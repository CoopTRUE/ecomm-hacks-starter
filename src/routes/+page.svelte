<script>
  import Upload from '$lib/components/Upload.svelte'
  import Globe from '$lib/components/Globe'
  import Hero from '$lib/components/Hero.svelte'
  import { Button } from '$lib/components/ui/button'
  import { onMount } from 'svelte'
  import { fly, scale, slide } from 'svelte/transition'
  import KeyedMount from '$lib/components/KeyedMount.svelte'
  import { cubicInOut, cubicOut, expoOut, quartOut } from 'svelte/easing'

  let mounted = $state(false)
  onMount(() => (mounted = true))
</script>

<div class="container mx-auto flex flex-col items-center">
  <Hero />
  <KeyedMount>
    <div in:scale={{ delay: 1000, start: 0.7, duration: 1000, easing: expoOut }}>
      <Upload />
    </div>
  </KeyedMount>
  <!-- <Button variant="outline">Button</Button> -->
  <Globe />
</div>
