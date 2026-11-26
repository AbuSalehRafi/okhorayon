import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getResearch, getResearchBySlug } from '@/lib/supabase/api';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';
import { DynamicPdfButton } from '@/components/reader/dynamic-pdf-button';

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const paper = await getResearchBySlug(params.slug);
  if (!paper) return { title: 'Research Not Found' };
  return {
    title: `${paper.title || paper.title_bn} — গবেষণা ও মনোগ্রাফ`,
    description: paper.abstract || paper.abstract_bn,
  };
}

export default async function SingleResearchPage({ params }: { params: { slug: string } }) {
  const paper = await getResearchBySlug(params.slug);
  if (!paper) notFound();

  const mainTitle = paper.title_bn || paper.title || 'Untitled Monograph';
  const subTitle = paper.title && paper.title !== paper.title_bn ? paper.title : null;

  return (
    <article className="max-w-3xl mx-auto py-6">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/research"
          className="inline-flex items-center gap-1.5 text-xs text-paper-700 dark:text-ink-300 hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>সকল গবেষণায় ফিরে যান (Back to research)</span>
        </Link>
      </div>

      {/* Header */}
      <header className="border-b border-paper-200 dark:border-ink-800 pb-8 mb-10">
        <div className="flex items-center justify-between gap-4 mb-3">
          <span className="flex items-center gap-1.5 text-accent text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>গবেষণা ও অভিসন্দর্ভ &middot; Research Inquiry</span>
          </span>

          <span
            className={`px-3 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${
              paper.status === 'published'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
            }`}
          >
            {paper.status === 'published' ? 'Published' : 'Ongoing Study'}
          </span>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl font-normal text-paper-950 dark:text-ink-50 leading-tight">
          {mainTitle}
        </h1>

        {subTitle && (
          <p className="font-sans text-xl text-paper-600 dark:text-ink-300 mt-2">
            {subTitle}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs font-mono text-paper-600 dark:text-ink-400 mt-4">
          <time dateTime={paper.published_at}>{formatDate(paper.published_at)}</time>
          {paper.is_sample && (
            <>
              <span>&middot;</span>
              <span className="text-accent uppercase font-mono text-[10px]">Sample Document</span>
            </>
          )}
        </div>

        {/* Abstract Box */}
        {(paper.abstract || paper.abstract_bn) && (
          <div className="mt-8 p-6 rounded-lg bg-paper-100 dark:bg-ink-900 border border-paper-300 dark:border-ink-800 border-l-4 border-l-accent shadow-sm">
            <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-accent mb-2">
              সারসংক্ষেপ / Abstract
            </h2>
            <p className="font-serif text-base text-paper-800 dark:text-ink-200 leading-relaxed">
              {paper.abstract_bn || paper.abstract}
            </p>
          </div>
        )}

        {/* Action bar: Keywords + PDF download */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          {paper.keywords && paper.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {paper.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs px-2.5 py-1 rounded bg-paper-200 dark:bg-ink-800 text-paper-700 dark:text-ink-300"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}

          <DynamicPdfButton
            title={mainTitle}
            author={paper.author || 'রাফি'}
            category="গবেষণা ও অভিসন্দর্ভ"
            publishedAt={paper.published_at}
            excerpt={paper.abstract_bn || paper.abstract}
            content={paper.content || ''}
            buttonLabel="পিডিএফ ডাউনলোড (PDF)"
          />
        </div>
      </header>

      {/* Full Content */}
      {paper.content && (
        <div className="my-10 text-paper-900 dark:text-ink-100 font-serif leading-relaxed">
          <MarkdownRenderer content={paper.content} />
        </div>
      )}

      {/* Footer & Actions */}
      <footer className="mt-16 pt-8 border-t border-paper-200 dark:border-ink-800 flex items-center justify-between text-xs text-paper-500 dark:text-ink-400">
        <Link
          href="/research"
          className="hover:text-accent transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>সকল গবেষণা</span>
        </Link>

        <DynamicPdfButton
          title={mainTitle}
          author={paper.author || 'রাফি'}
          category="গবেষণা ও অভিসন্দর্ভ"
          publishedAt={paper.published_at}
          excerpt={paper.abstract_bn || paper.abstract}
          content={paper.content || ''}
          buttonLabel="সম্পূর্ণ পেপার ডাউনলোড করুন"
        />
      </footer>
    </article>
  );
}
