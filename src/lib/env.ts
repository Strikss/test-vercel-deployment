import instanceJson from '@/instance.json'
import { isThemeId, type ThemeId } from './themes'

export type InstanceConfig = {
  theme: ThemeId
  name: string
}

export function readInstanceConfig(): InstanceConfig | null {
  const envTheme = import.meta.env.VITE_INSTANCE_THEME as string | undefined
  const envName = import.meta.env.VITE_INSTANCE_NAME as string | undefined

  const rawTheme = envTheme ?? instanceJson.theme
  const rawName = envName ?? instanceJson.name

  if (!rawName || !isThemeId(rawTheme)) return null
  return { theme: rawTheme, name: rawName }
}

export function readInstanceConfigSource(): 'env' | 'instance.json' | 'none' {
  const envTheme = import.meta.env.VITE_INSTANCE_THEME as string | undefined
  const envName = import.meta.env.VITE_INSTANCE_NAME as string | undefined
  if (envTheme && envName) return 'env'
  if (instanceJson.name && isThemeId(instanceJson.theme)) return 'instance.json'
  return 'none'
}
