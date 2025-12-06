<script lang="ts">
  import './layout.css'
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
  import favicon from '$lib/assets/favicon.svg'
  import { ModeWatcher } from 'mode-watcher'

  let { children } = $props()

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
      },
    },
  })
</script>

<svelte:head>
  <link href={favicon} rel="icon" />
</svelte:head>

<ModeWatcher defaultMode="dark" />
<QueryClientProvider client={queryClient}>
  {@render children()}
</QueryClientProvider>
