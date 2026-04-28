import * as React from 'react'
import { cn } from '@/lib/utils'

type Props = React.ComponentProps<'div'> & { orientation?: 'horizontal' | 'vertical' }

function Separator({ className, orientation = 'horizontal', ...props }: Props) {
  return (
    <div
      data-slot="separator"
      role="separator"
      data-orientation={orientation}
      className={cn(
        'bg-border shrink-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      {...props}
    />
  )
}

export { Separator }
