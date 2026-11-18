'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, ChevronRight, Moon, Sun, Type } from 'lucide-react';
import { MarkdownRenderer } from '../markdown/markdown-renderer';
import { Book, BookChapter } from '@/lib/types';

interface ReaderProps {
  book: Book;
  chapter: BookChapter;
  prevChapter: BookChapter | null;
  nextChapter: BookChapter | null;
}

type ReaderTheme = 'light' | 'sepia' | 'dark';
type FontSize = 'sm' | 'md' | 'lg' | 'xl';

export function DistractionFreeReader({ book, chapter, prevChapter, nextChapter }: ReaderProps) {
  const [theme, setTheme] = useState<ReaderTheme>('dark');
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [readingProgress, setReadingProgress] = useState(0);

  // 1. Save "Continue Reading" state to localStorage
  useEffect(() => {
    try {
      const state = {
        bookSlug: book.slug,
        bookTitle: book.title,
        chapterSlug: chapter.slug,
        chapterTitle: chapter.title,
        chapterNumber: chapter.chapter_number,
        timestamp: Date.now(),
      };
      localStorage.setItem('rafi_continue_reading', JSON.stringify(state));
    } catch {
      // Ignored
    }
  }, [book, chapter]);

  // 2. Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        const prog = (window.scrollY / total) * 100;
        setReadingProgress(Math.min(100, Math.max(0, prog)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Map font sizes to tailwind classes
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-[16px] leading-[1.7]';
      case 'md':
        return 'text-[18px] leading-[1.8]'; // Default per requirement (18px, 1.7-1.8)
      case 'lg':
        return 'text-[21px] leading-[1.85]';
      case 'xl':
        return 'text-[24px] leading-[1.9]';
    }
  };

  // Map reader theme to container classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-[#faf8f5] text-[#191c21]';
      case 'sepia':
        return 'bg-[#fbf5e8] text-[#382c1a]';
      case 'dark':
        return 'bg-[#080c14] text-[#ecf1f8]';
    }
  };

  const getThemeBarClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-[#faf8f5]/95 border-[#eae2d2] text-[#5a5043]';
      case 'sepia':
        return 'bg-[#fbf5e8]/95 border-[#e5dac1] text-[#65543d]';
      case 'dark':
        return 'bg-[#080c14]/95 border-[#1d2a40] text-[#9db1cc]';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getThemeClasses()}`}>
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-black/5 dark:bg-white/5">
        <div
          className="h-full bg-accent transition-all duration-100 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Reader Control Header */}
      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${getThemeBarClasses()}`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Back to Book Table of Contents */}
          <Link
            href={`/books/${book.slug}`}
            className="flex items-center gap-2 text-xs font-medium hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline font-serif">{book.title}</span>
            <span className="sm:hidden">Contents</span>
          </Link>

          {/* Controls: Font Size + Theme Switcher */}
          <div className="flex items-center gap-4">
            {/* Font Size Adjuster */}
            <div className="flex items-center gap-1 border border-current/20 rounded-md p-0.5 text-xs font-mono">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 rounded ${fontSize === 'sm' ? 'bg-accent text-white dark:text-ink-950 font-bold' : 'hover:opacity-75'}`}
                title="Small (16px)"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('md')}
                className={`px-2 py-0.5 rounded ${fontSize === 'md' ? 'bg-accent text-white dark:text-ink-950 font-bold' : 'hover:opacity-75'}`}
                title="Medium (18px standard)"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 rounded ${fontSize === 'lg' ? 'bg-accent text-white dark:text-ink-950 font-bold' : 'hover:opacity-75'}`}
                title="Large (21px)"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xl')}
                className={`px-2 py-0.5 rounded ${fontSize === 'xl' ? 'bg-accent text-white dark:text-ink-950 font-bold' : 'hover:opacity-75'}`}
                title="Extra Large (24px)"
              >
                A++
              </button>
            </div>

            {/* Theme Toggle (Light / Sepia / Dark) */}
            <div className="flex items-center gap-1 border border-current/20 rounded-md p-0.5 text-xs">
              <button
                onClick={() => setTheme('light')}
                className={`px-2 py-1 rounded flex items-center gap-1 ${
                  theme === 'light' ? 'bg-amber-100 text-amber-950 font-bold shadow-xs' : 'hover:opacity-75'
                }`}
                title="Light Paper Mode"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Light</span>
              </button>

              <button
                onClick={() => setTheme('sepia')}
                className={`px-2 py-1 rounded flex items-center gap-1 ${
                  theme === 'sepia' ? 'bg-[#ebdcb9] text-[#3d2f19] font-bold shadow-xs' : 'hover:opacity-75'
                }`}
                title="Warm Sepia Mode"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#dfcca5] border border-[#3d2f19]/30" />
                <span className="hidden md:inline">Sepia</span>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`px-2 py-1 rounded flex items-center gap-1 ${
                  theme === 'dark' ? 'bg-slate-800 text-slate-100 font-bold shadow-xs' : 'hover:opacity-75'
                }`}
                title="Midnight Ink Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Dark</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chapter Reader Container */}
      <main className="max-w-[70ch] mx-auto px-6 py-12 md:py-20">
        {/* Chapter Title & Number */}
        <div className="text-center pb-12 mb-12 border-b border-current/15">
          <span className="text-xs uppercase font-sans tracking-widest text-accent font-semibold block mb-2">
            {book.title}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
            {chapter.title}
          </h1>
          <p className="text-xs font-mono opacity-70 mt-3">
            Estimated reading time: {chapter.reading_time_min} minutes
          </p>
        </div>

        {/* Prose Content */}
        <div className={`font-serif ${getFontSizeClass()}`}>
          <MarkdownRenderer content={chapter.content} />
        </div>

        {/* Previous & Next Chapter Navigation */}
        <nav className="mt-20 pt-8 border-t border-current/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          {prevChapter ? (
            <Link
              href={`/books/${book.slug}/${prevChapter.slug}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-current/20 hover:border-accent hover:text-accent transition-colors w-full sm:w-auto text-left"
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-mono block opacity-70">Previous</span>
                <span className="font-serif text-sm font-medium line-clamp-1">
                  {prevChapter.title}
                </span>
              </div>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}

          <Link
            href={`/books/${book.slug}`}
            className="text-xs font-sans text-accent hover:underline flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Table of Contents</span>
          </Link>

          {nextChapter ? (
            <Link
              href={`/books/${book.slug}/${nextChapter.slug}`}
              className="flex items-center justify-end gap-2 px-4 py-2.5 rounded-lg border border-current/20 hover:border-accent hover:text-accent transition-colors w-full sm:w-auto text-right"
            >
              <div>
                <span className="text-[10px] uppercase font-mono block opacity-70">Next Chapter</span>
                <span className="font-serif text-sm font-medium line-clamp-1">
                  {nextChapter.title}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </Link>
          ) : (
            <div className="text-xs font-serif italic opacity-70">End of Book</div>
          )}
        </nav>
      </main>
    </div>
  );
}
