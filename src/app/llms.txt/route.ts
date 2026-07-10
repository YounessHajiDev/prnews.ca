export const GET = () => {
  const text = `# PR NEWS (prnews.ca)

## About
PR NEWS is a Canadian press release distribution platform.

## Pages
- /en — English homepage
- /en/news — Latest releases
- /en/pricing — Transparent pricing
- /en/how-it-works — How distribution works
- /en/resources — Guides and templates
- /en/about — About PR NEWS
- /en/contact — Contact information

## News Categories
- Business
- Technology
- Health
- Finance & Economy
- Government & Politics
- Environment
- Real Estate
- Energy & Mining
- Cannabis

## Distribution Network
PR NEWS distributes press releases to media outlets across all Canadian provinces.

## Contact
- Email: hello@prnews.ca
- Phone: 1-800-PR-NEWS
`;

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain' },
  });
};
