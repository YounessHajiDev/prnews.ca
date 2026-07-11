import * as React from 'react';
import { cn } from '@/lib/utils';

function Badge({ className, variant, ...rest }: Omit<React.ComponentProps<'div'>, 'className'> & { className?: string; variant?: 'default' | 'secondary' | 'destructive' }) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variant === 'default' && 'border-transparent bg-wire-amber text-white' || '' as string,
        variant === 'secondary' && 'border-transparent bg-wire-muted text-white' || '' as string,
        variant === 'destructive' && 'border-transparent bg-wire-error text-white' || '' as string,
        className || '' as string,
      )}
      {...rest}
    />
  );
}

export { Badge };
