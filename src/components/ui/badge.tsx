import * as React from 'react';
import { cn } from '@/lib/utils';

function Badge({ className, variant, ...props }: React.ComponentProps<'span'> & { variant?: 'default' | 'secondary' | 'destructive' }) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variant === 'default' && 'border-transparent bg-wire-amber text-white',
        variant === 'secondary' && 'border-transparent bg-wire-muted text-white',
        variant === 'destructive' && 'border-transparent bg-wire-error text-white',
        className
      )}
      {...props}
    />
  );
}

export { Badge };
