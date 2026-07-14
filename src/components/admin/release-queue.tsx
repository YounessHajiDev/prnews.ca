'use client';

import { Badge } from '@/components/ui/badge';

interface QueueItem {
  id: string;
  headline: string;
  company: string;
  submittedAt: Date;
  status: 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  priority: 'normal' | 'priority';
}

const DEMO_QUEUE: QueueItem[] = [
  {
    id: '1',
    headline: 'Tech Startup Raises $15M Series A',
    company: 'MapleAI Inc.',
    submittedAt: new Date('2026-07-10T10:00:00'),
    status: 'IN_REVIEW',
    priority: 'priority',
  },
  {
    id: '2',
    headline: 'BC Mining Company Announces New Operations',
    company: 'Pacific Minerals Corp.',
    submittedAt: new Date('2026-07-10T09:30:00'),
    status: 'SUBMITTED',
    priority: 'normal',
  },
  {
    id: '3',
    headline: 'Quebec Healthcare Provider Launches Platform',
    company: 'SantéNumérique',
    submittedAt: new Date('2026-07-09T14:00:00'),
    status: 'APPROVED',
    priority: 'normal',
  },
];

export function ReleaseQueue() {
  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-wire-border">
        <h2 className="font-display font-semibold">Release Queue</h2>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-wire-bg">
          <tr>
            <th className="text-left px-4 py-2 font-medium text-wire-muted">Release</th>
            <th className="text-left px-4 py-2 font-medium text-wire-muted">Company</th>
            <th className="text-left px-4 py-2 font-medium text-wire-muted">Submitted</th>
            <th className="text-left px-4 py-2 font-medium text-wire-muted">Status</th>
            <th className="text-left px-4 py-2 font-medium text-wire-muted">Actions</th>
          </tr>
        </thead>
        <tbody>
          {DEMO_QUEUE.map((item) => (
            <tr key={item.id} className="border-t border-wire-border">
              <td className="px-4 py-3 font-medium">{item.headline}</td>
              <td className="px-4 py-3 text-wire-muted">{item.company}</td>
              <td className="px-4 py-3 text-wire-muted">{item.submittedAt.toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <Badge
                  variant={
                    item.status === 'APPROVED'
                      ? 'default'
                      : item.status === 'IN_REVIEW'
                        ? 'secondary'
                        : item.status === 'REJECTED'
                          ? 'destructive'
                          : 'default'
                  }
                  className="capitalize"
                >
                  {item.status}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <button className="text-wire-brass-dark hover:underline text-sm">Review</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
