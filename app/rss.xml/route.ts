import { NextResponse } from 'next/server';
import { getArticles, getPoems } from '@/lib/supabase/api';
import { siteConfig } from '@/lib/site-config';

export async function GET() {
  const baseUrl = siteConfig.url;

  const [articles, poems] = await Promise.all([
    getArticles(),
    getPoems(),
  ]);

  const feedItems = [
    ...articles.map((a) => ({
      title: a.title || a.title_bn || 'Untitled Article',
      description: a.excerpt || a.excerpt_bn || '',
      link: `${baseUrl}/articles/${a.slug}`,
      pubDate: new Date(a.published_at).toUTCString(),
      category: 'Article',
    })),
    ...poems.map((p) => ({
      title: p.title || p.title_bn || 'Untitled Poem',
      description: (p.content || p.content_bn || '').slice(0, 150),
      link: `${baseUrl}/poems/${p.slug}`,
      pubDate: new Date(p.published_at).toUTCString(),
      category: 'Poem',
    })),
  ].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name} (${siteConfig.nameTransliteration})</title>
    <link>${baseUrl}</link>
    <description>${siteConfig.tagline}</description>
    <language>bn-BD</language>
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
