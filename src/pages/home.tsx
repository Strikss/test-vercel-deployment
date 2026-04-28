import { useMemo, useState } from 'react'
import { ArrowUpRight, ExternalLink, Plus } from 'lucide-react'
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
import { CodeBlock } from '@/components/code-block'
import {
  getPrimaryHost,
  isValidSlug,
  listTenants,
  sanitizeSlug,
  tenantUrl,
} from '@/lib/tenant'
import { THEMES, type ThemeId } from '@/lib/themes'
import { cn } from '@/lib/utils'

const REPO_URL = 'https://github.com/Strikss/test-vercel-deployment'
const EDIT_URL = `${REPO_URL}/edit/main/src/instance.json`

export function HomePage() {
  const [slug, setSlug] = useState('newshop')
  const [theme, setTheme] = useState<ThemeId>('violet')
  const [name, setName] = useState('New Shop')
  const tenants = useMemo(listTenants, [])
  const primaryHost = getPrimaryHost()

  const validSlug = isValidSlug(slug)
  const slugTaken = tenants.some((t) => t.slug === slug)
  const newTenantUrl = validSlug ? tenantUrl(slug) : ''

  const jsonSnippet = useMemo(() => {
    const merged: Record<string, { theme: string; name: string }> = {}
    for (const t of tenants) merged[t.slug] = { theme: t.theme, name: t.name }
    if (validSlug && !slugTaken) merged[slug] = { theme, name }
    return JSON.stringify({ tenants: merged }, null, 2)
  }, [tenants, slug, theme, name, validSlug, slugTaken])

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
          Pick a slug and a theme. After committing it to{' '}
          <code>src/instance.json</code> and pushing, your tenant is live at{' '}
          <code>&lt;slug&gt;.{primaryHost}</code>. Same Vercel deployment serves
          every subdomain — no per-tenant build, no backend.
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
            <Badge variant="secondary">{tenants.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {tenants.length === 0 ? (
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
                    href={tenantUrl(t.slug)}
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
                Adds an entry to <code>src/instance.json</code>. Push to commit
                and Vercel auto-deploys.
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
            <Label>Updated <code>src/instance.json</code></Label>
            <CodeBlock code={jsonSnippet} language="json" />
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild disabled={!validSlug || slugTaken}>
                {validSlug && !slugTaken ? (
                  <a href={EDIT_URL} target="_blank" rel="noreferrer">
                    Open instance.json on GitHub
                    <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                ) : (
                  <span>Open instance.json on GitHub</span>
                )}
              </Button>
              <span className="text-xs text-muted-foreground">
                Paste the JSON above, commit, push → Vercel deploys → your
                subdomain is live.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/40">
        <CardHeader>
          <CardTitle className="text-base">How this works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">One deployment</strong> — this
            Vite app is deployed once. The same static bundle serves every
            subdomain.
          </p>
          <p>
            <strong className="text-foreground">Wildcard domain</strong> —{' '}
            <code>*.{primaryHost}</code> is configured on the Vercel project,
            so every <code>&lt;slug&gt;.{primaryHost}</code> hits this build.
          </p>
          <p>
            <strong className="text-foreground">Client-side resolve</strong> —
            the SPA reads <code>window.location.hostname</code>, extracts the
            subdomain, looks up the tenant in <code>instance.json</code>,
            applies the theme.
          </p>
          <p>
            <strong className="text-foreground">Limit</strong> — adding a new
            tenant requires a commit + redeploy. For instant registration
            without commits, swap the JSON for Vercel Edge Config or KV.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
