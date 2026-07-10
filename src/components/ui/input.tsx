import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-wire-border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-wire-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wire-amber focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-wire-charcoal dark:border-wire-muted dark:ring-offset-wire-charcoal dark:placeholder:text-wire-muted dark:focus-visible:ring-wire-amber',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
