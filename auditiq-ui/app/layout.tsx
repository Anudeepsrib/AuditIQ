import type { Metadata } from 'next';
import { Inter, Syne, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AuditIQ — Financial Document Extraction Platform',
  description: 'Fine-tuned for financial truth. ML-powered extraction platform for financial documents with RBAC-enforced inference.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-[--background] text-[--text-primary] antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
