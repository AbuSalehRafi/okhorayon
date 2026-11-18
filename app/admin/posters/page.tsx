'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Poster } from '@/lib/types';
import { Image as ImageIcon, Plus, Trash2, Edit3, Check, Upload, Loader2 } from 'lucide-react';

export default function AdminPostersPage() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPoster, setEditingPoster] = useState<Poster | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states - Flexible: Neither English nor Bengali strictly mandatory
  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [highResUrl, setHighResUrl] = useState('');
  const [dimensions, setDimensions] = useState('24 x 36 in / Archival Print');

  const fetchPosters = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data && data.posters) {
        setPosters(data.posters);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  const openCreate = () => {
    setIsCreating(true);
    setEditingPoster(null);
    setTitle('');
    setTitleBn('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80');
    setHighResUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=2400&q=95');
    setDimensions('24 x 36 in / Screenprint on Archival Cotton');
  };

  const openEdit = (p: Poster) => {
    setEditingPoster(p);
    setIsCreating(false);
    setTitle(p.title || '');
    setTitleBn(p.title_bn || '');
    setDescription(p.description || '');
    setImageUrl(p.image_url);
    setHighResUrl(p.high_res_url || '');
    setDimensions(p.dimensions || '24 x 36 in');
  };

  const cancelForm = () => {
    setEditingPoster(null);
    setIsCreating(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
      setHighResUrl(previewUrl);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const primaryTitle = title.trim() || titleBn.trim();
    if (!primaryTitle) {
      alert('Please provide a poster title in English or Bengali.');
      return;
    }
    if (!imageUrl.trim()) {
      alert('Please provide an image for the poster.');
      return;
    }

    setSaving(true);
    let posterToSave: Poster;

    if (isCreating) {
      const slugCandidate = (title.trim() || titleBn.trim())
        .toLowerCase()
        .replace(/[^a-z0-9\u0980-\u09FF]+/g, '-')
        .replace(/(^-|-$)/g, '');

      posterToSave = {
        id: `poster-${Date.now()}`,
        type: 'poster',
        slug: slugCandidate || `poster-${Date.now()}`,
        title: title.trim() || titleBn.trim(),
        title_bn: titleBn.trim() || undefined,
        description: description.trim() || 'Visual artwork study',
        image_url: imageUrl,
        high_res_url: highResUrl || imageUrl,
        dimensions,
        status: 'published',
        published_at: new Date().toISOString(),
        is_sample: false,
      };
    } else if (editingPoster) {
      posterToSave = {
        ...editingPoster,
        title: title.trim() || titleBn.trim(),
        title_bn: titleBn.trim() || undefined,
        description: description.trim() || 'Visual artwork study',
        image_url: imageUrl,
        high_res_url: highResUrl || imageUrl,
        dimensions,
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
          action: 'save_poster',
          payload: posterToSave,
        }),
      });

      if (res.ok) {
        await fetchPosters();
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
        cancelForm();
      } else {
        alert('Failed to save poster.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving poster.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this poster piece?')) return;

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_poster',
          payload: { id },
        }),
      });

      if (res.ok) {
        await fetchPosters();
      } else {
        alert('Failed to delete poster.');
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
            <ImageIcon className="w-5 h-5 text-accent" />
            <span>Manage Posters &amp; Visual Art</span>
          </h1>
          <p className="text-xs text-paper-700 dark:text-ink-300 font-serif mt-1">
            Publish visual pieces in English, Bengali, or both. Persists live on the gallery.
          </p>
        </div>

        {!isCreating && !editingPoster && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white dark:text-ink-950 text-xs font-medium hover:bg-accent-hover transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Poster</span>
          </button>
        )}
      </div>

      {savedNotice && (
        <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Poster published and live in gallery!</span>
        </div>
      )}

      {/* Form */}
      {(isCreating || editingPoster) && (
        <form
          onSubmit={handleSave}
          className="p-6 rounded-xl border border-paper-300 dark:border-ink-800 bg-paper-100/70 dark:bg-ink-900/70 space-y-5 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-paper-200 dark:border-ink-800 pb-3">
            <h3 className="font-serif text-lg font-medium text-paper-900 dark:text-ink-100">
              {isCreating ? 'Publish New Poster' : `Edit: ${editingPoster?.title || editingPoster?.title_bn}`}
            </h3>
            <span className="text-xs text-accent font-mono">
              Visual Print
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                Poster Title (English) — Optional if Bengali provided
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Silence Before Syllable"
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
                placeholder="যেমন: শব্দের পূর্বে নৈশব্দ্য"
                className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-bengaliSerif"
              />
            </div>
          </div>

          {/* Image Upload & Preview */}
          <div className="p-4 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 space-y-4">
            <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300">
              Poster Image *
            </label>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {imageUrl && (
                <div className="relative w-28 h-36 rounded border border-paper-300 dark:border-ink-800 overflow-hidden shrink-0">
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                </div>
              )}

              <div className="flex-1 space-y-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md bg-paper-200 dark:bg-ink-850 hover:bg-accent hover:text-white transition-colors text-xs font-medium">
                  <Upload className="w-4 h-4" />
                  <span>Upload Poster Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                <div>
                  <span className="text-[11px] text-paper-700 dark:text-ink-300 block mb-1">
                    Or direct image URL:
                  </span>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-100 dark:bg-ink-900 text-xs font-mono focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                Print Dimensions &amp; Medium
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="24 x 36 in / Archival Screenprint"
                className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                High-Resolution Download URL (Optional)
              </label>
              <input
                type="url"
                value={highResUrl}
                onChange={(e) => setHighResUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
              Description / Concept
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Typographic meditation on stillness and space (in English or বাংলা)..."
              className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-serif"
            />
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
              <span>{isCreating ? 'Publish to Gallery' : 'Update Poster'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Grid Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-8 text-center text-xs font-mono text-paper-700 dark:text-ink-400">
            Loading gallery...
          </div>
        ) : (
          posters.map((p) => (
            <div
              key={p.id}
              className="border border-paper-200 dark:border-ink-800 rounded-lg overflow-hidden bg-paper-100/40 dark:bg-ink-900/40 p-4 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/5] w-full rounded overflow-hidden mb-3 bg-paper-200 dark:bg-ink-950">
                  <Image src={p.image_url} alt={p.title || p.title_bn || 'Poster'} fill className="object-cover" />
                </div>
                <h4 className="font-serif font-medium text-sm text-paper-900 dark:text-ink-100">
                  {p.title || p.title_bn}
                </h4>
                <p className="text-xs text-paper-700 dark:text-ink-300 font-mono mt-0.5">
                  {p.dimensions}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-paper-200 dark:border-ink-800 flex items-center justify-between">
                <span className="text-[10px] text-paper-700 dark:text-ink-400 font-mono">
                  {p.is_sample ? 'Sample' : 'Original'}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1 rounded text-paper-700 dark:text-ink-300 hover:text-accent"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1 rounded text-rose-600 dark:text-rose-400 hover:opacity-80"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
