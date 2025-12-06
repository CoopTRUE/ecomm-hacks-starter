<script lang="ts">
  import { page } from '$app/state'
  import LocalizationProgress from '$lib/components/LocalizationProgress.svelte'
  import LocalizationResults from '$lib/components/LocalizationResults.svelte'
  import { useJob } from '$lib/hooks/useJob'

  const storeId = page.params.storeId!
  const job = useJob(storeId)
  const jobStatus = $derived(job.data?.status ?? 'PENDING')
  const jobRegions = $derived(job.data?.info?.regions ?? [])
</script>

<div
  class="relative flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center overflow-hidden bg-background"
>
  <!-- Ambient background glow -->
  <div class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
    <div
      class="h-[500px] w-[500px] animate-pulse rounded-full bg-primary/20 blur-[120px] filter"
    ></div>
  </div>

  <div class="z-10 w-full">
    {#if jobStatus === 'LOCALIZED'}
      <LocalizationResults {storeId} />
    {:else}
      <LocalizationProgress regions={jobRegions} status={jobStatus} {storeId} />
    {/if}
  </div>
</div>
