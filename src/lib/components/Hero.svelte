<script lang="ts">
  import { fade, fly, slide } from 'svelte/transition'
  import KeyedMount from './KeyedMount.svelte'
  import { cubicOut, quartInOut, quartOut, quintOut } from 'svelte/easing'
</script>

<KeyedMount>
  <section>
    <h1
      class="mt-20 font-serif text-9xl leading-[0.8] font-medium tracking-tight text-foreground md:text-8xl lg:text-9xl"
      in:fly|global={{ duration: 1500, delay: 500, x: -30 }}
    >
      The Cavendish
      <span class="text-primary">Standard</span>
    </h1>
    <p
      in:slide|global={{ delay: 1400, axis: 'y', easing: quartInOut, duration: 500 }}
      class="ml-4 pb-20 text-muted-foreground/80"
    >
      Unpeeling the layers of complexity with <strong>precision</strong> and <i>grace</i>.
      <span class="font-medium text-primary">Upload to get started.</span>
    </p>
  </section>
</KeyedMount>
