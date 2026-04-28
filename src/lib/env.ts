import { isThemeId, type ThemeId } from './themes'

export type InstanceConfig = {
  theme: ThemeId
  name: string
}

export function readInstanceConfig(): InstanceConfig | null {
  const envTheme = import.meta.env.VITE_INSTANCE_THEME as string | undefined
  const envName = import.meta.env.VITE_INSTANCE_NAME as string | undefined
  if (envTheme && envName && isThemeId(envTheme)) {
    return { theme: envTheme, name: envName }
  }
  return null
}
