'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight, Clock, History } from 'lucide-react';
import { ContinueReadingState } from '@/lib/types';

export function ContinueReadingCard() {
  const [readingState, setReadingState] = useState<ContinueReadingState | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('rafi_continue_reading');
      if (stored) {
        setReadingState(JSON.parse(stored));
      } else {
        // Fallback default starter recommendation
        setReadingState({
          bookSlug: 'the-anatomy-of-contemplation',
          bookTitle: 'The Anatomy of Contemplation',
          chapterSlug: 'the-perimeter-of-silence',
          chapterTitle: 'Chapter I: The Perimeter of Silence',
          chapterNumber: 1,
          timestamp: Date.now(),
        });
      }
    } catch {
      // Ignored
    }
    setMounted(true);
  }, []);

  if (!mounted || !readingState) {
    return null;
  }

  return (
    <div className="border border-accent/30 bg-paper-100/70 dark:bg-ink-900/50 rounded-lg p-5 md:p-6 transition-all shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-md bg-accent/15 text-accent mt-0.5">
            <BookOpen className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-accent flex items-center gap-1">
                <History className="w-3 h-3" /> Continue Reading
              </span>
              <span className="text-xs text-paper-700 dark:text-ink-300">&bull;</span>
              <span className="text-xs text-paper-700 dark:text-ink-300 font-serif">
                {readingState.bookTitle}
              </span>
            </div>

            <h3 className="font-serif text-lg font-medium text-paper-900 dark:text-ink-100">
              {readingState.chapterTitle}
            </h3>
            <p className="text-xs text-paper-700 dark:text-ink-300 mt-1 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>Picks up where you left off</span>
            </p>
          </div>
        </div>

        <Link
          href={`/books/${readingState.bookSlug}/${readingState.chapterSlug}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-accent text-white dark:text-ink-950 font-medium text-sm hover:bg-accent-hover transition-colors shrink-0"
        >
          <span>Resume</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
