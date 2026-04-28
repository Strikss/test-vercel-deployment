import instanceJson from '@/instance.json'
import { isThemeId, type ThemeId } from './themes'

export type Tenant = {
  slug: string
  theme: ThemeId
  name: string
}

const PRIMARY_HOST = (
  (import.meta.env.VITE_PRIMARY_HOST as string | undefined) ?? 'localhost'
).toLowerCase()

export function getPrimaryHost() {
  return PRIMARY_HOST
}

export function getTenantSlugFromHost(host: string): string | null {
  const cleanHost = host.split(':')[0].toLowerCase()
  if (cleanHost === PRIMARY_HOST) return null
  if (cleanHost === `www.${PRIMARY_HOST}`) return null
  if (!cleanHost.endsWith(`.${PRIMARY_HOST}`)) return null

  const slug = cleanHost.slice(0, -(`.${PRIMARY_HOST}`.length))
  if (!slug || slug.includes('.')) return null
  return slug
}

export function getTenantBySlug(slug: string): Tenant | null {
  const tenants = instanceJson.tenants as Record<
    string,
    { theme: string; name: string }
  >
  const config = tenants[slug]
  if (!config || !isThemeId(config.theme)) return null
  return { slug, theme: config.theme, name: config.name }
}

export function getCurrentTenant(): Tenant | null {
  if (typeof window === 'undefined') return null
  const slug = getTenantSlugFromHost(window.location.hostname)
  if (!slug) return null
  return getTenantBySlug(slug)
}

export function listTenants(): Tenant[] {
  const tenants = instanceJson.tenants as Record<
    string,
    { theme: string; name: string }
  >
  return Object.entries(tenants)
    .filter(([, cfg]) => isThemeId(cfg.theme))
    .map(([slug, cfg]) => ({
      slug,
      theme: cfg.theme as ThemeId,
      name: cfg.name,
    }))
}

export function tenantUrl(slug: string, primaryHost: string = PRIMARY_HOST) {
  const protocol =
    typeof window !== 'undefined' ? window.location.protocol : 'https:'
  const port =
    typeof window !== 'undefined' && window.location.port
      ? `:${window.location.port}`
      : ''
  return `${protocol}//${slug}.${primaryHost}${port}`
}

export function isValidSlug(slug: string) {
  return /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/.test(slug)
}

export function sanitizeSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32)
}
