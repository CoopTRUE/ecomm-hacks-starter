<script lang="ts">
  import Scene from './Scene.svelte'
  import { Canvas } from '@threlte/core'
  import { Stars } from '@threlte/extras'
  import { onMount } from 'svelte'
  import { Tween } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { page } from '$app/state'

  let offset = new Tween(0, { duration: 1000, easing: cubicOut })

  $effect(() => {
    if (page.params.processId) {
      offset.set(1000)
    }
  })
</script>

<div class="absolute inset-0 -z-10" style:right="{-offset.current}px">
  <Canvas>
    <Stars fade speed={0.01} />
    <Scene />
  </Canvas>
</div>
