'use client';

import React, { useState, useRef } from 'react';
import { ContentType, ContentStatus } from '@/lib/types';
import {
  FileText,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  FileCheck,
  Image as ImageIcon,
  Star,
  Calendar,
} from 'lucide-react';

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
  const [description, setDescription] = useState(initialItem?.description || initialItem?.excerpt || initialItem?.abstract || '');
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

  // File states
  const [file, setFile] = useState<File | null>(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState<string>(initialItem?.pdf_url || initialItem?.image_url || '');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string>(initialItem?.cover_image_url || '');

  // UI / Progress states
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Validate File
  const handleFileSelection = (selectedFile: File) => {
    setErrorMessage('');
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB

    if (selectedFile.size > MAX_SIZE) {
      setErrorMessage('The selected file is too large (Maximum allowed: 50MB).');
      return;
    }

    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf');
    const isImage = selectedFile.type.startsWith('image/');

    if (type === 'poster') {
      if (!isPdf && !isImage) {
        setErrorMessage('Posters accept PDF, JPG, PNG, or WebP files.');
        return;
      }
    } else {
      if (!isPdf) {
        setErrorMessage(`Please upload a PDF file for ${type}.`);
        return;
      }
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const effectiveTitle = title.trim() || titleBn.trim();
    if (!effectiveTitle) {
      setErrorMessage('অনুগ্রহ করে একটি শিরোনাম প্রদান করুন (Please provide a title in Bengali or English).');
      return;
    }

    if (!file && !existingPdfUrl) {
      setErrorMessage('Please upload a PDF document (or image for posters).');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    try {
      let finalFileUrl = existingPdfUrl;
      let finalCoverUrl = existingCoverUrl;

      // Upload file if new file was selected
      if (file) {
        setUploadProgress(40);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('type', type);
        if (coverFile) {
          formData.append('cover', coverFile);
        }

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || uploadJson.error) {
          throw new Error(uploadJson.error || 'File upload failed');
        }

        finalFileUrl = uploadJson.fileUrl;
        finalCoverUrl = uploadJson.coverUrl;
      }

      setUploadProgress(75);

      // Generate slug
      const slugCandidate = (title.trim() || titleBn.trim())
        .toLowerCase()
        .replace(/[^a-z0-9\u0980-\u09FF]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const tagArray = tags
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean);

      // Construct item payload
      const payload: any = {
        id: initialItem?.id || `${type}-${Date.now()}`,
        type,
        slug: initialItem?.slug || slugCandidate || `${type}-${Date.now()}`,
        title: title.trim() || titleBn.trim(),
        title_bn: titleBn.trim() || title.trim(),
        description: description.trim(),
        excerpt: description.trim(),
        abstract: description.trim(),
        content: initialItem?.content || description.trim(),
        pdf_url: finalFileUrl,
        cover_image_url: finalCoverUrl,
        published_at: new Date(date).toISOString(),
        status,
        is_featured: isFeatured,
        is_sample: false,
        tags: tagArray,
        keywords: tagArray,
      };

      if (type === 'poster') {
        payload.image_url = finalFileUrl;
        payload.high_res_url = finalFileUrl;
      }

      // Save to server
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

      setUploadProgress(100);
      setSuccessMessage('Successfully published live to the website!');
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An unexpected error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 md:p-8 rounded-2xl border border-paper-300 dark:border-ink-800 bg-paper-100/70 dark:bg-ink-900/70 shadow-lg space-y-6"
    >
      <div className="flex items-center justify-between border-b border-paper-200 dark:border-ink-800 pb-4">
        <div>
          <h2 className="font-serif text-xl md:text-2xl font-medium text-paper-900 dark:text-ink-100">
            {isEditing ? 'রচনা সম্পাদনা' : 'নতুন রচনা আপলোড (Upload Entry)'}
          </h2>
          <p className="text-xs text-paper-700 dark:text-ink-300 font-serif mt-0.5">
            PDF আপলোড করুন — স্বয়ংক্রিয়ভাবে সরাসরি মূল সাইটে প্রকাশিত হবে।
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-paper-700 dark:text-ink-300 hover:text-paper-900 dark:hover:text-ink-100"
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

      {/* Row 1: Content Type & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-ink-300 mb-1.5">
            শাখা / Content Type *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ContentType)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-sans"
          >
            <option value="article">প্রবন্ধ (Article / Essay)</option>
            <option value="poem">কবিতা (Poem / Verse)</option>
            <option value="research">গবেষণা (Personal Research)</option>
            <option value="book">বই (Book / Volume)</option>
            <option value="poster">পোস্টার (Poster / Artwork)</option>
          </select>
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
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-mono"
            />
            <Calendar className="w-4 h-4 absolute left-3 top-3 text-paper-700 dark:text-ink-400" />
          </div>
        </div>
      </div>

      {/* Row 2: Title (Bengali or English) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-ink-300 mb-1.5">
            শিরোনাম / Title (বাংলা বা ইংরেজি) *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="যেমন: ড্যাফোডিল বিশ্ববিদ্যালয়ের হল জীবন"
            className="w-full px-3.5 py-2.5 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-serif"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-ink-300 mb-1.5">
            বিকল্প শিরোনাম / Subtitle / English Title (ঐচ্ছিক)
          </label>
          <input
            type="text"
            value={titleBn}
            onChange={(e) => setTitleBn(e.target.value)}
            placeholder="Optional secondary or English title"
            className="w-full px-3.5 py-2.5 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-serif"
          />
        </div>
      </div>

      {/* Row 3: Short Description */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-ink-300 mb-1.5">
          সংক্ষিপ্ত বিবরণ / Short Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="রচনার সারসংক্ষেপ যা হোমপেজ ও কার্ডে প্রদর্শিত হবে..."
          className="w-full px-3.5 py-2.5 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent font-serif leading-relaxed"
        />
      </div>

      {/* Drag & Drop File Upload Area */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-ink-300 mb-1.5">
          ফাইল আপলোড / File Upload ({type === 'poster' ? 'PDF, JPG, PNG' : 'PDF'}) *
        </label>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging
              ? 'border-accent bg-accent/10'
              : file || existingPdfUrl
              ? 'border-emerald-500/50 bg-emerald-500/5'
              : 'border-paper-300 dark:border-ink-800 hover:border-accent bg-paper-50/50 dark:bg-ink-950/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={type === 'poster' ? 'application/pdf,image/*' : 'application/pdf'}
            onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            {file ? (
              <>
                <FileCheck className="w-10 h-10 text-emerald-500" />
                <p className="font-serif text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
                <span className="text-xs text-paper-700 dark:text-ink-400">
                  ক্লিক করে ফাইল পরিবর্তন করুন
                </span>
              </>
            ) : existingPdfUrl ? (
              <>
                <FileCheck className="w-10 h-10 text-accent" />
                <p className="font-serif text-sm font-medium text-paper-900 dark:text-ink-100">
                  Current Document Attached: {existingPdfUrl}
                </p>
                <span className="text-xs text-accent">
                  নতুন ফাইল দিয়ে প্রতিস্থাপন করতে ক্লিক করুন
                </span>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-accent opacity-75" />
                <p className="font-serif text-sm font-medium text-paper-900 dark:text-ink-100">
                  এখানে PDF ফাইল টেনে এনে ফেলুন অথবা ক্লিক করে নির্বাচন করুন
                </p>
                <p className="text-xs text-paper-700 dark:text-ink-400 font-mono">
                  সর্বোচ্চ ৫০ মেগাবাইট (Supports up to 50MB)
                </p>
              </>
            )}
          </div>
        </div>

        {/* Progress bar during upload */}
        {isUploading && (
          <div className="mt-3">
            <div className="w-full h-1.5 rounded-full bg-paper-300 dark:bg-ink-800 overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[11px] font-mono text-accent mt-1 text-right">
              আপলোড হচ্ছে... {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {/* Optional Cover Image */}
      <div className="p-4 rounded-xl border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950">
        <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-ink-300 mb-1">
          কভার ছবি / Cover Image (ঐচ্ছিক)
        </label>
        <p className="text-xs text-paper-700 dark:text-ink-400 font-serif mb-3">
          কভার ছবি না দিলে অক্ষরায়ণ স্বয়ংক্রিয়ভাবে একটি মার্জিত প্রচ্ছদ তৈরি করে নেবে।
        </p>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-paper-300 dark:border-ink-800 hover:bg-paper-200 dark:hover:bg-ink-850 text-xs font-medium transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-accent" />
            <span>{coverFile ? coverFile.name : 'ছবি নির্বাচন করুন'}</span>
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>
      </div>

      {/* Row 4: Tags & Publishing Status & Featured Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-ink-300 mb-1.5">
            ট্যাগ বা ক্যাটাগরি (কমা দিয়ে লিখুন)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="শিক্ষা, ক্যাম্পাস, দর্শন"
            className="w-full px-3.5 py-2 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-ink-300 mb-1.5">
            স্ট্যাটাস / Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ContentStatus)}
            className="w-full px-3.5 py-2 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-sm focus:outline-none focus:border-accent"
          >
            <option value="published">প্রকাশিত (Published Live)</option>
            <option value="draft">খসড়া (Draft / Private)</option>
          </select>
        </div>

        <div className="flex items-center h-10 gap-2">
          <input
            type="checkbox"
            id="featuredToggle"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 rounded text-accent focus:ring-accent"
          />
          <label
            htmlFor="featuredToggle"
            className="text-xs font-serif text-paper-900 dark:text-ink-100 flex items-center gap-1 cursor-pointer"
          >
            <Star className="w-3.5 h-3.5 text-accent" />
            <span>হোমপেজে ফিচার্ড করুন (Featured)</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-paper-200 dark:border-ink-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg text-xs font-medium text-paper-700 dark:text-ink-300 hover:text-paper-900 dark:hover:text-ink-100"
          >
            বাতিল (Cancel)
          </button>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent text-white dark:text-ink-950 text-xs font-medium hover:bg-accent-hover transition-colors shadow-sm disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>আপলোড হচ্ছে...</span>
            </>
          ) : (
            <span>{isEditing ? 'পরিবর্তন সংরক্ষণ করুন' : 'সাইটে প্রকাশ করুন (Publish Entry)'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
