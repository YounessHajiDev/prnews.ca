import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'PR NEWS — Canadian Press Release Distribution',
    template: '%s | PR NEWS',
  },
  description:
    'Modern, transparent press release distribution for the Canadian market. See exactly where your story goes, before you hit send.',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Locale-specific layouts provide <html> and <body> with localized messages.
  return children;
}
