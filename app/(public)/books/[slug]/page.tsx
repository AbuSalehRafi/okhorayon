import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBookBySlug, getBooks } from '@/lib/supabase/api';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';

export async function generateStaticParams() {
  const books = await getBooks();
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const book = await getBookBySlug(params.slug);
  if (!book) return { title: 'Book Not Found' };
  return {
    title: `${book.title || book.title_bn} — Book by Rafi`,
    description: book.description,
  };
}

export default async function SingleBookPage({ params }: { params: { slug: string } }) {
  const book = await getBookBySlug(params.slug);
  if (!book) notFound();

  const mainTitle = book.title || book.title_bn || 'Untitled Book';
  const subTitle = book.title_bn && book.title_bn !== book.title ? book.title_bn : null;

  return (
    <article className="max-w-3xl mx-auto py-6">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 text-xs text-paper-700 dark:text-ink-300 hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to library</span>
        </Link>
      </div>

      {/* Book Hero Info */}
      <div className="flex flex-col sm:flex-row gap-8 pb-10 border-b border-paper-200 dark:border-ink-800">
        <div className="relative w-44 aspect-[2/3] shrink-0 rounded-lg overflow-hidden border border-paper-300 dark:border-ink-800 shadow-md bg-paper-200 dark:bg-ink-950">
          <Image
            src={book.cover_image_url}
            alt={mainTitle}
            fill
            priority
            sizes="200px"
            className="object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-accent font-semibold flex items-center gap-1 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Volume</span>
            </span>

            <h1 className="font-serif text-3xl md:text-4xl font-normal text-paper-900 dark:text-ink-100">
              {mainTitle}
            </h1>

            {subTitle && (
              <p className="font-bengaliSerif text-xl text-paper-700 dark:text-ink-300 mt-1">
                {subTitle}
              </p>
            )}

            {book.subtitle && (
              <p className="font-serif italic text-base text-paper-700 dark:text-ink-300 mt-1">
                {book.subtitle}
              </p>
            )}

            {book.description && (
              <p className="font-serif text-sm md:text-base text-paper-700 dark:text-ink-300 mt-4 leading-relaxed">
                {book.description}
              </p>
            )}
          </div>

          {book.chapters && book.chapters.length > 0 && (
            <div className="mt-6 pt-4">
              <Link
                href={`/books/${book.slug}/${book.chapters[0].slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white dark:text-ink-950 font-medium text-xs hover:bg-accent-hover transition-colors shadow-sm"
              >
                <span>Read From Beginning</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Table of Contents */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-normal text-paper-900 dark:text-ink-100 mb-6">
          Table of Contents
        </h2>

        <div className="space-y-3">
          {book.chapters?.map((chap) => (
            <Link
              key={chap.id}
              href={`/books/${book.slug}/${chap.slug}`}
              className="group flex items-center justify-between p-4 rounded-lg border border-paper-200 dark:border-ink-800 bg-paper-100/40 dark:bg-ink-900/30 hover:border-accent hover:bg-paper-100 dark:hover:bg-ink-900 transition-all"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-accent font-semibold w-8">
                  {String(chap.chapter_number).padStart(2, '0')}.
                </span>
                <div>
                  <h3 className="font-serif text-base text-paper-900 dark:text-ink-100 group-hover:text-accent transition-colors">
                    {chap.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-paper-700 dark:text-ink-300 font-mono shrink-0">
                <span className="hidden sm:flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{chap.reading_time_min}m</span>
                </span>
                <span className="text-accent group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
