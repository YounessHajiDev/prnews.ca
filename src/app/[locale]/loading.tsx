'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="animate-pulse">Loading...</div>
    </div>
  );
}
