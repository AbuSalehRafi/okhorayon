import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `${siteConfig.name} (${siteConfig.nameTransliteration}) — চিন্তাশীল রচনা ও পাঠাগার`,
  description: siteConfig.description,
  keywords: [
    siteConfig.name,
    siteConfig.nameTransliteration,
    'রাফি',
    'Rafi',
    'Bengali Literature',
    'কবিতা',
    'প্রবন্ধ',
    'গবেষণা',
    'পোস্টার',
    'বই',
    'Philosophy',
    'Essays',
  ],
  authors: [{ name: siteConfig.author }],
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: `${siteConfig.name} (${siteConfig.nameTransliteration})`,
    description: siteConfig.tagline,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} (${siteConfig.nameTransliteration})`,
    description: siteConfig.tagline,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-paper-50 dark:bg-ink-950 text-paper-900 dark:text-ink-100 antialiased selection:bg-accent/20 selection:text-accent font-sans">
        <ThemeProvider>
          <Header />
          <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
