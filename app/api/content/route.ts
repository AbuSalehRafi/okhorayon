import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getContentData, saveContentData } from '@/lib/cloud-db';

export async function GET() {
  const data = await getContentData();
  return NextResponse.json(data || {});
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    const data = await getContentData();
    if (!data) {
      return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }

    switch (action) {
      // UNIFIED SAVE ITEM (Poems, Articles, Research, Posters, Books)
      case 'save_item': {
        const item = payload;
        const type = item.type; // 'poem' | 'article' | 'research' | 'poster' | 'book'
        const collectionKey =
          type === 'poem'
            ? 'poems'
            : type === 'article' || type === 'story'
            ? 'articles'
            : type === 'research'
            ? 'research'
            : type === 'poster'
            ? 'posters'
            : 'books';

        if (!data[collectionKey]) data[collectionKey] = [];

        const index = data[collectionKey].findIndex((x: any) => x.id === item.id);
        if (index >= 0) {
          data[collectionKey][index] = { ...data[collectionKey][index], ...item };
        } else {
          data[collectionKey].unshift(item);
        }

        // If marked as featured, update the featured item slot
        if (item.is_featured) {
          data.featured = {
            type: item.type,
            title: item.title || item.title_bn,
            subtitle: item.description || item.excerpt || '',
            slug: item.slug,
            excerpt: item.description || item.excerpt || '',
            badge: 'নির্বাচিত রচনা',
            link: `/${collectionKey}/${item.slug}`,
          };
        }
        break;
      }

      // UNIFIED DELETE ITEM
      case 'delete_item': {
        const { id, type } = payload;
        const collectionKey =
          type === 'poem'
            ? 'poems'
            : type === 'article' || type === 'story'
            ? 'articles'
            : type === 'research'
            ? 'research'
            : type === 'poster'
            ? 'posters'
            : 'books';

        if (data[collectionKey]) {
          data[collectionKey] = data[collectionKey].filter((x: any) => x.id !== id);
        }
        break;
      }

      // TOGGLE PUBLISH / UNPUBLISH
      case 'toggle_publish': {
        const { id, type } = payload;
        const collectionKey =
          type === 'poem'
            ? 'poems'
            : type === 'article' || type === 'story'
            ? 'articles'
            : type === 'research'
            ? 'research'
            : type === 'poster'
            ? 'posters'
            : 'books';

        const item = (data[collectionKey] || []).find((x: any) => x.id === id);
        if (item) {
          item.status = item.status === 'published' ? 'draft' : 'published';
        }
        break;
      }

      // UPDATE PROFILE & PHILOSOPHY STATEMENT
      case 'update_profile': {
        data.profile = { ...data.profile, ...payload };
        break;
      }

      // GRANULAR COMPATIBILITY ACTIONS
      case 'save_poem': {
        const poem = payload;
        const index = data.poems.findIndex((p: any) => p.id === poem.id);
        if (index >= 0) data.poems[index] = poem;
        else data.poems.unshift(poem);
        break;
      }
      case 'delete_poem': {
        data.poems = data.poems.filter((p: any) => p.id !== payload.id);
        break;
      }

      case 'save_article': {
        const article = payload;
        const index = data.articles.findIndex((a: any) => a.id === article.id);
        if (index >= 0) data.articles[index] = article;
        else data.articles.unshift(article);
        break;
      }
      case 'delete_article': {
        data.articles = data.articles.filter((a: any) => a.id !== payload.id);
        break;
      }

      case 'save_research': {
        const research = payload;
        const index = data.research.findIndex((r: any) => r.id === research.id);
        if (index >= 0) data.research[index] = research;
        else data.research.unshift(research);
        break;
      }
      case 'delete_research': {
        data.research = data.research.filter((r: any) => r.id !== payload.id);
        break;
      }

      case 'save_poster': {
        const poster = payload;
        const index = data.posters.findIndex((p: any) => p.id === poster.id);
        if (index >= 0) data.posters[index] = poster;
        else data.posters.unshift(poster);
        break;
      }
      case 'delete_poster': {
        data.posters = data.posters.filter((p: any) => p.id !== payload.id);
        break;
      }

      case 'update_book_chapters': {
        const { bookId, chapters } = payload;
        const book = data.books.find((b: any) => b.id === bookId);
        if (book) book.chapters = chapters;
        break;
      }

      case 'save_quote': {
        const quote = payload;
        const index = data.quotes.findIndex((q: any) => q.id === quote.id);
        if (index >= 0) data.quotes[index] = quote;
        else data.quotes.push(quote);
        break;
      }
      case 'delete_quote': {
        data.quotes = data.quotes.filter((q: any) => q.id !== payload.id);
        break;
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    await saveContentData(data);
    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      // safe fallback
    }
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
