import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'content.json');

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading data file:', err);
    return null;
  }
}

async function writeData(data: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  const data = await readData();
  return NextResponse.json(data || {});
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    const data = await readData();
    if (!data) {
      return NextResponse.json({ error: 'Failed to read data file' }, { status: 500 });
    }

    switch (action) {
      case 'save_poem': {
        const poem = payload;
        const index = data.poems.findIndex((p: any) => p.id === poem.id);
        if (index >= 0) {
          data.poems[index] = poem;
        } else {
          data.poems.unshift(poem);
        }
        break;
      }
      case 'delete_poem': {
        data.poems = data.poems.filter((p: any) => p.id !== payload.id);
        break;
      }

      case 'save_article': {
        const article = payload;
        const index = data.articles.findIndex((a: any) => a.id === article.id);
        if (index >= 0) {
          data.articles[index] = article;
        } else {
          data.articles.unshift(article);
        }
        break;
      }
      case 'delete_article': {
        data.articles = data.articles.filter((a: any) => a.id !== payload.id);
        break;
      }

      case 'save_research': {
        const research = payload;
        const index = data.research.findIndex((r: any) => r.id === research.id);
        if (index >= 0) {
          data.research[index] = research;
        } else {
          data.research.unshift(research);
        }
        break;
      }
      case 'delete_research': {
        data.research = data.research.filter((r: any) => r.id !== payload.id);
        break;
      }

      case 'save_poster': {
        const poster = payload;
        const index = data.posters.findIndex((p: any) => p.id === poster.id);
        if (index >= 0) {
          data.posters[index] = poster;
        } else {
          data.posters.unshift(poster);
        }
        break;
      }
      case 'delete_poster': {
        data.posters = data.posters.filter((p: any) => p.id !== payload.id);
        break;
      }

      case 'save_book': {
        const book = payload;
        const index = data.books.findIndex((b: any) => b.id === book.id);
        if (index >= 0) {
          data.books[index] = { ...data.books[index], ...book };
        } else {
          data.books.unshift(book);
        }
        break;
      }
      case 'update_book_chapters': {
        const { bookId, chapters } = payload;
        const book = data.books.find((b: any) => b.id === bookId);
        if (book) {
          book.chapters = chapters;
        }
        break;
      }

      case 'save_quote': {
        const quote = payload;
        const index = data.quotes.findIndex((q: any) => q.id === quote.id);
        if (index >= 0) {
          data.quotes[index] = quote;
        } else {
          data.quotes.push(quote);
        }
        break;
      }
      case 'delete_quote': {
        data.quotes = data.quotes.filter((q: any) => q.id !== payload.id);
        break;
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    await writeData(data);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
