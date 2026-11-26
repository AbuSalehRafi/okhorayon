import React from 'react';
import Link from 'next/link';
import { getResearch } from '@/lib/supabase/api';
import { formatDate } from '@/lib/utils';
import { Download, Sparkles } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 0;

export const metadata = {
  title: `গবেষণা ও অভিসন্দর্ভ — ${siteConfig.name}`,
  description: 'দর্শন, ভাষা, নন্দনতত্ত্ব ও সামাজিক মনস্তত্ত্বের উপর মৌলিক গবেষণা ও গবেষণাপত্র।',
};

export default async function ResearchPage() {
  const papers = await getResearch();

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-paper-200 dark:border-ink-800 pb-6">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>গবেষণা ও পাঠ &middot; Inquiry &amp; Papers</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-paper-950 dark:text-ink-50">
          ব্যক্তিগত গবেষণা
          <span className="ml-3 font-sans text-paper-400 dark:text-ink-400 text-2xl font-light">
            / Research ({papers.length})
          </span>
        </h1>
        <p className="mt-2 text-sm md:text-base text-paper-600 dark:text-ink-300 font-serif leading-relaxed">
          মনোগ্রাফ, তাত্ত্বিক অন্বেষণ এবং বিশ্লেষণমূলক গবেষণাপত্র ও পিডিএফ সংযুক্তি।
        </p>
      </div>

      {/* Papers feed */}
      <div className="space-y-8">
        {papers.map((paper) => {
          const mainTitle = paper.title_bn || paper.title || 'Untitled Monograph';
          const subTitle = paper.title && paper.title !== paper.title_bn ? paper.title : null;
          const abstract = paper.abstract_bn || paper.abstract;

          return (
            <article
              key={paper.id}
              className="group p-6 rounded-lg border border-paper-200 dark:border-ink-800 bg-paper-100/40 dark:bg-ink-900/30 hover:border-accent/40 transition-all"
            >
              {/* Meta Row */}
              <div className="flex items-center justify-between text-xs font-mono mb-3">
                <time dateTime={paper.published_at} className="text-paper-500 dark:text-ink-400">
                  {formatDate(paper.published_at)}
                </time>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium uppercase tracking-wider ${
                      paper.status === 'published'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {paper.status === 'published' ? 'Published' : 'Ongoing Study'}
                  </span>
                  {paper.is_sample && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent uppercase">
                      Sample
                    </span>
                  )}
                </div>
              </div>

              <Link href={`/research/${paper.slug}`} className="block">
                <h2 className="font-serif text-2xl font-medium text-paper-900 dark:text-ink-100 group-hover:text-accent transition-colors">
                  {mainTitle}
                </h2>
                {subTitle && (
                  <p className="font-sans text-sm text-paper-500 dark:text-ink-400 mt-1">
                    {subTitle}
                  </p>
                )}
              </Link>

              {/* Abstract */}
              {abstract && (
                <div className="mt-4 p-4 rounded bg-paper-200/50 dark:bg-ink-850/60 border-l-2 border-accent">
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-accent block mb-1">
                    সারসংক্ষেপ / Abstract
                  </span>
                  <p className="text-sm font-serif text-paper-700 dark:text-ink-300 leading-relaxed">
                    {abstract}
                  </p>
                </div>
              )}

              {/* Keywords & Actions */}
              <div className="mt-5 flex items-center justify-between flex-wrap gap-4 pt-3 border-t border-paper-200 dark:border-ink-800/60">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {paper.keywords &&
                    paper.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-xs px-2 py-0.5 rounded bg-paper-200 dark:bg-ink-800 text-paper-600 dark:text-ink-400 font-sans"
                      >
                        {kw}
                      </span>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/research/${paper.slug}`}
                    className="text-xs font-medium text-accent hover:underline flex items-center gap-1 transition-colors"
                  >
                    <span>গবেষণা পাঠ করুন</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
