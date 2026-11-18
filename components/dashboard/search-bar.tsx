'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export function SearchBar({ placeholder = "Search across poems, articles, research, posters and books..." }: { placeholder?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full relative">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-24 py-3.5 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-100/60 dark:bg-ink-900/60 text-paper-900 dark:text-ink-100 placeholder:text-paper-700 dark:placeholder:text-ink-400 focus:outline-none focus:border-accent text-sm md:text-base font-sans transition-all shadow-sm"
        />
        <Search className="w-5 h-5 absolute left-3.5 text-paper-700 dark:text-ink-400 pointer-events-none" />
        <button
          type="submit"
          disabled={!query.trim()}
          className="absolute right-2 px-3.5 py-1.5 rounded-md bg-paper-200 dark:bg-ink-800 text-paper-800 dark:text-ink-200 text-xs font-medium hover:bg-accent hover:text-white dark:hover:text-ink-950 transition-colors disabled:opacity-40"
        >
          Search
        </button>
      </div>
    </form>
  );
}
