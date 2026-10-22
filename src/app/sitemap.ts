import type { MetadataRoute } from 'next';
import { getApiBaseUrl } from '@/lib/utils/env';

// Required so `output: 'export'` writes out/sitemap.xml instead of dropping it.
export const dynamic = 'force-static';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rasmuspharmaceuticals.com';
const API_URL = getApiBaseUrl();

const STATIC_PATHS: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
  { path: '', priority: 1.0, changeFrequency: 'daily' },
  { path: '/shop', priority: 0.9, changeFrequency: 'daily' },
  { path: '/products', priority: 0.8, changeFrequency: 'daily' },
  { path: '/brands', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/wellness', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/aboutUs', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
];

type ApiProduct = { id: number; slug?: string; status?: boolean };

async function fetchProductPaths(): Promise<MetadataRoute.Sitemap> {
  if (!API_URL) return [];
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(`${API_URL}/products?per_page=100`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return [];
    const body = await res.json();
    const items: ApiProduct[] = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
    return items
      .filter((p) => p && typeof p.id === 'number')
      .map((p) => ({
        url: `${SITE_URL}/shop/product/${p.id}/${p.slug || 'p'}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch {
    // Build must not fail because the API was unreachable
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: new Date(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  return [...staticEntries, ...(await fetchProductPaths())];
}
