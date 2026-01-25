'use client';

import React, { useEffect, useState } from 'react';
import { apiClient, Page, PageContent } from '@/lib/api/client';

interface DynamicPageProps {
    slug?: string;
    type?: 'about' | 'contact' | 'faq' | 'terms' | 'privacy';
}

const DynamicPage: React.FC<DynamicPageProps> = ({ slug, type }) => {
    const [pageData, setPageData] = useState<Page | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                setLoading(true);
                let response;

                if (type) {
                    response = await apiClient.getPageByType(type);
                } else if (slug) {
                    response = await apiClient.getPage(slug);
                } else {
                    setError('No page identifier provided');
                    setLoading(false);
                    return;
                }

                if (response.status && response.data) {
                    setPageData(response.data);
                } else {
                    setError(response.message || 'Failed to load page content');
                }
            } catch (err) {
                console.error('Error fetching page:', err);
                setError('Failed to load page content');
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [slug, type]);

    const renderSection = (section: PageContent, index: number) => {
        switch (section.type) {
            case 'hero':
                return (
                    <section key={index} className="bg-[#4caf50] text-white py-12 text-center">
                        <div className="container mx-auto px-4">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                {section.heading}
                            </h1>
                            {section.text && (
                                <p className="text-lg md:text-xl max-w-3xl mx-auto">
                                    {section.text}
                                </p>
                            )}
                        </div>
                    </section>
                );

            case 'text':
                return (
                    <div key={index} className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                        {section.heading && (
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                                {section.heading}
                            </h2>
                        )}
                        {section.text && (
                            <p className="text-base sm:text-lg leading-relaxed text-gray-600">
                                {section.text}
                            </p>
                        )}
                    </div>
                );

            case 'features':
                return (
                    <section key={index} className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto">
                            {section.heading && (
                                <header className="text-center mb-12">
                                    <h2 className="text-3xl md:text-4xl font-bold text-[#4caf50]">
                                        {section.heading}
                                    </h2>
                                </header>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                {section.items?.map((item, itemIndex) => (
                                    <div
                                        key={itemIndex}
                                        className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                                    >
                                        {item.icon && (
                                            <div className="text-3xl md:text-4xl mb-4">{item.icon}</div>
                                        )}
                                        <h3 className="text-lg md:text-xl font-semibold text-[#4caf50] mb-3">
                                            {item.title}
                                        </h3>
                                        <div className="w-12 h-1 bg-[#4caf50] my-3"></div>
                                        {item.description && (
                                            <p className="text-sm md:text-base text-gray-600">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );

            case 'faq_item':
                return (
                    <div key={index} className="max-w-4xl mx-auto px-4 py-3">
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">
                                {section.heading}
                            </h3>
                            {section.text && (
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                    {section.text}
                                </p>
                            )}
                        </div>
                    </div>
                );

            case 'contact_info':
                return (
                    <div key={index} className="max-w-4xl mx-auto px-4 py-8">
                        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                                Contact Information
                            </h3>
                            {section.contact_details && (
                                <div className="space-y-4">
                                    {Object.entries(section.contact_details).map(([key, value]) => (
                                        <div key={key} className="flex flex-col sm:flex-row">
                                            <span className="font-semibold text-gray-700 capitalize min-w-[120px] mb-1 sm:mb-0">
                                                {key.replace('_', ' ')}:
                                            </span>
                                            <span className="text-gray-600">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#4caf50] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading page content...</p>
                </div>
            </div>
        );
    }

    if (error || !pageData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Oops!</h2>
                        <p className="text-red-700 mb-4">{error || 'Page not found'}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-[#4caf50] text-white px-8 py-3 rounded-lg hover:bg-[#45a049] transition-colors font-semibold"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Render metadata */}
            {typeof document !== 'undefined' && pageData.meta_title && (
                <title>{pageData.meta_title}</title>
            )}

            {/* Render all content sections */}
            {pageData.content.map((section, index) => renderSection(section, index))}
        </div>
    );
};

export default DynamicPage;
