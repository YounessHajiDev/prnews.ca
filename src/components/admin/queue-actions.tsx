'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { approveRelease, rejectRelease, requestChanges } from '@/lib/actions/releases';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function QueueActions({ releaseId, approveLabel, rejectLabel, requestLabel }: {
  releaseId: string;
  approveLabel: string;
  rejectLabel: string;
  requestLabel: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');

  const run = async (action: (id: string) => Promise<{ success?: boolean; error?: string }>) => {
    setMessage('');
    startTransition(async () => {
      const result = await action(releaseId);
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage('Updated.');
        window.location.reload();
      }
    });
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Button
        variant="default"
        size="sm"
        className="gap-1"
        disabled={isPending}
        onClick={() => run(approveRelease)}
      >
        <CheckCircle className="w-4 h-4" /> {approveLabel}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        disabled={isPending}
        onClick={() => run(rejectRelease)}
      >
        <XCircle className="w-4 h-4" /> {rejectLabel}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={isPending}
        onClick={() => run(requestChanges)}
      >
        <AlertCircle className="w-4 h-4" /> {requestLabel}
      </Button>
      {message && <span className="text-sm text-wire-muted w-full">{message}</span>}
    </div>
  );
}
