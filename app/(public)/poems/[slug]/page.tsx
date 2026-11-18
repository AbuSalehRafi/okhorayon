import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPoemBySlug, getPoems } from '@/lib/supabase/api';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Feather } from 'lucide-react';

export async function generateStaticParams() {
  const poems = await getPoems();
  return poems.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const poem = await getPoemBySlug(params.slug);
  if (!poem) return { title: 'Poem Not Found' };
  const description = (poem.content || poem.content_bn || '').slice(0, 150);
  return {
    title: `${poem.title || poem.title_bn} — Poetry by Rafi`,
    description,
  };
}

export default async function SinglePoemPage({ params }: { params: { slug: string } }) {
  const poem = await getPoemBySlug(params.slug);
  if (!poem) notFound();

  const mainTitle = poem.title || poem.title_bn || 'Untitled Poem';
  const subTitle = poem.title_bn && poem.title_bn !== poem.title ? poem.title_bn : null;

  // Primary text to display
  const primaryBody = poem.content || poem.content_bn || '';
  const stanzas = primaryBody.split(/\n\s*\n/);

  // Secondary translation (only if both distinct versions exist)
  const hasDistinctTranslation = poem.content_bn && poem.content && poem.content_bn !== poem.content;

  return (
    <article className="max-w-2xl mx-auto py-6">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/poems"
          className="inline-flex items-center gap-1.5 text-xs text-paper-700 dark:text-ink-300 hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all poems</span>
        </Link>
      </div>

      {/* Header */}
      <header className="border-b border-paper-200 dark:border-ink-800 pb-6 mb-10">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <Feather className="w-3.5 h-3.5" />
          <span>Poem</span>
          {poem.is_sample && (
            <span className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded bg-accent/15 text-accent">
              Sample
            </span>
          )}
        </div>

        <h1 className="font-serif text-3xl md:text-4xl font-normal text-paper-900 dark:text-ink-100">
          {mainTitle}
        </h1>

        {subTitle && (
          <p className="font-bengaliSerif text-xl text-paper-700 dark:text-ink-300 mt-1">
            {subTitle}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-paper-700 dark:text-ink-300 mt-4 font-mono">
          <time>{formatDate(poem.published_at)}</time>
          {poem.notes && (
            <>
              <span>&middot;</span>
              <span className="italic font-sans text-paper-700 dark:text-ink-300">{poem.notes}</span>
            </>
          )}
        </div>
      </header>

      {/* Stanza and line-break fidelity */}
      <div className="my-10 pl-4 md:pl-8 border-l-2 border-accent/40 space-y-8">
        {stanzas.map((stanza, sIdx) => (
          <p
            key={sIdx}
            className="poem-stanza text-paper-900 dark:text-ink-100 leading-loose text-lg md:text-xl font-serif"
          >
            {stanza}
          </p>
        ))}
      </div>

      {/* Secondary translation if available */}
      {hasDistinctTranslation && (
        <div className="mt-16 pt-8 border-t border-paper-200 dark:border-ink-800">
          <h2 className="text-xs uppercase tracking-wider text-accent font-semibold mb-4">
            বাংলা সংস্করণ / Bengali Translation
          </h2>
          <div className="pl-4 md:pl-8 border-l-2 border-paper-300 dark:border-ink-700 space-y-6">
            {poem.content_bn!.split(/\n\s*\n/).map((bnStanza, bIdx) => (
              <p
                key={bIdx}
                className="font-bengaliSerif text-paper-900 dark:text-ink-100 leading-loose text-lg"
              >
                {bnStanza}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {poem.tags && poem.tags.length > 0 && (
        <footer className="mt-14 pt-6 border-t border-paper-200 dark:border-ink-800 flex flex-wrap gap-2">
          {poem.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded bg-paper-200 dark:bg-ink-850 text-paper-700 dark:text-ink-300"
            >
              #{tag}
            </span>
          ))}
        </footer>
      )}
    </article>
  );
}
