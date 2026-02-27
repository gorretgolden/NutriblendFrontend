'use client';

import React, { useEffect, useState } from 'react';
import { apiClient, Page, PageContent } from '@/lib/api/client';

const DynamicAboutUs = () => {
  const [pageData, setPageData] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutPage = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getPageByType('about');

        if (response.status && response.data) {
          setPageData(response.data);
        } else {
          setError('Failed to load About page content');
        }
      } catch (err) {
        console.error('Error fetching About page:', err);
        setError('Failed to load page content');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPage();
  }, []);

  const renderSection = (section: PageContent, index: number) => {
    switch (section.type) {
      case 'hero':
        return (
          <section key={index} className="bg-[#4caf50] text-white py-9 text-center">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {section.heading}
              </h1>
              {section.text && (
                <p className="text-xl">{section.text}</p>
              )}
            </div>
          </section>
        );

      case 'text':
        return (
          <div key={index} className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-8">
              {section.heading}
            </h2>
            <p className="text-lg sm:text-xl leading-relaxed text-gray-600">
              {section.text}
            </p>
          </div>
        );

      case 'features':
        return (
          <section key={index} className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <header className="text-center mb-16">
                <h2 className="text-4xl font-bold text-[#4caf50] mb-4">
                  {section.heading}
                </h2>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {section.items?.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:-translate-y-2"
                  >
                    {item.icon && (
                      <div className="text-4xl mb-4">{item.icon}</div>
                    )}
                    <h3 className="text-xl font-semibold text-[#4caf50] mb-3">
                      {item.title}
                    </h3>
                    <div className="w-12 h-1 bg-[#4caf50] my-4"></div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'faq_item':
        return (
          <div key={index} className="max-w-4xl mx-auto px-4 py-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {section.heading}
              </h3>
              <p className="text-gray-600">{section.text}</p>
            </div>
          </div>
        );

      case 'contact_info':
        return (
          <div key={index} className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Contact Information
              </h3>
              {section.contact_details && (
                <div className="space-y-4">
                  {Object.entries(section.contact_details).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-semibold text-gray-700 capitalize">
                        {key.replace('_', ' ')}:
                      </span>{' '}
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4caf50]"></div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || 'Page not found'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#4caf50] text-white px-6 py-2 rounded hover:bg-[#45a049]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {pageData.content.map((section, index) => renderSection(section, index))}
    </div>
  );
};

export default DynamicAboutUs;
