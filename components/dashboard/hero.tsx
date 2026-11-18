import React from 'react';
import { SiteProfile } from '@/lib/types';
import { siteConfig } from '@/lib/site-config';

interface HeroProps {
  profile: SiteProfile;
}

export function Hero({ profile }: HeroProps) {
  const philosophy = profile.philosophy_statement || siteConfig.tagline;

  return (
    <section className="pt-4 pb-10 md:pt-8 md:pb-14 border-b border-paper-200 dark:border-ink-800/80">
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-3">
          <span className="h-[1px] w-6 bg-accent" />
          <span className="text-xs uppercase font-sans tracking-widest text-accent font-medium">
            উন্মুক্ত পাঠাগার ও চিন্তাভাবনা
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-paper-950 dark:text-ink-50">
          {profile.name || siteConfig.name}
          <span className="ml-3 font-sans font-light text-paper-400 dark:text-ink-400 text-xl sm:text-2xl md:text-3xl">
            / {siteConfig.nameTransliteration}
          </span>
        </h1>

        <p className="font-serif text-lg sm:text-xl md:text-2xl text-paper-800 dark:text-ink-200 leading-relaxed italic pt-2">
          &ldquo;{philosophy}&rdquo;
        </p>

        {profile.bio && (
          <p className="text-sm md:text-base text-paper-600 dark:text-ink-300 font-sans leading-relaxed pt-1 max-w-2xl">
            {profile.bio}
          </p>
        )}
      </div>
    </section>
  );
}
