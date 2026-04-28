import { Link, NavLink } from 'react-router-dom'
import { Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Overview' },
  { to: '/deploy-button', label: 'Deploy Button' },
  { to: '/deploy-api', label: 'Deploy via API' },
  { to: '/preview', label: 'Preview' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <Rocket className="size-4" aria-hidden />
          </span>
          <span>Deploy Lab</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-1.5 transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
