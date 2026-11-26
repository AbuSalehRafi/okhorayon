import React from 'react';
import { notFound } from 'next/navigation';
import { getBookChapter, getBooks } from '@/lib/supabase/api';
import { DistractionFreeReader } from '@/components/reader/distraction-free-reader';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: { slug: string; chapter: string };
}) {
  const bookSlug = decodeURIComponent(params.slug);
  const chapterSlug = decodeURIComponent(params.chapter);
  const result = await getBookChapter(bookSlug, chapterSlug);
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
  const bookSlug = decodeURIComponent(params.slug);
  const chapterSlug = decodeURIComponent(params.chapter);
  const result = await getBookChapter(bookSlug, chapterSlug);
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
