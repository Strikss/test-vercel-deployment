import { useMemo, useState } from 'react'
import { Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ThemePicker } from '@/components/theme-picker'
import { NameInput } from '@/components/name-input'
import { InstancePreview } from '@/components/instance-preview'
import { CodeBlock } from '@/components/code-block'
import {
  buildVercelDeployUrl,
  isValidProjectName,
  sanitizeProjectName,
} from '@/lib/deploy'
import type { ThemeId } from '@/lib/themes'

export function DeployButtonPage() {
  const [theme, setTheme] = useState<ThemeId>('violet')
  const [name, setName] = useState('acme-store')

  const valid = isValidProjectName(name)
  const deployUrl = useMemo(
    () => (valid ? buildVercelDeployUrl({ theme, name }) : ''),
    [theme, name, valid]
  )

  const buttonMarkdown = useMemo(
    () =>
      valid
        ? `[![Deploy with Vercel](https://vercel.com/button)](${deployUrl})`
        : '',
    [deployUrl, valid]
  )

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 max-w-2xl space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Deploy with the Vercel Button
        </h1>
        <p className="text-muted-foreground">
          Pick a theme and a project name. We build the canonical{' '}
          <code>vercel.com/new/clone</code> URL with your env-var values
          pre-filled, so the user lands on Vercel&apos;s flow with everything
          already set.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configure</CardTitle>
            <CardDescription>
              Theme and name flow through to the Vercel form as defaults.
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
              This is what visitors see at{' '}
              <code>https://{name || 'your-app'}.vercel.app</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InstancePreview theme={theme} name={name} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">1 — One-click deploy</CardTitle>
          <CardDescription>
            Opens Vercel&apos;s clone flow in a new tab. The user logs in,
            confirms repo + env vars, and ships.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild disabled={!valid}>
              {valid ? (
                <a href={deployUrl} target="_blank" rel="noreferrer">
                  <img
                    src="https://vercel.com/button"
                    alt="Deploy with Vercel"
                    className="h-5"
                  />
                  Deploy with Vercel
                </a>
              ) : (
                <span>Deploy with Vercel</span>
              )}
            </Button>
            <Button asChild variant="outline">
              <Link to={`/preview?theme=${theme}&name=${name}`}>
                <Eye className="size-4" aria-hidden /> Open preview route
              </Link>
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium uppercase text-muted-foreground">
              Generated URL
            </div>
            <CodeBlock
              code={deployUrl || '— enter a valid project name —'}
              language="url"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium uppercase text-muted-foreground">
              Drop-in markdown for your README
            </div>
            <CodeBlock
              code={buttonMarkdown || '— enter a valid project name —'}
              language="markdown"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">2 — How it works</CardTitle>
          <CardDescription>
            The query string is the contract.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <code>repository-url</code> — the GitHub template that Vercel
              clones into the user&apos;s account.
            </li>
            <li>
              <code>project-name</code> + <code>repository-name</code> —
              prefill the project / repo name. The final{' '}
              <code>*.vercel.app</code> URL is derived from this.
            </li>
            <li>
              <code>env</code> + <code>env-&lt;KEY&gt;</code> — list the env
              vars the template needs and pre-populate their values.
            </li>
            <li>
              <code>envDescription</code> + <code>envLink</code> — show context
              + a doc link in the Vercel form.
            </li>
          </ul>
          <Separator />
          <p className="text-muted-foreground">
            <strong className="text-foreground">Limitation</strong> — the user
            lands on Vercel&apos;s UI. You can&apos;t finalize the URL,
            install integrations, or run post-deploy hooks from here.
            That&apos;s why the API approach exists.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
