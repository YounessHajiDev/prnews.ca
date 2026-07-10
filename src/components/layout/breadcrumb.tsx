'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-wire-muted">
        <li>
          <Link href="/" className="hover:text-wire-charcoal">Home</Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="w-3 h-3" />
            {item.href ? (
              <Link href={item.href} className="hover:text-wire-charcoal">{item.label}</Link>
            ) : (
              <span className="text-wire-charcoal font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
