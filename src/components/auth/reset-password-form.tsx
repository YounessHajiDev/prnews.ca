'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ResetPasswordForm({ token, t }: { token: string; t: Record<string, string> }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = String(formData.get('password'));
    const confirmPassword = String(formData.get('confirmPassword'));

    if (password !== confirmPassword) {
      setError(t.passwordsDoNotMatch || 'Passwords do not match.');
      setLoading(false);
      return;
    }

    const result = await resetPassword({ token, password });
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push('/login?reset=1');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</div>}
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">{t.newPasswordPlaceholder}</label>
        <Input id="password" name="password" type="password" required minLength={8} maxLength={128} />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">{t.confirmPasswordPlaceholder}</label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} maxLength={128} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t.resetting || 'Resetting...' : t.resetPassword}
      </Button>
    </form>
  );
}
