export async function GET() {
  const content = `# PR NEWS — Canadian press release distribution\n\n- URL: https://prnews.ca\n- Languages: English (en-CA), French (fr-CA)\n- Core offering: Self-serve press release writing, editorial review, and nationwide distribution to Canadian media outlets.\n- Public pages: /, /news, /pricing, /how-it-works, /about, /contact, /journalists, /resources, /newsroom/{company-slug}, /news/{category-slug}/{slug}\n- Auth: /login, /signup, /forgot-password, /reset-password\n- Dashboard: /app, /app/submit, /app/releases, /app/billing\n- Legal: /privacy, /terms, /accessibility-statement, /casl-compliance\n`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
