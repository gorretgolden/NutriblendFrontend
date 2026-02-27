/**
 * Environment Configuration
 * Centralized environment variables with validation
 */

interface EnvConfig {
    apiUrl: string;
    assetUrl: string;
    siteUrl: string;
    googleAnalyticsId?: string;
    isProd: boolean;
    isDev: boolean;
    isTest: boolean;
}

function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue;
    if (!value && !defaultValue) {
        console.warn(`Missing environment variable: ${key}`);
    }
    return value || '';
}

export const env: EnvConfig = {
    apiUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:8000/api/v1'),
    assetUrl: getEnvVar('NEXT_PUBLIC_ASSET_URL', 'http://localhost:8000'),
    siteUrl: getEnvVar('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000'),
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    isProd: process.env.NODE_ENV === 'production',
    isDev: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test',
};

// Validate critical environment variables
if (typeof window === 'undefined') {
    const requiredEnvVars = ['NEXT_PUBLIC_API_URL'];
    const missingVars = requiredEnvVars.filter(
        (varName) => !process.env[varName]
    );

    if (missingVars.length > 0 && env.isProd) {
        console.error(
            `Missing required environment variables: ${missingVars.join(', ')}`
        );
    }
}

export default env;
