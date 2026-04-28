import { useMemo, useState } from 'react'
import { CheckCircle2, Loader2, ExternalLink } from 'lucide-react'
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
import { ThemePicker } from '@/components/theme-picker'
import { NameInput } from '@/components/name-input'
import { InstancePreview } from '@/components/instance-preview'
import { CodeBlock } from '@/components/code-block'
import {
  buildApiSimulationSteps,
  isValidProjectName,
  sanitizeProjectName,
  type SimulatedStep,
} from '@/lib/deploy'
import type { ThemeId } from '@/lib/themes'
import { cn } from '@/lib/utils'

type StepState = 'idle' | 'pending' | 'done'

export function DeployApiPage() {
  const [theme, setTheme] = useState<ThemeId>('blue')
  const [name, setName] = useState('beta-tenant')
  const [running, setRunning] = useState(false)
  const [stepStates, setStepStates] = useState<StepState[]>([
    'idle',
    'idle',
    'idle',
  ])
  const [deployUrl, setDeployUrl] = useState<string | null>(null)

  const valid = isValidProjectName(name)
  const steps = useMemo(
    () => buildApiSimulationSteps({ theme, name }),
    [theme, name]
  )

  async function simulate() {
    if (!valid || running) return
    setRunning(true)
    setDeployUrl(null)
    setStepStates(['idle', 'idle', 'idle'])

    for (let i = 0; i < steps.length; i++) {
      setStepStates((prev) => {
        const next = [...prev]
        next[i] = 'pending'
        return next
      })
      await new Promise((r) => setTimeout(r, steps[i].duration))
      setStepStates((prev) => {
        const next = [...prev]
        next[i] = 'done'
        return next
      })
    }

    setDeployUrl(`https://${name}-${randomSuffix()}.vercel.app`)
    setRunning(false)
  }

  function reset() {
    setStepStates(['idle', 'idle', 'idle'])
    setDeployUrl(null)
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 max-w-2xl space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Deploy via the Vercel REST API
        </h1>
        <p className="text-muted-foreground">
          The user never leaves your UI. After OAuth, your backend POSTs to{' '}
          <code>/v9/projects</code> and <code>/v13/deployments</code>. This
          page simulates the flow with mock latency so you can feel the shape.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configure</CardTitle>
            <CardDescription>
              The same inputs as the Button approach, but the values are sent
              programmatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <ThemePicker value={theme} onChange={setTheme} />
            </div>
            <NameInput
              value={name}
              onChange={(v) => sanitizeAndSet(v, setName)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Live preview</CardTitle>
            <CardDescription>
              The themed instance the API call will produce.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InstancePreview theme={theme} name={name} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">1 — Sign in with Vercel</CardTitle>
          <CardDescription>
            Real flow points the user at{' '}
            <code>https://vercel.com/integrations/&lt;slug&gt;/new</code>. The
            integration callback hands you an access token bound to the
            user&apos;s scope.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" disabled>
            <ExternalLink className="size-4" aria-hidden /> Sign in with Vercel
            (mock)
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-lg">
                2 — Provision project + deploy
              </CardTitle>
              <CardDescription>
                Run the simulation to watch each API call resolve.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={reset}
                disabled={running}
              >
                Reset
              </Button>
              <Button onClick={simulate} disabled={!valid || running} size="sm">
                {running ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />{' '}
                    Deploying…
                  </>
                ) : (
                  'Run simulation'
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step, i) => (
            <StepRow key={step.endpoint} step={step} state={stepStates[i]} />
          ))}

          {deployUrl && (
            <>
              <Separator />
              <div className="rounded-lg border bg-accent/50 p-4 text-sm">
                <div className="mb-1 flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="size-4 text-primary" aria-hidden />
                  <span className="font-medium">Deployment ready</span>
                </div>
                <a
                  href={deployUrl}
                  className="font-mono text-xs underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {deployUrl}
                </a>
                <p className="mt-2 text-xs text-muted-foreground">
                  In production this URL comes from the deployment response.
                  Track readiness via <code>GET /v13/deployments/&lt;id&gt;</code>{' '}
                  or webhooks.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">3 — Why pick this</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Custom domains</strong> — assign{' '}
            <code>customer.yourdomain.com</code> via{' '}
            <code>POST /v10/projects/&lt;id&gt;/domains</code> right after
            deploy.
          </p>
          <p>
            <strong className="text-foreground">Multi-tenant</strong> — pair
            with Vercel for Platforms to host hundreds of customer sites under
            your own brand.
          </p>
          <p>
            <strong className="text-foreground">Post-deploy hooks</strong> —
            seed a database, run migrations, send Slack alerts. None of that
            is possible from the Button URL.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function sanitizeAndSet(v: string, set: (s: string) => void) {
  set(sanitizeProjectName(v))
}

function StepRow({ step, state }: { step: SimulatedStep; state: StepState }) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4 transition-colors',
        state === 'pending' && 'border-ring/40 bg-accent/30',
        state === 'done' && 'border-primary/30 bg-primary/5'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge
              variant={state === 'done' ? 'default' : 'outline'}
              className="font-mono"
            >
              {step.method}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">
              {step.endpoint}
            </span>
          </div>
          <div className="text-sm font-medium">{step.label}</div>
        </div>
        <StepStatus state={state} />
      </div>
      {step.body ? (
        <div className="mt-3">
          <CodeBlock
            language="json"
            code={JSON.stringify(step.body, null, 2)}
          />
        </div>
      ) : null}
    </div>
  )
}

function StepStatus({ state }: { state: StepState }) {
  if (state === 'pending')
    return <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden />
  if (state === 'done')
    return <CheckCircle2 className="size-4 text-primary" aria-hidden />
  return <span className="size-4 rounded-full border border-border" aria-hidden />
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 8)
}
