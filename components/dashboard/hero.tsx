import React from 'react';
import { SiteProfile } from '@/lib/types';

interface HeroProps {
  profile: SiteProfile;
}

export function Hero({ profile }: HeroProps) {
  return (
    <section className="pt-6 pb-12 md:pt-10 md:pb-16 border-b border-paper-200 dark:border-ink-800/80">
      <div className="max-w-3xl">
        <div className="inline-block px-3 py-1 rounded-full bg-paper-200/70 dark:bg-ink-850 text-xs font-mono tracking-wider text-accent mb-4 border border-paper-300 dark:border-ink-800">
          WRITER &middot; ESSAYIST &middot; RESEARCHER
        </div>

        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-paper-900 dark:text-ink-100">
          {profile.name}
          {profile.name_bn && (
            <span className="ml-3 font-bengaliSerif font-light text-paper-400 dark:text-ink-400 text-3xl md:text-4xl">
              {profile.name_bn}
            </span>
          )}
        </h1>

        <p className="mt-5 font-serif text-xl md:text-2xl text-paper-700 dark:text-ink-200 leading-relaxed italic">
          &ldquo;{profile.philosophy_statement}&rdquo;
        </p>

        {profile.philosophy_statement_bn && (
          <p className="mt-2 font-bengaliSerif text-base md:text-lg text-paper-400 dark:text-ink-400 leading-normal">
            &ldquo;{profile.philosophy_statement_bn}&rdquo;
          </p>
        )}

        <p className="mt-6 text-sm md:text-base text-paper-700 dark:text-ink-300 font-sans leading-relaxed max-w-2xl">
          {profile.bio}
        </p>
      </div>
    </section>
  );
}
