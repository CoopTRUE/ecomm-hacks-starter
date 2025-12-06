<script lang="ts">
  import { T } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
  import { browser } from '$app/environment'
  import { loaded } from '$lib/stores.svelte'

  async function loadGlobe() {
    if (!browser) return null
    const { default: ThreeGlobe } = await import('three-globe')
    const globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')

    loaded.loaded = true
    return globe
  }

  const globePromise = loadGlobe()
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 400]}>
  <OrbitControls
    autoRotate
    autoRotateSpeed={0.5}
    enableDamping
    enablePan={false}
    enableRotate={false}
    enableZoom={false}
  />
</T.PerspectiveCamera>

<T.AmbientLight intensity={1.5} />
<T.DirectionalLight intensity={2} position={[10, 10, 5]} />

{#await globePromise then globe}
  {#if globe}
    <T is={globe} />
  {/if}
{/await}
