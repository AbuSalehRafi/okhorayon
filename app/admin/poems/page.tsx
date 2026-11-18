'use client';

import React, { useState, useEffect } from 'react';
import { Poem } from '@/lib/types';
import { Feather, Plus, Trash2, Edit3, Check, Loader2 } from 'lucide-react';

export default function AdminPoemsPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPoem, setEditingPoem] = useState<Poem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Form states - NEITHER English nor Bengali is strictly mandatory, just at least one!
  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [content, setContent] = useState('');
  const [contentBn, setContentBn] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [saving, setSaving] = useState(false);

  const fetchPoems = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data && data.poems) {
        setPoems(data.poems);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoems();
  }, []);

  const openCreate = () => {
    setIsCreating(true);
    setEditingPoem(null);
    setTitle('');
    setTitleBn('');
    setContent('');
    setContentBn('');
    setTags('');
    setStatus('published');
  };

  const openEdit = (p: Poem) => {
    setEditingPoem(p);
    setIsCreating(false);
    setTitle(p.title || '');
    setTitleBn(p.title_bn || '');
    setContent(p.content || '');
    setContentBn(p.content_bn || '');
    setTags(p.tags?.join(', ') || '');
    setStatus(p.status);
  };

  const cancelForm = () => {
    setEditingPoem(null);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Flexible Validation: Require at least ONE title and at least ONE content body
    const primaryTitle = title.trim() || titleBn.trim();
    const primaryContent = content.trim() || contentBn.trim();

    if (!primaryTitle) {
      alert('Please provide a title in either English or Bengali.');
      return;
    }
    if (!primaryContent) {
      alert('Please provide the poem body in either English or Bengali.');
      return;
    }

    setSaving(true);
    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    let poemToSave: Poem;

    if (isCreating) {
      const slugCandidate = (title.trim() || titleBn.trim())
        .toLowerCase()
        .replace(/[^a-z0-9\u0980-\u09FF]+/g, '-')
        .replace(/(^-|-$)/g, '');

      poemToSave = {
        id: `poem-${Date.now()}`,
        slug: slugCandidate || `poem-${Date.now()}`,
        title: title.trim() || titleBn.trim(), // Fallback if only Bengali provided
        title_bn: titleBn.trim() || undefined,
        content: content.trim() || contentBn.trim(), // Fallback if only Bengali provided
        content_bn: contentBn.trim() || undefined,
        tags: tagArray,
        status,
        published_at: new Date().toISOString(),
        is_sample: false,
      };
    } else if (editingPoem) {
      poemToSave = {
        ...editingPoem,
        title: title.trim() || titleBn.trim(),
        title_bn: titleBn.trim() || undefined,
        content: content.trim() || contentBn.trim(),
        content_bn: contentBn.trim() || undefined,
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
          action: 'save_poem',
          payload: poemToSave,
        }),
      });

      if (res.ok) {
        await fetchPoems();
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
        cancelForm();
      } else {
        alert('Failed to save poem to server.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving poem.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this poem?')) return;

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_poem',
          payload: { id },
        }),
      });

      if (res.ok) {
        await fetchPoems();
      } else {
        alert('Failed to delete poem.');
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
            <Feather className="w-5 h-5 text-accent" />
            <span>Manage Poems &amp; Verse</span>
          </h1>
          <p className="text-xs text-paper-700 dark:text-ink-300 font-serif mt-1">
            Publish in English, Bengali, or both. Neither language is mandatory.
          </p>
        </div>

        {!isCreating && !editingPoem && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white dark:text-ink-950 text-xs font-medium hover:bg-accent-hover transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Poem</span>
          </button>
        )}
      </div>

      {savedNotice && (
        <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Poem saved and published live on the website!</span>
        </div>
      )}

      {/* Editor Form */}
      {(isCreating || editingPoem) && (
        <form
          onSubmit={handleSave}
          className="p-6 rounded-xl border border-paper-300 dark:border-ink-800 bg-paper-100/70 dark:bg-ink-900/70 space-y-5 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-paper-200 dark:border-ink-800 pb-3">
            <h3 className="font-serif text-lg font-medium text-paper-900 dark:text-ink-100">
              {isCreating ? 'Compose New Poem' : `Edit: ${editingPoem?.title || editingPoem?.title_bn}`}
            </h3>
            <span className="text-xs text-accent font-mono">
              English or Bengali
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                Poem Title (English) — Optional if Bengali provided
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Nocturne of the Unspoken"
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
                placeholder="যেমন: অনুক্ত সুরের নিশুতি"
                className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-bengaliSerif"
              />
            </div>
          </div>

          {/* Stanza Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                English Poem Body (Optional if Bengali provided)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="Write English verse here (separate stanzas with double enter)..."
                className="w-full p-4 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm font-serif leading-loose focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                বাংলা কবিতা (Optional if English provided)
              </label>
              <textarea
                value={contentBn}
                onChange={(e) => setContentBn(e.target.value)}
                rows={8}
                placeholder="এখানে বাংলা কবিতা লিখুন..."
                className="w-full p-4 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm font-bengaliSerif leading-loose focus:outline-none focus:border-accent"
              />
            </div>
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
                placeholder="solitude, night, metaphysics"
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
              <span>{isCreating ? 'Publish to Live Site' : 'Update Poem'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Poems Table */}
      <div className="border border-paper-200 dark:border-ink-800 rounded-lg overflow-hidden bg-paper-100/30 dark:bg-ink-900/30">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-paper-700 dark:text-ink-400">
            Loading archive...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-paper-200/60 dark:bg-ink-850 text-paper-700 dark:text-ink-300 uppercase tracking-wider font-mono">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Bengali</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Tags</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-200 dark:divide-ink-800 text-paper-800 dark:text-ink-200">
                {poems.map((p) => (
                  <tr key={p.id} className="hover:bg-paper-100 dark:hover:bg-ink-850/50">
                    <td className="p-3.5 font-serif font-medium">{p.title || '—'}</td>
                    <td className="p-3.5 font-bengaliSerif text-paper-700 dark:text-ink-300">
                      {p.title_bn || '—'}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${
                          p.status === 'published'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-paper-700 dark:text-ink-300">
                      {p.tags?.join(', ') || '—'}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1 rounded text-paper-700 dark:text-ink-300 hover:text-accent"
                        title="Edit Poem"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1 rounded text-rose-600 dark:text-rose-400 hover:opacity-80"
                        title="Delete Poem"
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
