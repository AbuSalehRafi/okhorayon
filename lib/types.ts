export type ContentType = 'poem' | 'article' | 'research' | 'poster' | 'book';
export type ContentStatus = 'draft' | 'published' | 'ongoing';

export interface BaseItem {
  id: string;
  type?: ContentType;
  slug: string;
  title: string;
  title_bn?: string;
  author?: string;
  author_bn?: string;
  description?: string;
  description_bn?: string;
  excerpt?: string;
  excerpt_bn?: string;
  abstract?: string;
  abstract_bn?: string;
  form?: string;
  content?: string;
  content_bn?: string;
  pdf_url?: string;
  cover_image_url?: string;
  published_at: string;
  status?: ContentStatus;
  is_featured?: boolean;
  is_sample?: boolean;
  tags?: string[];
  reading_time_min?: number;
}

export interface Poem extends BaseItem {
  type?: 'poem';
  notes?: string;
}

export interface Article extends BaseItem {
  type?: 'article';
}

export interface ResearchPaper extends BaseItem {
  type?: 'research';
  abstract?: string;
  keywords?: string[];
}

export interface Poster extends BaseItem {
  type?: 'poster';
  image_url: string;
  high_res_url?: string;
  dimensions?: string;
}

export interface BookChapter {
  id: string;
  book_id: string;
  chapter_number: number;
  slug: string;
  title: string;
  content: string;
  reading_time_min: number;
  created_at: string;
}

export interface Book extends BaseItem {
  type?: 'book';
  subtitle?: string;
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

export type ContentItemUnion = Poem | Article | ResearchPaper | Poster | Book;

export interface ContinueReadingState {
  bookSlug: string;
  bookTitle: string;
  chapterSlug: string;
  chapterTitle: string;
  chapterNumber: number;
  timestamp: number;
  scrollPercent?: number;
}
