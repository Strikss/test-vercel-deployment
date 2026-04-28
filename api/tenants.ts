import type { ApiRequest, ApiResponse } from './_http'
import {
  createTenant,
  isRedisConfigured,
  listTenants,
  normalizeTenant,
} from './_tenant-store'

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({
      tenants: await listTenants(),
      storage: isRedisConfigured() ? 'redis' : 'seed',
    })
  }

  if (req.method === 'POST') {
    const tenant = normalizeTenant(req.body)
    if (!tenant) {
      return res.status(400).json({ error: 'Invalid tenant config' })
    }

    if (!isRedisConfigured()) {
      return res.status(503).json({
        error:
          'Redis is not configured. Add Upstash Redis env vars to create tenants at runtime.',
      })
    }

    const existing = (await listTenants()).some((item) => item.slug === tenant.slug)
    if (existing) {
      return res.status(409).json({ error: 'Tenant slug is already taken' })
    }

    await createTenant(tenant)
    return res.status(201).json({ tenant })
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
