import React from 'react';
import Link from 'next/link';
import { getArticles } from '@/lib/supabase/api';
import { formatDate } from '@/lib/utils';
import { Clock, Download, FileText, Tag } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: `প্রবন্ধ ও নিবন্ধ — ${siteConfig.name}`,
  description: 'মননশীল প্রবন্ধ, দর্শন, সামাজিক বিশ্লেষণ, সাহিত্য ও চিন্তামূলক রচনার উন্মুক্ত পাঠাগার।',
};

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-paper-200 dark:border-ink-800 pb-6">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <FileText className="w-4 h-4" />
          <span>প্রবন্ধ ও চিন্তা &middot; Essays &amp; Inquiries</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-paper-950 dark:text-ink-50">
          প্রবন্ধ
          <span className="ml-3 font-sans text-paper-400 dark:text-ink-400 text-2xl font-light">
            / Articles ({articles.length})
          </span>
        </h1>
        <p className="mt-2 text-sm md:text-base text-paper-600 dark:text-ink-300 font-serif leading-relaxed">
          সমাজ, সাহিত্য, শিক্ষা, মানবিক সংকট ও ভাবনার নিবিষ্ট ব্যবচ্ছেদ।
        </p>
      </div>

      {/* Article feed */}
      <div className="space-y-8">
        {articles.map((article) => {
          const mainTitle = article.title_bn || article.title || 'Untitled Essay';
          const subTitle = article.title && article.title !== article.title_bn ? article.title : null;
          const excerpt = article.excerpt_bn || article.excerpt;

          return (
            <article
              key={article.id}
              className="group p-6 rounded-lg border border-paper-200 dark:border-ink-800 bg-paper-100/40 dark:bg-ink-900/30 hover:border-accent/40 transition-all"
            >
              <div className="flex items-center justify-between text-xs text-paper-500 dark:text-ink-400 font-mono mb-2">
                <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.reading_time_min || 5} মিনিট পাঠ</span>
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
                  <p className="font-sans text-sm text-paper-500 dark:text-ink-400 mt-1">
                    {subTitle}
                  </p>
                )}
                {excerpt && (
                  <p className="text-paper-600 dark:text-ink-300 text-sm md:text-base font-serif mt-3 leading-relaxed">
                    {excerpt}
                  </p>
                )}
              </Link>

              {/* Tags & Action */}
              <div className="mt-5 flex items-center justify-between gap-4 pt-3 border-t border-paper-200 dark:border-ink-800/60">
                <div className="flex items-center gap-2 flex-wrap">
                  {article.tags && article.tags.length > 0 && (
                    <>
                      <Tag className="w-3 h-3 text-paper-400 dark:text-ink-500" />
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2.5 py-0.5 rounded-full bg-paper-200 dark:bg-ink-850 text-paper-600 dark:text-ink-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </>
                  )}
                </div>

                <Link
                  href={`/articles/${article.slug}`}
                  className="text-xs font-medium text-accent hover:underline shrink-0"
                >
                  সম্পূর্ণ পাঠ &rarr;
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
