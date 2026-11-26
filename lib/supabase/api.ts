import { getContentData } from '@/lib/cloud-db';
import {
  sampleProfile,
  sampleQuotes,
  samplePoems,
  sampleArticles,
  sampleResearch,
  samplePosters,
  sampleBooks,
  sampleFeaturedItem,
} from '@/lib/starter-data';
import {
  Article,
  Book,
  BookChapter,
  ContentItemUnion,
  InterstitialQuote,
  Poem,
  Poster,
  ResearchPaper,
  SiteProfile,
} from '@/lib/types';

// Robust helper to match slugs across raw, decoded, and Bengali characters
function matchesSlug(item: any, rawSlug: string): boolean {
  if (!item || !rawSlug) return false;
  try {
    const decodedQuery = decodeURIComponent(rawSlug).trim().toLowerCase();
    const itemSlug = decodeURIComponent(item.slug || '').trim().toLowerCase();
    const itemId = String(item.id || '').trim().toLowerCase();
    const itemTitle = decodeURIComponent(item.title || '').trim().toLowerCase();
    const itemTitleBn = decodeURIComponent(item.title_bn || '').trim().toLowerCase();

    return (
      itemSlug === decodedQuery ||
      item.slug === rawSlug ||
      itemId === decodedQuery ||
      itemTitle === decodedQuery ||
      itemTitleBn === decodedQuery
    );
  } catch {
    return item.slug === rawSlug || item.id === rawSlug;
  }
}

// 1. PROFILE
export async function getProfile(): Promise<SiteProfile> {
  const data = await getContentData();
  return data.profile || sampleProfile;
}

// 2. QUOTES
export async function getQuotes(): Promise<InterstitialQuote[]> {
  const data = await getContentData();
  const quotes: InterstitialQuote[] = data.quotes || sampleQuotes;
  return quotes.filter((q) => q.is_active);
}

// 3. POEMS
export async function getPoems(): Promise<Poem[]> {
  const data = await getContentData();
  return (data.poems || samplePoems).filter((p: Poem) => p.status === 'published');
}

export async function getAllPoemsAdmin(): Promise<Poem[]> {
  const data = await getContentData();
  return data.poems || samplePoems;
}

export async function getPoemBySlug(slug: string): Promise<Poem | null> {
  const data = await getContentData();
  const poem = (data.poems || samplePoems).find((p: Poem) => matchesSlug(p, slug));
  return poem || null;
}

// 4. ARTICLES
export async function getArticles(): Promise<Article[]> {
  const data = await getContentData();
  return (data.articles || sampleArticles).filter((a: Article) => a.status === 'published');
}

export async function getAllArticlesAdmin(): Promise<Article[]> {
  const data = await getContentData();
  return data.articles || sampleArticles;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const data = await getContentData();
  const article = (data.articles || sampleArticles).find((a: Article) => matchesSlug(a, slug));
  return article || null;
}

// 5. RESEARCH
export async function getResearch(): Promise<ResearchPaper[]> {
  const data = await getContentData();
  return data.research || sampleResearch;
}

export async function getResearchBySlug(slug: string): Promise<ResearchPaper | null> {
  const data = await getContentData();
  const paper = (data.research || sampleResearch).find((r: ResearchPaper) => matchesSlug(r, slug));
  return paper || null;
}

// 6. POSTERS
export async function getPosters(): Promise<Poster[]> {
  const data = await getContentData();
  return (data.posters || samplePosters).filter((p: Poster) => p.status !== 'draft');
}

export async function getAllPostersAdmin(): Promise<Poster[]> {
  const data = await getContentData();
  return data.posters || samplePosters;
}

export async function getPosterBySlug(slug: string): Promise<Poster | null> {
  const data = await getContentData();
  const poster = (data.posters || samplePosters).find((p: Poster) => matchesSlug(p, slug));
  return poster || null;
}

// 7. BOOKS
export async function getBooks(): Promise<Book[]> {
  const data = await getContentData();
  return (data.books || sampleBooks).filter((b: Book) => b.status === 'published');
}

export async function getAllBooksAdmin(): Promise<Book[]> {
  const data = await getContentData();
  return data.books || sampleBooks;
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const data = await getContentData();
  const book = (data.books || sampleBooks).find((b: Book) => matchesSlug(b, slug));
  return book || null;
}

export async function getBookChapter(
  bookSlug: string,
  chapterSlug: string
): Promise<{ book: Book; chapter: BookChapter; prevChapter: BookChapter | null; nextChapter: BookChapter | null } | null> {
  const data = await getContentData();
  const book = (data.books || sampleBooks).find((b: Book) => matchesSlug(b, bookSlug));
  if (!book || !book.chapters) return null;

  const decodedChapSlug = decodeURIComponent(chapterSlug).trim().toLowerCase();
  const currentIndex = book.chapters.findIndex((c: BookChapter) => {
    const cSlug = decodeURIComponent(c.slug || '').trim().toLowerCase();
    return cSlug === decodedChapSlug || c.slug === chapterSlug || c.id === chapterSlug;
  });
  if (currentIndex === -1) return null;

  const chapter = book.chapters[currentIndex];
  const prevChapter = currentIndex > 0 ? book.chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < book.chapters.length - 1 ? book.chapters[currentIndex + 1] : null;

  return { book, chapter, prevChapter, nextChapter };
}

// 8. LATEST ITEMS ACROSS ALL 5 CONTENT TYPES
export async function getLatestFeed(limit = 6): Promise<ContentItemUnion[]> {
  const data = await getContentData();
  const poems: Poem[] = (data.poems || samplePoems).filter((p: Poem) => p.status === 'published');
  const articles: Article[] = (data.articles || sampleArticles).filter((a: Article) => a.status === 'published');
  const research: ResearchPaper[] = data.research || sampleResearch;
  const posters: Poster[] = (data.posters || samplePosters).filter((p: Poster) => p.status !== 'draft');
  const books: Book[] = (data.books || sampleBooks).filter((b: Book) => b.status === 'published');

  const items: ContentItemUnion[] = [
    ...poems.map((p) => ({ ...p, type: 'poem' as const })),
    ...articles.map((a) => ({ ...a, type: 'article' as const })),
    ...research.map((r) => ({ ...r, type: 'research' as const })),
    ...posters.map((post) => ({ ...post, type: 'poster' as const })),
    ...books.map((b) => ({ ...b, type: 'book' as const })),
  ];

  return items
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, limit);
}

// 9. SUMMARY COUNTS & TOP 3 FOR HOMEPAGE
export async function getDashboardSummaries() {
  const data = await getContentData();
  const poems = (data.poems || samplePoems).filter((p: Poem) => p.status === 'published');
  const articles = (data.articles || sampleArticles).filter((a: Article) => a.status === 'published');
  const research = data.research || sampleResearch;
  const posters = (data.posters || samplePosters).filter((p: Poster) => p.status !== 'draft');
  const books = (data.books || sampleBooks).filter((b: Book) => b.status === 'published');

  return {
    poems: {
      count: poems.length,
      recent: poems.slice(0, 3),
    },
    articles: {
      count: articles.length,
      recent: articles.slice(0, 3),
    },
    research: {
      count: research.length,
      recent: research.slice(0, 3),
    },
    posters: {
      count: posters.length,
      recent: posters.slice(0, 3),
    },
    books: {
      count: books.length,
      recent: books.slice(0, 3),
    },
  };
}

// 10. FEATURED ITEM
export async function getFeaturedItem() {
  const data = await getContentData();
  return data.featured || sampleFeaturedItem;
}
