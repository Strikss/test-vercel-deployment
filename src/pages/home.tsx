import { useMemo, useState } from 'react'
import { ArrowRight, ExternalLink, FileJson, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ThemePicker } from '@/components/theme-picker'
import { NameInput } from '@/components/name-input'
import { InstancePreview } from '@/components/instance-preview'
import { CodeBlock } from '@/components/code-block'
import {
  TEMPLATE_REPO_URL,
  buildVercelDeployUrl,
  isValidProjectName,
  sanitizeProjectName,
  suggestVercelUrl,
} from '@/lib/deploy'
import type { ThemeId } from '@/lib/themes'

export function HomePage() {
  const [theme, setTheme] = useState<ThemeId>('violet')
  const [name, setName] = useState('acme-store')

  const valid = isValidProjectName(name)
  const deployUrl = useMemo(
    () => (valid ? buildVercelDeployUrl({ theme, name }) : ''),
    [theme, name, valid]
  )
  const instanceJsonPreview = useMemo(
    () => JSON.stringify({ theme, name }, null, 2),
    [theme, name]
  )
  const editJsonUrl = `${TEMPLATE_REPO_URL}/edit/main/src/instance.json`

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 max-w-2xl space-y-3">
        <Badge variant="outline" className="rounded-full">
          Deploy lab
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Pick a theme, deploy a branded shadcn app
        </h1>
        <p className="text-muted-foreground">
          Configure once, click <strong>Deploy now</strong>, and Vercel clones
          this repo into your account at the subdomain you chose. The theme is
          baked in at build time — no backend, no database.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configure</CardTitle>
            <CardDescription>
              These two values land in <code>src/instance.json</code> on your
              clone (or in env vars, depending on the path you pick below).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <ThemePicker value={theme} onChange={setTheme} />
            </div>
            <NameInput
              value={name}
              onChange={(v) => setName(sanitizeProjectName(v))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Live preview</CardTitle>
            <CardDescription>
              This is what visitors will see at{' '}
              <code>{suggestVercelUrl(name) || 'your-app.vercel.app'}</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InstancePreview theme={theme} name={name} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-primary/40">
        <CardHeader>
          <CardTitle className="text-lg">Deploy now</CardTitle>
          <CardDescription>
            One click. Vercel clones this repo, applies your theme + name as
            build-time env vars, and gives you{' '}
            <code>{suggestVercelUrl(name) || 'your-app.vercel.app'}</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild disabled={!valid} size="lg">
              {valid ? (
                <a href={deployUrl} target="_blank" rel="noreferrer">
                  <img
                    src="https://vercel.com/button"
                    alt="Deploy with Vercel"
                    className="h-5"
                  />
                  Deploy with Vercel
                  <ArrowRight className="size-4" aria-hidden />
                </a>
              ) : (
                <span>Deploy with Vercel</span>
              )}
            </Button>
            <Button asChild variant="outline">
              <Link to={`/preview?theme=${theme}&name=${name}`}>
                <Eye className="size-4" aria-hidden /> Preview the deployed page
              </Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            After deploy, your <code>instance.json</code> stays empty — the
            theme + name flow through{' '}
            <code>VITE_INSTANCE_THEME</code> /{' '}
            <code>VITE_INSTANCE_NAME</code> env vars so a single click is
            enough. Want it baked into source instead? See below.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <FileJson className="size-5" aria-hidden />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg">
                Or — bake config into <code>src/instance.json</code>
              </CardTitle>
              <CardDescription>
                For a permanent themed deploy, commit your config to source.
                The app reads <code>instance.json</code> when env vars
                aren&apos;t set.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeBlock code={instanceJsonPreview} language="json" />
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline">
              <a href={editJsonUrl} target="_blank" rel="noreferrer">
                Edit instance.json on GitHub
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            </Button>
            <span className="text-xs text-muted-foreground">
              Push your change → Vercel auto-deploys → done.
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-10 mb-4">
        <Separator />
      </div>

      <div className="mb-4 max-w-2xl space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Want more control?
        </h2>
        <p className="text-sm text-muted-foreground">
          Two deeper-dive pages explore alternative deploy mechanisms — useful
          when you outgrow the single-click flow.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Deploy button details</CardTitle>
            <CardDescription>
              How the <code>vercel.com/new/clone</code> URL is built, with the
              full env-var contract.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="ghost" size="sm">
              <Link to="/deploy-button">
                Open <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-base">REST API approach</CardTitle>
            <CardDescription>
              OAuth + <code>POST /v9/projects</code> for an admin dashboard
              that deploys without leaving your UI.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="ghost" size="sm">
              <Link to="/deploy-api">
                Open <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
