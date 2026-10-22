/**
 * Environment-derived URLs with production-safe fallbacks.
 * Production builds must never fall back to localhost.
 */

export const PRODUCTION_API_BASE = 'https://admin.rasmuspharmaceuticals.com/api/v1';

const isLocalUrl = (url: string) => /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(url);

/** Resolved API base URL (includes /api/v1) for the current environment. */
export const getApiBaseUrl = (): string => {
    const envApi = process.env.NEXT_PUBLIC_API_URL || '';
    const isDev = process.env.NODE_ENV === 'development';
    if (envApi && !(!isDev && isLocalUrl(envApi))) return envApi;
    return PRODUCTION_API_BASE;
};

/** Backend origin without the /api/v1 suffix, for Laravel web routes (OAuth). */
export const getBackendBaseUrl = (): string => getApiBaseUrl().replace(/\/api\/v1\/?$/, '');
