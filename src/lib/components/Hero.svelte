<script lang="ts">
  import KeyedMount from './KeyedMount.svelte'
  import { cubicOut, quartInOut, quartOut, quintOut } from 'svelte/easing'
  import { fade, fly, slide } from 'svelte/transition'
</script>

<KeyedMount>
  <section>
    <h1
      class="mt-20 font-serif text-9xl leading-[0.8] font-medium tracking-tight text-foreground md:text-8xl lg:text-9xl"
      in:fly|global={{ duration: 1500, delay: 500, x: -30 }}
      out:fly|global={{ duration: 500, delay: 200, x: -30 }}
    >
      The Cavendish
      <span class="text-primary">Standard</span>
    </h1>
    <p
      class="ml-4 pb-16 text-muted-foreground/80"
      in:slide|global={{ delay: 1400, axis: 'y', duration: 500 }}
      out:slide|global={{ delay: 100, axis: 'y', duration: 500 }}
    >
      Unpeeling the layers of complexity with <strong>precision</strong> and <i>grace</i>.
      <span class="font-medium text-primary">Upload to get started.</span>
    </p>
  </section>
</KeyedMount>
