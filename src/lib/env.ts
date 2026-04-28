import { getCurrentTenant, type Tenant } from './tenant'

export type InstanceConfig = Tenant

export function readInstanceConfig(): InstanceConfig | null {
  return getCurrentTenant()
}
