import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Rafi — Writer, Essayist & Philosopher',
  description:
    'The personal sanctuary and writings of Rafi. Essays on solitude, Bengali thought, existential philosophy, poetry, research papers, visual posters, and books.',
  keywords: [
    'Rafi',
    'Philosopher',
    'Writer',
    'Bengali Literature',
    'Poetry',
    'Essays',
    'Contemplation',
    'Solitude',
    'Aesthetics',
  ],
  authors: [{ name: 'Rafi' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rafi-writer.vercel.app'),
  openGraph: {
    title: 'Rafi — Writer & Philosopher',
    description: 'Thinking in the margin of silence; observing where thought meets stillness.',
    url: 'https://rafi-writer.vercel.app',
    siteName: 'Rafi',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rafi — Writer & Philosopher',
    description: 'Thinking in the margin of silence; observing where thought meets stillness.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-paper-50 dark:bg-ink-950 text-paper-900 dark:text-ink-100 antialiased selection:bg-accent/20 selection:text-accent">
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
