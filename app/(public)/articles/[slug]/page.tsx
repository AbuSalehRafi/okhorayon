import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getArticles } from '@/lib/supabase/api';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Clock, Download, FileText, Tag } from 'lucide-react';
import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';
import { ReadingProgressBar } from '@/components/reader/reading-progress';
import { DynamicPdfButton } from '@/components/reader/dynamic-pdf-button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: `${article.title || article.title_bn} — অক্ষরায়ণ`,
    description: article.excerpt || article.excerpt_bn,
  };
}

export default async function SingleArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const mainTitle = article.title_bn || article.title || 'Untitled Essay';
  const subTitle = article.title && article.title !== article.title_bn ? article.title : null;

  return (
    <>
      <ReadingProgressBar />
      <article className="max-w-3xl mx-auto py-6">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-xs text-paper-700 dark:text-ink-300 hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>সকল প্রবন্ধে ফিরে যান (Back to articles)</span>
          </Link>
        </div>

        {/* Header */}
        <header className="border-b border-paper-200 dark:border-ink-800 pb-8 mb-10">
          <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>প্রবন্ধ ও চিন্তা</span>
            {article.is_sample && (
              <span className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded bg-accent/15 text-accent">
                Sample
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-paper-950 dark:text-ink-50 leading-tight">
            {mainTitle}
          </h1>

          {subTitle && (
            <p className="font-sans text-xl text-paper-600 dark:text-ink-300 mt-2">
              {subTitle}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-paper-600 dark:text-ink-300 mt-6 pt-4 border-t border-paper-200 dark:border-ink-850">
            <div className="flex items-center gap-3">
              <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
              <span>&middot;</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{article.reading_time_min || 5} মিনিট পাঠ</span>
              </span>
            </div>

            {/* Dynamic PDF Download Button */}
            <DynamicPdfButton
              title={mainTitle}
              author={article.author || 'রাফি'}
              category="প্রবন্ধ ও চিন্তা"
              publishedAt={article.published_at}
              excerpt={article.excerpt_bn || article.excerpt}
              content={article.content || ''}
              buttonLabel="পিডিএফ ডাউনলোড (PDF)"
            />
          </div>

          {(article.excerpt || article.excerpt_bn) && (
            <p className="mt-6 text-base md:text-lg font-serif italic text-paper-700 dark:text-ink-200 leading-relaxed border-l-2 border-accent pl-4">
              {article.excerpt_bn || article.excerpt}
            </p>
          )}
        </header>

        {/* Full Text Content directly displayed on page */}
        {article.content ? (
          <div className="my-10 leading-relaxed text-paper-900 dark:text-ink-100 font-serif">
            <MarkdownRenderer content={article.content} />
          </div>
        ) : (
          <div className="my-10 p-6 rounded-lg bg-paper-100 dark:bg-ink-900 border border-paper-200 dark:border-ink-800 text-sm text-paper-700 dark:text-ink-300">
            কোনো বিস্তারিত বিবরণ পাওয়া যায়নি।
          </div>
        )}

        {/* Footer & Tags */}
        <footer className="mt-16 pt-8 border-t border-paper-200 dark:border-ink-800">
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-8">
              <Tag className="w-3.5 h-3.5 text-paper-500 dark:text-ink-400" />
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-paper-200/60 dark:bg-ink-850 text-paper-700 dark:text-ink-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-paper-500 dark:text-ink-400">
            <Link
              href="/articles"
              className="hover:text-accent transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>সকল প্রবন্ধ</span>
            </Link>

            <DynamicPdfButton
              title={mainTitle}
              author={article.author || 'রাফি'}
              category="প্রবন্ধ ও চিন্তা"
              publishedAt={article.published_at}
              excerpt={article.excerpt_bn || article.excerpt}
              content={article.content || ''}
              buttonLabel="পিডিএফ ডাউনলোড করুন"
            />
          </div>
        </footer>
      </article>
    </>
  );
}
