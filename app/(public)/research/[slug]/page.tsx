import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getResearch, getResearchBySlug } from '@/lib/supabase/api';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Download, FileText, Sparkles } from 'lucide-react';
import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';
import { PdfViewer } from '@/components/reader/pdf-viewer';

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

          {paper.pdf_url && (
            <a
              href={paper.pdf_url}
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-white dark:text-ink-950 font-medium text-xs hover:bg-accent-hover transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>পিডিএফ ডাউনলোড (Download Full Paper)</span>
            </a>
          )}
        </div>
      </header>

      {/* Embedded PDF Viewer if available */}
      {paper.pdf_url && (
        <div className="my-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-sans font-medium text-paper-900 dark:text-ink-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              <span>অনলাইন পাঠক ও পিডিএফ ভিউয়ার (In-Browser Document Reader)</span>
            </h2>
          </div>
          <PdfViewer url={paper.pdf_url} title={mainTitle} />
        </div>
      )}

      {/* Full Content if available */}
      {paper.content && (
        <div className="my-10">
          <MarkdownRenderer content={paper.content} />
        </div>
      )}
    </article>
  );
}
