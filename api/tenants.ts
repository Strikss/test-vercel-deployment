import type { ApiRequest, ApiResponse } from './_http.js'
import {
  createTenant,
  isRedisConfigured,
  isTenantStoreError,
  listTenants,
  normalizeTenant,
} from './_tenant-store.js'

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
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

      const existing = (await listTenants()).some(
        (item) => item.slug === tenant.slug
      )
      if (existing) {
        return res.status(409).json({ error: 'Tenant slug is already taken' })
      }

      await createTenant(tenant)
      return res.status(201).json({ tenant })
    }

    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error: isTenantStoreError(error)
        ? error.message
        : 'Tenant storage request failed',
    })
  }
}
