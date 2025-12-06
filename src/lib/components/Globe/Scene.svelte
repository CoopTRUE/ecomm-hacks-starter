<script lang="ts">
  import { browser } from '$app/environment'
  import { T } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'

  async function loadGlobe() {
    if (!browser) return null
    const { default: ThreeGlobe } = await import('three-globe')
    const globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')

    return globe
  }

  const globePromise = loadGlobe()
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 400]}>
  <OrbitControls enableDamping autoRotate autoRotateSpeed={0.5} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={1.5} />
<T.DirectionalLight position={[10, 10, 5]} intensity={2} />

{#await globePromise then globe}
  {#if globe}
    <T is={globe} />
  {/if}
{/await}
