import React from 'react';
import Link from 'next/link';
import { Rss, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-paper-200 dark:border-ink-800/80 bg-paper-100/50 dark:bg-ink-950/60 transition-colors">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-paper-700 dark:text-ink-300">
        <div className="space-y-1 text-center md:text-left">
          <p className="font-serif text-paper-900 dark:text-ink-100 font-medium">
            Rafi &middot; Solitude, Language &amp; Thought
          </p>
          <p className="text-xs text-paper-700 dark:text-ink-300 font-serif">
            নীরবতার প্রান্তে চিন্তার বিস্তার
          </p>
        </div>

        <div className="flex items-center space-x-6 text-xs text-paper-700 dark:text-ink-300">
          <Link
            href="/rss.xml"
            prefetch={false}
            className="flex items-center gap-1.5 hover:text-accent transition-colors"
          >
            <Rss className="w-3.5 h-3.5" />
            <span>RSS Feed</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 hover:text-accent transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
