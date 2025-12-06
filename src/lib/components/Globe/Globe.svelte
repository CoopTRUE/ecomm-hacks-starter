<script lang="ts">
  import Scene from './Scene.svelte'
  import { Canvas } from '@threlte/core'
  import { Stars } from '@threlte/extras'
</script>

<div class="absolute inset-0 -z-10">
  <Canvas>
    <Stars fade speed={0.01} />
    <Scene />
  </Canvas>
</div>
