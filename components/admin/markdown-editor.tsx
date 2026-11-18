'use client';

import React, { useState } from 'react';
import { MarkdownRenderer } from '../markdown/markdown-renderer';
import { Bold, Code, Eye, Heading, Italic, List, Quote, SplitSquareVertical } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your thoughts in Markdown...',
  minHeight = '360px',
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview' | 'split'>('split');

  const insertSyntax = (prefix: string, suffix: string = '') => {
    onChange(`${value}${prefix}text${suffix}`);
  };

  return (
    <div className="border border-paper-300 dark:border-ink-800 rounded-lg overflow-hidden bg-paper-50 dark:bg-ink-950 flex flex-col shadow-sm">
      {/* Editor Toolbar */}
      <div className="px-3 py-2 bg-paper-100 dark:bg-ink-900 border-b border-paper-300 dark:border-ink-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertSyntax('**', '**')}
            className="p-1.5 rounded hover:bg-paper-200 dark:hover:bg-ink-800 text-paper-700 dark:text-ink-300"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('*', '*')}
            className="p-1.5 rounded hover:bg-paper-200 dark:hover:bg-ink-800 text-paper-700 dark:text-ink-300"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('### ')}
            className="p-1.5 rounded hover:bg-paper-200 dark:hover:bg-ink-800 text-paper-700 dark:text-ink-300"
            title="Heading"
          >
            <Heading className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('> ')}
            className="p-1.5 rounded hover:bg-paper-200 dark:hover:bg-ink-800 text-paper-700 dark:text-ink-300"
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('- ')}
            className="p-1.5 rounded hover:bg-paper-200 dark:hover:bg-ink-800 text-paper-700 dark:text-ink-300"
            title="List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('```\n', '\n```')}
            className="p-1.5 rounded hover:bg-paper-200 dark:hover:bg-ink-800 text-paper-700 dark:text-ink-300"
            title="Code Block"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 border border-paper-300 dark:border-ink-800 rounded p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-2 py-0.5 rounded ${
              activeTab === 'write'
                ? 'bg-accent text-white dark:text-ink-950 font-medium'
                : 'text-paper-700 dark:text-ink-400'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`hidden md:block px-2 py-0.5 rounded ${
              activeTab === 'split'
                ? 'bg-accent text-white dark:text-ink-950 font-medium'
                : 'text-paper-700 dark:text-ink-400'
            }`}
          >
            Split
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2 py-0.5 rounded flex items-center gap-1 ${
              activeTab === 'preview'
                ? 'bg-accent text-white dark:text-ink-950 font-medium'
                : 'text-paper-700 dark:text-ink-400'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-paper-300 dark:divide-ink-800">
        {/* Write Pane */}
        {(activeTab === 'write' || activeTab === 'split') && (
          <div className={activeTab === 'write' ? 'md:col-span-2' : ''}>
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              style={{ minHeight }}
              className="w-full h-full p-4 bg-transparent text-paper-900 dark:text-ink-100 font-mono text-sm leading-relaxed focus:outline-none resize-y"
            />
          </div>
        )}

        {/* Live Preview Pane */}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div
            className={`p-4 bg-paper-100/50 dark:bg-ink-900/30 overflow-y-auto ${
              activeTab === 'preview' ? 'md:col-span-2' : ''
            }`}
            style={{ minHeight, maxHeight: '600px' }}
          >
            {value.trim() ? (
              <MarkdownRenderer content={value} />
            ) : (
              <p className="text-xs italic text-paper-700 dark:text-ink-400 font-serif">
                Live Markdown preview will render here...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
