<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import Dropzone from 'dropzone'
  import 'dropzone/dist/dropzone.css'

  let dropzoneElement: HTMLElement
  let dropzone: Dropzone
  let textInput = ''

  onMount(() => {
    // Disable auto discovery to prevent Dropzone from attaching twice
    // @ts-ignore - Dropzone type might not have autoDiscover static property defined in all versions
    Dropzone.autoDiscover = false

    dropzone = new Dropzone(dropzoneElement, {
      url: '#', // No server-side upload handler by default
      autoProcessQueue: false, // Don't upload automatically
      acceptedFiles: 'image/*,text/plain,.txt', // Allow images and text files
      addRemoveLinks: true,
      dictDefaultMessage: 'Drop image files or text files here',
    })

    dropzone.on('addedfile', (file) => {
      console.log('File added:', file)
      // If it's a text file, we could potentially read it into the text area
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            console.log('Text file content:', e.target.result)
          }
        }
        reader.readAsText(file)
      }
    })
  })

  onDestroy(() => {
    if (dropzone) {
      dropzone.destroy()
    }
  })
</script>

<div
  class="mx-auto w-full max-w-xl space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
>
  <div class="space-y-2">
    <h3 class="text-lg font-semibold text-gray-900">File Upload</h3>
    <div
      class="dropzone flex min-h-[150px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-gray-400"
      bind:this={dropzoneElement}
    ></div>
  </div>

  <div class="relative">
    <div class="absolute inset-0 flex items-center">
      <span class="w-full border-t border-gray-300" />
    </div>
    <div class="relative flex justify-center text-xs uppercase">
      <span class="bg-white px-2 text-gray-500">Or input text</span>
    </div>
  </div>

  <div class="space-y-2">
    <label for="text-input" class="block text-sm font-medium text-gray-700">Text Content</label>
    <textarea
      id="text-input"
      class="min-h-[120px] w-full resize-y rounded-lg border border-gray-300 p-3 text-sm focus:border-transparent focus:ring-2 focus:ring-black"
      bind:value={textInput}
      placeholder="Enter or paste your text strings here..."
    ></textarea>
  </div>
</div>

<style>
  /* Custom overrides for Dropzone styles to match Tailwind/Clean UI */
  :global(.dropzone) {
    border: none;
    background: transparent;
    padding: 0;
  }
  :global(.dropzone .dz-preview) {
    margin: 1rem;
  }
  :global(.dropzone .dz-message) {
    margin: 2rem 0;
    font-weight: 500;
    color: #6b7280;
  }
</style>
