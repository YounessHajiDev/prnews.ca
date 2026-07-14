import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className || '')}>
      <div className="mb-4 rounded-full border border-wire-brass/20 bg-wire-brass/10 p-4">
        <Icon className="h-8 w-8 text-wire-brass-dark" aria-hidden="true" />
      </div>
      <h2 className="heading-sm mb-2">{title}</h2>
      <p className="body-small max-w-sm text-wire-slate">{description}</p>
      {action && (
        <Link href={action.href} className={buttonVariants({ className: 'mt-6' })}>
          {action.label}
        </Link>
      )}
    </div>
  );
}
