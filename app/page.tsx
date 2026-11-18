import React from 'react';
import Link from 'next/link';
import {
  getProfile,
  getQuotes,
  getArticles,
  getPoems,
  getResearch,
  getPosters,
  getBooks,
} from '@/lib/supabase/api';
import { Hero } from '@/components/dashboard/hero';
import { SearchBar } from '@/components/dashboard/search-bar';
import { ContinueReadingCard } from '@/components/dashboard/continue-reading';
import { InterstitialQuoteCard } from '@/components/quotes/interstitial-quote';
import { formatDate } from '@/lib/utils';
import { ArrowRight, BookOpen, Clock, Download, Feather, FileCheck, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';

export const revalidate = 0; // Dynamic, updates immediately on file/admin edits

export default async function HomePage() {
  const [profile, quotes, articles, poems, research, posters, books] = await Promise.all([
    getProfile(),
    getQuotes(),
    getArticles(),
    getPoems(),
    getResearch(),
    getPosters(),
    getBooks(),
  ]);

  const recentArticles = articles.slice(0, 3);
  const recentPoems = poems.slice(0, 3);
  const recentResearch = research.slice(0, 3);
  const recentPosters = posters.slice(0, 3);
  const recentBooks = books.slice(0, 3);

  return (
    <div className="space-y-20 py-2">
      {/* 1. Quiet Hero with editable philosophy statement */}
      <Hero profile={profile} />

      {/* 2. Global Archive Search */}
      <div className="max-w-2xl mx-auto -mt-6">
        <SearchBar placeholder="কবিতা, প্রবন্ধ, গবেষণা, পোস্টার ও বই খুঁজুন (Search archive)..." />
      </div>

      {/* 3. Continue Reading Widget (if active) */}
      <ContinueReadingCard />

      {/* Quote Interlude 1 */}
      {quotes[0] && <InterstitialQuoteCard quote={quotes[0]} />}

      {/* SECTION 1: প্রবন্ধ / ARTICLES */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-paper-200 dark:border-ink-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent font-medium mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>শাখা ১ &middot; প্রবন্ধ ও নিবন্ধ</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-paper-950 dark:text-ink-50">
              প্রবন্ধ <span className="font-sans text-lg font-light text-paper-500 dark:text-ink-400">/ Articles</span>
            </h2>
          </div>
          <Link
            href="/articles"
            className="group inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-accent hover:underline"
          >
            <span>সকল প্রবন্ধ দেখুন ({articles.length})</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="divide-y divide-paper-200 dark:divide-ink-800/80">
          {recentArticles.map((article) => {
            const title = article.title_bn || article.title;
            const excerpt = article.excerpt_bn || article.excerpt;
            return (
              <article key={article.id} className="py-6 first:pt-2 group">
                <div className="flex items-baseline justify-between gap-4 text-xs text-paper-500 dark:text-ink-400 mb-2">
                  <div className="flex items-center gap-3">
                    <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
                    <span>&middot;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.reading_time_min} মিনিট পাঠ
                    </span>
                  </div>
                  {article.pdf_url && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-accent/10 text-accent font-mono">
                      <Download className="w-3 h-3" /> PDF
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl md:text-2xl font-normal text-paper-900 dark:text-ink-100 group-hover:text-accent transition-colors">
                  <Link href={`/articles/${article.slug}`}>{title}</Link>
                </h3>

                {excerpt && (
                  <p className="mt-2.5 font-serif text-base text-paper-600 dark:text-ink-300 leading-relaxed line-clamp-2">
                    {excerpt}
                  </p>
                )}

                {article.tags && article.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-paper-200/50 dark:bg-ink-900 text-paper-600 dark:text-ink-400"
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
      </section>

      {/* SECTION 2: কবিতা / POEMS */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-paper-200 dark:border-ink-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent font-medium mb-1">
              <Feather className="w-3.5 h-3.5" />
              <span>শাখা ২ &middot; কাব্য ও পঙ্‌ক্তিমালা</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-paper-950 dark:text-ink-50">
              কবিতা <span className="font-sans text-lg font-light text-paper-500 dark:text-ink-400">/ Poems</span>
            </h2>
          </div>
          <Link
            href="/poems"
            className="group inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-accent hover:underline"
          >
            <span>সকল কবিতা দেখুন ({poems.length})</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPoems.map((poem) => {
            const title = poem.title_bn || poem.title;
            const content = poem.content_bn || poem.content || '';
            const previewLines = content
              .split('\n')
              .filter((l) => l.trim().length > 0)
              .slice(0, 4);

            return (
              <div
                key={poem.id}
                className="border border-paper-200 dark:border-ink-800 bg-paper-100/40 dark:bg-ink-900/40 rounded-lg p-5 flex flex-col justify-between hover:border-accent/40 transition-colors"
              >
                <div>
                  <div className="text-xs text-paper-500 dark:text-ink-400 mb-2">
                    {formatDate(poem.published_at)}
                  </div>
                  <h3 className="font-serif text-lg font-medium text-paper-900 dark:text-ink-100 hover:text-accent transition-colors">
                    <Link href={`/poems/${poem.slug}`}>{title}</Link>
                  </h3>
                  <div className="mt-4 font-serif text-sm text-paper-600 dark:text-ink-300 leading-relaxed italic space-y-1 pl-2 border-l-2 border-paper-300 dark:border-ink-800">
                    {previewLines.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                    {content.split('\n').filter((l) => l.trim()).length > 4 && (
                      <p className="text-xs text-paper-400 dark:text-ink-500">...</p>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-paper-200 dark:border-ink-800/60 flex items-center justify-between text-xs">
                  <span className="text-paper-500 dark:text-ink-400">
                    {poem.form || 'ছন্দহীন / মুক্তক'}
                  </span>
                  <Link
                    href={`/poems/${poem.slug}`}
                    className="text-accent hover:underline font-medium"
                  >
                    পাঠ করুন &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quote Interlude 2 */}
      {quotes[1] && <InterstitialQuoteCard quote={quotes[1]} />}

      {/* SECTION 3: গবেষণা / PERSONAL RESEARCH */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-paper-200 dark:border-ink-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>শাখা ৩ &middot; গবেষণা ও অভিসন্দর্ভ</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-paper-950 dark:text-ink-50">
              ব্যক্তিগত গবেষণা <span className="font-sans text-lg font-light text-paper-500 dark:text-ink-400">/ Research</span>
            </h2>
          </div>
          <Link
            href="/research"
            className="group inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-accent hover:underline"
          >
            <span>সকল গবেষণা দেখুন ({research.length})</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentResearch.map((paper) => {
            const title = paper.title_bn || paper.title;
            const abstract = paper.abstract_bn || paper.abstract;
            return (
              <div
                key={paper.id}
                className="border border-paper-200 dark:border-ink-800 bg-paper-100/40 dark:bg-ink-900/40 rounded-lg p-5 flex flex-col justify-between hover:border-accent/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs mb-2">
                    <span className="text-paper-500 dark:text-ink-400">
                      {formatDate(paper.published_at)}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${
                        paper.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {paper.status === 'published' ? 'Published' : 'Ongoing'}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-medium text-paper-900 dark:text-ink-100 hover:text-accent transition-colors">
                    <Link href={`/research/${paper.slug}`}>{title}</Link>
                  </h3>

                  {abstract && (
                    <p className="mt-2.5 font-serif text-xs md:text-sm text-paper-600 dark:text-ink-300 line-clamp-3 leading-relaxed">
                      {abstract}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-paper-200 dark:border-ink-800/60 flex items-center justify-between text-xs">
                  {paper.pdf_url ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-accent font-mono">
                      <Download className="w-3 h-3" /> PDF সংযুক্ত
                    </span>
                  ) : (
                    <span className="text-paper-400 dark:text-ink-500">অনলাইন পেপার</span>
                  )}
                  <Link
                    href={`/research/${paper.slug}`}
                    className="text-accent hover:underline font-medium"
                  >
                    বিস্তারিত &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: পোস্টার / POSTERS */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-paper-200 dark:border-ink-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent font-medium mb-1">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>শাখা ৪ &middot; দৃশ্যশিল্প ও পোস্টার</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-paper-950 dark:text-ink-50">
              পোস্টার গ্যালারি <span className="font-sans text-lg font-light text-paper-500 dark:text-ink-400">/ Posters</span>
            </h2>
          </div>
          <Link
            href="/posters"
            className="group inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-accent hover:underline"
          >
            <span>সকল পোস্টার দেখুন ({posters.length})</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recentPosters.map((poster) => {
            const title = poster.title_bn || poster.title;
            return (
              <div
                key={poster.id}
                className="group border border-paper-200 dark:border-ink-800 bg-paper-100/40 dark:bg-ink-900/40 rounded-lg overflow-hidden hover:border-accent/40 transition-all flex flex-col"
              >
                <Link href={`/posters/${poster.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-paper-200 dark:bg-ink-800">
                  <img
                    src={poster.image_url}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </Link>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base font-medium text-paper-900 dark:text-ink-100 group-hover:text-accent transition-colors">
                      <Link href={`/posters/${poster.slug}`}>{title}</Link>
                    </h3>
                    {poster.dimensions && (
                      <p className="text-xs text-paper-500 dark:text-ink-400 font-mono mt-1">
                        {poster.dimensions}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 pt-2 border-t border-paper-200 dark:border-ink-800/60 flex items-center justify-between text-xs">
                    <span className="text-paper-500 dark:text-ink-400">
                      {formatDate(poster.published_at)}
                    </span>
                    <Link
                      href={`/posters/${poster.slug}`}
                      className="text-accent hover:underline font-medium"
                    >
                      ফুলস্ক্রিন &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: বই / BOOKS */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-paper-200 dark:border-ink-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent font-medium mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>শাখা ৫ &middot; পুস্তক ও সংকলন</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-paper-950 dark:text-ink-50">
              বই ও পুস্তিকা <span className="font-sans text-lg font-light text-paper-500 dark:text-ink-400">/ Books</span>
            </h2>
          </div>
          <Link
            href="/books"
            className="group inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-accent hover:underline"
          >
            <span>সকল বই দেখুন ({books.length})</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentBooks.map((book) => {
            const title = book.title_bn || book.title;
            const desc = book.description_bn || book.description;
            const chapterCount = book.chapters?.length || 0;
            return (
              <div
                key={book.id}
                className="border border-paper-200 dark:border-ink-800 bg-paper-100/40 dark:bg-ink-900/40 rounded-lg p-5 flex flex-col justify-between hover:border-accent/40 transition-colors"
              >
                <div>
                  {book.cover_image_url && (
                    <div className="mb-4 aspect-[3/4] max-h-56 overflow-hidden rounded shadow-sm bg-paper-200 dark:bg-ink-800">
                      <img
                        src={book.cover_image_url}
                        alt={title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-paper-500 dark:text-ink-400 mb-2">
                    <span>{formatDate(book.published_at)}</span>
                    {chapterCount > 0 && (
                      <>
                        <span>&middot;</span>
                        <span>{chapterCount} টি অধ্যায়</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-medium text-paper-900 dark:text-ink-100 hover:text-accent transition-colors">
                    <Link href={`/books/${book.slug}`}>{title}</Link>
                  </h3>

                  {desc && (
                    <p className="mt-2.5 font-serif text-xs md:text-sm text-paper-600 dark:text-ink-300 line-clamp-3 leading-relaxed">
                      {desc}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-paper-200 dark:border-ink-800/60 flex items-center justify-between text-xs">
                  <span className="text-paper-500 dark:text-ink-400 font-mono text-[11px]">
                    অনলাইন রিডার
                  </span>
                  <Link
                    href={`/books/${book.slug}`}
                    className="text-accent hover:underline font-medium"
                  >
                    বই খুলুন &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
