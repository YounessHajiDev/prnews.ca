'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SignupForm({ t }: { t: Record<string, string> }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: String(formData.get('name')),
      email: String(formData.get('email')),
      password: String(formData.get('password')),
      company: String(formData.get('company')),
    };

    const result = await signUp(data);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push('/login?registered=1');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">{t.fullName}</label>
        <Input id="name" name="name" type="text" required minLength={2} maxLength={120} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">{t.email}</label>
        <Input id="email" name="email" type="email" required maxLength={255} />
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium mb-1">{t.companyName}</label>
        <Input id="company" name="company" type="text" required minLength={2} maxLength={120} />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">{t.password}</label>
        <Input id="password" name="password" type="password" required minLength={8} maxLength={128} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t.creatingAccount || 'Creating account...' : t.createAccount}
      </Button>
    </form>
  );
}
