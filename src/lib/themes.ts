export type ThemeId =
  | 'default'
  | 'blue'
  | 'emerald'
  | 'rose'
  | 'violet'
  | 'amber'

export type Theme = {
  id: ThemeId
  label: string
  swatch: string
  description: string
}

export const THEMES: Theme[] = [
  {
    id: 'default',
    label: 'Default',
    swatch: 'oklch(0.205 0 0)',
    description: 'Neutral slate, classic shadcn look.',
  },
  {
    id: 'blue',
    label: 'Blue',
    swatch: 'oklch(0.546 0.215 262.881)',
    description: 'Calm cobalt — fits dashboards and SaaS.',
  },
  {
    id: 'emerald',
    label: 'Emerald',
    swatch: 'oklch(0.6 0.13 162)',
    description: 'Trusty green — finance and health vibes.',
  },
  {
    id: 'rose',
    label: 'Rose',
    swatch: 'oklch(0.645 0.246 16.439)',
    description: 'Warm coral — DTC, hospitality, lifestyle.',
  },
  {
    id: 'violet',
    label: 'Violet',
    swatch: 'oklch(0.606 0.25 292.717)',
    description: 'Premium purple — AI and creative tools.',
  },
  {
    id: 'amber',
    label: 'Amber',
    swatch: 'oklch(0.78 0.17 70)',
    description: 'Bold amber — bookings and food brands.',
  },
]

export const themeClass = (id: ThemeId) =>
  id === 'default' ? '' : `theme-${id}`

export const isThemeId = (v: string | null | undefined): v is ThemeId =>
  !!v && THEMES.some((t) => t.id === v)
