import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBookBySlug, getBooks } from '@/lib/supabase/api';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { DynamicPdfButton } from '@/components/reader/dynamic-pdf-button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const book = await getBookBySlug(params.slug);
  if (!book) return { title: 'Book Not Found' };
  return {
    title: `${book.title || book.title_bn} — অক্ষরায়ণ`,
    description: book.description || book.description_bn,
  };
}

export default async function SingleBookPage({ params }: { params: { slug: string } }) {
  const book = await getBookBySlug(params.slug);
  if (!book) notFound();

  const mainTitle = book.title_bn || book.title || 'Untitled Book';
  const subTitle = book.title && book.title !== book.title_bn ? book.title : null;

  return (
    <article className="max-w-3xl mx-auto py-6">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 text-xs text-paper-700 dark:text-ink-300 hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>সকল বইয়ের তালিকায় ফিরে যান (Back to library)</span>
        </Link>
      </div>

      {/* Book Hero Info */}
      <div className="flex flex-col sm:flex-row gap-8 pb-10 border-b border-paper-200 dark:border-ink-800">
        {book.cover_image_url && (
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
        )}

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-accent font-semibold flex items-center gap-1 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>পুস্তক প্রকাশনা &middot; Full Volume</span>
            </span>

            <h1 className="font-serif text-3xl md:text-4xl font-normal text-paper-950 dark:text-ink-50">
              {mainTitle}
            </h1>

            {subTitle && (
              <p className="font-sans text-xl text-paper-600 dark:text-ink-300 mt-1">
                {subTitle}
              </p>
            )}

            {book.subtitle && (
              <p className="font-serif italic text-base text-paper-600 dark:text-ink-300 mt-1">
                {book.subtitle}
              </p>
            )}

            {(book.description || book.description_bn) && (
              <p className="font-serif text-sm md:text-base text-paper-700 dark:text-ink-200 mt-4 leading-relaxed">
                {book.description_bn || book.description}
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 flex flex-wrap items-center gap-3">
            {book.chapters && book.chapters.length > 0 && (
              <Link
                href={`/books/${book.slug}/${book.chapters[0].slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white dark:text-ink-950 font-medium text-xs hover:bg-accent-hover transition-colors shadow-sm"
              >
                <span>প্রথম অধ্যায় থেকে পড়া শুরু করুন</span>
              </Link>
            )}

            {book.chapters && book.chapters.length > 0 && (
              <DynamicPdfButton
                title={mainTitle}
                author={book.author || 'রাফি'}
                category="পুস্তক প্রকাশনা"
                publishedAt={book.published_at}
                excerpt={book.description_bn || book.description}
                content={(book.chapters || [])
                  .map(
                    (ch: any) =>
                      `### অধ্যায় ${ch.chapter_number}: ${ch.title}\n\n${ch.content || ''}`
                  )
                  .join('\n\n---\n\n')}
                buttonLabel="সম্পূর্ণ বই ডাউনলোড (PDF)"
                className="px-4 py-2.5"
              />
            )}
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      {book.chapters && book.chapters.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-normal text-paper-900 dark:text-ink-100 mb-6">
            সূচিপত্র / Table of Contents
          </h2>

          <div className="space-y-3">
            {book.chapters.map((chap) => (
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

                <div className="flex items-center gap-3 text-xs text-paper-500 dark:text-ink-400 font-mono shrink-0">
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
      )}
    </article>
  );
}
