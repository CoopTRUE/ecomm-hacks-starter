<script lang="ts" module>
  import type { GeoJsonFeature, GeoJsonFeatureCollection } from '$lib/types'

  let countries = $state.raw<GeoJsonFeature[]>([])
</script>

<script lang="ts">
  import { T, useCamera, useTask } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
  import { browser } from '$app/environment'
  import { page } from '$app/state'
  import { focusedRegions, loaded } from '$lib/stores.svelte'
  import axios from 'axios'
  import { onMount } from 'svelte'
  import { cubicOut } from 'svelte/easing'
  import { Tween } from 'svelte/motion'
  import type { OrbitControls as OrbitControlsType } from 'three/examples/jsm/Addons.js'
  import type ThreeGlobeType from 'three-globe'

  let polygonTransparency = new Tween(1, { duration: 1000, easing: cubicOut })
  let globe = $state.raw<ThreeGlobeType | null>(null)

  async function loadGlobe() {
    const { default: ThreeGlobe } = await import('three-globe')
    globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .polygonCapColor(() => 'rgba(200, 0, 0, 0.7)')
      .polygonSideColor(() => 'rgba(0, 100, 0, 0.1)')
      .polygonAltitude((feat) => 0.1)
      .polygonStrokeColor(() => '#111')
    loaded.loaded = true
  }

  async function loadCountries() {
    const { data } = await axios.get<GeoJsonFeatureCollection>('/ne_110m_admin_0_countries.geojson')
    countries = data.features.filter((f) => f.properties.ISO_A2 !== 'AQ')
  }

  let orbitControls = $state.raw<OrbitControlsType | null>(null)
  const { camera } = $derived(useCamera())

  onMount(() => {
    loadGlobe()
    loadCountries()
  })

  const filteredCountries = $derived(
    countries.filter(
      (f) =>
        f.properties.ISO_A2 !== 'AQ' &&
        focusedRegions.regions.some((r) => r === f.properties.ISO_A2)
    )
  )

  $effect(() => {
    globe?.polygonsData(filteredCountries)
  })

  const shouldShowOrbitControls = $derived(!!page.params.storeId)
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 400]}>
  <OrbitControls
    autoRotate
    autoRotateSpeed={0.5}
    dampingFactor={0.04}
    enableDamping
    enablePan={shouldShowOrbitControls}
    enableRotate={shouldShowOrbitControls}
    enableZoom={shouldShowOrbitControls}
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
