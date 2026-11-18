import React from 'react';
import { getPosters } from '@/lib/supabase/api';
import { PosterGallery } from '@/components/posters/poster-gallery';
import { Image as ImageIcon } from 'lucide-react';

export const metadata = {
  title: 'Posters & Visual Pieces — Rafi',
  description: 'Limited edition typographic posters, architectural meditations, and visual philosophy.',
};

export default async function PostersPage() {
  const posters = await getPosters();

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-paper-200 dark:border-ink-800 pb-6">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <ImageIcon className="w-4 h-4" />
          <span>Visual Philosophy &amp; Prints</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-paper-900 dark:text-ink-100">
          Posters
          <span className="ml-3 font-bengaliSerif text-paper-400 dark:text-ink-400 text-2xl">
            / পোস্টার
          </span>
        </h1>
        <p className="mt-2 text-sm text-paper-700 dark:text-ink-300 font-serif leading-relaxed">
          Typographic compositions, minimalist screenprints, and visual studies. Click any piece to inspect in full-resolution lightbox.
        </p>
      </div>

      {/* Gallery with Lightbox */}
      <PosterGallery posters={posters} />
    </div>
  );
}
