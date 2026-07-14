'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const CanadaMap = dynamic(
  () => import('./canada-map').then((m) => m.CanadaMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-full w-full animate-pulse rounded-2xl bg-wire-paper"
        aria-hidden="true"
      />
    ),
  }
);

export function LazyCanadaMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0, rootMargin: '100px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative mx-auto flex h-[55vh] max-h-[520px] w-full items-center justify-center"
    >
      {visible ? (
        <CanadaMap />
      ) : (
        <div
          className="h-full w-full animate-pulse rounded-2xl bg-wire-paper"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
