import { authOptions, getServerSession } from './auth';

export { authOptions, getServerSession };

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session;
}

export function requireRole(role: string) {
  return async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== role) {
      throw new Error('Forbidden');
    }
    return session;
  };
}

export function getUserRole(session: { user?: { role?: string } } | null) {
  return session?.user?.role ?? null;
}
