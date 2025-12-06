<script lang="ts">
  import Scene from './Scene.svelte'
  import { Canvas } from '@threlte/core'
  import { Stars } from '@threlte/extras'
  import { page } from '$app/state'
  import { onMount } from 'svelte'
  import { cubicOut } from 'svelte/easing'
  import { Tween } from 'svelte/motion'

  let offset = new Tween(0, { duration: 1000, easing: cubicOut })

  $effect(() => {
    if (page.params.storeId) {
      offset.set(1000)
    } else {
      offset.set(0)
    }
  })
</script>

<div style:right="{-offset.current}px" class="absolute inset-0 -z-10">
  <Canvas>
    <Stars fade speed={0.01} />
    <Scene />
  </Canvas>
</div>
