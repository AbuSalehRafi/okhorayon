# Rafi — Writer, Essayist & Philosopher Personal Website

A calm, serious, and philosophical personal website built for Rafi. Designed for contemplation, deep reading, and scholarly archiving.

---

## 🌟 Key Features

1. **Dashboard Home Page:**
   - Hero with bilingual name & philosophy statement.
   - Unified search across all content types.
   - **Continue Reading** widget that automatically remembers and resumes the last book chapter.
   - Featured piece slot.
   - 5 summary panels (Poems, Articles, Research, Posters, Books) with total counts and 3 newest entries.
   - Interstitial philosopher quotes editable from the admin portal.
   - Latest dispatches feed across all 5 content disciplines.

2. **Five Content Disciplines:**
   - **Poems:** Short meditative verse preserving exact stanza spacing and line breaks.
   - **Articles:** Long-form essays with reading time estimation, tags, and reading progress bar.
   - **Personal Research:** Academic treatises with abstracts, keywords, status badges (*Ongoing* vs *Published*), and PDF downloads.
   - **Posters:** Visual artwork gallery with a full-size modal lightbox and high-resolution download button.
   - **Books & Distraction-Free Reader:** Multi-chapter volumes with Table of Contents, chapter pagination, progress bar, adjustable font size (`A-`, `A`, `A+`, `A++`), and Light / Sepia / Dark theme toggle.

3. **Philosophical Design & Typography:**
   - **Palette:** Soft warm-grey paper for light mode (`#faf8f5`), midnight ink-blue for dark mode (`#080c14`), and warm parchment for reading (`#fbf5e8`).
   - **Accent:** Scholarly antique brass/gold (`#b5873a`). Meets WCAG AA contrast.
   - **Bilingual Support:** Merriweather & Georgia serif for English; Noto Serif Bengali and Noto Sans Bengali for Bengali.
   - **Texture:** Faint paper grain and celestial star-field background.
   - **Motion:** Gentle fades, prefers-reduced-motion compliance.

4. **Private Admin Portal (`/admin`):**
   - Password-protected author sanctuary (default: `rafi2026`).
   - Markdown editor with live split-pane preview.
   - Reorder book chapters with up/down arrows.
   - Image and PDF manuscript upload.
   - Full CRUD for poems, essays, research, posters, books, and quotes.

5. **SEO & Accessibility:**
   - Dynamic `sitemap.xml` and `robots.txt`.
   - RSS 2.0 Feed at `/rss.xml` for articles and poems.
   - Fully semantic HTML, keyboard accessible, visible focus states.

---

## 🚀 Beginner's Setup Guide: Step-by-Step

### 1. Local Development (Instant Out-of-the-Box)

The website is engineered with an intelligent offline mock layer (`lib/starter-data.ts`). You can run and test all features immediately without configuring any cloud accounts first!

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the local development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   - Public Website: [http://localhost:3000](http://localhost:3000)
   - Admin Portal: [http://localhost:3000/admin](http://localhost:3000/admin) (Password: `rafi2026`)
   - RSS Feed: [http://localhost:3000/rss.xml](http://localhost:3000/rss.xml)

---

### 2. Setting Up Supabase (Database, Auth, Storage)

When you are ready to connect to a live cloud database:

#### Step A: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign up for free.
2. Click **New project**, choose an organization, name your project (e.g. `rafi-writer`), set a secure database password, and choose your preferred region.

#### Step B: Run the SQL Schema
1. In your Supabase dashboard, click **SQL Editor** on the left menu.
2. Click **New query**.
3. Copy the entire contents of `supabase/schema.sql` from this repository and paste it into the editor.
4. Click **Run**.
   - *This will automatically create all tables (`poems`, `articles`, `research`, `posters`, `books`, `book_chapters`, `interstitial_quotes`, `profiles`), indexes, Row Level Security (RLS) policies, and storage buckets (`media` and `documents`).*

#### Step C: Configure Local Environment Variables
1. In your Supabase dashboard, go to **Project Settings** (gear icon) -> **API**.
2. Find:
   - **Project URL**
   - **Project API Keys** -> `anon` / `public`
3. In the project root, create a file named `.env.local`:
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_ADMIN_PASSWORD=rafi2026
   ```

---

### 3. Deploying to Vercel

1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "feat: complete production-ready writer website for Rafi"
   git branch -M main
   git remote add origin https://github.com/your-username/rafi-writer.git
   git push -u origin main
   ```

2. Sign in to [https://vercel.com](https://vercel.com).
3. Click **Add New...** -> **Project**.
4. Import your `rafi-writer` repository.
5. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SITE_URL`: `https://your-domain.vercel.app`
   - `NEXT_PUBLIC_SUPABASE_URL`: (from your Supabase dashboard)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (from your Supabase dashboard)
   - `NEXT_PUBLIC_ADMIN_PASSWORD`: (your chosen admin password)
6. Click **Deploy**. Vercel will build and launch your site globally in seconds!

---

## 📂 Project Structure

```text
├── app/
│   ├── (public)/
│   │   ├── poems/               # Poems listing and single poem views
│   │   ├── articles/            # Long-form essays with reading progress
│   │   ├── research/            # Academic research & PDF manuscripts
│   │   ├── posters/             # Poster gallery & lightbox
│   │   ├── books/               # Multi-chapter distraction-free book reader
│   │   └── search/              # Unified site-wide search
│   ├── admin/                   # Secure authoring sanctuary & Markdown editors
│   ├── rss.xml/                 # RSS 2.0 Syndication
│   ├── sitemap.ts               # Dynamic sitemap
│   ├── globals.css              # Custom styling, fonts, and dark/light palettes
│   └── page.tsx                 # The home dashboard
├── components/
│   ├── dashboard/               # Hero, summary panels, continue-reading card
│   ├── reader/                  # Distraction-free reader & font/theme controls
│   ├── posters/                 # Lightbox and image grid
│   ├── markdown/                # Typography-optimized Markdown renderer
│   └── admin/                   # Split-pane live Markdown authoring editor
├── lib/
│   ├── starter-data.ts          # Sample entries in English & Bengali (marked [Sample])
│   ├── types.ts                 # TypeScript type interfaces
│   ├── utils.ts                 # Reading time, Bengali numerals, formatting
│   └── supabase/                # API client & queries
└── supabase/
    └── schema.sql               # Full PostgreSQL tables & RLS security rules
```
