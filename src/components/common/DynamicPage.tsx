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
            <div className="min-h-screen bg-white">
                {/* Hero Skeleton */}
                <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer h-48" />

                {/* Content Skeleton */}
                <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
                    {/* Title Skeleton */}
                    <div className="space-y-4">
                        <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-3/4" />
                        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-full" />
                        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-5/6" />
                    </div>

                    {/* Feature Grid Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                                <div className="h-12 w-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-full" />
                                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-4/5" />
                                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-full" />
                                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-3/4" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !pageData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center max-w-md mx-auto px-4">
                    {/* Error Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>

                    {/* Error Message */}
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        {error || 'We couldn\'t find the page you\'re looking for.'}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#4caf50] text-white px-8 py-3 rounded-lg hover:bg-[#45a049] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-white text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 font-semibold border-2 border-gray-200 hover:border-gray-300"
                        >
                            Go Home
                        </button>
                    </div>
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
