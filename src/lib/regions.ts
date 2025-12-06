import type { CountryCode } from './server/prisma'

export interface Region {
  code: CountryCode
  name: string
  color: string
  requirements: string[]
  flag: string
  lat: number
  lng: number
}

export const REGIONS = [
  {
    code: 'US',
    name: 'United States',
    color: '#3B82F6',
    requirements: ['UPC barcode', 'FDA compliance', 'English required'],
    flag: '🇺🇸',
    lat: 37.0902,
    lng: -95.7129,
  },
  {
    code: 'EU',
    name: 'European Union',
    color: '#6366F1',
    requirements: [
      'CE marking',
      'Allergens in bold',
      'Metric units',
      'Multilingual',
      'WEEE symbol',
    ],
    flag: '🇪🇺',
    lat: 54.526,
    lng: 15.2551,
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    color: '#EF4444',
    requirements: ['UKCA marking', 'Recycling symbols', 'UK importer info'],
    flag: '🇬🇧',
    lat: 55.3781,
    lng: -3.436,
  },
  {
    code: 'JP',
    name: 'Japan',
    color: '#F43F5E',
    requirements: ['JAN barcode', 'Recycling codes', 'Specific fonts'],
    flag: '🇯🇵',
    lat: 36.2048,
    lng: 138.2529,
  },
  {
    code: 'CN',
    name: 'China',
    color: '#F59E0B',
    requirements: ['CCC mark', 'Mandarin required', 'Specific claims rules'],
    flag: '🇨🇳',
    lat: 35.8617,
    lng: 104.1954,
  },
  {
    code: 'KR',
    name: 'South Korea',
    color: '#10B981',
    requirements: ['KC mark', 'Korean labeling', 'Country of origin'],
    flag: '🇰🇷',
    lat: 35.9078,
    lng: 127.7669,
  },
  {
    code: 'BR',
    name: 'Brazil',
    color: '#22C55E',
    requirements: ['INMETRO seal', 'Portuguese required', 'ANVISA for cosmetics'],
    flag: '🇧🇷',
    lat: -14.235,
    lng: -51.9253,
  },
  {
    code: 'AU',
    name: 'Australia',
    color: '#8B5CF6',
    requirements: ['Australian Made logo option', 'Metric', 'Recycling codes'],
    flag: '🇦🇺',
    lat: -25.2744,
    lng: 133.7751,
  },
] as const satisfies Region[]
