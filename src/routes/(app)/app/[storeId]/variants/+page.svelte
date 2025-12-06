<script lang="ts">
  import { useMutationState } from '@tanstack/svelte-query'
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import Button from '$lib/components/ui/button/button.svelte'
  import { useCreateLocalization } from '$lib/hooks/useCreateLocalization'
  import { useJob } from '$lib/hooks/useJob'
  import { onMount } from 'svelte'
  import { cubicOut } from 'svelte/easing'
  import { fade, fly } from 'svelte/transition'

  const storeId = page.params.storeId!
  const job = useJob(storeId)
  const jobStatus = $derived(job.data?.status ?? 'PENDING')
  const jobRegions = $derived(job.data?.info?.regions ?? [])

  // Status mapping for text content
  const statusContent: Record<string, { title: string; desc: string; step: number }> = {
    PENDING: {
      title: 'Initiating Sequence',
      desc: 'Establishing connection to store...',
      step: 1,
    },
    ANALYZING: {
      title: 'Analyzing DNA',
      desc: 'Decodifying brand voice and product structure...',
      step: 2,
    },
    LOCALIZING: {
      title: 'Globalizing Assets',
      desc: 'Generating culturally adapted variants across regions...',
      step: 3,
    },
    LOCALIZED: {
      title: 'Ready for Launch',
      desc: 'Your store has been successfully adapted.',
      step: 4,
    },
    FAILED: {
      title: 'Process Interrupted',
      desc: 'An unexpected error occurred during adaptation.',
      step: 0,
    },
  }

  let currentContent = $derived(statusContent[jobStatus] || statusContent.PENDING)
  const { mutate: createLocalization, isPending } = $derived(useCreateLocalization(storeId))

  // Loading dots animation state
  let dots = $state('')
  onMount(() => {
    const interval = setInterval(() => {
      dots = dots.length >= 3 ? '' : dots + '.'
    }, 500)
    return () => clearInterval(interval)
  })

  function handleContinue() {
    // In a real app, this might navigate to the results or dashboard
    // For now, we'll just reload or go back to store home
    alert('Not implemented')
  }
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

  <div class="z-10 flex w-full max-w-2xl flex-col items-center justify-center p-8 text-center">
    <!-- Animated Status Content -->
    {#key jobStatus}
      <div
        class="flex flex-col items-center gap-6"
        in:fly={{ y: 20, duration: 600, delay: 100, easing: cubicOut }}
        out:fade={{ duration: 200 }}
      >
        <!-- Icon / Progress Indicator -->
        {#if jobStatus === 'LOCALIZING'}
          <div
            class="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20"
          >
            <svg
              class="h-8 w-8"
              fill="none"
              height="32"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="32"
              xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12" /></svg
            >
          </div>
        {:else if jobStatus === 'LOCALIZATION_FAILED'}
          <div
            class="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/20"
          >
            <svg
              class="h-8 w-8"
              fill="none"
              height="32"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="32"
              xmlns="http://www.w3.org/2000/svg"
              ><circle cx="12" cy="12" r="10" /><line x1="15" x2="9" y1="9" y2="15" /><line
                x1="9"
                x2="15"
                y1="9"
                y2="15"
              /></svg
            >
          </div>
        {:else}
          <div class="relative flex h-16 w-16 items-center justify-center">
            <div
              class="absolute inset-0 animate-spin rounded-full border-t-2 border-primary opacity-20"
            ></div>
            <div
              style:animation-direction="reverse"
              style:animation-duration="2s"
              class="absolute inset-0 animate-spin rounded-full border-r-2 border-primary/40"
            ></div>
          </div>
        {/if}

        <!-- Text Content -->
        <div class="space-y-2">
          <h1 class="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
            {currentContent.title}{#if jobStatus !== 'LOCALIZED' && jobStatus !== 'LOCALIZATION_FAILED'}<span
                class="inline-block w-[1ch] text-left">{dots}</span
              >{/if}
          </h1>
          <p class="font-sans text-lg text-muted-foreground/80">
            {currentContent.desc}
          </p>
        </div>
      </div>
    {/key}

    <!-- Progress Bar (Fake or Real based on steps) -->
    {#if jobStatus !== 'LOCALIZED' && jobStatus !== 'LOCALIZATION_FAILED'}
      <div class="mt-12 w-full max-w-xs" in:fade={{ delay: 400 }}>
        <div class="relative h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            style:width="{(currentContent.step / 4) * 100}%"
            class="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-in-out"
          >
            <div
              class="absolute top-0 right-0 h-full w-20 translate-x-10 animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"
            ></div>
          </div>
        </div>
        <div class="mt-2 flex justify-between text-xs font-medium text-muted-foreground">
          <span>Step {currentContent.step} of 3</span>
          <span>{Math.round((currentContent.step / 4) * 100)}%</span>
        </div>
      </div>
    {/if}

    <!-- Result Action -->
    {#if jobStatus === 'LOCALIZING'}
      <div class="mt-10" in:fly={{ y: 10, delay: 500 }}>
        <Button
          class="min-w-[200px] animate-in duration-500 fade-in zoom-in"
          onclick={handleContinue}
          size="lg"
        >
          View Localized Store
        </Button>
      </div>
    {:else if jobStatus === 'LOCALIZATION_FAILED'}
      <div class="mt-10" in:fly={{ y: 10, delay: 500 }}>
        <Button
          disabled={isPending}
          loading={isPending}
          onclick={() => createLocalization(jobRegions)}
          size="lg"
          variant="outline">Retry</Button
        >
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  @keyframes shimmer {
    100% {
      transform: translateX(-100%);
    }
  }
</style>
