'use client';

import React, { useState } from 'react';
import { ContentType, ContentStatus } from '@/lib/types';
import {
  FileText,
  Check,
  AlertCircle,
  Loader2,
  Calendar,
  User,
  Eye,
  Edit3,
  Feather,
  Sparkles,
  BookOpen,
  Send,
} from 'lucide-react';
import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';
import { siteConfig } from '@/lib/site-config';

interface UnifiedEntryFormProps {
  initialItem?: any;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function UnifiedEntryForm({ initialItem, onSuccess, onCancel }: UnifiedEntryFormProps) {
  const isEditing = !!initialItem;

  const [type, setType] = useState<ContentType>(initialItem?.type || 'article');
  const [title, setTitle] = useState(initialItem?.title || initialItem?.title_bn || '');
  const [titleBn, setTitleBn] = useState(initialItem?.title_bn || '');
  const [author, setAuthor] = useState(initialItem?.author || siteConfig.author || 'রাফি');
  const [content, setContent] = useState(initialItem?.content || initialItem?.content_bn || '');
  const [description, setDescription] = useState(
    initialItem?.description || initialItem?.excerpt || initialItem?.abstract || ''
  );
  const [date, setDate] = useState(
    initialItem?.published_at
      ? new Date(initialItem.published_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [tags, setTags] = useState(
    initialItem?.tags ? initialItem.tags.join(', ') : initialItem?.keywords ? initialItem.keywords.join(', ') : ''
  );
  const [status, setStatus] = useState<ContentStatus>(initialItem?.status || 'published');
  const [isFeatured, setIsFeatured] = useState<boolean>(initialItem?.is_featured || false);

  // Editor mode: 'edit' or 'preview'
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const effectiveTitle = title.trim() || titleBn.trim();
    if (!effectiveTitle) {
      setErrorMessage('অনুগ্রহ করে একটি শিরোনাম প্রদান করুন (Please provide a content title).');
      return;
    }

    if (!content.trim()) {
      setErrorMessage('অনুগ্রহ করে মূল রচনা বা লেখার টেক্সট লিখুন (Please enter or paste the main text content).');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate slug from title
      const slugCandidate = (title.trim() || titleBn.trim())
        .toLowerCase()
        .replace(/[^a-z0-9\u0980-\u09FF]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const tagArray = tags
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean);

      // Auto-generate excerpt if not explicitly provided
      const autoExcerpt =
        description.trim() ||
        content
          .replace(/[#*`>_-]/g, '')
          .slice(0, 160)
          .trim() + '...';

      // Estimate reading time (approx 180 words per minute for Bengali/English)
      const wordCount = content.trim().split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 180));

      // Construct item payload
      const payload: any = {
        id: initialItem?.id || `${type}-${Date.now()}`,
        type,
        slug: initialItem?.slug || slugCandidate || `${type}-${Date.now()}`,
        title: title.trim() || titleBn.trim(),
        title_bn: titleBn.trim() || title.trim(),
        author: author.trim() || 'রাফি',
        author_bn: author.trim() || 'রাফি',
        description: autoExcerpt,
        excerpt: autoExcerpt,
        excerpt_bn: autoExcerpt,
        abstract: autoExcerpt,
        abstract_bn: autoExcerpt,
        content: content.trim(),
        content_bn: content.trim(),
        reading_time_min: readingTime,
        published_at: new Date(date).toISOString(),
        status,
        is_featured: isFeatured,
        is_sample: false,
        tags: tagArray,
        keywords: tagArray,
      };

      // Save to server & Firestore
      const saveRes = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_item',
          payload,
        }),
      });

      const saveJson = await saveRes.json();
      if (!saveRes.ok || saveJson.error) {
        throw new Error(saveJson.error || 'Failed to save entry');
      }

      setSuccessMessage('সফলভাবে প্রকাশিত এবং ডাটাবেসে সংরক্ষিত হয়েছে! (Saved successfully)');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'একটি ত্রুটি দেখা দিয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 md:p-8 rounded-2xl border border-paper-300 dark:border-ink-800 bg-paper-100/70 dark:bg-ink-900/70 shadow-lg space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-paper-200 dark:border-ink-800 pb-4">
        <div>
          <h2 className="font-serif text-xl md:text-2xl font-medium text-paper-900 dark:text-ink-100 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-accent" />
            <span>{isEditing ? 'রচনা সম্পাদনা (Edit Content)' : 'নতুন রচনা প্রকাশ (Add New Content)'}</span>
          </h2>
          <p className="text-xs text-paper-600 dark:text-ink-400 font-serif mt-1">
            সরাসরি টেক্সট লিখুন বা পেস্ট করুন &mdash; কোনো পিডিএফ বা ফাইল আপলোডের প্রয়োজন নেই।
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs px-3 py-1.5 rounded-lg border border-paper-300 dark:border-ink-800 text-paper-700 dark:text-ink-300 hover:text-paper-900 dark:hover:text-ink-100 transition-colors"
          >
            বাতিল (Cancel)
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Row 1: Category & Author & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-ink-300 mb-1.5">
            বিভাগ / Category *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ContentType)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-sans"
          >
            <option value="article">প্রবন্ধ (Article / Essay)</option>
            <option value="poem">কবিতা (Poem / Verse)</option>
            <option value="story">গল্প ও কথাসাহিত্য (Story / Fiction)</option>
            <option value="research">গবেষণা ও চিন্তাপত্র (Research Monograph)</option>
            <option value="book">বই ও পুস্তিকা (Book Volume)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-ink-300 mb-1.5">
            লেখক / Author Name *
          </label>
          <div className="relative">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="লেখকের নাম (যেমন: রাফি)"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-serif"
            />
            <User className="w-4 h-4 absolute left-3 top-3 text-paper-500 dark:text-ink-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-ink-300 mb-1.5">
            তারিখ / Publication Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-mono"
            />
            <Calendar className="w-4 h-4 absolute left-3 top-3 text-paper-500 dark:text-ink-400" />
          </div>
        </div>
      </div>

      {/* Row 2: Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-ink-300 mb-1.5">
            রচনার শিরোনাম / Content Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="রচনার প্রধান শিরোনাম..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-serif"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-ink-300 mb-1.5">
            বিকল্প শিরোনাম / Subtitle (ঐচ্ছিক)
          </label>
          <input
            type="text"
            value={titleBn}
            onChange={(e) => setTitleBn(e.target.value)}
            placeholder="উপশিরোনাম বা ইংরেজি রূপান্তর..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-serif"
          />
        </div>
      </div>

      {/* Row 3: Main Text Content with Write / Preview Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-ink-300 flex items-center gap-1.5">
            <span>মূল লেখা / Main Content *</span>
            <span className="text-paper-500 dark:text-ink-500 normal-case font-sans">
              (অনুচ্ছেদ ও ফাঁকা লাইন হুবহু সংরক্ষিত থাকবে)
            </span>
          </label>

          <div className="flex items-center border border-paper-300 dark:border-ink-800 rounded-lg p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'write'
                  ? 'bg-accent text-white dark:text-ink-950 font-semibold'
                  : 'text-paper-700 dark:text-ink-300 hover:text-paper-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>লিখুন (Write)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-accent text-white dark:text-ink-950 font-semibold'
                  : 'text-paper-700 dark:text-ink-300 hover:text-paper-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>প্রিভিউ (Preview)</span>
            </button>
          </div>
        </div>

        {activeTab === 'write' ? (
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              placeholder="এখানে আপনার প্রবন্ধ, কবিতা বা গল্পের সম্পূর্ণ লেখা পেস্ট করুন অথবা লিখুন...

(প্যারাগ্রাফ ও স্পেসিং স্বয়ংক্রিয়ভাবে বজায় থাকবে। বোল্ড করার জন্য **লেখা**, হেডিংয়ের জন্য ### শিরোনাম ব্যবহার করতে পারেন।)"
              className="w-full px-4 py-3 rounded-xl border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-base focus:outline-none focus:border-accent font-serif leading-relaxed text-paper-950 dark:text-ink-50"
            />
            <div className="flex justify-between items-center text-xs text-paper-500 dark:text-ink-400 mt-1 px-1 font-mono">
              <span>{content.trim() ? `${content.trim().split(/\s+/).length} শব্দ (Words)` : '০ শব্দ'}</span>
              <span>{content.length} অক্ষর</span>
            </div>
          </div>
        ) : (
          <div className="min-h-[320px] p-6 rounded-xl border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950/70 overflow-auto max-h-[500px]">
            {content.trim() ? (
              <div className="font-serif leading-relaxed text-paper-900 dark:text-ink-100">
                <MarkdownRenderer content={content} />
              </div>
            ) : (
              <div className="text-center py-16 text-paper-500 dark:text-ink-400 font-serif text-sm">
                প্রিভিউ দেখতে প্রথমে &quot;লিখুন&quot; ট্যাবে কিছু টেক্সট লিখুন।
              </div>
            )}
          </div>
        )}
      </div>

      {/* Row 4: Excerpt & Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-ink-300 mb-1.5">
            সারসংক্ষেপ / Excerpt (ঐচ্ছিক)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="খালি রাখলে মূল লেখার প্রথম অংশ থেকে স্বয়ংক্রিয়ভাবে তৈরি হবে..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-xs focus:outline-none focus:border-accent font-serif"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-ink-300 mb-1.5">
            ট্যাগ / Keywords (কমা দিয়ে আলাদা করুন)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="যেমন: সাহিত্য, দর্শন, ক্যাম্পাস, বাংলাদেশ"
            className="w-full px-3.5 py-2.5 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-xs focus:outline-none focus:border-accent font-sans"
          />
        </div>
      </div>

      {/* Row 5: Status & Featured */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-paper-200 dark:border-ink-800">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="published"
              checked={status === 'published'}
              onChange={() => setStatus('published')}
              className="text-accent focus:ring-accent"
            />
            <span className="text-xs font-medium text-paper-800 dark:text-ink-200">
              সরাসরি প্রকাশ (Publish Live)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="draft"
              checked={status === 'draft'}
              onChange={() => setStatus('draft')}
              className="text-accent focus:ring-accent"
            />
            <span className="text-xs font-medium text-paper-800 dark:text-ink-200">
              খসড়া (Save as Draft)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded text-accent focus:ring-accent"
            />
            <span className="text-xs font-medium text-paper-800 dark:text-ink-200">
              হোমপেজে হাইলাইট করুন (Feature on Homepage)
            </span>
          </label>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white dark:text-ink-950 font-medium text-sm hover:bg-accent-hover transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>সংরক্ষণ হচ্ছে...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{isEditing ? 'পরিবর্তন সংরক্ষণ করুন' : 'সাইটে প্রকাশ করুন'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
