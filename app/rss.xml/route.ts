import { NextResponse } from 'next/server';
import { sampleArticles, samplePoems } from '@/lib/starter-data';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rafi-writer.vercel.app';

  const feedItems = [
    ...sampleArticles.map((a) => ({
      title: a.title,
      description: a.excerpt,
      link: `${baseUrl}/articles/${a.slug}`,
      pubDate: new Date(a.published_at).toUTCString(),
      category: 'Article',
    })),
    ...samplePoems.map((p) => ({
      title: p.title,
      description: p.content.slice(0, 150),
      link: `${baseUrl}/poems/${p.slug}`,
      pubDate: new Date(p.published_at).toUTCString(),
      category: 'Poem',
    })),
  ].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Rafi — Writer, Essayist &amp; Philosopher</title>
    <link>${baseUrl}</link>
    <description>Thinking in the margin of silence; observing where thought meets stillness.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${feedItems
      .map(
        (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid>${item.link}</guid>
      <category>${item.category}</category>
      <pubDate>${item.pubDate}</pubDate>
      <description><![CDATA[${item.description}]]></description>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
