import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wire-amber focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-wire-charcoal dark:focus-visible:ring-wire-amber',
  {
    variants: {
      variant: {
        default: 'bg-wire-amber text-white hover:bg-wire-amber-dark dark:bg-wire-amber dark:text-wire-charcoal dark:hover:bg-wire-amber-light',
        destructive: 'bg-wire-error text-white hover:bg-wire-error/90',
        outline: 'border border-wire-border bg-white hover:bg-wire-charcoal hover:text-white dark:bg-wire-charcoal dark:border-wire-muted dark:text-white dark:hover:bg-wire-muted',
        secondary: 'bg-wire-muted text-white hover:bg-wire-muted/80',
        ghost: 'hover:bg-wire-charcoal hover:text-white',
        link: 'text-wire-amber underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
