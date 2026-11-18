import { MetadataRoute } from 'next';
import {
  getPoems,
  getArticles,
  getResearch,
  getPosters,
  getBooks,
} from '@/lib/supabase/api';
import { siteConfig } from '@/lib/site-config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  const [poems, articles, research, posters, books] = await Promise.all([
    getPoems(),
    getArticles(),
    getResearch(),
    getPosters(),
    getBooks(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/poems`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/research`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/posters`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/books`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const poemRoutes: MetadataRoute.Sitemap = poems.map((p) => ({
    url: `${baseUrl}/poems/${p.slug}`,
    lastModified: new Date(p.published_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/articles/${a.slug}`,
    lastModified: new Date(a.published_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const researchRoutes: MetadataRoute.Sitemap = research.map((r) => ({
    url: `${baseUrl}/research/${r.slug}`,
    lastModified: new Date(r.published_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const posterRoutes: MetadataRoute.Sitemap = posters.map((post) => ({
    url: `${baseUrl}/posters/${post.slug}`,
    lastModified: new Date(post.published_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const bookRoutes: MetadataRoute.Sitemap = books.map((b) => ({
    url: `${baseUrl}/books/${b.slug}`,
    lastModified: new Date(b.published_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...poemRoutes,
    ...articleRoutes,
    ...researchRoutes,
    ...posterRoutes,
    ...bookRoutes,
  ];
}
