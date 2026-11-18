'use client';

import React from 'react';
import { useTheme } from './theme-provider';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${theme === 'dark' ? 'light paper' : 'ink dark'} theme`}
      className={`p-2 rounded-full border border-paper-300 dark:border-ink-800 bg-paper-100 dark:bg-ink-900 text-paper-700 dark:text-ink-300 hover:text-accent dark:hover:text-accent transition-colors ${className}`}
      title={theme === 'dark' ? 'Light paper mode' : 'Ink night mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
