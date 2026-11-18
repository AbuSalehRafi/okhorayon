'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { ContentItemUnion } from '@/lib/types';
import { ArrowRight, Search as SearchIcon } from 'lucide-react';

function SearchComponent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [filterType, setFilterType] = useState<string>('all');
  const [results, setResults] = useState<ContentItemUnion[]>([]);
  const [archiveData, setArchiveData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => setArchiveData(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!query.trim() || !archiveData) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase().trim();

    const poems = (archiveData.poems || [])
      .filter((p: any) => p.status === 'published')
      .filter(
        (p: any) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.title_bn && p.title_bn.includes(q)) ||
          (p.content && p.content.toLowerCase().includes(q)) ||
          (p.content_bn && p.content_bn.includes(q)) ||
          (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(q)))
      )
      .map((p: any) => ({ ...p, type: 'poem' as const }));

    const articles = (archiveData.articles || [])
      .filter((a: any) => a.status === 'published')
      .filter(
        (a: any) =>
          (a.title && a.title.toLowerCase().includes(q)) ||
          (a.title_bn && a.title_bn.includes(q)) ||
          (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
          (a.content && a.content.toLowerCase().includes(q)) ||
          (a.tags && a.tags.some((t: string) => t.toLowerCase().includes(q)))
      )
      .map((a: any) => ({ ...a, type: 'article' as const }));

    const research = (archiveData.research || [])
      .filter(
        (r: any) =>
          (r.title && r.title.toLowerCase().includes(q)) ||
          (r.title_bn && r.title_bn.includes(q)) ||
          (r.abstract && r.abstract.toLowerCase().includes(q)) ||
          (r.keywords && r.keywords.some((k: string) => k.toLowerCase().includes(q)))
      )
      .map((r: any) => ({ ...r, type: 'research' as const }));

    const posters = (archiveData.posters || [])
      .filter((p: any) => p.status !== 'draft')
      .filter(
        (p: any) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.title_bn && p.title_bn.includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      )
      .map((p: any) => ({ ...p, type: 'poster' as const }));

    const books = (archiveData.books || [])
      .filter((b: any) => b.status === 'published')
      .filter(
        (b: any) =>
          (b.title && b.title.toLowerCase().includes(q)) ||
          (b.subtitle && b.subtitle.toLowerCase().includes(q)) ||
          (b.description && b.description.toLowerCase().includes(q))
      )
      .map((b: any) => ({ ...b, type: 'book' as const }));

    const combined: ContentItemUnion[] = [
      ...poems,
      ...articles,
      ...research,
      ...posters,
      ...books,
    ];
    setResults(combined);
  }, [query, archiveData]);

  const filteredResults =
    filterType === 'all'
      ? results
      : results.filter((item) => item.type === filterType);

  const getItemLink = (item: ContentItemUnion) => {
    switch (item.type) {
      case 'poem':
        return `/poems/${item.slug}`;
      case 'article':
        return `/articles/${item.slug}`;
      case 'research':
        return `/research/${item.slug}`;
      case 'poster':
        return `/posters/${item.slug}`;
      case 'book':
        return `/books/${item.slug}`;
    }
  };

  const getSnippet = (item: ContentItemUnion) => {
    switch (item.type) {
      case 'poem':
        return (item.content || item.content_bn || '').split('\n')[0];
      case 'article':
        return item.excerpt;
      case 'research':
        return item.abstract;
      case 'poster':
        return item.description;
      case 'book':
        return item.description;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-paper-200 dark:border-ink-800 pb-6">
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-paper-900 dark:text-ink-100">
          Search the Archive
        </h1>
        <p className="mt-2 text-sm text-paper-700 dark:text-ink-300 font-serif leading-relaxed">
          Inquire across all poems, philosophical essays, research monographs, posters, and books.
        </p>
      </div>

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type keywords, titles, or concepts (e.g. solitude, silence, Bengal, ontology)..."
          className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-100/60 dark:bg-ink-900/60 text-paper-900 dark:text-ink-100 placeholder:text-paper-700 dark:placeholder:text-ink-400 focus:outline-none focus:border-accent font-sans text-base transition-all shadow-sm"
          autoFocus
        />
        <SearchIcon className="w-5 h-5 absolute left-3.5 top-4 text-paper-700 dark:text-ink-400 pointer-events-none" />
      </div>

      {/* Type Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { key: 'all', label: 'All Disciplines' },
          { key: 'poem', label: 'Poems' },
          { key: 'article', label: 'Articles' },
          { key: 'research', label: 'Research' },
          { key: 'poster', label: 'Posters' },
          { key: 'book', label: 'Books' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterType(f.key)}
            className={`px-3 py-1 rounded-full text-xs font-sans transition-colors ${
              filterType === f.key
                ? 'bg-accent text-white dark:text-ink-950 font-medium'
                : 'bg-paper-200 dark:bg-ink-850 text-paper-700 dark:text-ink-300 hover:text-paper-900 dark:hover:text-ink-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results Feed */}
      <div className="space-y-4 pt-4">
        {query.trim() && filteredResults.length === 0 && (
          <div className="py-12 text-center border border-dashed border-paper-300 dark:border-ink-800 rounded-lg p-8">
            <p className="font-serif text-lg text-paper-700 dark:text-ink-300">
              No matching pieces found for &ldquo;{query}&rdquo;.
            </p>
            <p className="text-xs text-paper-700 dark:text-ink-400 mt-2 font-sans">
              Try searching for general terms like &quot;solitude&quot;, &quot;water&quot;, &quot;silence&quot;, or &quot;poetry&quot;.
            </p>
          </div>
        )}

        {filteredResults.map((item) => {
          const link = getItemLink(item);
          const snippet = getSnippet(item);

          return (
            <article
              key={`${item.type}-${item.id}`}
              className="p-5 rounded-lg border border-paper-200 dark:border-ink-800 bg-paper-100/40 dark:bg-ink-900/30 hover:border-accent/40 transition-all"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-semibold">
                  {item.type}
                </span>
                <time className="text-xs font-mono text-paper-700 dark:text-ink-300">
                  {formatDate(item.published_at)}
                </time>
              </div>

              <Link href={link} className="block group">
                <h3 className="font-serif text-xl font-medium text-paper-900 dark:text-ink-100 group-hover:text-accent transition-colors">
                  {item.title || item.title_bn}
                </h3>
                {item.title_bn && item.title_bn !== item.title && (
                  <p className="font-bengaliSerif text-xs text-paper-700 dark:text-ink-300 mt-0.5">
                    {item.title_bn}
                  </p>
                )}
                <p className="text-sm text-paper-700 dark:text-ink-300 font-serif mt-2 line-clamp-2 leading-relaxed">
                  {snippet}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-accent font-medium">
                  <span>Open piece</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs font-mono">Loading archive search...</div>}>
      <SearchComponent />
    </Suspense>
  );
}
