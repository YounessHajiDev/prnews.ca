import * as React from 'react';
import { cn } from '@/lib/utils';

function Badge({ className, variant, ...rest }: Omit<React.ComponentProps<'div'>, 'className'> & { className?: string; variant?: 'default' | 'secondary' | 'destructive' }) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-wire-brass focus:ring-offset-2',
        variant === 'default' ? 'border-transparent bg-wire-brass text-white' : '',
        variant === 'secondary' ? 'border-transparent bg-wire-ink/10 text-wire-ink' : '',
        variant === 'destructive' ? 'border-transparent bg-wire-red text-white' : '',
        className || ''
      )}
      {...rest}
    />
  );
}

export { Badge };
