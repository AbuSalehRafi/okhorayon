'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { UnifiedEntryForm } from '@/components/admin/unified-entry-form';
import {
  BookOpen,
  Feather,
  FileText,
  Image as ImageIcon,
  Plus,
  Sparkles,
  ExternalLink,
  Search,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Eye,
  Settings,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form modal / view state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Philosophy editor
  const [isEditingPhilosophy, setIsEditingPhilosophy] = useState(false);
  const [philosophyText, setPhilosophyText] = useState('');

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/content');
      const json = await res.json();
      setData(json);
      if (json?.profile?.philosophy_statement_bn) {
        setPhilosophyText(json.profile.philosophy_statement_bn);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const poems = data?.poems || [];
  const articles = data?.articles || [];
  const research = data?.research || [];
  const posters = data?.posters || [];
  const books = data?.books || [];

  // Combine all items for the unified management table
  const allEntries = [
    ...articles.map((item: any) => ({ ...item, type: 'article' })),
    ...poems.map((item: any) => ({ ...item, type: 'poem' })),
    ...research.map((item: any) => ({ ...item, type: 'research' })),
    ...posters.map((item: any) => ({ ...item, type: 'poster' })),
    ...books.map((item: any) => ({ ...item, type: 'book' })),
  ].sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  // Filter entries
  const filteredEntries = allEntries.filter((item: any) => {
    const matchesSearch =
      !searchQuery.trim() ||
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.title_bn && item.title_bn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.tags && item.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleTogglePublish = async (id: string, type: string) => {
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_publish',
          payload: { id, type },
        }),
      });
      if (res.ok) {
        await fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id: string, type: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_item',
          payload: { id, type },
        }),
      });
      if (res.ok) {
        await fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePhilosophy = async () => {
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          payload: {
            philosophy_statement: philosophyText,
            philosophy_statement_bn: philosophyText,
          },
        }),
      });
      if (res.ok) {
        setIsEditingPhilosophy(false);
        await fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getItemLink = (item: any) => {
    switch (item.type) {
      case 'poem':
        return `/poems/${item.slug}`;
      case 'article':
        return `/articles/${item.slug}`;
      case 'research':
        return `/research/${item.slug}`;
      case 'poster':
        return `/posters/${item.slug}`;
      case 'book':
        return `/books/${item.slug}`;
      default:
        return '/';
    }
  };

  return (
    <div className="space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-paper-200 dark:border-ink-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold block">
            অক্ষরায়ণ অ্যাডমিন
          </span>
          <h1 className="font-serif text-3xl font-medium text-paper-900 dark:text-ink-100">
            Curator Sanctuary
          </h1>
          <p className="text-xs text-paper-700 dark:text-ink-300 font-serif mt-1">
            সরাসরি টেক্সট লিখে বা পেস্ট করে নতুন রচনা প্রকাশ ও সম্পাদনা করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-paper-300 dark:border-ink-800 text-xs text-paper-700 dark:text-ink-300 hover:text-accent transition-colors"
          >
            <span>মূল সাইট দেখুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => {
              setEditingItem(null);
              setIsFormOpen(!isFormOpen);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white dark:text-ink-950 text-xs font-medium hover:bg-accent-hover transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{isFormOpen ? 'ফর্ম বন্ধ করুন' : 'নতুন রচনা লিখুন (Add Content)'}</span>
          </button>
        </div>
      </div>

      {/* Editable Philosophy Line Box */}
      <div className="p-5 rounded-xl border border-paper-200 dark:border-ink-800 bg-paper-100/50 dark:bg-ink-900/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-accent font-medium flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" />
            <span>হোমপেজের মূল দার্শনিক উক্তি (Homepage Philosophy Line)</span>
          </span>
          <button
            onClick={() => setIsEditingPhilosophy(!isEditingPhilosophy)}
            className="text-xs text-accent hover:underline"
          >
            {isEditingPhilosophy ? 'বাতিল' : 'সম্পাদনা করুন'}
          </button>
        </div>

        {isEditingPhilosophy ? (
          <div className="space-y-3">
            <textarea
              value={philosophyText}
              onChange={(e) => setPhilosophyText(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-bengaliSerif"
            />
            <button
              onClick={handleSavePhilosophy}
              className="px-4 py-1.5 rounded-md bg-accent text-white dark:text-ink-950 text-xs font-medium hover:bg-accent-hover"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        ) : (
          <p className="font-bengaliSerif text-base text-paper-800 dark:text-ink-200 italic">
            &ldquo;{data?.profile?.philosophy_statement_bn || data?.profile?.philosophy_statement}&rdquo;
          </p>
        )}
      </div>

      {/* Unified Entry Form (Conditional Modal / Dropdown) */}
      {isFormOpen && (
        <div className="mb-10">
          <UnifiedEntryForm
            initialItem={editingItem}
            onSuccess={() => {
              setIsFormOpen(false);
              setEditingItem(null);
              fetchDashboard();
            }}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingItem(null);
            }}
          />
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: 'প্রবন্ধ (Articles)', count: articles.length, icon: FileText, type: 'article' },
          { label: 'কবিতা (Poems)', count: poems.length, icon: Feather, type: 'poem' },
          { label: 'গবেষণা (Research)', count: research.length, icon: Sparkles, type: 'research' },
          { label: 'পোস্টার (Posters)', count: posters.length, icon: ImageIcon, type: 'poster' },
          { label: 'বই (Books)', count: books.length, icon: BookOpen, type: 'book' },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              onClick={() => setSelectedType(selectedType === m.type ? 'all' : m.type)}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                selectedType === m.type
                  ? 'border-accent bg-accent/10'
                  : 'border-paper-200 dark:border-ink-800 bg-paper-100/50 dark:bg-ink-900/40 hover:border-accent/50'
              }`}
            >
              <div className="flex items-center justify-between text-paper-700 dark:text-ink-400 mb-1">
                <Icon className="w-4 h-4 text-accent" />
                <span className="text-2xl font-serif font-medium text-paper-900 dark:text-ink-100">
                  {loading ? '...' : m.count}
                </span>
              </div>
              <p className="text-xs font-sans text-paper-700 dark:text-ink-300 truncate">
                {m.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Unified Entries Table with Search and Type Filter */}
      <div className="border border-paper-200 dark:border-ink-800 rounded-xl overflow-hidden bg-paper-100/30 dark:bg-ink-900/30 shadow-sm">
        {/* Table Filters Header */}
        <div className="p-4 border-b border-paper-200 dark:border-ink-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-paper-100/70 dark:bg-ink-900/70">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="শিরোনাম বা ট্যাগ দিয়ে অনুসন্ধান..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-xs font-sans focus:outline-none focus:border-accent"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-paper-700 dark:text-ink-400" />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            {[
              { key: 'all', label: 'সব' },
              { key: 'article', label: 'প্রবন্ধ' },
              { key: 'poem', label: 'কবিতা' },
              { key: 'research', label: 'গবেষণা' },
              { key: 'poster', label: 'পোস্টার' },
              { key: 'book', label: 'বই' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedType(f.key)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-sans transition-colors ${
                  selectedType === f.key
                    ? 'bg-accent text-white dark:text-ink-950 font-medium'
                    : 'bg-paper-200/80 dark:bg-ink-850 text-paper-700 dark:text-ink-300 hover:text-paper-900 dark:hover:text-ink-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-xs font-mono text-paper-700 dark:text-ink-400">
              সংগ্রহ লোড হচ্ছে...
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="p-12 text-center text-xs font-serif text-paper-700 dark:text-ink-400">
              কোনো রচনা পাওয়া যায়নি। &quot;নতুন রচনা লিখুন&quot; বাটনে ক্লিক করে যোগ করুন।
            </div>
          ) : (
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-paper-200/60 dark:bg-ink-850 text-paper-700 dark:text-ink-300 uppercase tracking-wider font-mono">
                <tr>
                  <th className="p-3.5">শিরোনাম (Title)</th>
                  <th className="p-3.5">শাখা (Category)</th>
                  <th className="p-3.5">লেখক (Author)</th>
                  <th className="p-3.5">স্ট্যাটাস</th>
                  <th className="p-3.5">তারিখ</th>
                  <th className="p-3.5 text-right">পদক্ষেপ (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-200 dark:divide-ink-800 text-paper-800 dark:text-ink-200">
                {filteredEntries.map((item: any) => {
                  const isPub = item.status === 'published';
                  return (
                    <tr key={item.id} className="hover:bg-paper-100 dark:hover:bg-ink-850/50 transition-colors">
                      <td className="p-3.5">
                        <p className="font-serif font-medium text-sm text-paper-900 dark:text-ink-100 line-clamp-1">
                          {item.title || item.title_bn}
                        </p>
                        {item.title_bn && item.title_bn !== item.title && (
                          <p className="font-bengaliSerif text-xs text-paper-700 dark:text-ink-300 mt-0.5 line-clamp-1">
                            {item.title_bn}
                          </p>
                        )}
                      </td>
                      <td className="p-3.5 font-mono capitalize text-accent">
                        {item.type}
                      </td>
                      <td className="p-3.5 font-serif text-[13px] text-paper-800 dark:text-ink-200">
                        {item.author || item.author_bn || 'রাফি'}
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleTogglePublish(item.id, item.type)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${
                            isPub
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25'
                              : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25'
                          }`}
                          title="ক্লিক করে স্ট্যাটাস পরিবর্তন করুন"
                        >
                          {isPub ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{isPub ? 'প্রকাশিত' : 'খসড়া'}</span>
                        </button>
                      </td>
                      <td className="p-3.5 font-mono text-paper-700 dark:text-ink-300">
                        {formatDate(item.published_at)}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <Link
                          href={getItemLink(item)}
                          target="_blank"
                          className="p-1.5 rounded hover:bg-paper-200 dark:hover:bg-ink-800 text-paper-700 dark:text-ink-300 inline-block"
                          title="মূল সাইটে দেখুন"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsFormOpen(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-1.5 rounded hover:bg-paper-200 dark:hover:bg-ink-800 text-paper-700 dark:text-ink-300"
                          title="সম্পাদনা করুন"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.type, item.title || item.title_bn)}
                          className="p-1.5 rounded hover:bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
