import { getTenantSlugFromHost } from './tenant'

export function isTenantHost() {
  if (typeof window === 'undefined') return false
  return getTenantSlugFromHost(window.location.hostname) !== null
}
