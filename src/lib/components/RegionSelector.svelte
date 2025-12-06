<script lang="ts">
  import PhArrowRight from '~icons/ph/arrow-right'
  import PhCheck from '~icons/ph/check'
  import { page } from '$app/state'
  import { Button } from '$lib/components/ui/button'
  import * as Tooltip from '$lib/components/ui/tooltip'
  import { useCreateAnalysis } from '$lib/hooks/useCreateAnalysis'
  import { useCreateLocalization } from '$lib/hooks/useCreateLocalization'
  import { useJob } from '$lib/hooks/useJob'
  import { REGIONS } from '$lib/regions'
  import type { CountryCode } from '$lib/server/prisma'
  import { focusedRegions } from '$lib/stores.svelte'
  import { fade, fly, slide } from 'svelte/transition'

  function toggleRegion(code: CountryCode) {
    if (focusedRegions.regions.includes(code)) {
      focusedRegions.regions = focusedRegions.regions.filter((r) => r !== code)
    } else {
      focusedRegions.regions.push(code)
    }
  }

  const { regions } = $derived(focusedRegions)

  const job = useJob(page.params.storeId!)
  const jobStatus = $derived(job.data?.status ?? 'PENDING')
  const { mutate: createAnalysis, isPending: isCreatingAnalysis } = useCreateAnalysis(
    page.params.storeId!
  )
  const { mutate: createLocalization, isPending } = $derived(
    useCreateLocalization(page.params.storeId!)
  )
</script>

<Tooltip.Provider>
  <div
    class="absolute top-0 bottom-0 left-0 flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
    in:fade|global={{ duration: 300, delay: 500 }}
    out:fade|global={{ duration: 300 }}
  >
    <div class="mb-2 flex flex-col gap-1">
      <h3 class="text-lg font-semibold text-white">Target Regions</h3>
      <p class="text-xs text-white/50">Select markets for localization</p>
    </div>

    <div class="flex flex-1 flex-col gap-2 overflow-y-auto">
      {#each REGIONS as region, i}
        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger>
            {#snippet child({ props })}
              <button
                class:bg-white_10={regions.includes(region.code)}
                class:border-white_20={regions.includes(region.code)}
                in:fly|global={{ y: 100, delay: i * 100 + 500 }}
                {...props}
                class="group relative flex w-full cursor-pointer items-center gap-3 rounded-lg border border-transparent bg-white/0 p-3 text-left transition-all duration-300 hover:border-white/10 hover:bg-white/5"
                onclick={() => toggleRegion(region.code)}
              >
                <!-- Selection Glow -->
                {#if regions.includes(region.code)}
                  <div
                    style:background-color={region.color}
                    class="absolute inset-0 rounded-lg opacity-20 blur-md transition-opacity duration-500"
                    in:fade={{ duration: 300 }}
                  ></div>
                {/if}

                <!-- Hover Glow -->
                <div
                  style:background-color={region.color}
                  class="absolute inset-0 rounded-lg opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-10"
                ></div>

                <span class="z-10 text-2xl drop-shadow-lg filter">{region.flag}</span>

                <div class="z-10 flex flex-1 flex-col">
                  <span
                    class="text-sm font-medium text-white transition-colors group-hover:text-white"
                  >
                    {region.name}
                  </span>
                  <span
                    class="text-[10px] text-white/40 transition-colors group-hover:text-white/60"
                  >
                    {region.requirements.slice(0, 2).join(', ')}...
                  </span>
                </div>

                <div
                  class="z-10 flex h-5 w-5 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:border-white/40"
                  class:bg-white={regions.includes(region.code)}
                  class:border-white={regions.includes(region.code)}
                >
                  {#if regions.includes(region.code)}
                    <PhCheck class="h-3 w-3 text-black" />
                  {/if}
                </div>
              </button>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content
            style="border-color: {region.color}40; box-shadow: 0 0 30px -10px {region.color}20"
            class="z-50 ml-4 w-64 rounded-lg border border-white/10 bg-[#0a0a0f]/95 p-4 shadow-xl backdrop-blur-xl"
            align="start"
            side="right"
          >
            <div class="mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
              <span class="text-2xl">{region.flag}</span>
              <div>
                <h4 class="text-sm font-semibold text-white">{region.name} Requirements</h4>
                <p class="text-[10px] text-white/50">Market specific rules</p>
              </div>
            </div>

            <ul class="flex flex-col gap-2">
              {#each region.requirements as req}
                <li class="flex items-start gap-2 text-xs text-white/80">
                  <div
                    style:color={region.color}
                    class="mt-1.5 h-1 w-1 rounded-full bg-current"
                  ></div>
                  {req}
                </li>
              {/each}
            </ul>

            <div class="mt-3 flex items-center justify-between border-t border-white/10 pt-2">
              <span class="text-[10px] text-white/40">Est. cost</span>
              <span class="font-mono text-xs text-white">€0.40</span>
            </div>
          </Tooltip.Content>
        </Tooltip.Root>
      {/each}
    </div>

    {#if regions.length > 0}
      <div class="mt-4" transition:slide={{ duration: 300 }}>
        <Button
          class="group w-full bg-linear-to-r from-primary to-purple-500 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-600"
          disabled={isPending || isCreatingAnalysis || jobStatus === 'ANALYZING'}
          loading={isPending || isCreatingAnalysis || jobStatus === 'ANALYZING'}
          onclick={() => {
            if (jobStatus !== 'ANALYZED') {
              createAnalysis()
            } else {
              createLocalization(regions)
            }
          }}
        >
          {#if isCreatingAnalysis || jobStatus === 'ANALYZING'}
            Waiting for analysis to complete
          {:else if jobStatus === 'ANALYSIS_FAILED'}
            Retry Analysis?
          {:else}
            Continue
            {#if !isPending}
              <PhArrowRight
                class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            {/if}
          {/if}
        </Button>
      </div>
    {/if}
  </div>
</Tooltip.Provider>
