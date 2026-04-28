import { useSearchParams } from 'react-router-dom'
import { InstancePreview } from '@/components/instance-preview'
import { Badge } from '@/components/ui/badge'
import { isThemeId, type ThemeId } from '@/lib/themes'
import { readInstanceConfig } from '@/lib/env'

export function PreviewPage() {
  const [params] = useSearchParams()
  const envConfig = readInstanceConfig()

  const themeParam = params.get('theme')
  const nameParam = params.get('name')

  const theme: ThemeId = envConfig?.theme
    ?? (isThemeId(themeParam) ? themeParam : 'violet')
  const name = envConfig?.name ?? nameParam ?? 'your-app'
  const source = envConfig
    ? 'env (VITE_INSTANCE_*)'
    : themeParam || nameParam
      ? 'URL params'
      : 'defaults'

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-2xl flex-col items-center justify-center px-6 py-12">
      <Badge variant="outline" className="mb-3 rounded-full">
        Source: {source}
      </Badge>
      <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
        This is the &ldquo;deployed&rdquo; instance — the only thing the
        end-user sees. The same component renders in every white-label deploy,
        styled by the theme baked in at build time.
      </p>
      <div className="w-full">
        <InstancePreview theme={theme} name={name} />
      </div>
    </div>
  )
}
