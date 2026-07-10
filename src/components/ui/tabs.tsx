import * as React from 'react';
import { cn } from '@/lib/utils';

function Tabs({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="tabs"
      data-orientation="horizontal"
      className={cn('flex items-center gap-1', className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="tabs-list"
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg border border-wire-border p-1 text-wire-muted dark:bg-wire-charcoal dark:border-wire-muted',
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      data-slot="tabs-trigger"
      type="button"
      data-state="inactive"
      data-orientation="horizontal"
      aria-selected="false"
      data-active="false"
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wire-amber focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:text-wire-muted dark:ring-offset-wire-charcoal dark:focus-visible:ring-wire-amber data-[state=active]:bg-white data-[state=active]:text-wire-charcoal data-[state=active]:shadow-sm dark:data-[state=active]:bg-wire-muted dark:data-[state=active]:text-white',
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="tabs-content"
      data-orientation="horizontal"
      className={cn('mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wire-amber focus-visible:ring-offset-2 dark:ring-offset-wire-charcoal dark:focus-visible:ring-wire-amber', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
