import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rasmuspharmaceuticals.com';

// Pages that require login or are transactional are deliberately excluded.
const NO_INDEX = ['/cart', '/login', '/auth/reset-password', '/auth/social-callback', '/verify-email', '/account', '/wholesale-registration'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: NO_INDEX,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
