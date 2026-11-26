'use client';

import React, { useState } from 'react';
import { Download, Loader2, FileDown, Check } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { formatDate } from '@/lib/utils';

interface DynamicPdfButtonProps {
  title: string;
  author?: string;
  category?: string;
  publishedAt?: string;
  excerpt?: string;
  content: string;
  className?: string;
  buttonLabel?: string;
}

export function DynamicPdfButton({
  title,
  author = siteConfig.author || 'রাফি',
  category = 'রচনাবলী',
  publishedAt,
  excerpt,
  content,
  className = '',
  buttonLabel = 'পিডিএফ ডাউনলোড',
}: DynamicPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleDownload = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setIsDone(false);

    try {
      // Dynamic imports to ensure client-side only execution and lightweight bundle
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // 1. Create temporary off-screen container for crisp print rendering
      const printContainer = document.createElement('div');
      printContainer.id = 'dynamic-pdf-render-container';
      printContainer.style.position = 'fixed';
      printContainer.style.left = '-99999px';
      printContainer.style.top = '0';
      printContainer.style.width = '800px';
      printContainer.style.padding = '48px 56px';
      printContainer.style.backgroundColor = '#ffffff';
      printContainer.style.color = '#111827';
      printContainer.style.fontFamily = "'Noto Serif Bengali', 'SolaimanLipi', 'Kalpurush', 'Times New Roman', serif";
      printContainer.style.fontSize = '15px';
      printContainer.style.lineHeight = '1.8';
      printContainer.style.zIndex = '-9999';

      // Clean markdown formatting for printing
      const formattedHtml = content
        .replace(/^### (.*$)/gim, '<h3 style="font-size:18px; font-weight:700; margin: 24px 0 8px 0; color:#0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 style="font-size:20px; font-weight:700; margin: 28px 0 10px 0; color:#0f172a;">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 style="font-size:22px; font-weight:700; margin: 30px 0 12px 0; color:#0f172a;">$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^> (.*$)/gim, '<blockquote style="border-left: 3px solid #b5873a; padding-left: 14px; margin: 16px 0; font-style: italic; color: #475569; background: #fafaf9; padding: 10px 14px; border-radius: 4px;">$1</blockquote>')
        .replace(/^\* (.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 4px;">$1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 4px;">$1</li>')
        .replace(/---/g, '<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />')
        .replace(/\n\s*\n/g, '<p style="margin-bottom: 14px;"></p>')
        .replace(/\n/g, '<br />');

      // 2. Build the complete printable HTML with official watermark
      printContainer.innerHTML = `
        <div style="position: relative; width: 100%; min-height: 1000px;">
          <!-- Subtle Repeating Watermark Background -->
          <div style="position: absolute; inset: 0; pointer-events: none; opacity: 0.045; display: flex; flex-direction: column; justify-content: space-around; align-items: center; z-index: 0; overflow: hidden;">
            <div style="font-size: 80px; font-weight: bold; transform: rotate(-25deg); white-space: nowrap; font-family: serif; color: #000;">${siteConfig.name} &middot; OKHORAYON</div>
            <div style="font-size: 80px; font-weight: bold; transform: rotate(-25deg); white-space: nowrap; font-family: serif; color: #000;">${siteConfig.name} &middot; OKHORAYON</div>
            <div style="font-size: 80px; font-weight: bold; transform: rotate(-25deg); white-space: nowrap; font-family: serif; color: #000;">${siteConfig.name} &middot; OKHORAYON</div>
          </div>

          <!-- Official Document Header -->
          <div style="position: relative; z-index: 1; border-bottom: 2px solid #b5873a; padding-bottom: 18px; margin-bottom: 28px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h2 style="font-size: 26px; font-weight: bold; color: #b5873a; margin: 0; line-height: 1.2;">
                  ${siteConfig.name} <span style="font-size: 14px; font-weight: normal; color: #64748b; font-family: sans-serif;">&middot; ${siteConfig.nameTransliteration}</span>
                </h2>
                <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0; font-family: serif; font-style: italic;">
                  ${siteConfig.tagline}
                </p>
              </div>
              <div style="text-align: right; font-family: sans-serif; font-size: 11px; color: #64748b;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; background-color: #f1f5f9; color: #0f172a; font-weight: 600; text-transform: uppercase; font-size: 10px;">
                  ${category}
                </span>
                <div style="margin-top: 4px;">https://okhorayon.vercel.app</div>
              </div>
            </div>
          </div>

          <!-- Document Title & Meta -->
          <div style="position: relative; z-index: 1; margin-bottom: 24px;">
            <h1 style="font-size: 28px; font-weight: 700; color: #0f172a; line-height: 1.35; margin: 0 0 12px 0;">
              ${title}
            </h1>
            
            <div style="display: flex; align-items: center; gap: 16px; font-size: 12px; color: #64748b; font-family: sans-serif; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
              <span><strong>লেখক / Author:</strong> ${author}</span>
              ${publishedAt ? `<span>&bull;</span><span><strong>তারিখ / Date:</strong> ${formatDate(publishedAt)}</span>` : ''}
              <span>&bull;</span>
              <span><strong>উৎস:</strong> অক্ষরায়ণ উন্মুক্ত পাঠাগার</span>
            </div>

            ${excerpt ? `
              <div style="margin-top: 14px; padding: 12px 16px; background-color: #f8fafc; border-left: 3px solid #b5873a; font-size: 14px; color: #334155; font-style: italic;">
                ${excerpt}
              </div>
            ` : ''}
          </div>

          <!-- Main Document Content -->
          <div style="position: relative; z-index: 1; font-size: 15px; color: #1e293b; text-align: justify; text-justify: inter-word; line-height: 1.9;">
            ${formattedHtml}
          </div>

          <!-- Document Footer -->
          <div style="position: relative; z-index: 1; margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; font-family: sans-serif; display: flex; justify-content: space-between;">
            <span>অক্ষরায়ণ (Okhorayon) &mdash; সর্বস্বত্ব সংরক্ষিত</span>
            <span>পৃষ্ঠা থেকে স্বয়ংক্রিয়ভাবে সংগৃহীত পিডিএফ কপি</span>
          </div>
        </div>
      `;

      document.body.appendChild(printContainer);

      // 3. Render HTML to canvas with high resolution
      const canvas = await html2canvas(printContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Remove temporary DOM container
      document.body.removeChild(printContainer);

      // 4. Create multi-page A4 PDF
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 12;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      let heightLeft = contentHeight;
      let position = margin;
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Page 1
      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight, '', 'FAST');
      heightLeft -= (pageHeight - margin * 2);

      // Subsequent pages for long articles/poems
      while (heightLeft > 0) {
        position = margin - (contentHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight, '', 'FAST');
        heightLeft -= (pageHeight - margin * 2);
      }

      // Add watermark footer with page numbers to every page
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(140, 140, 140);
        pdf.text(
          `${siteConfig.name} (${siteConfig.nameTransliteration})  |  পৃষ্ঠা ${i} / ${totalPages}`,
          pageWidth / 2,
          pageHeight - 6,
          { align: 'center' }
        );
      }

      // 5. Trigger download
      const safeFilename = `${(title || 'okhorayon-document')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\u0980-\u09FF]+/g, '_')
        .slice(0, 50)}.pdf`;

      pdf.save(safeFilename);
      setIsDone(true);
      setTimeout(() => setIsDone(false), 3000);
    } catch (err) {
      console.error('Dynamic PDF generation error:', err);
      alert('পিডিএফ তৈরিতে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isGenerating}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs transition-all shadow-sm ${
        isDone
          ? 'bg-emerald-600 text-white'
          : isGenerating
          ? 'bg-accent/70 text-white cursor-wait'
          : 'bg-accent text-white dark:text-ink-950 hover:bg-accent-hover active:scale-95'
      } ${className}`}
      title="এই রচনার ডায়নামিক পিডিএফ ডাউনলোড করুন"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>পিডিএফ তৈরি হচ্ছে...</span>
        </>
      ) : isDone ? (
        <>
          <Check className="w-3.5 h-3.5" />
          <span>ডাউনলোড সম্পন্ন!</span>
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5" />
          <span>{buttonLabel}</span>
        </>
      )}
    </button>
  );
}
