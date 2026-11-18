import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Feather, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Article, Book, Poem, Poster, ResearchPaper } from '@/lib/types';

interface SummaryPanelsProps {
  data: {
    poems: { count: number; recent: Poem[] };
    articles: { count: number; recent: Article[] };
    research: { count: number; recent: ResearchPaper[] };
    posters: { count: number; recent: Poster[] };
    books: { count: number; recent: Book[] };
  };
}

export function SummaryPanels({ data }: SummaryPanelsProps) {
  const panels = [
    {
      title: 'Poems',
      titleBn: 'কবিতা',
      count: data.poems.count,
      href: '/poems',
      icon: Feather,
      items: data.poems.recent.map((p) => ({
        title: p.title || p.title_bn,
        titleBn: p.title_bn && p.title_bn !== p.title ? p.title_bn : null,
        href: `/poems/${p.slug}`,
        date: p.published_at,
        meta: p.tags?.slice(0, 2).join(', '),
      })),
    },
    {
      title: 'Articles',
      titleBn: 'প্রবন্ধ',
      count: data.articles.count,
      href: '/articles',
      icon: FileText,
      items: data.articles.recent.map((a) => ({
        title: a.title || a.title_bn,
        titleBn: a.title_bn && a.title_bn !== a.title ? a.title_bn : null,
        href: `/articles/${a.slug}`,
        date: a.published_at,
        meta: `${a.reading_time_min} min read`,
      })),
    },
    {
      title: 'Personal Research',
      titleBn: 'গবেষণা',
      count: data.research.count,
      href: '/research',
      icon: Sparkles,
      items: data.research.recent.map((r) => ({
        title: r.title || r.title_bn,
        titleBn: r.title_bn && r.title_bn !== r.title ? r.title_bn : null,
        href: `/research/${r.slug}`,
        date: r.published_at,
        meta: r.status === 'ongoing' ? 'Ongoing' : 'Published',
      })),
    },
    {
      title: 'Posters',
      titleBn: 'পোস্টার',
      count: data.posters.count,
      href: '/posters',
      icon: ImageIcon,
      items: data.posters.recent.map((post) => ({
        title: post.title || post.title_bn,
        titleBn: post.title_bn && post.title_bn !== post.title ? post.title_bn : null,
        href: `/posters/${post.slug}`,
        date: post.published_at,
        meta: post.dimensions || 'Archival Print',
      })),
    },
    {
      title: 'Books',
      titleBn: 'বই',
      count: data.books.count,
      href: '/books',
      icon: BookOpen,
      items: data.books.recent.map((b) => ({
        title: b.title || b.title_bn,
        titleBn: b.title_bn && b.title_bn !== b.title ? b.title_bn : null,
        href: `/books/${b.slug}`,
        date: b.published_at,
        meta: `${b.chapters?.length || 4} chapters`,
      })),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {panels.map((panel, idx) => {
        const Icon = panel.icon;
        return (
          <div
            key={panel.title}
            className={`border border-paper-200 dark:border-ink-800 bg-paper-100/50 dark:bg-ink-900/40 rounded-lg p-5 flex flex-col justify-between hover:border-paper-300 dark:hover:border-ink-700 transition-colors ${
              idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
            }`}
          >
            <div>
              {/* Header: Title + Count Badge */}
              <div className="flex items-center justify-between pb-3.5 border-b border-paper-200 dark:border-ink-800">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded bg-paper-200 dark:bg-ink-800 text-paper-700 dark:text-ink-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-medium text-base text-paper-900 dark:text-ink-100">
                      {panel.title}
                    </h3>
                    <span className="text-[11px] font-serif text-paper-700 dark:text-ink-300">
                      {panel.titleBn}
                    </span>
                  </div>
                </div>

                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-paper-200 dark:bg-ink-800 text-paper-700 dark:text-ink-300">
                  {panel.count}
                </span>
              </div>

              {/* 3 Newest Items */}
              <ul className="mt-4 space-y-3">
                {panel.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="group">
                    <Link
                      href={item.href}
                      className="block text-sm hover:text-accent transition-colors"
                    >
                      <p className="font-serif font-normal text-paper-900 dark:text-ink-200 group-hover:text-accent line-clamp-1">
                        {item.title}
                      </p>
                      {item.titleBn && (
                        <p className="font-bengaliSerif text-xs text-paper-700 dark:text-ink-300 line-clamp-1">
                          {item.titleBn}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-[11px] text-paper-700 dark:text-ink-300 mt-0.5">
                        <span>{formatDate(item.date)}</span>
                        {item.meta && (
                          <>
                            <span>&middot;</span>
                            <span className="text-paper-700 dark:text-ink-300">{item.meta}</span>
                          </>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* View All link */}
            <div className="pt-4 mt-4 border-t border-paper-200 dark:border-ink-800/60">
              <Link
                href={panel.href}
                className="inline-flex items-center text-xs font-medium text-accent hover:text-accent-hover transition-colors gap-1"
              >
                <span>View all {panel.title.toLowerCase()}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
