'use client';

import { ReactNode } from 'react';
import { useInView } from '@/hooks/use-in-view';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';

type Animation = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-in';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  className?: string;
}

const animationClass: Record<Animation, string> = {
  'fade-up': 'animate-fade-up',
  'fade-in': 'animate-fade-in',
  'slide-left': 'animate-slide-left',
  'slide-right': 'animate-slide-right',
  'scale-in': 'animate-scale-in',
};

export function AnimatedSection({
  children,
  animation = 'fade-up',
  delay = 0,
  className = '',
}: AnimatedSectionProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const reducedMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className={cn(
        'will-change-transform',
        reducedMotion ? '' : inView ? animationClass[animation] : 'opacity-0',
        className
      )}
      style={{ animationDelay: reducedMotion ? undefined : `${delay}ms` }}
    >
      {children}
    </div>
  );
}
