<script lang="ts">
  import './layout.css'
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
  import favicon from '$lib/assets/favicon.svg'
  import { ModeWatcher } from 'mode-watcher'
  import { Toaster } from '$lib/components/ui/sonner'
  import { toast } from 'svelte-sonner'
  import { AxiosError } from 'axios'

  let { children } = $props()

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
      },
      mutations: {
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message || error.message)
          } else {
            toast.error(error.message)
          }
        },
      },
    },
  })
</script>

<svelte:head>
  <link href={favicon} rel="icon" />
</svelte:head>

<ModeWatcher defaultMode="dark" />
<Toaster />
<QueryClientProvider client={queryClient}>
  {@render children()}
</QueryClientProvider>
