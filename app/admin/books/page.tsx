'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Book, BookChapter } from '@/lib/types';
import { calculateReadingTime } from '@/lib/utils';
import { MarkdownEditor } from '@/components/admin/markdown-editor';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Check,
  Edit3,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react';

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);

  // Chapter editing
  const [editingChapter, setEditingChapter] = useState<BookChapter | null>(null);
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [saving, setSaving] = useState(false);

  // Chapter Form States - English or Bengali
  const [chapTitle, setChapTitle] = useState('');
  const [chapContent, setChapContent] = useState('');

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data && data.books) {
        setBooks(data.books);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const currentBook = books[selectedBookIndex] || books[0];

  const persistBookChapters = async (chapters: BookChapter[]) => {
    if (!currentBook) return;
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_book_chapters',
          payload: {
            bookId: currentBook.id,
            chapters,
          },
        }),
      });

      if (res.ok) {
        await fetchBooks();
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 2500);
      } else {
        alert('Failed to save chapter sequence.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const moveChapterUp = (index: number) => {
    if (index === 0 || !currentBook.chapters) return;
    const chapters = [...currentBook.chapters];
    const temp = chapters[index - 1];
    chapters[index - 1] = chapters[index];
    chapters[index] = temp;

    const updated = chapters.map((c, i) => ({ ...c, chapter_number: i + 1 }));
    persistBookChapters(updated);
  };

  const moveChapterDown = (index: number) => {
    if (!currentBook.chapters || index >= currentBook.chapters.length - 1) return;
    const chapters = [...currentBook.chapters];
    const temp = chapters[index + 1];
    chapters[index + 1] = chapters[index];
    chapters[index] = temp;

    const updated = chapters.map((c, i) => ({ ...c, chapter_number: i + 1 }));
    persistBookChapters(updated);
  };

  const openNewChapter = () => {
    setIsCreatingChapter(true);
    setEditingChapter(null);
    setChapTitle('');
    setChapContent('### Chapter Section\n\nBegin chapter manuscript in English or বাংলা...');
  };

  const openEditChapter = (c: BookChapter) => {
    setEditingChapter(c);
    setIsCreatingChapter(false);
    setChapTitle(c.title);
    setChapContent(c.content);
  };

  const cancelChapterForm = () => {
    setEditingChapter(null);
    setIsCreatingChapter(false);
  };

  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapTitle.trim()) {
      alert('Please enter a chapter title.');
      return;
    }
    if (!chapContent.trim()) {
      alert('Please enter chapter content.');
      return;
    }

    const readingTime = calculateReadingTime(chapContent);
    const existingChapters = currentBook.chapters || [];

    let updatedChapters: BookChapter[];

    if (isCreatingChapter) {
      const slugCandidate = chapTitle
        .toLowerCase()
        .replace(/[^a-z0-9\u0980-\u09FF]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const newChap: BookChapter = {
        id: `chap-${Date.now()}`,
        book_id: currentBook.id,
        chapter_number: existingChapters.length + 1,
        slug: slugCandidate || `chapter-${existingChapters.length + 1}`,
        title: chapTitle,
        content: chapContent,
        reading_time_min: readingTime,
        created_at: new Date().toISOString(),
      };
      updatedChapters = [...existingChapters, newChap];
    } else if (editingChapter) {
      updatedChapters = existingChapters.map((c) =>
        c.id === editingChapter.id
          ? {
              ...c,
              title: chapTitle,
              content: chapContent,
              reading_time_min: readingTime,
            }
          : c
      );
    } else {
      return;
    }

    await persistBookChapters(updatedChapters);
    cancelChapterForm();
  };

  const handleDeleteChapter = async (id: string) => {
    if (!confirm('Delete this chapter?')) return;
    const existingChapters = currentBook.chapters || [];
    const filtered = existingChapters
      .filter((c) => c.id !== id)
      .map((c, i) => ({ ...c, chapter_number: i + 1 }));
    await persistBookChapters(filtered);
  };

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-xs text-paper-700 dark:text-ink-400">
        Loading books and chapters...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-paper-200 dark:border-ink-800">
        <div>
          <h1 className="font-serif text-2xl font-medium text-paper-900 dark:text-ink-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            <span>Manage Books &amp; Chapters</span>
          </h1>
          <p className="text-xs text-paper-700 dark:text-ink-300 font-serif mt-1">
            Reorder chapters, compose in English or Bengali, and save live to reader.
          </p>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Chapter sequence and contents saved live to reader!</span>
        </div>
      )}

      {/* Book Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-paper-300 dark:border-ink-800 pb-2">
        {books.map((b, idx) => (
          <button
            key={b.id}
            onClick={() => {
              setSelectedBookIndex(idx);
              cancelChapterForm();
            }}
            className={`px-4 py-2 rounded-t-lg text-xs font-serif transition-colors ${
              selectedBookIndex === idx
                ? 'bg-paper-200 dark:bg-ink-850 text-accent font-semibold border-b-2 border-accent'
                : 'text-paper-700 dark:text-ink-300 hover:text-paper-900 dark:hover:text-ink-100'
            }`}
          >
            {b.title || b.title_bn}
          </button>
        ))}
      </div>

      {currentBook && (
        <>
          {/* Book Metadata Preview */}
          <div className="p-5 rounded-xl border border-paper-200 dark:border-ink-800 bg-paper-100/50 dark:bg-ink-900/40 flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative w-24 aspect-[2/3] rounded overflow-hidden border border-paper-300 dark:border-ink-800 shrink-0">
              <Image src={currentBook.cover_image_url} alt={currentBook.title} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-xl font-medium text-paper-900 dark:text-ink-100">
                {currentBook.title} {currentBook.title_bn && `/ ${currentBook.title_bn}`}
              </h2>
              {currentBook.subtitle && (
                <p className="text-xs font-serif italic text-paper-700 dark:text-ink-300">
                  {currentBook.subtitle}
                </p>
              )}
              <p className="text-xs text-paper-700 dark:text-ink-300 font-serif mt-2 max-w-2xl">
                {currentBook.description}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs font-mono text-accent">
                <span>{currentBook.chapters?.length || 0} Total Chapters</span>
                <span>&bull;</span>
                <span className="uppercase">{currentBook.status}</span>
              </div>
            </div>

            <button
              onClick={openNewChapter}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white dark:text-ink-950 text-xs font-medium hover:bg-accent-hover transition-colors shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Chapter</span>
            </button>
          </div>

          {/* Chapter Form */}
          {(isCreatingChapter || editingChapter) && (
            <form
              onSubmit={handleSaveChapter}
              className="p-6 rounded-xl border border-paper-300 dark:border-ink-800 bg-paper-100/70 dark:bg-ink-900/70 space-y-5 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-paper-200 dark:border-ink-800 pb-3">
                <h3 className="font-serif text-lg font-medium text-paper-900 dark:text-ink-100">
                  {isCreatingChapter ? 'Compose New Chapter' : `Edit: ${editingChapter?.title}`}
                </h3>
                <span className="text-xs text-accent font-mono">
                  English or বাংলা
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                  Chapter Title (English or বাংলা) *
                </label>
                <input
                  type="text"
                  value={chapTitle}
                  onChange={(e) => setChapTitle(e.target.value)}
                  required
                  placeholder="e.g. Chapter V: The Geometry of Silence অথবা পঞ্চম অধ্যায়"
                  className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                  Chapter Manuscript (Markdown) *
                </label>
                <MarkdownEditor value={chapContent} onChange={setChapContent} minHeight="400px" />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-paper-200 dark:border-ink-800">
                <button
                  type="button"
                  onClick={cancelChapterForm}
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
                  <span>{isCreatingChapter ? 'Append Chapter Live' : 'Update Chapter'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Chapters Reordering & Management List */}
          <div className="border border-paper-200 dark:border-ink-800 rounded-lg overflow-hidden bg-paper-100/30 dark:bg-ink-900/30">
            <div className="p-4 border-b border-paper-200 dark:border-ink-800 flex items-center justify-between">
              <h3 className="font-serif text-base font-medium text-paper-900 dark:text-ink-100">
                Chapter Sequence (Order in Reader)
              </h3>
              <span className="text-xs font-mono text-paper-700 dark:text-ink-300">
                Use &uarr; and &darr; to reorder live
              </span>
            </div>

            <ul className="divide-y divide-paper-200 dark:divide-ink-800">
              {currentBook.chapters?.map((chap, idx) => (
                <li
                  key={chap.id}
                  className="p-4 flex items-center justify-between hover:bg-paper-100 dark:hover:bg-ink-850/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 font-mono text-xs text-accent font-semibold">
                      #{chap.chapter_number}
                    </span>
                    <div>
                      <h4 className="font-serif text-sm font-medium text-paper-900 dark:text-ink-100">
                        {chap.title}
                      </h4>
                      <span className="text-[11px] font-mono text-paper-700 dark:text-ink-300">
                        {chap.reading_time_min} min read
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveChapterUp(idx)}
                      disabled={idx === 0 || saving}
                      className="p-1.5 rounded border border-paper-300 dark:border-ink-800 hover:bg-paper-200 dark:hover:bg-ink-800 disabled:opacity-30"
                      title="Move Chapter Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveChapterDown(idx)}
                      disabled={idx === (currentBook.chapters?.length || 1) - 1 || saving}
                      className="p-1.5 rounded border border-paper-300 dark:border-ink-800 hover:bg-paper-200 dark:hover:bg-ink-800 disabled:opacity-30"
                      title="Move Chapter Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => openEditChapter(chap)}
                      className="p-1.5 rounded text-paper-700 dark:text-ink-300 hover:text-accent ml-2"
                      title="Edit Chapter"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteChapter(chap.id)}
                      className="p-1.5 rounded text-rose-600 dark:text-rose-400 hover:opacity-80"
                      title="Delete Chapter"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
