'use client';

import React, { useState, useEffect } from 'react';
import { ResearchPaper } from '@/lib/types';
import { Download, FileUp, Plus, Sparkles, Trash2, Edit3, Check, Loader2 } from 'lucide-react';
import { MarkdownEditor } from '@/components/admin/markdown-editor';

export default function AdminResearchPage() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPaper, setEditingPaper] = useState<ResearchPaper | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states - Flexible: Neither English nor Bengali strictly mandatory
  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [abstract, setAbstract] = useState('');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [status, setStatus] = useState<'ongoing' | 'published'>('published');
  const [pdfUrl, setPdfUrl] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');

  const fetchPapers = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data && data.research) {
        setPapers(data.research);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const openCreate = () => {
    setIsCreating(true);
    setEditingPaper(null);
    setTitle('');
    setTitleBn('');
    setAbstract('');
    setContent('### 1. Introduction\n\nWorking notes and hypotheses in English or বাংলা...');
    setKeywords('Phenomenology, Aesthetics');
    setStatus('published');
    setPdfUrl('');
    setUploadFileName('');
  };

  const openEdit = (p: ResearchPaper) => {
    setEditingPaper(p);
    setIsCreating(false);
    setTitle(p.title || '');
    setTitleBn(p.title_bn || '');
    setAbstract(p.abstract || '');
    setContent(p.content || '');
    setKeywords(p.keywords?.join(', ') || '');
    setStatus(p.status);
    setPdfUrl(p.pdf_url || '');
    setUploadFileName('');
  };

  const cancelForm = () => {
    setEditingPaper(null);
    setIsCreating(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFileName(file.name);
      const mockUrl = `/samples/${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-')}`;
      setPdfUrl(mockUrl);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const primaryTitle = title.trim() || titleBn.trim();
    if (!primaryTitle) {
      alert('Please provide a paper title in English or Bengali.');
      return;
    }

    if (!abstract.trim()) {
      alert('Please provide an abstract for the research paper.');
      return;
    }

    setSaving(true);
    const kwArray = keywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    let paperToSave: ResearchPaper;

    if (isCreating) {
      const slugCandidate = (title.trim() || titleBn.trim())
        .toLowerCase()
        .replace(/[^a-z0-9\u0980-\u09FF]+/g, '-')
        .replace(/(^-|-$)/g, '');

      paperToSave = {
        id: `research-${Date.now()}`,
        slug: slugCandidate || `research-${Date.now()}`,
        title: title.trim() || titleBn.trim(),
        title_bn: titleBn.trim() || undefined,
        abstract,
        content,
        keywords: kwArray,
        status,
        pdf_url: pdfUrl || undefined,
        published_at: new Date().toISOString(),
        is_sample: false,
      };
    } else if (editingPaper) {
      paperToSave = {
        ...editingPaper,
        title: title.trim() || titleBn.trim(),
        title_bn: titleBn.trim() || undefined,
        abstract,
        content,
        keywords: kwArray,
        status,
        pdf_url: pdfUrl || undefined,
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
          action: 'save_research',
          payload: paperToSave,
        }),
      });

      if (res.ok) {
        await fetchPapers();
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
        cancelForm();
      } else {
        alert('Failed to save research paper.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving paper.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this research monograph?')) return;

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_research',
          payload: { id },
        }),
      });

      if (res.ok) {
        await fetchPapers();
      } else {
        alert('Failed to delete paper.');
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
            <Sparkles className="w-5 h-5 text-accent" />
            <span>Manage Personal Research &amp; Papers</span>
          </h1>
          <p className="text-xs text-paper-700 dark:text-ink-300 font-serif mt-1">
            Publish research in English, Bengali, or both. Changes persist live on the website.
          </p>
        </div>

        {!isCreating && !editingPaper && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white dark:text-ink-950 text-xs font-medium hover:bg-accent-hover transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Research Paper</span>
          </button>
        )}
      </div>

      {savedNotice && (
        <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Research entry published live on website!</span>
        </div>
      )}

      {/* Editor Form */}
      {(isCreating || editingPaper) && (
        <form
          onSubmit={handleSave}
          className="p-6 rounded-xl border border-paper-300 dark:border-ink-800 bg-paper-100/70 dark:bg-ink-900/70 space-y-5 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-paper-200 dark:border-ink-800 pb-3">
            <h3 className="font-serif text-lg font-medium text-paper-900 dark:text-ink-100">
              {isCreating ? 'Catalog New Research Paper' : `Edit: ${editingPaper?.title || editingPaper?.title_bn}`}
            </h3>
            <span className="text-xs text-accent font-mono">
              Academic &amp; Philosophical
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                Paper Title (English) — Optional if Bengali provided
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Epistemology of the Margin"
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
                placeholder="যেমন: প্রান্তিকের জ্ঞানতত্ত্ব"
                className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-bengaliSerif"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
              Paper Abstract / সারসংক্ষেপ (English or বাংলা) *
            </label>
            <textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              required
              rows={3}
              placeholder="This inquiry investigates..."
              className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-serif"
            />
          </div>

          {/* PDF Upload */}
          <div className="p-4 rounded-lg border border-dashed border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950">
            <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-2">
              Attach PDF Manuscript
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md bg-paper-200 dark:bg-ink-850 hover:bg-accent hover:text-white transition-colors text-xs font-medium">
                <FileUp className="w-4 h-4" />
                <span>Upload PDF File</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadFileName && (
                <span className="text-xs text-accent font-mono">
                  Attached: {uploadFileName}
                </span>
              )}

              {pdfUrl && !uploadFileName && (
                <span className="text-xs text-paper-700 dark:text-ink-300 font-mono">
                  PDF Link: {pdfUrl}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
              Research Notes / Body (Markdown) — Write in English or বাংলা
            </label>
            <MarkdownEditor value={content} onChange={setContent} minHeight="280px" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                Keywords (comma separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Phenomenology, Hermeneutics, Textual Theory"
                className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-paper-700 dark:text-ink-300 mb-1">
                Study Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'ongoing' | 'published')}
                className="w-full px-3 py-2 rounded-md border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent"
              >
                <option value="published">Published</option>
                <option value="ongoing">Ongoing Study</option>
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
              <span>{isCreating ? 'Publish to Live Site' : 'Update Research'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="border border-paper-200 dark:border-ink-800 rounded-lg overflow-hidden bg-paper-100/30 dark:bg-ink-900/30">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-paper-700 dark:text-ink-400">
            Loading research...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-paper-200/60 dark:bg-ink-850 text-paper-700 dark:text-ink-300 uppercase tracking-wider font-mono">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Keywords</th>
                  <th className="p-3.5">PDF</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-200 dark:divide-ink-800 text-paper-800 dark:text-ink-200">
                {papers.map((p) => (
                  <tr key={p.id} className="hover:bg-paper-100 dark:hover:bg-ink-850/50">
                    <td className="p-3.5 font-serif font-medium">{p.title || p.title_bn}</td>
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
                      {p.keywords?.slice(0, 3).join(', ') || '—'}
                    </td>
                    <td className="p-3.5 font-mono">
                      {p.pdf_url ? (
                        <span className="text-accent flex items-center gap-1">
                          <Download className="w-3 h-3" /> PDF
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1 rounded text-paper-700 dark:text-ink-300 hover:text-accent"
                        title="Edit Paper"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1 rounded text-rose-600 dark:text-rose-400 hover:opacity-80"
                        title="Delete Paper"
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
