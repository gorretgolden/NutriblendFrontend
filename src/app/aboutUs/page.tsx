// app/aboutUs/page.tsx — server component; data is fetched at build time and
// revalidated every hour so the page is always fresh but never hits the API
// on every single request.
import React from 'react';
import { Metadata } from 'next';
import DynamicPage from '@/components/common/DynamicPage';
import { apiClient, Page } from '@/lib/api/client';

export const revalidate = 3600; // revalidate every 1 hour

export async function generateMetadata(): Promise<Metadata> {
    try {
        const res = await apiClient.getPageByType('about');
        if (res.status && res.data) {
            return {
                title: res.data.meta_title ?? 'About Us - NutriBlend Haven',
                description: res.data.meta_description ?? undefined,
            };
        }
    } catch {}
    return { title: 'About Us - NutriBlend Haven' };
}

export default async function AboutUsPage() {
    let pageData: Page | null = null;

    try {
        const res = await apiClient.getPageByType('about');
        if (res.status && res.data) {
            pageData = res.data;
        }
    } catch (err) {
        console.error('[AboutUsPage] Failed to fetch page data:', err);
    }

    return <DynamicPage type="about" initialData={pageData} />;
}
