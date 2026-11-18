import React from 'react';
import {
  getProfile,
  getQuotes,
  getFeaturedItem,
  getDashboardSummaries,
  getLatestFeed,
} from '@/lib/supabase/api';
import { Hero } from '@/components/dashboard/hero';
import { SearchBar } from '@/components/dashboard/search-bar';
import { ContinueReadingCard } from '@/components/dashboard/continue-reading';
import { FeaturedSlot } from '@/components/dashboard/featured-slot';
import { SummaryPanels } from '@/components/dashboard/summary-panels';
import { LatestFeed } from '@/components/dashboard/latest-feed';
import { InterstitialQuoteCard } from '@/components/quotes/interstitial-quote';

export default async function HomePage() {
  const [profile, quotes, featured, summaries, latestItems] = await Promise.all([
    getProfile(),
    getQuotes(),
    getFeaturedItem(),
    getDashboardSummaries(),
    getLatestFeed(5),
  ]);

  return (
    <div className="space-y-12">
      {/* 1. Hero */}
      <Hero profile={profile} />

      {/* 2. Global Search */}
      <div className="max-w-2xl mx-auto">
        <SearchBar />
      </div>

      {/* 3. Continue Reading Widget */}
      <ContinueReadingCard />

      {/* 4. Featured Slot */}
      {featured && <FeaturedSlot featured={featured} />}

      {/* Interstitial Quote 1 */}
      {quotes[0] && <InterstitialQuoteCard quote={quotes[0]} />}

      {/* 5. Five Summary Panels */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-paper-200 dark:border-ink-800 pb-3">
          <h2 className="font-serif text-2xl font-normal text-paper-900 dark:text-ink-100">
            Works by Discipline
          </h2>
          <span className="text-xs font-serif text-paper-400 dark:text-ink-400">
            শাখা অনুযায়ী কাজ
          </span>
        </div>
        <SummaryPanels data={summaries} />
      </section>

      {/* Interstitial Quote 2 */}
      {quotes[1] && <InterstitialQuoteCard quote={quotes[1]} />}

      {/* 6. Latest Feed across all 5 content types */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-paper-200 dark:border-ink-800 pb-3">
          <h2 className="font-serif text-2xl font-normal text-paper-900 dark:text-ink-100">
            Latest Dispatches
          </h2>
          <span className="text-xs font-serif text-paper-400 dark:text-ink-400">
            সাম্প্রতিক প্রকাশনা
          </span>
        </div>
        <LatestFeed items={latestItems} />
      </section>
    </div>
  );
}
