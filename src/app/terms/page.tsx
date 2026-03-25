// app/terms/page.tsx — server component; data is fetched at build time and
// revalidated every hour.
import React from 'react';
import { Metadata } from 'next';
import DynamicPage from '@/components/common/DynamicPage';
import { apiClient, Page } from '@/lib/api/client';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
    try {
        const res = await apiClient.getPageByType('terms');
        if (res.status && res.data) {
            return {
                title: res.data.meta_title ?? 'Terms and Conditions - NutriBlend Haven',
                description: res.data.meta_description ?? undefined,
            };
        }
    } catch {}
    return { title: 'Terms and Conditions - NutriBlend Haven' };
}

export default async function TermsPage() {
    let pageData: Page | null = null;

    try {
        const res = await apiClient.getPageByType('terms');
        if (res.status && res.data) {
            pageData = res.data;
        }
    } catch (err) {
        console.error('[TermsPage] Failed to fetch page data:', err);
    }

    return <DynamicPage type="terms" initialData={pageData} />;
}
