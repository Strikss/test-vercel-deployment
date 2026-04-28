import { Redis } from '@upstash/redis'

export type ThemeId =
  | 'default'
  | 'blue'
  | 'emerald'
  | 'rose'
  | 'violet'
  | 'amber'

export type Tenant = {
  slug: string
  theme: ThemeId
  name: string
}

const VALID_THEMES = new Set<ThemeId>([
  'default',
  'blue',
  'emerald',
  'rose',
  'violet',
  'amber',
])

const SEED_TENANTS: Tenant[] = [
  { slug: 'acme', theme: 'violet', name: 'Acme Co' },
  { slug: 'bobs', theme: 'amber', name: "Bob's Burgers" },
  { slug: 'atlas', theme: 'emerald', name: 'Atlas Health' },
]

const TENANT_INDEX_KEY = 'tenants:index'

let redis: Redis | null | undefined

export function isTenantStoreError(error: unknown): error is Error {
  return error instanceof Error
}

function getRedis() {
  if (redis !== undefined) return redis

  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN

  redis = url && token ? new Redis({ url, token }) : null
  return redis
}

export function isRedisConfigured() {
  return getRedis() !== null
}

export function isValidSlug(slug: string) {
  return /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/.test(slug)
}

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && VALID_THEMES.has(value as ThemeId)
}

export function normalizeTenant(input: unknown): Tenant | null {
  if (!input || typeof input !== 'object') return null

  const candidate = input as Record<string, unknown>
  if (
    typeof candidate.slug !== 'string' ||
    typeof candidate.name !== 'string' ||
    !isValidSlug(candidate.slug) ||
    !isThemeId(candidate.theme)
  ) {
    return null
  }

  return {
    slug: candidate.slug,
    theme: candidate.theme,
    name: candidate.name.trim() || candidate.slug,
  }
}

export async function listTenants(): Promise<Tenant[]> {
  const client = getRedis()
  if (!client) return SEED_TENANTS

  const slugs = await client.smembers<string[]>(TENANT_INDEX_KEY)
  if (!slugs.length) return []

  const tenants = await Promise.all(slugs.map((slug) => getTenant(slug)))
  return tenants
    .filter((tenant): tenant is Tenant => tenant !== null)
    .sort((a, b) => a.slug.localeCompare(b.slug))
}

export async function getTenant(slug: string): Promise<Tenant | null> {
  if (!isValidSlug(slug)) return null

  const client = getRedis()
  if (!client) {
    return SEED_TENANTS.find((tenant) => tenant.slug === slug) ?? null
  }

  return normalizeTenant(await client.get(`tenant:${slug}`))
}

export async function createTenant(tenant: Tenant) {
  const client = getRedis()
  if (!client) {
    throw new Error('Redis is not configured')
  }

  await client
    .pipeline()
    .set(`tenant:${tenant.slug}`, tenant)
    .sadd(TENANT_INDEX_KEY, tenant.slug)
    .exec()
}
