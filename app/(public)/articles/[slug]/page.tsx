import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getArticles } from '@/lib/supabase/api';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Clock, FileText, Tag } from 'lucide-react';
import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';
import { ReadingProgressBar } from '@/components/reader/reading-progress';

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: `${article.title || article.title_bn} — Essay by Rafi`,
    description: article.excerpt,
  };
}

export default async function SingleArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const mainTitle = article.title || article.title_bn || 'Untitled Essay';
  const subTitle = article.title_bn && article.title_bn !== article.title ? article.title_bn : null;

  return (
    <>
      <ReadingProgressBar />
      <article className="max-w-2xl mx-auto py-6">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-xs text-paper-700 dark:text-ink-300 hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all essays</span>
          </Link>
        </div>

        {/* Header */}
        <header className="border-b border-paper-200 dark:border-ink-800 pb-8 mb-10">
          <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Philosophical Essay</span>
            {article.is_sample && (
              <span className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded bg-accent/15 text-accent">
                Sample
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-paper-900 dark:text-ink-100 leading-tight">
            {mainTitle}
          </h1>

          {subTitle && (
            <p className="font-bengaliSerif text-xl md:text-2xl text-paper-700 dark:text-ink-300 mt-2">
              {subTitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-paper-700 dark:text-ink-300 mt-6">
            <time>{formatDate(article.published_at)}</time>
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{article.reading_time_min} min read</span>
            </span>
          </div>

          {article.excerpt && (
            <p className="mt-6 text-base md:text-lg font-serif italic text-paper-700 dark:text-ink-300 leading-relaxed border-l-2 border-accent pl-4">
              {article.excerpt}
            </p>
          )}
        </header>

        {/* Markdown Content */}
        <div className="my-10">
          <MarkdownRenderer content={article.content} />
        </div>

        {/* Footer & Tags */}
        <footer className="mt-16 pt-8 border-t border-paper-200 dark:border-ink-800">
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-8">
              <Tag className="w-3.5 h-3.5 text-paper-700 dark:text-ink-400" />
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-paper-200 dark:bg-ink-850 text-paper-700 dark:text-ink-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* About Author */}
          <div className="p-6 rounded-lg bg-paper-100 dark:bg-ink-900 border border-paper-200 dark:border-ink-800 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-accent text-white dark:text-ink-950 font-serif flex items-center justify-center font-bold text-lg shrink-0">
              R
            </div>
            <div>
              <h4 className="font-serif font-medium text-paper-900 dark:text-ink-100">
                Rafi / রাফি
              </h4>
              <p className="text-xs text-paper-700 dark:text-ink-300 mt-1 font-serif leading-relaxed">
                Thinking in the margin of silence; observing where thought meets stillness.
              </p>
            </div>
          </div>
        </footer>
      </article>
    </>
  );
}
