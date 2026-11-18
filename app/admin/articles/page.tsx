'use client';

import React, { useState, useEffect } from 'react';
import { Article, ContentStatus } from '@/lib/types';
import { calculateReadingTime } from '@/lib/utils';
import { MarkdownEditor } from '@/components/admin/markdown-editor';
import { FileText, Plus, Trash2, Edit3, Check, Loader2 } from 'lucide-react';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states - Flexible: Neither English nor Bengali strictly mandatory
  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<ContentStatus>('published');

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data && data.articles) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openCreate = () => {
    setIsCreating(true);
    setEditingArticle(null);
    setTitle('');
    setTitleBn('');
    setExcerpt('');
    setContent('### Introduction\n\nWrite your essay in English or Bengali...');
    setTags('Philosophy');
    setStatus('published');
  };

  const openEdit = (a: Article) => {
    setEditingArticle(a);
    setIsCreating(false);
    setTitle(a.title || '');
    setTitleBn(a.title_bn || '');
    setExcerpt(a.excerpt || '');
    setContent(a.content || '');
    setTags(a.tags?.join(', ') || '');
    setStatus(a.status || 'published');
  };

  const cancelForm = () => {
    setEditingArticle(null);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const primaryTitle = title.trim() || titleBn.trim();
    if (!primaryTitle) {
      alert('Please provide a title in either English or Bengali.');
      return;
    }

    if (!content.trim()) {
      alert('Please provide the essay content.');
      return;
    }

    setSaving(true);
    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const readingTime = calculateReadingTime(content);

    let articleToSave: Article;

    if (isCreating) {
      const slugCandidate = (title.trim() || titleBn.trim())
        .toLowerCase()
        .replace(/[^a-z0-9\u0980-\u09FF]+/g, '-')
        .replace(/(^-|-$)/g, '');

      articleToSave = {
        id: `article-${Date.now()}`,
        type: 'article',
        slug: slugCandidate || `article-${Date.now()}`,
        title: title.trim() || titleBn.trim(),
        title_bn: titleBn.trim() || undefined,
        excerpt: excerpt.trim() || content.trim().slice(0, 140) + '...',
        content,
        reading_time_min: readingTime,
        tags: tagArray,
        status,
        published_at: new Date().toISOString(),
        is_sample: false,
      };
    } else if (editingArticle) {
      articleToSave = {
        ...editingArticle,
        title: title.trim() || titleBn.trim(),
        title_bn: titleBn.trim() || undefined,
        excerpt: excerpt.trim() || content.trim().slice(0, 140) + '...',
        content,
        reading_time_min: readingTime,
        tags: tagArray,
        status,
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
          action: 'save_article',
          payload: articleToSave,
        }),
      });

      if (res.ok) {
        await fetchArticles();
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
        cancelForm();
      } else {
        alert('Failed to save article.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving article.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_article',
          payload: { id },
        }),
      });

      if (res.ok) {
        await fetchArticles();
      } else {
        alert('Failed to delete article.');
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
            <FileText className="w-5 h-5 text-accent" />
            <span>Manage Philosophical Articles</span>
          </h1>
          <p className="text-xs text-paper-700 dark:text-ink-300 font-serif mt-1">
            Write long-form essays in English, Bengali, or both. Changes publish live instantly.
          </p>
        </div>

        {!isCreating && !editingArticle && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white dark:text-ink-950 text-xs font-medium hover:bg-accent-hover transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </button>
        )}
      </div>

      {savedNotice && (
        <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Article published and live across the entire website!</span>
        </div>
      )}

      {/* Editor Form */}
      {(isCreating || editingArticle) && (
        <form
          onSubmit={handleSave}
          className="p-6 rounded-xl border border-paper-300 dark:border-ink-800 bg-paper-100/70 dark:bg-ink-900/70 space-y-5 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-paper-200 dark:border-ink-800 pb-3">
            <h3 className="font-serif text-lg font-medium text-paper-900 dark:text-ink-100">
              {isCreating ? 'Write New Essay' : `Edit: ${editingArticle?.title || editingArticle?.title_bn}`}
            </h3>
            <span className="text-xs text-accent font-mono">
              Live Markdown &amp; Preview
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                Article Title (English) — Optional if Bengali provided
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. On the Architecture of Inner Silence"
                className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                Bengali Title (বাংলা শিরোনাম) — Optional if English provided
              </label>
              <input
                type="text"
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                placeholder="যেমন: অন্তর্নিহিত নীরবতার স্থাপত্য"
                className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-bengaliSerif"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
              Short Excerpt / সারসংক্ষেপ (Optional)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="Short summary for cards and search snippets (auto-generated if left empty)..."
              className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-serif"
            />
          </div>

          {/* Live Markdown Editor */}
          <div>
            <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
              Article Content (Markdown) — Write in English or বাংলা *
            </label>
            <MarkdownEditor value={content} onChange={setContent} minHeight="420px" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Philosophy, Solitude, Consciousness"
                className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent"
              >
                <option value="published">Published (Live on Website)</option>
                <option value="draft">Draft (Private)</option>
              </select>
            </div>
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
              <span>{isCreating ? 'Publish to Live Site' : 'Update Article'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Articles Table */}
      <div className="border border-paper-200 dark:border-ink-800 rounded-lg overflow-hidden bg-paper-100/30 dark:bg-ink-900/30">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-paper-700 dark:text-ink-400">
            Loading articles...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-paper-200/60 dark:bg-ink-850 text-paper-700 dark:text-ink-300 uppercase tracking-wider font-mono">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Reading Time</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Tags</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-200 dark:divide-ink-800 text-paper-800 dark:text-ink-200">
                {articles.map((a) => (
                  <tr key={a.id} className="hover:bg-paper-100 dark:hover:bg-ink-850/50">
                    <td className="p-3.5 font-serif font-medium">{a.title || a.title_bn}</td>
                    <td className="p-3.5 font-mono text-paper-700 dark:text-ink-300">
                      {a.reading_time_min}m
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${
                          a.status === 'published'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-paper-700 dark:text-ink-300">
                      {a.tags?.join(', ') || '—'}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEdit(a)}
                        className="p-1 rounded text-paper-700 dark:text-ink-300 hover:text-accent"
                        title="Edit Article"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="p-1 rounded text-rose-600 dark:text-rose-400 hover:opacity-80"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
