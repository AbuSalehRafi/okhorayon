import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark } from 'lucide-react';

interface FeaturedSlotProps {
  featured: {
    type: string;
    title: string;
    subtitle?: string;
    slug: string;
    excerpt: string;
    badge: string;
    link: string;
  };
}

export function FeaturedSlot({ featured }: FeaturedSlotProps) {
  return (
    <section className="relative overflow-hidden border border-paper-300 dark:border-ink-800 bg-gradient-to-br from-paper-100 to-paper-200/50 dark:from-ink-900 dark:to-ink-850 rounded-xl p-7 md:p-9 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-accent text-white dark:text-ink-950 uppercase tracking-wider">
          <Bookmark className="w-3.5 h-3.5" />
          {featured.badge}
        </span>
      </div>

      <h2 className="font-serif text-2xl md:text-3xl font-medium text-paper-900 dark:text-ink-100 mt-2">
        {featured.title}
      </h2>

      {featured.subtitle && (
        <p className="font-serif italic text-sm md:text-base text-paper-700 dark:text-ink-300 mt-1">
          {featured.subtitle}
        </p>
      )}

      <p className="text-paper-700 dark:text-ink-300 text-base md:text-lg font-serif mt-4 leading-relaxed max-w-3xl">
        {featured.excerpt}
      </p>

      <div className="mt-6">
        <Link
          href={featured.link}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-paper-900 dark:bg-ink-100 text-paper-50 dark:text-ink-950 font-medium text-sm hover:bg-accent dark:hover:bg-accent hover:text-white dark:hover:text-ink-950 transition-all shadow-sm"
        >
          <span>Begin Reading</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
