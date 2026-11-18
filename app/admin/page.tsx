'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import {
  BookOpen,
  Feather,
  FileText,
  Image as ImageIcon,
  Plus,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/content');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const poemsCount = data?.poems?.length || 0;
  const articlesCount = data?.articles?.length || 0;
  const researchCount = data?.research?.length || 0;
  const postersCount = data?.posters?.length || 0;
  const booksCount = data?.books?.length || 0;

  const metrics = [
    { label: 'Poems', count: poemsCount, href: '/admin/poems', icon: Feather },
    { label: 'Articles', count: articlesCount, href: '/admin/articles', icon: FileText },
    { label: 'Research', count: researchCount, href: '/admin/research', icon: Sparkles },
    { label: 'Posters', count: postersCount, href: '/admin/posters', icon: ImageIcon },
    { label: 'Books', count: booksCount, href: '/admin/books', icon: BookOpen },
  ];

  return (
    <div className="space-y-10">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium text-paper-900 dark:text-ink-100">
            Curator Dashboard
          </h1>
          <p className="text-xs text-paper-700 dark:text-ink-300 font-serif mt-1">
            Review, publish, and manage your complete collection across all disciplines.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-paper-300 dark:border-ink-800 text-xs text-paper-700 dark:text-ink-300 hover:text-accent transition-colors"
        >
          <span>View Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.label}
              href={m.href}
              className="p-4 rounded-lg border border-paper-200 dark:border-ink-800 bg-paper-100/50 dark:bg-ink-900/40 hover:border-accent transition-colors"
            >
              <div className="flex items-center justify-between text-paper-700 dark:text-ink-400 mb-2">
                <Icon className="w-4 h-4" />
                <span className="text-2xl font-serif font-medium text-paper-900 dark:text-ink-100">
                  {loading ? '...' : m.count}
                </span>
              </div>
              <p className="text-xs font-sans text-paper-700 dark:text-ink-300">
                {m.label}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Bar */}
      <div className="p-5 rounded-lg border border-accent/30 bg-accent/5 dark:bg-accent/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-base font-medium text-paper-900 dark:text-ink-100">
            Compose New Piece
          </h3>
          <p className="text-xs text-paper-700 dark:text-ink-300 font-serif">
            Publish in English, Bengali, or both. Neither language is mandatory.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/poems"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-paper-200 dark:bg-ink-800 text-xs font-medium hover:bg-accent hover:text-white dark:hover:text-ink-950 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Poem</span>
          </Link>
          <Link
            href="/admin/articles"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-paper-200 dark:bg-ink-800 text-xs font-medium hover:bg-accent hover:text-white dark:hover:text-ink-950 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Article</span>
          </Link>
          <Link
            href="/admin/research"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-paper-200 dark:bg-ink-800 text-xs font-medium hover:bg-accent hover:text-white dark:hover:text-ink-950 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Research</span>
          </Link>
          <Link
            href="/admin/posters"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-paper-200 dark:bg-ink-800 text-xs font-medium hover:bg-accent hover:text-white dark:hover:text-ink-950 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Poster</span>
          </Link>
          <Link
            href="/admin/books"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-paper-200 dark:bg-ink-800 text-xs font-medium hover:bg-accent hover:text-white dark:hover:text-ink-950 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book</span>
          </Link>
        </div>
      </div>

      {/* Recent Manuscripts Table */}
      <div className="border border-paper-200 dark:border-ink-800 rounded-lg overflow-hidden bg-paper-100/30 dark:bg-ink-900/30">
        <div className="p-4 border-b border-paper-200 dark:border-ink-800 flex items-center justify-between">
          <h3 className="font-serif text-base font-medium text-paper-900 dark:text-ink-100">
            Current Catalog Entries
          </h3>
          <span className="text-xs font-mono text-paper-700 dark:text-ink-300">
            Persisted in data/content.json
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-paper-200/60 dark:bg-ink-850 text-paper-700 dark:text-ink-300 uppercase tracking-wider font-mono">
              <tr>
                <th className="p-3.5">Title</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-200 dark:divide-ink-800 text-paper-800 dark:text-ink-200">
              {data?.articles?.slice(0, 3).map((a: any) => (
                <tr key={a.id} className="hover:bg-paper-100 dark:hover:bg-ink-850/50">
                  <td className="p-3.5 font-serif font-medium">{a.title || a.title_bn}</td>
                  <td className="p-3.5 font-mono text-accent">Article</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                      {a.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-paper-700 dark:text-ink-300">
                    {formatDate(a.published_at)}
                  </td>
                  <td className="p-3.5 text-right">
                    <Link href={`/articles/${a.slug}`} className="text-accent hover:underline mr-3">
                      View
                    </Link>
                    <Link href={`/admin/articles`} className="text-paper-700 dark:text-ink-300 hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}

              {data?.poems?.slice(0, 3).map((p: any) => (
                <tr key={p.id} className="hover:bg-paper-100 dark:hover:bg-ink-850/50">
                  <td className="p-3.5 font-serif font-medium">{p.title || p.title_bn}</td>
                  <td className="p-3.5 font-mono text-accent">Poem</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-paper-700 dark:text-ink-300">
                    {formatDate(p.published_at)}
                  </td>
                  <td className="p-3.5 text-right">
                    <Link href={`/poems/${p.slug}`} className="text-accent hover:underline mr-3">
                      View
                    </Link>
                    <Link href={`/admin/poems`} className="text-paper-700 dark:text-ink-300 hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
