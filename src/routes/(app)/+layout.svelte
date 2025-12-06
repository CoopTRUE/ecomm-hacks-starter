<script lang="ts">
  import Globe from '$lib/components/Globe'

  let { children } = $props()
</script>

<div class="container mx-auto flex flex-col items-center gap-5">
  {@render children()}
  <Globe />
</div>
