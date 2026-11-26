import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBooks } from '@/lib/supabase/api';
import { BookOpen } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: `বই ও পুস্তিকা — ${siteConfig.name}`,
  description: 'পুস্তক ও ধারাবাহিক গ্রন্থ সংকলন। অধ্যায়ভিত্তিক পাঠ ও পিডিএফ সংস্করণ।',
};

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-paper-200 dark:border-ink-800 pb-6">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>পুস্তক ও দীর্ঘ রচনা &middot; Long-form Volumes</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-paper-950 dark:text-ink-50">
          বই ও সংকলন
          <span className="ml-3 font-sans text-paper-400 dark:text-ink-400 text-2xl font-light">
            / Books ({books.length})
          </span>
        </h1>
        <p className="mt-2 text-sm md:text-base text-paper-600 dark:text-ink-300 font-serif leading-relaxed">
          সম্পূর্ণ অধ্যায়ভিত্তিক বই ও পুস্তিকা। শান্ত ও মনোযোগী পড়ার পরিবেশ।
        </p>
      </div>

      {/* Book cards */}
      <div className="space-y-8">
        {books.map((book) => {
          const mainTitle = book.title_bn || book.title || 'Untitled Book';
          const subTitle = book.title && book.title !== book.title_bn ? book.title : null;
          const desc = book.description_bn || book.description;

          return (
            <article
              key={book.id}
              className="group border border-paper-200 dark:border-ink-800 bg-paper-100/50 dark:bg-ink-900/40 rounded-xl overflow-hidden hover:border-accent/40 transition-all p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start"
            >
              {/* Book Cover */}
              {book.cover_image_url && (
                <div className="relative w-36 sm:w-44 aspect-[2/3] shrink-0 rounded-md overflow-hidden border border-paper-300 dark:border-ink-800 shadow-md bg-paper-200 dark:bg-ink-950">
                  <Image
                    src={book.cover_image_url}
                    alt={mainTitle}
                    fill
                    sizes="(max-width: 768px) 150px, 180px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-accent/15 text-accent">
                      {book.chapters?.length || 0} অধ্যায়
                    </span>
                    {book.is_sample && (
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-paper-200 dark:bg-ink-800 text-paper-700 dark:text-ink-300">
                        Sample Book
                      </span>
                    )}
                  </div>

                  <Link href={`/books/${book.slug}`}>
                    <h2 className="font-serif text-2xl md:text-3xl font-medium text-paper-900 dark:text-ink-100 group-hover:text-accent transition-colors">
                      {mainTitle}
                    </h2>
                  </Link>

                  {subTitle && (
                    <p className="font-sans text-base text-paper-500 dark:text-ink-400 mt-1">
                      {subTitle}
                    </p>
                  )}

                  {book.subtitle && (
                    <p className="font-serif italic text-sm md:text-base text-paper-600 dark:text-ink-300 mt-1">
                      {book.subtitle}
                    </p>
                  )}

                  {desc && (
                    <p className="font-serif text-sm md:text-base text-paper-600 dark:text-ink-300 mt-4 leading-relaxed line-clamp-3">
                      {desc}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-paper-200 dark:border-ink-800/60 flex items-center gap-4">
                  <Link
                    href={`/books/${book.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-paper-900 dark:bg-ink-100 text-paper-50 dark:text-ink-950 font-medium text-xs hover:bg-accent dark:hover:bg-accent hover:text-white dark:hover:text-ink-950 transition-colors shadow-sm"
                  >
                    <span>সূচিপত্র দেখুন (Table of Contents)</span>
                  </Link>

                  {book.chapters && book.chapters.length > 0 && (
                    <Link
                      href={`/books/${book.slug}/${book.chapters[0].slug}`}
                      className="text-xs text-accent hover:underline font-medium"
                    >
                      পড়া শুরু করুন &rarr;
                    </Link>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
