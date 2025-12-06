<script lang="ts">
  import PhDownloadSimple from '~icons/ph/download-simple'
  import PhSpinnerGap from '~icons/ph/spinner-gap'
  import ImageCard from '$lib/components/ImageCard.svelte'
  import TextCard from '$lib/components/TextCard.svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import * as Tabs from '$lib/components/ui/tabs'
  import { useStoreDetails } from '$lib/hooks/useStoreDetails'
  import { REGIONS } from '$lib/regions'
  import JSZip from 'jszip'
  import { fade } from 'svelte/transition'
  import { toast } from 'svelte-sonner'

  let { storeId }: { storeId: string } = $props()

  const query = $derived(useStoreDetails(storeId))
  const store = $derived(query.data)
  const isLoading = $derived(query.isLoading)

  // Use store state for selected variant ID to coordinate with Tabs
  let selectedVariantId = $state<string>('')

  $effect(() => {
    if (store?.variants && store.variants.length > 0 && !selectedVariantId) {
      selectedVariantId = store.variants[0].id
    }
  })

  function getRegionInfo(code: string) {
    return REGIONS.find((r) => r.code === code)
  }

  function downloadBlob(blob: Blob, name = 'file.txt') {
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = URL.createObjectURL(blob)

    // Create a link element
    const link = document.createElement('a')

    // Set link's href to point to the Blob URL
    link.href = blobUrl
    link.download = name

    // Append link to the body
    document.body.appendChild(link)

    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    )

    // Remove link from body
    document.body.removeChild(link)
  }

  async function downloadZip() {
    if (!store) return

    const zip = new JSZip()
    const folder = zip.folder(`localization-${store.name || 'store'}`)

    if (!folder) return

    // Original Images
    if (store.images.length > 0) {
      const origFolder = folder.folder('original')
      if (origFolder) {
        store.images.forEach((img, i) => {
          if (img) {
            origFolder.file(`original-${i + 1}.png`, img, { base64: true })
          }
        })
      }
    }

    // Variants
    store.variants.forEach((variant) => {
      const regionFolder = folder.folder(variant.region)
      if (regionFolder) {
        // Images
        variant.generatedImages.forEach((img, i) => {
          if (img) {
            regionFolder.file(`localized-${i + 1}.png`, img, { base64: true })
          }
        })
        // Text
        if (variant.localizedText.length > 0) {
          regionFolder.file('text.txt', variant.localizedText.join('\n\n'))
        }
      }
    })

    try {
      const content = await zip.generateAsync({ type: 'blob' })
      downloadBlob(content, `localization-${store.name || 'store'}.zip`)
      toast.success('Download started')
    } catch (error) {
      console.error(error)
      toast.error('Failed to generate ZIP')
    }
  }
</script>

<div class="container mx-auto max-w-6xl p-6">
  <div class="mb-8 flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Localization Results</h1>
      <p class="text-muted-foreground">Review and download your adapted assets.</p>
    </div>
    <Button class="gap-2" onclick={downloadZip} variant="outline">
      <PhDownloadSimple class="h-4 w-4" />
      Download ZIP
    </Button>
  </div>

  {#if isLoading}
    <div class="flex h-64 w-full items-center justify-center">
      <PhSpinnerGap class="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  {:else if store && selectedVariantId}
    <div class="flex flex-col gap-8">
      <Tabs.Root
        class="w-full"
        onValueChange={(v) => (selectedVariantId = v)}
        value={selectedVariantId}
      >
        <Tabs.List class="w-full justify-start overflow-x-auto">
          {#each store.variants as variant}
            {@const region = getRegionInfo(variant.region)}
            <Tabs.Trigger
              class="gap-2 transition-colors duration-300 data-[state=active]:bg-primary/20!"
              value={variant.id}
            >
              <span class="text-lg">{region?.flag}</span>
              <span>{variant.region}</span>
              {#if region}
                <div
                  style:background-color={region.color}
                  class="ml-1 h-1.5 w-1.5 rounded-full"
                ></div>
              {/if}
            </Tabs.Trigger>
          {/each}
        </Tabs.List>

        {#each store.variants as variant}
          <Tabs.Content class="mt-6 outline-none" value={variant.id}>
            <div class="grid gap-8 lg:grid-cols-2" in:fade={{ duration: 200 }}>
              <!-- Left Column: Images -->
              <div class="space-y-6">
                <h2 class="text-xl font-semibold">Visual Adaptation</h2>

                <div class="grid gap-6">
                  {#each store.images as originalImage, i}
                    {@const localizedImage = variant.generatedImages[i]}
                    <div class="rounded-lg border bg-card p-4 shadow-sm">
                      <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Original -->
                        <div class="space-y-2">
                          <ImageCard
                            alt="Original"
                            label="Original"
                            src={originalImage ? `data:image/png;base64,${originalImage}` : null}
                          />
                        </div>

                        <!-- Localized -->
                        <div class="space-y-2">
                          <ImageCard
                            alt="Localized"
                            label={`Localized (${variant.region})`}
                            src={localizedImage ? `data:image/png;base64,${localizedImage}` : null}
                          />
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>

              <!-- Right Column: Text -->
              <div class="space-y-6">
                <h2 class="text-xl font-semibold">Text Adaptation</h2>

                <div class="space-y-4">
                  {#each variant.localizedText as textBlock, i}
                    <TextCard index={i} textData={textBlock} />
                  {/each}

                  {#if variant.localizedText.length === 0}
                    <div
                      class="rounded-lg border border-dashed p-8 text-center text-muted-foreground"
                    >
                      No localized text available.
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          </Tabs.Content>
        {/each}
      </Tabs.Root>
    </div>
  {:else}
    <div class="rounded-lg border border-dashed p-12 text-center">
      <p class="text-lg text-muted-foreground">No localization data found.</p>
    </div>
  {/if}
</div>
