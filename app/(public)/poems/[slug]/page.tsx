import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPoemBySlug, getPoems } from '@/lib/supabase/api';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Feather } from 'lucide-react';
import { DynamicPdfButton } from '@/components/reader/dynamic-pdf-button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const poem = await getPoemBySlug(slug);
  if (!poem) return { title: 'Poem Not Found' };
  const description = (poem.content_bn || poem.content || '').slice(0, 150);
  return {
    title: `${poem.title || poem.title_bn} — অক্ষরায়ণ`,
    description,
  };
}

export default async function SinglePoemPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const poem = await getPoemBySlug(slug);
  if (!poem) notFound();

  const mainTitle = poem.title_bn || poem.title || 'Untitled Poem';
  const subTitle = poem.title && poem.title !== poem.title_bn ? poem.title : null;

  // Primary text to display
  const primaryBody = poem.content_bn || poem.content || '';
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
          <span>সকল কবিতায় ফিরে যান (Back to poems)</span>
        </Link>
      </div>

      {/* Header */}
      <header className="border-b border-paper-200 dark:border-ink-800 pb-6 mb-10">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <Feather className="w-3.5 h-3.5" />
          <span>কবিতা &middot; Poem</span>
          {poem.is_sample && (
            <span className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded bg-accent/15 text-accent">
              Sample
            </span>
          )}
        </div>

        <h1 className="font-serif text-3xl md:text-4xl font-normal text-paper-950 dark:text-ink-50">
          {mainTitle}
        </h1>

        {subTitle && (
          <p className="font-sans text-xl text-paper-600 dark:text-ink-300 mt-1">
            {subTitle}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-paper-500 dark:text-ink-400 mt-4 pt-3 border-t border-paper-200 dark:border-ink-850 font-mono">
          <div className="flex items-center gap-3">
            <time dateTime={poem.published_at}>{formatDate(poem.published_at)}</time>
            {poem.notes && (
              <>
                <span>&middot;</span>
                <span className="italic font-sans text-paper-600 dark:text-ink-400">{poem.notes}</span>
              </>
            )}
          </div>

          <DynamicPdfButton
            title={mainTitle}
            author={poem.author || 'রাফি'}
            category="কবিতা ও স্তবক"
            publishedAt={poem.published_at}
            content={primaryBody}
            buttonLabel="কবিতাটি পিডিএফ ডাউনলোড করুন"
          />
        </div>
      </header>

      {/* Stanza and line-break fidelity */}
      {stanzas.length > 0 && stanzas[0] !== '' && (
        <div className="my-10 pl-4 md:pl-8 border-l-2 border-accent/40 space-y-8">
          {stanzas.map((stanza, sIdx) => (
            <p
              key={sIdx}
              className="poem-stanza text-paper-900 dark:text-ink-100 leading-loose text-lg md:text-xl font-serif whitespace-pre-line"
            >
              {stanza}
            </p>
          ))}
        </div>
      )}

      {/* Secondary translation if available */}
      {hasDistinctTranslation && (
        <div className="mt-16 pt-8 border-t border-paper-200 dark:border-ink-800">
          <h2 className="text-xs uppercase tracking-wider text-accent font-semibold mb-4">
            ইংরেজি সংস্করণ / English Version
          </h2>
          <div className="pl-4 md:pl-8 border-l border-paper-300 dark:border-ink-800 space-y-6 text-paper-700 dark:text-ink-300 font-serif text-base">
            {(poem.content || '').split(/\n\s*\n/).map((stz, i) => (
              <p key={i} className="whitespace-pre-line leading-relaxed">
                {stz}
              </p>
            ))}
          </div>
        </div>
      )}
      {/* Footer & Actions */}
      <footer className="mt-16 pt-8 border-t border-paper-200 dark:border-ink-800 flex items-center justify-between text-xs text-paper-500 dark:text-ink-400">
        <Link
          href="/poems"
          className="hover:text-accent transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>সকল কবিতা</span>
        </Link>

        <DynamicPdfButton
          title={mainTitle}
          author={poem.author || 'রাফি'}
          category="কবিতা ও স্তবক"
          publishedAt={poem.published_at}
          content={primaryBody}
          buttonLabel="পিডিএফ ডাউনলোড করুন"
        />
      </footer>
    </article>
  );
}
