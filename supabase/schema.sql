-- =========================================================================
-- OKHORAYON WRITER WEBSITE - SUPABASE DATABASE SCHEMA
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 0. UNIFIED SITE STORE TABLE (Stores full synced dynamic content & automatically seeds)
CREATE TABLE IF NOT EXISTS public.site_store (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public read and write access to site_store for the writer site
ALTER TABLE public.site_store ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_store" ON public.site_store FOR SELECT USING (true);
CREATE POLICY "Public write site_store" ON public.site_store FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update site_store" ON public.site_store FOR UPDATE USING (true);

-- Storage bucket for uploads (PDFs, Images, Posters, Books)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true) 
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public access to uploads bucket" ON storage.objects 
FOR ALL USING (bucket_id = 'uploads') WITH CHECK (bucket_id = 'uploads');

-- 1. PROFILES TABLE (Rafi's Bio and Philosophy)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Rafi',
    name_bn TEXT DEFAULT 'রাফি',
    philosophy_statement TEXT NOT NULL,
    philosophy_statement_bn TEXT,
    bio TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. POEMS TABLE
CREATE TABLE IF NOT EXISTS public.poems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    title_bn TEXT,
    content TEXT NOT NULL, -- Exact line-breaks and stanzas preserved
    content_bn TEXT,
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    is_sample BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    title_bn TEXT,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL, -- Markdown
    reading_time_min INTEGER DEFAULT 5,
    tags TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    is_sample BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PERSONAL RESEARCH TABLE
CREATE TABLE IF NOT EXISTS public.research (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    title_bn TEXT,
    abstract TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    content TEXT, -- Notes or full paper markdown
    status TEXT NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'published')),
    pdf_url TEXT,
    is_sample BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. POSTERS GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.posters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    title_bn TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    high_res_url TEXT,
    dimensions TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    is_sample BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BOOKS TABLE
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    is_sample BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BOOK CHAPTERS TABLE
CREATE TABLE IF NOT EXISTS public.book_chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL, -- Markdown
    reading_time_min INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (book_id, slug),
    UNIQUE (book_id, chapter_number)
);

-- 8. INTERSTITIAL PHILOSOPHICAL QUOTES
CREATE TABLE IF NOT EXISTS public.interstitial_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_text TEXT NOT NULL,
    quote_text_bn TEXT,
    author TEXT NOT NULL,
    source TEXT,
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SITE SETTINGS (Featured Item, etc.)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- INDEXES FOR FAST PERFORMANCE & FULL-TEXT SEARCH
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_poems_published ON public.poems(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_research_published ON public.research(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posters_published ON public.posters(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_books_published ON public.books(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_book_chapters_book_num ON public.book_chapters(book_id, chapter_number ASC);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Anyone can READ published content; Only authenticated Rafi (admin) can WRITE
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interstitial_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Published poems are viewable by everyone" ON public.poems FOR SELECT USING (status = 'published');
CREATE POLICY "Published articles are viewable by everyone" ON public.articles FOR SELECT USING (status = 'published');
CREATE POLICY "Research is viewable by everyone" ON public.research FOR SELECT USING (true);
CREATE POLICY "Published posters are viewable by everyone" ON public.posters FOR SELECT USING (status = 'published');
CREATE POLICY "Published books are viewable by everyone" ON public.books FOR SELECT USING (status = 'published');
CREATE POLICY "Book chapters are viewable by everyone" ON public.book_chapters FOR SELECT USING (true);
CREATE POLICY "Active quotes are viewable by everyone" ON public.interstitial_quotes FOR SELECT USING (is_active = true);
CREATE POLICY "Site settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);

-- Admin Full Access Policies (Authenticated Rafi)
CREATE POLICY "Admin full access profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access poems" ON public.poems FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access articles" ON public.articles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access research" ON public.research FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access posters" ON public.posters FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access books" ON public.books FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access chapters" ON public.book_chapters FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access quotes" ON public.interstitial_quotes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- STORAGE BUCKETS SETUP (Run in Storage SQL or create in Dashboard)
-- =========================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true) ON CONFLICT (id) DO NOTHING;

-- Public read access on buckets
CREATE POLICY "Public Access Media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Public Access Documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
-- Admin write access on buckets
CREATE POLICY "Admin Upload Media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');
CREATE POLICY "Admin Upload Documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents');
