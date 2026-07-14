/**
 * Analytics / cookie consent hook point.
 *
 * PR NEWS does not ship with advertising or analytics cookies at launch.
 * When analytics is added later, set NEXT_PUBLIC_GA_MEASUREMENT_ID (or another
 * provider equivalent) and update loadAnalytics() to inject the script only
 * after the user has given consent via a cookie/consent banner.
 *
 * Do not load analytics scripts before consent is obtained.
 */

export const ANALYTICS_ENABLED = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export type ConsentState = 'granted' | 'denied' | 'pending';

let storedConsent: ConsentState | undefined;

export function getConsent(): ConsentState | undefined {
  if (typeof window === 'undefined') return undefined;
  if (storedConsent) return storedConsent;
  const raw = localStorage.getItem('prnews-analytics-consent');
  if (raw === 'granted' || raw === 'denied') {
    storedConsent = raw;
    return storedConsent;
  }
  return 'pending';
}

export function setConsent(value: ConsentState): void {
  if (typeof window === 'undefined') return;
  storedConsent = value;
  localStorage.setItem('prnews-analytics-consent', value);
  if (value === 'granted') {
    loadAnalytics();
  }
}

export function loadAnalytics(): void {
  if (!ANALYTICS_ENABLED || typeof window === 'undefined') return;
  if (getConsent() !== 'granted') return;

  // Example GA4 loader. Replace with your provider's snippet.
  if (GA_MEASUREMENT_ID && !(window as any).gtagLoaded) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    const inline = document.createElement('script');
    inline.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}');
    `;
    document.head.appendChild(inline);
    (window as any).gtagLoaded = true;
  }
}
