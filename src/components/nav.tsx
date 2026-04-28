import { Link } from 'react-router-dom'
import { Rocket } from 'lucide-react'
import { getPrimaryHost } from '@/lib/tenant'

export function Nav() {
  const host = getPrimaryHost()

  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <Rocket className="size-4" aria-hidden />
          </span>
          <span>Deploy Lab</span>
        </Link>
        <span className="font-mono text-xs text-muted-foreground">
          {host}
        </span>
      </div>
    </header>
  )
}
