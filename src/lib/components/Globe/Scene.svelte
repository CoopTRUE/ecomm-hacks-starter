<script lang="ts">
  import { T, useCamera } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
  import { browser } from '$app/environment'
  import { loaded } from '$lib/stores.svelte'
  import type { OrbitControls as OrbitControlsType } from 'three/examples/jsm/Addons.js'
  import { onMount } from 'svelte'
  import type ThreeGlobeType from 'three-globe'
  import { Vector3 } from 'three'

  let globe = $state.raw<ThreeGlobeType | null>(null)

  async function loadGlobe() {
    const { default: ThreeGlobe } = await import('three-globe')
    globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')

    loaded.loaded = true
  }

  let orbitControls = $state.raw<OrbitControlsType | null>(null)
  const { camera } = $derived(useCamera())

  onMount(() => {
    loadGlobe()
    setTimeout(() => {
      camera.current.lookAt(new Vector3(0, 20, 50))
    }, 2000)
  })
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 400]}>
  <OrbitControls
    autoRotate
    autoRotateSpeed={0.5}
    enableDamping
    enablePan={false}
    enableRotate={false}
    enableZoom={false}
    oncreate={(ref) => {
      orbitControls = ref
    }}
  />
</T.PerspectiveCamera>

<T.AmbientLight intensity={1.5} />
<T.DirectionalLight intensity={2} position={[10, 10, 5]} />

{#if globe}
  <T is={globe} />
{/if}
