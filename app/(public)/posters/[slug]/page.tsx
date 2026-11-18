import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPosterBySlug, getPosters } from '@/lib/supabase/api';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Download, Image as ImageIcon } from 'lucide-react';

export async function generateStaticParams() {
  const posters = await getPosters();
  return posters.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const poster = await getPosterBySlug(params.slug);
  if (!poster) return { title: 'Poster Not Found' };
  return {
    title: `${poster.title || poster.title_bn} — Visual Work by Rafi`,
    description: poster.description,
  };
}

export default async function SinglePosterPage({ params }: { params: { slug: string } }) {
  const poster = await getPosterBySlug(params.slug);
  if (!poster) notFound();

  const mainTitle = poster.title || poster.title_bn || 'Untitled Artwork';
  const subTitle = poster.title_bn && poster.title_bn !== poster.title ? poster.title_bn : null;

  return (
    <article className="max-w-3xl mx-auto py-6">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/posters"
          className="inline-flex items-center gap-1.5 text-xs text-paper-700 dark:text-ink-300 hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to poster gallery</span>
        </Link>
      </div>

      <header className="border-b border-paper-200 dark:border-ink-800 pb-6 mb-8">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Visual Artwork</span>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl font-normal text-paper-900 dark:text-ink-100">
          {mainTitle}
        </h1>
        {subTitle && (
          <p className="font-bengaliSerif text-xl text-paper-700 dark:text-ink-300 mt-1">
            {subTitle}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs font-mono text-paper-700 dark:text-ink-300 mt-3">
          <time>{formatDate(poster.published_at)}</time>
          {poster.dimensions && (
            <>
              <span>&middot;</span>
              <span>{poster.dimensions}</span>
            </>
          )}
        </div>
      </header>

      {/* Poster Display */}
      <div className="relative aspect-[4/5] w-full max-w-xl mx-auto overflow-hidden rounded-lg border border-paper-300 dark:border-ink-800 shadow-md">
        <Image
          src={poster.high_res_url || poster.image_url}
          alt={mainTitle}
          fill
          priority
          className="object-contain bg-paper-100 dark:bg-ink-900"
        />
      </div>

      <div className="mt-8 p-6 rounded-lg bg-paper-100/60 dark:bg-ink-900/40 border border-paper-200 dark:border-ink-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-medium text-paper-900 dark:text-ink-100">
            Work Details
          </h3>
          <p className="text-sm font-serif text-paper-700 dark:text-ink-300 mt-1">
            {poster.description}
          </p>
        </div>

        <a
          href={poster.high_res_url || poster.image_url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-accent text-white dark:text-ink-950 font-medium text-xs hover:bg-accent-hover transition-colors shrink-0 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Download High-Res</span>
        </a>
      </div>
    </article>
  );
}
