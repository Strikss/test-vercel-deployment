import { Link } from 'react-router-dom'
import { ArrowRight, MousePointerClick, Code2 } from 'lucide-react'
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

export function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10 max-w-2xl space-y-3">
        <Badge variant="outline" className="rounded-full">
          Deploy lab
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Two ways to ship a white-label app to Vercel
        </h1>
        <p className="text-muted-foreground">
          Pick a theme and a project name. Each page below provisions the same
          shadcn template, but with a different developer-experience trade-off.
          The deployed instance shows a small shadcn card themed with the
          color you picked.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MousePointerClick className="size-5" aria-hidden />
            </div>
            <CardTitle>Vercel Deploy Button</CardTitle>
            <CardDescription>
              A signed URL pointing at <code>vercel.com/new/clone</code>.
              Vercel handles auth, repo cloning, env-var prompting, and
              deployment. Zero backend on your side.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Best for</strong> open-source
              templates and quick demos. The user lands on Vercel&apos;s
              guided flow.
            </p>
            <p>
              <strong className="text-foreground">Trade-off</strong> the
              hand-off leaves your UI — you can suggest a name and pre-fill
              env vars, but Vercel owns the final form.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/deploy-button">
                Try this approach <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Code2 className="size-5" aria-hidden />
            </div>
            <CardTitle>Vercel REST API</CardTitle>
            <CardDescription>
              &ldquo;Sign in with Vercel&rdquo; OAuth, then{' '}
              <code>POST /v9/projects</code> +{' '}
              <code>POST /v13/deployments</code>. You stay in control of the
              entire flow.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Best for</strong> the future
              admin dashboard — pick options, deploy under your domain or the
              customer&apos;s.
            </p>
            <p>
              <strong className="text-foreground">Trade-off</strong> requires
              an OAuth integration, a token store, and a small backend (or
              Vercel Functions) to call the API.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary">
              <Link to="/deploy-api">
                Try this approach <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-8 bg-muted/40">
        <CardHeader>
          <CardTitle className="text-base">What gets deployed?</CardTitle>
          <CardDescription>
            The exact same Vite + React + shadcn project you&apos;re looking at
            now. Two env vars (<code>VITE_INSTANCE_THEME</code>,{' '}
            <code>VITE_INSTANCE_NAME</code>) flip the entry route to{' '}
            <code>/preview</code> and apply the customer&apos;s theme.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild variant="outline">
            <Link to="/preview?theme=violet&name=acme-store">
              See a preview <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
