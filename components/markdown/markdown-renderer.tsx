import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose-reading ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-paper-900 dark:text-ink-100 mt-8 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl md:text-2xl font-serif font-medium text-paper-900 dark:text-ink-100 mt-7 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg md:text-xl font-sans font-semibold text-paper-800 dark:text-ink-200 mt-6 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-paper-800 dark:text-ink-200 leading-[1.8] mb-5 text-[1.125rem]">
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent pl-5 my-6 italic text-paper-700 dark:text-ink-300 font-serif">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 my-4 space-y-2 text-paper-800 dark:text-ink-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 my-4 space-y-2 text-paper-800 dark:text-ink-200">
              {children}
            </ol>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 rounded bg-paper-200 dark:bg-ink-800 text-paper-900 dark:text-ink-100 font-mono text-sm">
                  {children}
                </code>
              );
            }
            return (
              <pre className="p-4 rounded-lg bg-paper-200/70 dark:bg-ink-900 border border-paper-300 dark:border-ink-800 overflow-x-auto my-6 text-sm font-mono text-paper-900 dark:text-ink-200">
                <code>{children}</code>
              </pre>
            );
          },
          hr: () => (
            <div className="flex items-center justify-center my-8">
              <span className="w-16 h-[1px] bg-paper-300 dark:bg-ink-800" />
              <span className="mx-3 text-accent text-xs">&diams;</span>
              <span className="w-16 h-[1px] bg-paper-300 dark:bg-ink-800" />
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
