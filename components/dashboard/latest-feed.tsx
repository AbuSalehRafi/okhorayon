import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { ContentItemUnion } from '@/lib/types';
import { ArrowRight, BookOpen, Feather, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';

interface LatestFeedProps {
  items: ContentItemUnion[];
}

export function LatestFeed({ items }: LatestFeedProps) {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'poem':
        return { label: 'Poem', icon: Feather, color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20' };
      case 'article':
        return { label: 'Article', icon: FileText, color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20' };
      case 'research':
        return { label: 'Research', icon: Sparkles, color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20' };
      case 'poster':
        return { label: 'Poster', icon: ImageIcon, color: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20' };
      case 'book':
        return { label: 'Book', icon: BookOpen, color: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20' };
      default:
        return { label: 'Writing', icon: FileText, color: 'bg-paper-200 text-paper-800' };
    }
  };

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

  const getItemSnippet = (item: ContentItemUnion) => {
    switch (item.type) {
      case 'poem':
        return (item.content || item.content_bn || '').split('\n')[0] + '...';
      case 'article':
        return item.excerpt;
      case 'research':
        return (item.abstract || '').slice(0, 140) + '...';
      case 'poster':
        return item.description;
      case 'book':
        return item.subtitle || (item.description || '').slice(0, 140) + '...';
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const badge = getTypeBadge(item.type);
        const Icon = badge.icon;
        const link = getItemLink(item);
        const snippet = getItemSnippet(item);

        const mainTitle = item.title || item.title_bn || 'Untitled Piece';
        const subTitle = item.title_bn && item.title_bn !== item.title ? item.title_bn : null;

        return (
          <article
            key={`${item.type}-${item.id}`}
            className="group p-5 rounded-lg border border-paper-200 dark:border-ink-800/80 bg-paper-100/40 dark:bg-ink-900/30 hover:border-accent/40 transition-all"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}
              >
                <Icon className="w-3 h-3" />
                <span>{badge.label}</span>
              </span>

              <time className="text-xs text-paper-700 dark:text-ink-300 font-mono">
                {formatDate(item.published_at)}
              </time>
            </div>

            <Link href={link} className="block">
              <h3 className="font-serif text-lg font-medium text-paper-900 dark:text-ink-100 group-hover:text-accent transition-colors">
                {mainTitle}
              </h3>

              {subTitle && (
                <p className="font-bengaliSerif text-xs text-paper-700 dark:text-ink-300 mt-0.5">
                  {subTitle}
                </p>
              )}

              <p className="text-sm text-paper-700 dark:text-ink-300 mt-2 line-clamp-2 font-serif leading-relaxed">
                {snippet}
              </p>

              <div className="flex items-center text-xs text-accent mt-3 gap-1 font-medium group-hover:translate-x-0.5 transition-transform">
                <span>Read piece</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
