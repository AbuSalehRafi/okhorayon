import React from 'react';
import Link from 'next/link';
import { getPoems } from '@/lib/supabase/api';
import { formatDate } from '@/lib/utils';
import { Feather } from 'lucide-react';

export const metadata = {
  title: 'Poems — Rafi',
  description: 'Short meditative pieces, verse, and lyric fragments. Preserving line breaks and stanza intervals.',
};

export default async function PoemsPage() {
  const poems = await getPoems();

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-paper-200 dark:border-ink-800 pb-6">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <Feather className="w-4 h-4" />
          <span>Poetry &amp; Verse</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-paper-900 dark:text-ink-100">
          Poems
          <span className="ml-3 font-bengaliSerif text-paper-400 dark:text-ink-400 text-2xl">
            / কবিতা
          </span>
        </h1>
        <p className="mt-2 text-sm text-paper-700 dark:text-ink-300 font-serif leading-relaxed">
          Fragments caught between silence and utterance. Line breaks and breath intervals preserved.
        </p>
      </div>

      {/* Poems list */}
      <div className="space-y-8">
        {poems.map((poem) => {
          const mainTitle = poem.title || poem.title_bn || 'Untitled Poem';
          const subTitle = poem.title_bn && poem.title_bn !== poem.title ? poem.title_bn : null;
          const bodyPreview = (poem.content || poem.content_bn || '').split(/\n\s*\n/)[0] || '';

          return (
            <article
              key={poem.id}
              className="group p-6 rounded-lg border border-paper-200 dark:border-ink-800 bg-paper-100/40 dark:bg-ink-900/30 hover:border-accent/40 transition-all"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <time className="text-xs font-mono text-paper-700 dark:text-ink-300">
                  {formatDate(poem.published_at)}
                </time>
                {poem.is_sample && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent uppercase tracking-wider">
                    Sample
                  </span>
                )}
              </div>

              <Link href={`/poems/${poem.slug}`} className="block">
                <h2 className="font-serif text-xl md:text-2xl font-medium text-paper-900 dark:text-ink-100 group-hover:text-accent transition-colors">
                  {mainTitle}
                </h2>
                {subTitle && (
                  <p className="font-bengaliSerif text-sm text-paper-700 dark:text-ink-300 mt-0.5">
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
                      className="text-[11px] px-2 py-0.5 rounded bg-paper-200/80 dark:bg-ink-800/80 text-paper-700 dark:text-ink-300"
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
