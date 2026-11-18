import React from 'react';
import Link from 'next/link';
import { getArticles } from '@/lib/supabase/api';
import { formatDate } from '@/lib/utils';
import { Clock, FileText, Tag } from 'lucide-react';

export const metadata = {
  title: 'Articles & Essays — Rafi',
  description: 'Long-form philosophical essays on metaphysics, language, time, and solitude.',
};

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-paper-200 dark:border-ink-800 pb-6">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <FileText className="w-4 h-4" />
          <span>Essays &amp; Inquiries</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-paper-900 dark:text-ink-100">
          Articles
          <span className="ml-3 font-bengaliSerif text-paper-400 dark:text-ink-400 text-2xl">
            / প্রবন্ধ
          </span>
        </h1>
        <p className="mt-2 text-sm text-paper-700 dark:text-ink-300 font-serif leading-relaxed">
          Extended reflections on the conditions of consciousness, literature, and interior architecture.
        </p>
      </div>

      {/* Article feed */}
      <div className="space-y-8">
        {articles.map((article) => {
          const mainTitle = article.title || article.title_bn || 'Untitled Essay';
          const subTitle = article.title_bn && article.title_bn !== article.title ? article.title_bn : null;

          return (
            <article
              key={article.id}
              className="group p-6 rounded-lg border border-paper-200 dark:border-ink-800 bg-paper-100/40 dark:bg-ink-900/30 hover:border-accent/40 transition-all"
            >
              <div className="flex items-center justify-between text-xs text-paper-700 dark:text-ink-300 font-mono mb-2">
                <time>{formatDate(article.published_at)}</time>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.reading_time_min || 5} min read</span>
                  </span>
                  {article.is_sample && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent uppercase">
                      Sample
                    </span>
                  )}
                </div>
              </div>

              <Link href={`/articles/${article.slug}`} className="block">
                <h2 className="font-serif text-2xl font-medium text-paper-900 dark:text-ink-100 group-hover:text-accent transition-colors">
                  {mainTitle}
                </h2>
                {subTitle && (
                  <p className="font-bengaliSerif text-sm text-paper-700 dark:text-ink-300 mt-1">
                    {subTitle}
                  </p>
                )}
                {article.excerpt && (
                  <p className="text-paper-700 dark:text-ink-300 text-sm md:text-base font-serif mt-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                )}
              </Link>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-5 flex items-center gap-2 flex-wrap pt-3 border-t border-paper-200 dark:border-ink-800/60">
                  <Tag className="w-3 h-3 text-paper-700 dark:text-ink-400" />
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-0.5 rounded-full bg-paper-200 dark:bg-ink-850 text-paper-700 dark:text-ink-300"
                    >
                      {tag}
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
