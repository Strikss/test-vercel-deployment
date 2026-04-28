import { isThemeId, type ThemeId } from './themes'

export type Tenant = {
  slug: string
  theme: ThemeId
  name: string
}

export type TenantListResponse = {
  tenants: Tenant[]
  storage: 'redis' | 'seed'
}

const CONFIGURED_PRIMARY_HOST = (
  import.meta.env.VITE_PRIMARY_HOST as string | undefined
)?.toLowerCase()

export function getPrimaryHost() {
  if (CONFIGURED_PRIMARY_HOST) return CONFIGURED_PRIMARY_HOST
  if (typeof window !== 'undefined') return window.location.hostname.toLowerCase()
  return 'localhost'
}

export function getTenantSlugFromHost(host: string): string | null {
  const cleanHost = host.split(':')[0].toLowerCase()
  const primaryHost = getPrimaryHost()
  if (cleanHost === primaryHost) return null
  if (cleanHost === `www.${primaryHost}`) return null
  if (!cleanHost.endsWith(`.${primaryHost}`)) return null

  const slug = cleanHost.slice(0, -(`.${primaryHost}`.length))
  if (!slug || slug.includes('.')) return null
  return slug
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const response = await fetch(`/api/tenant?slug=${encodeURIComponent(slug)}`)
  if (response.status === 404) return null
  if (!response.ok) throw new Error('Failed to load tenant')

  const payload = (await response.json()) as { tenant?: unknown }
  return normalizeTenant(payload.tenant)
}

export async function getCurrentTenant(): Promise<Tenant | null> {
  if (typeof window === 'undefined') return null
  const slug = getTenantSlugFromHost(window.location.hostname)
  if (!slug) return null
  return getTenantBySlug(slug)
}

export async function listTenants(): Promise<TenantListResponse> {
  const response = await fetch('/api/tenants')
  if (!response.ok) throw new Error('Failed to load tenants')

  const payload = (await response.json()) as {
    tenants?: unknown
    storage?: unknown
  }
  const tenants = Array.isArray(payload.tenants)
    ? payload.tenants.map(normalizeTenant).filter((t): t is Tenant => t !== null)
    : []

  return {
    tenants,
    storage: payload.storage === 'redis' ? 'redis' : 'seed',
  }
}

export async function createTenant(tenant: Tenant): Promise<Tenant> {
  const response = await fetch('/api/tenants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tenant),
  })

  const payload = (await response.json().catch(() => ({}))) as {
    tenant?: unknown
    error?: string
  }

  if (!response.ok) {
    throw new Error(payload.error ?? 'Failed to create tenant')
  }

  const created = normalizeTenant(payload.tenant)
  if (!created) throw new Error('API returned an invalid tenant')
  return created
}

export function tenantUrl(slug: string, primaryHost: string = getPrimaryHost()) {
  const protocol =
    typeof window !== 'undefined' ? window.location.protocol : 'https:'
  const port =
    typeof window !== 'undefined' &&
    window.location.port &&
    primaryHost === window.location.hostname
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

function normalizeTenant(input: unknown): Tenant | null {
  if (!input || typeof input !== 'object') return null

  const candidate = input as Record<string, unknown>
  if (
    typeof candidate.slug !== 'string' ||
    typeof candidate.name !== 'string' ||
    typeof candidate.theme !== 'string' ||
    !isThemeId(candidate.theme)
  ) {
    return null
  }

  return {
    slug: candidate.slug,
    theme: candidate.theme,
    name: candidate.name,
  }
}
