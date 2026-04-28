import { CheckCircle2, Sparkles, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { THEMES, type ThemeId, themeClass } from '@/lib/themes'
import { cn } from '@/lib/utils'

type Props = {
  theme: ThemeId
  name: string
  className?: string
}

export function InstancePreview({ theme, name, className }: Props) {
  const themeMeta = THEMES.find((t) => t.id === theme) ?? THEMES[0]

  return (
    <div className={cn(themeClass(theme), className)}>
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-lg">
                Welcome to{' '}
                <span className="text-primary">{name || 'your-app'}</span>
              </CardTitle>
              <CardDescription>
                A live shadcn/ui demo with the {themeMeta.label.toLowerCase()}{' '}
                theme baked in at build time.
              </CardDescription>
            </div>
            <Badge variant="accent" className="gap-1">
              <Sparkles className="size-3" aria-hidden />
              {themeMeta.label}
            </Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-3 py-4">
          <div className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 size-4 text-primary" aria-hidden />
            <span>
              Brand color is driven by a single CSS variable, set per
              deployment.
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Zap className="mt-0.5 size-4 text-primary" aria-hidden />
            <span>
              Same codebase, different envs — no rebuild fork per customer.
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2">
          <Button>Get started</Button>
          <Button variant="outline">View docs</Button>
          <Button variant="ghost">Skip</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
