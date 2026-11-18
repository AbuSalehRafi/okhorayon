'use client';

import React, { useState, useEffect } from 'react';
import { InterstitialQuote } from '@/lib/types';
import { Quote, Plus, Trash2, Edit3, Check, Loader2 } from 'lucide-react';

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<InterstitialQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuote, setEditingQuote] = useState<InterstitialQuote | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states - English or Bengali
  const [quoteText, setQuoteText] = useState('');
  const [quoteTextBn, setQuoteTextBn] = useState('');
  const [author, setAuthor] = useState('');
  const [source, setSource] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchQuotes = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data && data.quotes) {
        setQuotes(data.quotes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const openCreate = () => {
    setIsCreating(true);
    setEditingQuote(null);
    setQuoteText('');
    setQuoteTextBn('');
    setAuthor('Rafi');
    setSource('Reflections');
    setIsActive(true);
  };

  const openEdit = (q: InterstitialQuote) => {
    setEditingQuote(q);
    setIsCreating(false);
    setQuoteText(q.quote_text || '');
    setQuoteTextBn(q.quote_text_bn || '');
    setAuthor(q.author);
    setSource(q.source || '');
    setIsActive(q.is_active);
  };

  const cancelForm = () => {
    setEditingQuote(null);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const primaryText = quoteText.trim() || quoteTextBn.trim();
    if (!primaryText) {
      alert('Please enter quotation text in English or Bengali.');
      return;
    }
    if (!author.trim()) {
      alert('Please provide the author or philosopher name.');
      return;
    }

    setSaving(true);
    let quoteToSave: InterstitialQuote;

    if (isCreating) {
      quoteToSave = {
        id: `quote-${Date.now()}`,
        quote_text: quoteText.trim() || quoteTextBn.trim(),
        quote_text_bn: quoteTextBn.trim() || undefined,
        author: author.trim(),
        source: source.trim() || undefined,
        display_order: quotes.length + 1,
        is_active: isActive,
      };
    } else if (editingQuote) {
      quoteToSave = {
        ...editingQuote,
        quote_text: quoteText.trim() || quoteTextBn.trim(),
        quote_text_bn: quoteTextBn.trim() || undefined,
        author: author.trim(),
        source: source.trim() || undefined,
        is_active: isActive,
      };
    } else {
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_quote',
          payload: quoteToSave,
        }),
      });

      if (res.ok) {
        await fetchQuotes();
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
        cancelForm();
      } else {
        alert('Failed to save quote.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving quote.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this philosopher quote?')) return;

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_quote',
          payload: { id },
        }),
      });

      if (res.ok) {
        await fetchQuotes();
      } else {
        alert('Failed to delete quote.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-paper-200 dark:border-ink-800">
        <div>
          <h1 className="font-serif text-2xl font-medium text-paper-900 dark:text-ink-100 flex items-center gap-2">
            <Quote className="w-5 h-5 text-accent" />
            <span>Manage Interstitial Quotes</span>
          </h1>
          <p className="text-xs text-paper-700 dark:text-ink-300 font-serif mt-1">
            Display quotes on homepage in English, Bengali, or both. Persists live immediately.
          </p>
        </div>

        {!isCreating && !editingQuote && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white dark:text-ink-950 text-xs font-medium hover:bg-accent-hover transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Quote</span>
          </button>
        )}
      </div>

      {savedNotice && (
        <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Quotes updated live on the homepage!</span>
        </div>
      )}

      {/* Editor Form */}
      {(isCreating || editingQuote) && (
        <form
          onSubmit={handleSave}
          className="p-6 rounded-xl border border-paper-300 dark:border-ink-800 bg-paper-100/70 dark:bg-ink-900/70 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-paper-200 dark:border-ink-800 pb-3">
            <h3 className="font-serif text-lg font-medium text-paper-900 dark:text-ink-100">
              {isCreating ? 'Add Interstitial Quote' : 'Edit Quote'}
            </h3>
            <span className="text-xs text-accent font-mono">
              Quiet Divider
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                Quotation Text (English) — Optional if Bengali provided
              </label>
              <textarea
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                rows={3}
                placeholder="The silence that precedes speech is not empty..."
                className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-serif italic"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                বাংলা উদ্ধৃতি (Optional if English provided)
              </label>
              <textarea
                value={quoteTextBn}
                onChange={(e) => setQuoteTextBn(e.target.value)}
                rows={3}
                placeholder="কথার আগের নীরবতা শূন্য নয়..."
                className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-bengaliSerif italic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                Philosopher / Author *
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                placeholder="e.g. Friedrich Nietzsche, Ludwig Wittgenstein, Rafi"
                className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                Source Work (Optional)
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Twilight of the Idols"
                className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="activeCheck"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-accent focus:ring-accent"
            />
            <label htmlFor="activeCheck" className="text-xs font-mono text-paper-700 dark:text-ink-300">
              Display actively on homepage
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-paper-200 dark:border-ink-800">
            <button
              type="button"
              onClick={cancelForm}
              className="px-4 py-2 rounded-md text-xs text-paper-700 dark:text-ink-300 hover:text-paper-900 dark:hover:text-ink-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-md bg-accent text-white dark:text-ink-950 text-xs font-medium hover:bg-accent-hover transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isCreating ? 'Save Quote to Live Site' : 'Update Quote'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Quotes List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-paper-700 dark:text-ink-400">
            Loading quotes...
          </div>
        ) : (
          quotes.map((q) => (
            <div
              key={q.id}
              className="p-5 rounded-lg border border-paper-200 dark:border-ink-800 bg-paper-100/40 dark:bg-ink-900/30 flex items-start justify-between gap-4"
            >
              <div>
                <blockquote className="font-serif italic text-base text-paper-900 dark:text-ink-100">
                  &ldquo;{q.quote_text || q.quote_text_bn}&rdquo;
                </blockquote>
                {q.quote_text_bn && q.quote_text && (
                  <p className="font-bengaliSerif text-xs text-paper-700 dark:text-ink-300 mt-1">
                    &ldquo;{q.quote_text_bn}&rdquo;
                  </p>
                )}
                <p className="text-xs font-mono text-accent mt-2">
                  &mdash; {q.author} {q.source && `(${q.source})`}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(q)}
                  className="p-1 rounded text-paper-700 dark:text-ink-300 hover:text-accent"
                  title="Edit Quote"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="p-1 rounded text-rose-600 dark:text-rose-400 hover:opacity-80"
                  title="Delete Quote"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
