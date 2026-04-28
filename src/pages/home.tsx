import { useEffect, useState } from 'react'
import { ArrowUpRight, Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemePicker } from '@/components/theme-picker'
import { InstancePreview } from '@/components/instance-preview'
import {
  createTenant,
  getPrimaryHost,
  isValidSlug,
  listTenants,
  sanitizeSlug,
  type Tenant,
  tenantUrl,
} from '@/lib/tenant'
import { THEMES, type ThemeId } from '@/lib/themes'
import { cn } from '@/lib/utils'

export function HomePage() {
  const [slug, setSlug] = useState('newshop')
  const [theme, setTheme] = useState<ThemeId>('violet')
  const [name, setName] = useState('New Shop')
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [storage, setStorage] = useState<'redis' | 'seed'>('seed')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const primaryHost = getPrimaryHost()

  const validSlug = isValidSlug(slug)
  const slugTaken = tenants.some((t) => t.slug === slug)
  const newTenantUrl = validSlug ? tenantUrl(slug) : ''

  const canSubmit = validSlug && !slugTaken && name.trim() !== '' && !submitting

  useEffect(() => {
    void refreshTenants()
  }, [])

  async function refreshTenants() {
    setLoading(true)
    setMessage(null)
    try {
      const result = await listTenants()
      setTenants(result.tenants)
      setStorage(result.storage)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load tenants')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateTenant() {
    if (!canSubmit) return

    setSubmitting(true)
    setMessage(null)
    try {
      const tenant = await createTenant({
        slug,
        theme,
        name: name.trim(),
      })

      setTenants((current) =>
        [...current, tenant].sort((a, b) => a.slug.localeCompare(b.slug))
      )
      setStorage('redis')
      setMessage(`${tenant.name} is live at ${tenantUrl(tenant.slug)}.`)
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Failed to create tenant'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10 max-w-2xl space-y-3">
        <Badge variant="outline" className="rounded-full">
          Multi-tenant lab
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          One deployment, every tenant gets a branded subdomain
        </h1>
        <p className="text-muted-foreground">
          Pick a slug and a theme. The app writes tenant config to Redis through
          a Vercel API route, then the same deployment serves{' '}
          <code>&lt;slug&gt;.{primaryHost}</code>. No per-tenant build or GitHub
          commit is needed.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Existing tenants</CardTitle>
              <CardDescription>
                Each lives at <code>&lt;slug&gt;.{primaryHost}</code> on the
                same deployment.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={storage === 'redis' ? 'default' : 'secondary'}>
                {storage === 'redis' ? 'Redis' : 'Seed data'}
              </Badge>
              <Badge variant="secondary">{tenants.length}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading tenants...</p>
          ) : tenants.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tenants registered yet. Add one below.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tenants.map((t) => {
                const themeMeta = THEMES.find((th) => th.id === t.theme)
                return (
                  <a
                    key={t.slug}
                    href={tenantUrl(t.slug, primaryHost, '/preview')}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      'group flex items-center justify-between gap-3 rounded-lg border bg-card p-3 text-left transition-all',
                      'hover:border-ring/60 hover:shadow-sm'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="size-8 shrink-0 rounded-md border border-border/60 shadow-inner"
                        style={{ background: themeMeta?.swatch }}
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {t.name}
                        </div>
                        <div className="truncate font-mono text-xs text-muted-foreground">
                          {t.slug}.{primaryHost}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </a>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6 border-primary/40">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plus className="size-5" aria-hidden />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg">Register a new tenant</CardTitle>
              <CardDescription>
                Persists tenant config in Redis through <code>/api/tenants</code>.
                The subdomain is available immediately after creation.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="slug">Subdomain</Label>
                <div className="flex items-center overflow-hidden rounded-md border border-input shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/40">
                  <span className="px-3 text-sm text-muted-foreground select-none">
                    https://
                  </span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(sanitizeSlug(e.target.value))}
                    placeholder="newshop"
                    className="border-0 px-0 shadow-none focus-visible:border-0 focus-visible:ring-0"
                  />
                  <span className="px-3 text-sm text-muted-foreground select-none">
                    .{primaryHost}
                  </span>
                </div>
                <p
                  className={cn(
                    'text-xs',
                    slugTaken
                      ? 'text-destructive'
                      : !validSlug && slug !== ''
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                  )}
                >
                  {slugTaken
                    ? `"${slug}" is already taken — pick another.`
                    : slug === ''
                      ? 'Lowercase letters, digits, dashes — 1 to 32 chars.'
                      : !validSlug
                        ? 'Use only a-z, 0-9, and dashes (no leading/trailing dash).'
                        : `Will be live at ${newTenantUrl}`}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display-name">Display name</Label>
                <Input
                  id="display-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="New Shop"
                />
              </div>

              <div className="space-y-2">
                <Label>Theme</Label>
                <ThemePicker value={theme} onChange={setTheme} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Live preview</Label>
              <InstancePreview theme={theme} name={name} />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                disabled={!canSubmit}
                onClick={() => void handleCreateTenant()}
              >
                {submitting ? 'Creating...' : 'Create tenant'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => void refreshTenants()}
              >
                <RefreshCw className="size-3.5" aria-hidden />
                Refresh
              </Button>
              <span className="text-xs text-muted-foreground">
                Requires Upstash Redis env vars in Vercel. Without Redis, the
                app shows seed tenants but cannot persist new ones.
              </span>
            </div>
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/40">
        <CardHeader>
          <CardTitle className="text-base">How this works</CardTitle>
          <CardDescription>
            The database stores tenant config. Vercel makes every tenant
            hostname reach this same app safely over HTTPS.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 text-sm text-muted-foreground">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border bg-background p-4">
              <h3 className="mb-2 font-medium text-foreground">
                Request flow
              </h3>
              <p>
                A visitor opens <code>acme.{primaryHost}</code>. Vercel routes
                that hostname to this one deployment. The app extracts{' '}
                <code>acme</code>, calls <code>/api/tenant</code>, reads{' '}
                <code>tenant:acme</code> from Redis, then renders the Acme theme.
              </p>
            </div>

            <div className="rounded-lg border bg-background p-4">
              <h3 className="mb-2 font-medium text-foreground">
                Creating a tenant
              </h3>
              <p>
                The form posts to <code>/api/tenants</code>. That API writes the
                slug, name, and theme to Redis. Nothing is committed to GitHub
                and no new Vercel deployment is created for that tenant.
              </p>
            </div>

            <div className="rounded-lg border bg-background p-4">
              <h3 className="mb-2 font-medium text-foreground">
                Why Vercel is needed
              </h3>
              <p>
                Redis only answers “which config belongs to this slug?” Vercel
                handles the infrastructure before our app runs: wildcard domain
                routing, HTTPS certificates, global edge routing, deployments,
                and serverless API functions.
              </p>
            </div>

            <div className="rounded-lg border bg-background p-4">
              <h3 className="mb-2 font-medium text-foreground">
                What we still own
              </h3>
              <p>
                We own tenant records, validation, theme rendering, and data
                isolation. In production, Redis could be replaced or backed by
                Postgres; the important part is resolving every request by
                hostname before loading tenant data.
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-background p-4">
            <h3 className="mb-2 font-medium text-foreground">
              Main takeaway
            </h3>
            <p>
              Deployment is app code. Tenant config is data. We deploy the app
              once to Vercel, configure <code>*.{primaryHost}</code>, and then
              add tenants instantly by writing config to Redis.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
