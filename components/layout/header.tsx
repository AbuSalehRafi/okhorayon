'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../theme-toggle';
import { BookOpen, Feather, FileText, Image as ImageIcon, Menu, Search, Sparkles, X } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

const NAV_LINKS = [
  { href: '/poems', label: 'কবিতা', labelEn: 'Poems', icon: Feather },
  { href: '/articles', label: 'প্রবন্ধ', labelEn: 'Articles', icon: FileText },
  { href: '/research', label: 'গবেষণা', labelEn: 'Research', icon: Sparkles },
  { href: '/posters', label: 'পোস্টার', labelEn: 'Posters', icon: ImageIcon },
  { href: '/books', label: 'বই', labelEn: 'Books', icon: BookOpen },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If in distraction-free reader mode, the reader layout has its own header
  const isReaderPage = pathname.includes('/books/') && pathname.split('/').length > 3;
  if (isReaderPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-paper-200 dark:border-ink-800/80 bg-paper-50/90 dark:bg-ink-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo / Writer Identity */}
        <Link
          href="/"
          className="group flex items-baseline gap-2 text-paper-900 dark:text-ink-100 focus:outline-none"
        >
          <span className="font-serif text-2xl tracking-tight font-semibold text-paper-950 dark:text-ink-50 group-hover:text-accent transition-colors">
            {siteConfig.name}
          </span>
          <span className="text-xs font-sans text-paper-500 dark:text-ink-400 tracking-wider">
            / {siteConfig.nameTransliteration}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {NAV_LINKS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors py-1 relative flex items-center gap-1.5 ${
                  isActive
                    ? 'text-accent font-semibold'
                    : 'text-paper-700 dark:text-ink-300 hover:text-paper-950 dark:hover:text-ink-50'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[11px] opacity-60 font-normal">({item.labelEn})</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Search + Theme Toggle + Mobile Menu Button */}
        <div className="flex items-center space-x-3">
          <Link
            href="/search"
            aria-label="Search across site"
            className="p-2 rounded-full text-paper-700 dark:text-ink-300 hover:text-accent dark:hover:text-accent transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </Link>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-paper-700 dark:text-ink-300 hover:text-paper-900 dark:hover:text-ink-100"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-paper-200 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 px-6 py-4 space-y-3">
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-paper-200/60 dark:bg-ink-800/60 text-accent font-semibold'
                    : 'text-paper-700 dark:text-ink-300 hover:bg-paper-100 dark:hover:bg-ink-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                <span className="text-xs text-paper-400 dark:text-ink-500">({item.labelEn})</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-paper-200 dark:border-ink-800">
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-paper-700 dark:text-ink-300 hover:bg-paper-100 dark:hover:bg-ink-900"
            >
              <Search className="w-4 h-4" />
              <span>অনুসন্ধান (Search)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
