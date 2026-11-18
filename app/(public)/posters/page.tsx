import React from 'react';
import { getPosters } from '@/lib/supabase/api';
import { PosterGallery } from '@/components/posters/poster-gallery';
import { Image as ImageIcon } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 0;

export const metadata = {
  title: `পোস্টার ও দৃশ্যশিল্প — ${siteConfig.name}`,
  description: 'টাইপোগ্রাফিক পোস্টার, জ্যামিতিক নকশা এবং দৃশ্যশিল্পের উন্মুক্ত গ্যালারি।',
};

export default async function PostersPage() {
  const posters = await getPosters();

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-paper-200 dark:border-ink-800 pb-6">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <ImageIcon className="w-4 h-4" />
          <span>দৃশ্যশিল্প ও প্রকাশনা &middot; Visual Philosophy &amp; Prints</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-paper-950 dark:text-ink-50">
          পোস্টার গ্যালারি
          <span className="ml-3 font-sans text-paper-400 dark:text-ink-400 text-2xl font-light">
            / Posters ({posters.length})
          </span>
        </h1>
        <p className="mt-2 text-sm md:text-base text-paper-600 dark:text-ink-300 font-serif leading-relaxed">
          টাইপোগ্রাফিক ব্যঞ্জনা ও চিন্তাশীল দৃশ্যশিল্প। পূর্ণ রেজোলিউশনে দেখতে যেকোনো পোস্টারে ক্লিক করুন।
        </p>
      </div>

      {/* Gallery with Lightbox */}
      <PosterGallery posters={posters} />
    </div>
  );
}
