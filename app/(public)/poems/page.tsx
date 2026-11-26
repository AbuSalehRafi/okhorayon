import React from 'react';
import Link from 'next/link';
import { getPoems } from '@/lib/supabase/api';
import { formatDate } from '@/lib/utils';
import { Download, Feather } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 0;

export const metadata = {
  title: `কবিতা ও পঙ্‌ক্তিমালা — ${siteConfig.name}`,
  description: 'নীরবতা ও অস্তিত্বের দ্বন্দ্বে জন্ম নেওয়া কবিতা ও পঙ্‌ক্তিমালা।',
};

export default async function PoemsPage() {
  const poems = await getPoems();

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-paper-200 dark:border-ink-800 pb-6">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <Feather className="w-4 h-4" />
          <span>কাব্য ও পঙ্‌ক্তিমালা &middot; Poetry &amp; Verse</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-paper-950 dark:text-ink-50">
          কবিতা
          <span className="ml-3 font-sans text-paper-400 dark:text-ink-400 text-2xl font-light">
            / Poems ({poems.length})
          </span>
        </h1>
        <p className="mt-2 text-sm md:text-base text-paper-600 dark:text-ink-300 font-serif leading-relaxed">
          নীরবতার প্রান্তসীমায় জন্ম নেওয়া কিছু পঙক্তি ও অনুভূতির সংকলন।
        </p>
      </div>

      {/* Poems list */}
      <div className="space-y-8">
        {poems.map((poem) => {
          const mainTitle = poem.title_bn || poem.title || 'Untitled Poem';
          const subTitle = poem.title && poem.title !== poem.title_bn ? poem.title : null;
          const bodyPreview = (poem.content || poem.content_bn || '').split(/\n\s*\n/)[0] || '';

          return (
            <article
              key={poem.id}
              className="group p-6 rounded-lg border border-paper-200 dark:border-ink-800 bg-paper-100/40 dark:bg-ink-900/30 hover:border-accent/40 transition-all"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <time dateTime={poem.published_at} className="text-xs font-mono text-paper-500 dark:text-ink-400">
                  {formatDate(poem.published_at)}
                </time>
                <div className="flex items-center gap-2">
                  {poem.is_sample && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent uppercase tracking-wider">
                      Sample
                    </span>
                  )}
                </div>
              </div>

              <Link href={`/poems/${poem.slug}`} className="block">
                <h2 className="font-serif text-xl md:text-2xl font-medium text-paper-900 dark:text-ink-100 group-hover:text-accent transition-colors">
                  {mainTitle}
                </h2>
                {subTitle && (
                  <p className="font-sans text-sm text-paper-500 dark:text-ink-400 mt-0.5">
                    {subTitle}
                  </p>
                )}

                {/* First stanza preview */}
                {bodyPreview && (
                  <div className="mt-4 text-paper-700 dark:text-ink-300 font-serif text-sm italic border-l-2 border-paper-300 dark:border-ink-800 pl-4 py-1">
                    {bodyPreview}
                  </div>
                )}
              </Link>

              {poem.tags && poem.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-paper-200 dark:border-ink-800/60">
                  {poem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2 py-0.5 rounded bg-paper-200/80 dark:bg-ink-800/80 text-paper-600 dark:text-ink-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
