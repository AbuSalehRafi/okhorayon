'use client';

import React, { useState } from 'react';
import { Download, ExternalLink, FileText, Maximize2, Minimize2 } from 'lucide-react';

interface PdfViewerProps {
  url: string;
  title: string;
  className?: string;
}

export function PdfViewer({ url, title, className = '' }: PdfViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div
      className={`border border-paper-300 dark:border-ink-800 rounded-xl overflow-hidden bg-paper-100/50 dark:bg-ink-900/60 transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl bg-paper-50 dark:bg-ink-950 flex flex-col' : className
      }`}
    >
      {/* Viewer Action Bar */}
      <div className="px-4 py-3 bg-paper-200/60 dark:bg-ink-850/80 border-b border-paper-300 dark:border-ink-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-serif text-paper-900 dark:text-ink-100 truncate">
          <FileText className="w-4 h-4 text-accent shrink-0" />
          <span className="truncate font-medium">{title}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded hover:bg-paper-300 dark:hover:bg-ink-800 text-paper-700 dark:text-ink-300 transition-colors"
            title="Open in new window"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded hover:bg-paper-300 dark:hover:bg-ink-800 text-paper-700 dark:text-ink-300 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <a
            href={url}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent text-white dark:text-ink-950 text-xs font-medium hover:bg-accent-hover transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {/* Embedded PDF iframe */}
      <div className={`w-full ${isFullscreen ? 'flex-1' : 'h-[650px] md:h-[800px]'}`}>
        <iframe
          src={`${url}#toolbar=1&navpanes=0&scrollbar=1`}
          title={title}
          className="w-full h-full border-0 bg-paper-50 dark:bg-ink-950"
        />
      </div>
    </div>
  );
}
