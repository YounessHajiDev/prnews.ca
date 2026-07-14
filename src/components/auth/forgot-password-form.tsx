'use client';

import { useState } from 'react';
import { requestPasswordReset } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ForgotPasswordForm({ t }: { t: Record<string, string> }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await requestPasswordReset({ email: String(formData.get('email')) });
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setMessage(t.resetSent || 'If an account exists, a reset link has been sent.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</div>}
      {message && <div className="rounded-md bg-green-50 p-3 text-sm text-green-700" role="status">{message}</div>}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">{t.email}</label>
        <Input id="email" name="email" type="email" required />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t.sending || 'Sending...' : t.sendResetLink}
      </Button>
    </form>
  );
}
