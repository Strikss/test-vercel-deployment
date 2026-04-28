import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { THEMES, type ThemeId } from '@/lib/themes'

type Props = {
  value: ThemeId
  onChange: (id: ThemeId) => void
}

export function ThemePicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {THEMES.map((theme) => {
        const selected = theme.id === value
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onChange(theme.id)}
            aria-pressed={selected}
            className={cn(
              'group flex flex-col items-start gap-2 rounded-lg border bg-card p-3 text-left transition-all',
              'hover:border-ring/60 hover:shadow-sm',
              selected
                ? 'border-ring ring-2 ring-ring/30'
                : 'border-border'
            )}
          >
            <div className="flex w-full items-center justify-between">
              <span
                className="size-6 rounded-md border border-border/60 shadow-inner"
                style={{ background: theme.swatch }}
                aria-hidden
              />
              {selected ? (
                <Check className="size-4 text-foreground" aria-hidden />
              ) : null}
            </div>
            <div>
              <div className="text-sm font-medium">{theme.label}</div>
              <div className="text-xs text-muted-foreground line-clamp-2">
                {theme.description}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
