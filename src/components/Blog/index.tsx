'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';

interface WellnessArticle {
  id: number;
  title: string;
  slug: string;
  image?: string;
  excerpt?: string;
  meta_description?: string;
}

// Fallback static articles when no blog pages exist in the backend
const fallbackArticles: WellnessArticle[] = [
  {
    id: 1,
    title: 'The 7 Best Immune Supplements For Kids',
    slug: 'immune-supplements-for-kids',
    image: '/images/bottle2.avif',
    excerpt: 'Discover the top immune-boosting supplements that are safe and effective for children.',
  },
  {
    id: 2,
    title: 'Top 5 Tips To Thrive in Menopause & Beyond',
    slug: 'menopause-tips',
    image: '/images/bottle3.avif',
    excerpt: 'Natural strategies and supplements to make menopause manageable.',
  },
  {
    id: 3,
    title: 'Buffered Vitamin C With Bioflavonoids',
    slug: 'buffered-vitamin-c',
    image: '/images/bottle4.avif',
    excerpt: 'Why buffered vitamin C is gentler on your stomach and more effective.',
  },
  {
    id: 4,
    title: "How Vitamin D Affects Your Brain",
    slug: 'vitamin-d-brain',
    image: '/images/bottle5.avif',
    excerpt: "A doctor's guide to the cognitive benefits of optimal vitamin D levels.",
  },
  {
    id: 5,
    title: 'How To Start Working Out Again',
    slug: 'start-working-out',
    image: '/images/bottle6.avif',
    excerpt: 'A 7-step guide to getting back into fitness after a long break.',
  },
  {
    id: 6,
    title: 'Oil Of Oregano For Cold & Flu',
    slug: 'oregano-oil-cold-flu',
    image: '/images/bottle7.avif',
    excerpt: 'This powerful natural remedy can help you fight seasonal illness.',
  },
];

const WellnessHub = () => {
  const [articles, setArticles] = useState<WellnessArticle[]>(fallbackArticles);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await apiClient.getPages('blog');
        if (response.status && response.data && Array.isArray(response.data) && response.data.length > 0) {
          const mapped: WellnessArticle[] = response.data
            .filter((p: any) => p.is_active !== false)
            .map((page: any) => ({
              id: page.id,
              title: page.title,
              slug: page.slug,
              image: page.content?.image || page.content?.featured_image || '/images/bottle2.avif',
              excerpt: page.meta_description || page.content?.excerpt || '',
            }));
          if (mapped.length > 0) setArticles(mapped);
        }
      } catch (error) {
        // Use fallback
      }
    };
    fetchArticles();
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener('scroll', checkScroll);
    return () => el?.removeEventListener('scroll', checkScroll);
  }, [articles]);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60" />
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-1.5 rounded-full mb-3">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-emerald-700 text-[11px] font-bold tracking-[0.15em] uppercase">Wellness Hub</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              Health & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Wellness</span> Tips
            </h2>
            <p className="text-gray-500 mt-2 text-sm md:text-base">Expert insights to help you live your healthiest life</p>
          </div>

          {/* Navigation arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border-2 border-emerald-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border-2 border-emerald-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Articles Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {articles.map((article, idx) => (
            <Link
              key={article.id}
              href={`/${article.slug}`}
              className="flex-shrink-0 w-[250px] sm:w-[280px] group snap-start"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all duration-500">
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={article.image || '/images/bottle2.avif'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  {/* Reading badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <span className="text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                      {idx < 2 ? 'Popular' : idx < 4 ? 'Trending' : 'New'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-gray-900 font-bold text-[15px] leading-snug mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors duration-300">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold group-hover:gap-2.5 transition-all duration-300">
                    Read More
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Wellness Hub CTA card */}
          <Link
            href="/shop"
            className="flex-shrink-0 w-[250px] sm:w-[280px] snap-start"
          >
            <div className="h-full bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-emerald-200/50 hover:-translate-y-1 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center min-h-[320px] relative">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5 backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-extrabold text-2xl mb-2 tracking-tight">
                  WELLNESS<br />HUB
                </h3>
                <p className="text-white/60 text-sm mb-5">Explore our full collection of health products</p>
                <span className="inline-flex items-center gap-2 bg-white/10 px-5 py-2.5 rounded-full text-white text-sm font-semibold backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                  Shop Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WellnessHub;
