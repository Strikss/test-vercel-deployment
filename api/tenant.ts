import type { ApiRequest, ApiResponse } from './_http.js'
import { getTenant, isTenantStoreError, isValidSlug } from './_tenant-store.js'

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const slug = typeof req.query.slug === 'string' ? req.query.slug : ''
    if (!isValidSlug(slug)) {
      return res.status(400).json({ error: 'Invalid tenant slug' })
    }

    const tenant = await getTenant(slug)
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' })
    }

    return res.status(200).json({ tenant })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error: isTenantStoreError(error)
        ? error.message
        : 'Tenant storage request failed',
    })
  }
}
