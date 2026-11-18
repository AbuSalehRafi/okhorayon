import React from 'react';
import { InterstitialQuote as QuoteType } from '@/lib/types';

interface InterstitialQuoteProps {
  quote: QuoteType;
  className?: string;
}

export function InterstitialQuoteCard({ quote, className = '' }: InterstitialQuoteProps) {
  return (
    <figure
      className={`my-16 md:my-20 max-w-2xl mx-auto px-6 py-6 text-center border-y border-paper-200 dark:border-ink-800/80 bg-paper-100/30 dark:bg-ink-900/30 rounded-sm ${className}`}
    >
      <div className="flex items-center justify-center space-x-3 mb-4">
        <span className="quote-flourish" />
        <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">
          Contemplation
        </span>
        <span className="quote-flourish" />
      </div>

      <blockquote className="font-serif italic text-lg md:text-xl text-paper-900 dark:text-ink-100 leading-relaxed">
        &ldquo;{quote.quote_text}&rdquo;
      </blockquote>

      {quote.quote_text_bn && (
        <p className="mt-2.5 font-bengaliSerif text-sm md:text-base text-paper-700 dark:text-ink-300 leading-normal">
          &ldquo;{quote.quote_text_bn}&rdquo;
        </p>
      )}

      <figcaption className="mt-4 text-xs font-sans text-paper-700 dark:text-ink-300 tracking-wide">
        &mdash; <span className="font-medium text-paper-900 dark:text-ink-200">{quote.author}</span>
        {quote.source && (
          <span className="italic ml-1 text-paper-700 dark:text-ink-300">
            ({quote.source})
          </span>
        )}
      </figcaption>
    </figure>
  );
}
