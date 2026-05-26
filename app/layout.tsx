import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const serif = localFont({
  src: [
    { path: '../public/fonts/instrument-serif-regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/instrument-serif-italic.ttf',  weight: '400', style: 'italic' },
  ],
  variable: '--font-serif',
  display: 'swap',
});

const sans = localFont({
  src: '../public/fonts/geist-latin.woff2',
  variable: '--font-sans',
  display: 'swap',
});

const mono = localFont({
  src: '../public/fonts/geist-mono-latin.woff2',
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ferie — road-trip companion',
  description: 'Oslo → Stavanger, the long way home · Tesla Model Y · June 2026',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
