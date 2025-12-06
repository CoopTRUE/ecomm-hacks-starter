import type { CountryCode } from './server/prisma'

class LoadedStore {
  loaded = $state(false)
}
class FocusedRegionsStore {
  regions = $state<CountryCode[]>([])
}

export const loaded = new LoadedStore()
export const focusedRegions = new FocusedRegionsStore()
