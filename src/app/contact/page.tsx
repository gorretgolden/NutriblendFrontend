// app/contact/page.tsx — server component; data is fetched at build time and
// revalidated every hour.  Contact details are enriched with the public
// settings API so the phone / email / address are always up-to-date.
import React from 'react';
import { Metadata } from 'next';
import DynamicPage from '@/components/common/DynamicPage';
import { apiClient, Page, PageContent } from '@/lib/api/client';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
    try {
        const res = await apiClient.getPageByType('contact');
        if (res.status && res.data) {
            return {
                title: res.data.meta_title ?? 'Contact Us - NutriBlend Haven',
                description: res.data.meta_description ?? undefined,
            };
        }
    } catch {}
    return { title: 'Contact Us - NutriBlend Haven' };
}

export default async function ContactPage() {
    let pageData: Page | null = null;

    try {
        // Fetch the CMS page content and the public settings in parallel.
        const [pageRes, settingsRes] = await Promise.all([
            apiClient.getPageByType('contact'),
            apiClient.getPublicSettings(),
        ]);

        if (pageRes.status && pageRes.data) {
            pageData = { ...pageRes.data };

            // If the settings API returned real contact data, merge it into the
            // contact_info section so we always show the most authoritative values.
            if (settingsRes.status && settingsRes.data) {
                const settings = settingsRes.data;
                pageData = {
                    ...pageData,
                    content: pageData.content.map((section: PageContent) => {
                        if (section.type !== 'contact_info') return section;

                        const mergedDetails: Record<string, string> = {
                            ...(section.contact_details ?? {}),
                        };

                        if (settings.address) mergedDetails['address'] = settings.address;
                        if (settings.phone) mergedDetails['phone'] = settings.phone;
                        if (settings.email) mergedDetails['email'] = settings.email;
                        if (settings.opening_hours) mergedDetails['hours'] = settings.opening_hours;

                        return { ...section, contact_details: mergedDetails };
                    }),
                };
            }
        }
    } catch (err) {
        console.error('[ContactPage] Failed to fetch page data:', err);
    }

    return <DynamicPage type="contact" initialData={pageData} />;
}
