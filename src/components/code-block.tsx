import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language = 'http', className }: Props) {
  const [copied, setCopied] = useState(false)

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-muted/40',
        className
      )}
    >
      <div className="flex items-center justify-between border-b bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">
        <span className="font-mono uppercase tracking-wide">{language}</span>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 gap-1 px-2 text-xs"
          onClick={() => {
            navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
          }}
        >
          {copied ? (
            <Check className="size-3.5" aria-hidden />
          ) : (
            <Copy className="size-3.5" aria-hidden />
          )}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  )
}
