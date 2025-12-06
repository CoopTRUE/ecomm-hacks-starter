<script lang="ts">
  import PhCheck from '~icons/ph/check'
  import PhArrowRight from '~icons/ph/arrow-right'
  import { type Region, REGIONS } from '$lib/regions'
  import { fade, fly, slide } from 'svelte/transition'
  import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip'
  import { TooltipProvider } from '$lib/components/ui/tooltip'
  import { Button } from '$lib/components/ui/button'

  let {
    selectedRegions = $bindable([]),
  }: {
    selectedRegions?: string[]
  } = $props()

  function toggleRegion(code: string) {
    if (selectedRegions.includes(code)) {
      selectedRegions = selectedRegions.filter((r) => r !== code)
    } else {
      selectedRegions.push(code)
    }
  }

  function onContinue() {}
</script>

<TooltipProvider>
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
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            {#snippet child({ props })}
              <button
                in:fly|global={{ y: 100, delay: i * 100 + 500 }}
                {...props}
                class="group relative flex w-full cursor-pointer items-center gap-3 rounded-lg border border-transparent bg-white/0 p-3 text-left transition-all duration-300 hover:border-white/10 hover:bg-white/5"
                class:bg-white_10={selectedRegions.includes(region.code)}
                class:border-white_20={selectedRegions.includes(region.code)}
                onclick={() => toggleRegion(region.code)}
              >
                <!-- Selection Glow -->
                {#if selectedRegions.includes(region.code)}
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
                  class:bg-white={selectedRegions.includes(region.code)}
                  class:border-white={selectedRegions.includes(region.code)}
                >
                  {#if selectedRegions.includes(region.code)}
                    <PhCheck class="h-3 w-3 text-black" />
                  {/if}
                </div>
              </button>
            {/snippet}
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="start"
            class="z-50 ml-4 w-64 rounded-lg border border-white/10 bg-[#0a0a0f]/95 p-4 shadow-xl backdrop-blur-xl"
            style="border-color: {region.color}40; box-shadow: 0 0 30px -10px {region.color}20"
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
          </TooltipContent>
        </Tooltip>
      {/each}
    </div>

    {#if selectedRegions.length > 0}
      <div class="mt-4" in:slide={{ duration: 300 }}>
        <Button
          class="w-full bg-linear-to-r from-primary to-purple-500 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-600"
          onclick={onContinue}
        >
          Continue
          <PhArrowRight class="ml-2 h-4 w-4" />
        </Button>
      </div>
    {/if}
  </div>
</TooltipProvider>
