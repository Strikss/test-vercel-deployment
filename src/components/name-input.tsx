import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { suggestVercelUrl, isValidProjectName } from '@/lib/deploy'
import { cn } from '@/lib/utils'

type Props = {
  value: string
  onChange: (value: string) => void
  id?: string
}

export function NameInput({ value, onChange, id = 'project-name' }: Props) {
  const valid = isValidProjectName(value)
  const url = suggestVercelUrl(value)

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Subdomain / project name</Label>
      <div className="flex items-center overflow-hidden rounded-md border border-input shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/40">
        <span className="px-3 text-sm text-muted-foreground select-none">
          https://
        </span>
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="acme-store"
          className="border-0 px-0 shadow-none focus-visible:border-0 focus-visible:ring-0"
        />
        <span className="px-3 text-sm text-muted-foreground select-none">
          .vercel.app
        </span>
      </div>
      <p
        className={cn(
          'text-xs',
          value === '' || valid ? 'text-muted-foreground' : 'text-destructive'
        )}
      >
        {value === ''
          ? 'Lowercase letters, digits, and dashes — 1 to 52 chars.'
          : valid
            ? `Will deploy to ${url}`
            : 'Use only a-z, 0-9, and dashes (no leading/trailing dash).'}
      </p>
    </div>
  )
}
