import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const buttonVariants = (props: { variant?: ButtonProps['variant']; size?: ButtonProps['size']; className?: string }) => {
  const { variant = 'default', size = 'default', className } = props;
  const base = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wire-amber focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  const variants: Record<string, string> = {
    default: 'bg-wire-amber text-white hover:bg-wire-amber-dark',
    destructive: 'bg-wire-error text-white hover:bg-wire-error/90',
    outline: 'border border-wire-border bg-white hover:bg-wire-charcoal hover:text-white',
    secondary: 'bg-wire-muted text-white hover:bg-wire-muted/80',
    ghost: 'hover:bg-wire-charcoal hover:text-white',
    link: 'text-wire-amber underline-offset-4 hover:underline',
  };
  const sizes: Record<string, string> = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };
  return cn(base, variants[variant] || '', sizes[size] || '', className || '');
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
