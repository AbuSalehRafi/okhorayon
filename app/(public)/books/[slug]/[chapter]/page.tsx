import React from 'react';
import { notFound } from 'next/navigation';
import { getBookChapter, getBooks } from '@/lib/supabase/api';
import { DistractionFreeReader } from '@/components/reader/distraction-free-reader';

export async function generateStaticParams() {
  const books = await getBooks();
  const params: { slug: string; chapter: string }[] = [];

  for (const book of books) {
    if (book.chapters) {
      for (const chap of book.chapters) {
        params.push({ slug: book.slug, chapter: chap.slug });
      }
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; chapter: string };
}) {
  const result = await getBookChapter(params.slug, params.chapter);
  if (!result) return { title: 'Chapter Not Found' };
  return {
    title: `${result.chapter.title} — ${result.book.title}`,
    description: `Read ${result.chapter.title} from ${result.book.title} by Rafi.`,
  };
}

export default async function ChapterReaderPage({
  params,
}: {
  params: { slug: string; chapter: string };
}) {
  const result = await getBookChapter(params.slug, params.chapter);
  if (!result) notFound();

  return (
    <div className="-mx-6 -my-10">
      <DistractionFreeReader
        book={result.book}
        chapter={result.chapter}
        prevChapter={result.prevChapter}
        nextChapter={result.nextChapter}
      />
    </div>
  );
}
