export type ContentStatus = 'draft' | 'published';

export interface Poem {
  id: string;
  slug: string;
  title: string;
  title_bn?: string;
  content: string; // Stanza & line-break preserved
  content_bn?: string;
  published_at: string;
  status: ContentStatus;
  is_sample: boolean;
  notes?: string;
  tags?: string[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  title_bn?: string;
  excerpt: string;
  content: string; // Markdown
  reading_time_min: number;
  tags: string[];
  status: ContentStatus;
  published_at: string;
  is_sample: boolean;
}

export interface ResearchPaper {
  id: string;
  slug: string;
  title: string;
  title_bn?: string;
  abstract: string;
  keywords: string[];
  content?: string; // Notes / Markdown content
  status: 'ongoing' | 'published';
  pdf_url?: string;
  published_at: string;
  is_sample: boolean;
}

export interface Poster {
  id: string;
  slug: string;
  title: string;
  title_bn?: string;
  description: string;
  image_url: string;
  high_res_url?: string;
  dimensions?: string;
  published_at: string;
  is_sample: boolean;
  status?: ContentStatus;
}

export interface BookChapter {
  id: string;
  book_id: string;
  chapter_number: number;
  slug: string;
  title: string;
  content: string; // Markdown
  reading_time_min: number;
  created_at: string;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  title_bn?: string;
  subtitle?: string;
  description: string;
  cover_image_url: string;
  status: ContentStatus;
  published_at: string;
  is_sample: boolean;
  chapters?: BookChapter[];
}

export interface InterstitialQuote {
  id: string;
  quote_text: string;
  quote_text_bn?: string;
  author: string;
  source?: string;
  display_order: number;
  is_active: boolean;
}

export interface SiteProfile {
  name: string;
  name_bn?: string;
  philosophy_statement: string;
  philosophy_statement_bn?: string;
  bio: string;
}

export type ContentItemUnion =
  | ({ type: 'poem' } & Poem)
  | ({ type: 'article' } & Article)
  | ({ type: 'research' } & ResearchPaper)
  | ({ type: 'poster' } & Poster)
  | ({ type: 'book' } & Book);

export interface ContinueReadingState {
  bookSlug: string;
  bookTitle: string;
  chapterSlug: string;
  chapterTitle: string;
  chapterNumber: number;
  timestamp: number;
  scrollPercent?: number;
}
