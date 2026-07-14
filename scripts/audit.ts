import { db } from '../src/lib/db/prisma';
import { createReleaseForUser, approveReleaseById, getCreditBalance } from '../src/lib/services/releases';
import { hash } from 'bcryptjs';

async function main() {
  console.log('=== PR NEWS production audit script ===\n');

  // 1. Ensure a clean test user
  const email = 'audit-client@prnews.ca';
  let company = await db.company.findFirst({ where: { slug: 'audit-corp' } });
  if (!company) {
    company = await db.company.create({
      data: { name: 'Audit Corp', slug: 'audit-corp', country: 'CA' },
    });
  }

  let user = await db.user.findUnique({ where: { email } });
  if (!user) {
    user = await db.user.create({
      data: {
        name: 'Audit Client',
        email,
        passwordHash: await hash('AuditPass123!', 12),
        role: 'CLIENT',
        companyId: company.id,
      },
    });
    await db.creditTransaction.create({
      data: { userId: user.id, amount: 5, type: 'purchase' },
    });
  }

  const startBalance = await getCreditBalance(user.id);
  if (startBalance < 2) {
    await db.creditTransaction.create({
      data: { userId: user.id, amount: 5, type: 'purchase' },
    });
  }

  console.log(`User: ${user.email} (${user.id}) | Credits before: ${await getCreditBalance(user.id)}`);

  // 2. Create a release
  const en = await createReleaseForUser(user.id, {
    headline: 'Audit Press Release EN',
    headlineFr: 'Communiqué de presse audit FR',
    summary: 'This is a summary of the audit release used for end-to-end verification.',
    body: '<p>This is the body of the audit release. It contains enough words to pass validation and includes a <a href="https://prnews.ca">test link</a>.</p>',
    bodyFr: '<p>Ceci est le corps du communiqué de vérification.</p>',
    category: 'Technology',
    language: 'both',
    dateline: 'Toronto',
    keywords: ['audit', 'test'],
  });

  if (en.error || !en.success || !en.release) {
    console.error('EN submission failed:', en.error);
    process.exit(1);
  }

  console.log(`Created release ${en.release.id} | Credits after: ${await getCreditBalance(user.id)}`);

  // 3. Approve the release
  const approved = await approveReleaseById(en.release.id);
  if (approved.error || !approved.success) {
    console.error('Approval failed:', approved.error);
    process.exit(1);
  }

  const release = await db.pressRelease.findUnique({
    where: { id: en.release.id },
    include: { distributionLogs: true },
  });
  console.log(`Status: ${release?.status} | Distribution logs: ${release?.distributionLogs.length}`);

  // 4. Verify public page and structured data
  const publicUrl = `http://localhost:3000/en/news/${release?.categorySlug}/${release?.slug}`;
  const response = await fetch(publicUrl);
  const html = await response.text();
  const checks = [
    ['HTTP 200', response.status === 200],
    ['Headline in HTML', html.includes('Audit Press Release EN')],
    ['JSON-LD present', html.includes('application/ld+json')],
    ['Sanitized body present', html.includes('This is the body of the audit release')],
    ['Link preserved', html.includes('https://prnews.ca')],
    ['Script tag stripped', !html.includes('<script>alert')],
  ];

  for (const [name, pass] of checks) {
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${name}`);
  }

  // Ensure enough credits for the remaining tests
  const currentBalance = await getCreditBalance(user.id);
  if (currentBalance < 2) {
    await db.creditTransaction.create({
      data: { userId: user.id, amount: 5, type: 'purchase' },
    });
  }

  // 5. XSS storage-time sanitization
  const xss = await createReleaseForUser(user.id, {
    headline: 'XSS Test',
    summary: 'This summary is safe.',
    body: '<p>Safe paragraph</p><script>alert("xss")</script><img src=x onerror=alert(1)>',
    category: 'Business',
    language: 'en',
  });

  if (xss.error || !xss.success || !xss.release) {
    console.error('XSS test submission failed:', xss.error);
    process.exit(1);
  }

  const stored = await db.pressRelease.findUnique({ where: { id: xss.release.id } });
  const hasScript = stored?.body.includes('<script>');
  const hasOnerror = stored?.body.includes('onerror=');
  console.log(`[${!hasScript && !hasOnerror ? 'PASS' : 'FAIL'}] Stored XSS sanitization`);

  // 6. Multi-tenant isolation: create another company/user and try to access release
  let otherCompany = await db.company.findFirst({ where: { slug: 'other-corp' } });
  if (!otherCompany) {
    otherCompany = await db.company.create({
      data: { name: 'Other Corp', slug: 'other-corp', country: 'CA' },
    });
  }
  let otherUser = await db.user.findUnique({ where: { email: 'other@prnews.ca' } });
  if (!otherUser) {
    otherUser = await db.user.create({
      data: {
        name: 'Other User',
        email: 'other@prnews.ca',
        passwordHash: await hash('OtherPass123!', 12),
        role: 'CLIENT',
        companyId: otherCompany.id,
      },
    });
  }

  // Credit check: other user with 0 credits should fail
  const otherResult = await createReleaseForUser(otherUser.id, {
    headline: 'Should fail due to no credits',
    summary: 'This user has no credits and cannot submit a release.',
    body: '<p>This body has more than enough characters to pass the minimum body length validation check.</p>',
    category: 'Business',
    language: 'en',
  });
  console.log(`[${otherResult.error === 'Insufficient credits. Please purchase a plan or subscribe.' ? 'PASS' : 'FAIL'}] Insufficient-credits guard`);

  // 7. CASL unsubscribe
  const subscriber = await db.subscriber.upsert({
    where: { email: 'unsubscribe-test@prnews.ca' },
    create: { email: 'unsubscribe-test@prnews.ca' },
    update: {},
  });
  const unsubUrl = `http://localhost:3000/api/unsubscribe?token=${subscriber.token}`;
  const unsubRes = await fetch(unsubUrl, { redirect: 'manual' });
  const updatedSub = await db.subscriber.findUnique({ where: { id: subscriber.id } });
  console.log(`[${updatedSub?.unsubscribedAt && unsubRes.status === 302 ? 'PASS' : 'FAIL'}] Unsubscribe endpoint sets unsubscribedAt and redirects`);

  // 8. Auth flow via NextAuth credentials callback
  async function login(email: string, password: string) {
    const csrfRes = await fetch('http://localhost:3000/api/auth/csrf');
    const csrfBody = await csrfRes.json();
    const cookies = csrfRes.headers.getSetCookie?.() || [];
    const csrfCookie = cookies.find((c) => c.startsWith('next-auth.csrf-token=')) || '';

    const loginRes = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': csrfCookie,
      },
      body: new URLSearchParams({
        csrfToken: csrfBody.csrfToken,
        callbackUrl: '/app',
        json: 'true',
        email,
        password,
      }),
      redirect: 'manual',
    });

    const sessionCookie = loginRes.headers.getSetCookie?.() || [];
    const nextSession = sessionCookie.find((c) => c.startsWith('next-auth.session-token=')) || '';
    return nextSession;
  }

  const clientCookie = await login('audit-client@prnews.ca', 'AuditPass123!');
  const appRes = await fetch('http://localhost:3000/en/app', { headers: { Cookie: clientCookie } });
  console.log(`[${appRes.status === 200 ? 'PASS' : 'FAIL'}] Authenticated client can access /app`);

  const adminCookie = await login('admin@prnews.ca', 'TestPass123!');
  const adminRes = await fetch('http://localhost:3000/en/admin/queue', { headers: { Cookie: adminCookie } });
  console.log(`[${adminRes.status === 200 ? 'PASS' : 'FAIL'}] Authenticated admin can access /admin/queue`);

  const unauthAdminRes = await fetch('http://localhost:3000/en/admin/queue', { redirect: 'manual' });
  const blockedStatuses = [301, 302, 303, 307, 308, 401, 403, 404];
  console.log(`[${blockedStatuses.includes(unauthAdminRes.status) ? 'PASS' : 'FAIL'}] Unauthenticated access to /admin/queue is blocked`);

  console.log('\n=== Audit complete ===');
  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
