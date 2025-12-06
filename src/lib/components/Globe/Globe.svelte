<script lang="ts">
  import { Canvas } from '@threlte/core'
  import Scene from './Scene.svelte'
  import { Stars } from '@threlte/extras'
</script>

<div class="absolute inset-0 -z-10">
  <Canvas>
    <Stars fade speed={0.01} />
    <Scene />
  </Canvas>
</div>
