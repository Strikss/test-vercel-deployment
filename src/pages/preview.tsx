import { useSearchParams } from 'react-router-dom'
import { InstancePreview } from '@/components/instance-preview'
import { Badge } from '@/components/ui/badge'
import { isThemeId, type ThemeId } from '@/lib/themes'
import { getCurrentTenant } from '@/lib/tenant'

export function PreviewPage() {
  const [params] = useSearchParams()
  const tenant = getCurrentTenant()

  const themeParam = params.get('theme')
  const nameParam = params.get('name')

  const theme: ThemeId =
    tenant?.theme ?? (isThemeId(themeParam) ? themeParam : 'violet')
  const name = tenant?.name ?? nameParam ?? 'your-app'
  const source = tenant
    ? `tenant: ${tenant.slug}`
    : themeParam || nameParam
      ? 'URL params (preview)'
      : 'defaults'

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-2xl flex-col items-center justify-center px-6 py-12">
      <Badge variant="outline" className="mb-3 rounded-full">
        Source: {source}
      </Badge>
      <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
        This is the deployed instance — what every visitor sees on{' '}
        <code>{tenant ? window.location.hostname : 'the tenant subdomain'}</code>.
        Same bundle as every other tenant; only the theme + name differ.
      </p>
      <div className="w-full">
        <InstancePreview theme={theme} name={name} />
      </div>
    </div>
  )
}
