'use client';

import React, { useRef, useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types/product.types';

interface ProductCarouselProps {
  products: Product[];
  title: string;
  subtitle?: string;
  badge?: string;
  viewAllLink?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  title,
  subtitle,
  badge,
  viewAllLink = "#"
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
      setShowArrows(scrollWidth > clientWidth);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    updateScrollState();
    const ref = carouselRef.current;
    if (ref) {
      ref.addEventListener('scroll', updateScrollState);
    }
    window.addEventListener('resize', updateScrollState);
    return () => {
      if (ref) ref.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [products]);

  return (
    <section className="my-8 md:my-14">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {badge && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-200/50 animate-pulse">
                  {badge}
                </span>
              )}
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
            </div>
            {subtitle && (
              <p className="text-gray-500 text-sm md:text-base mt-1">{subtitle}</p>
            )}
          </div>

          <a
            href={viewAllLink}
            className="group inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm md:text-base transition-all duration-300 bg-green-50 hover:bg-green-100 px-5 py-2.5 rounded-full"
          >
            View All
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Carousel */}
        <div className="relative group/carousel">
          {/* Left Arrow */}
          {showArrows && (
            <button
              onClick={() => scroll('left')}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 border border-gray-100 ${canScrollLeft
                  ? 'hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-green-200/50 hover:scale-110 opacity-0 group-hover/carousel:opacity-100'
                  : 'opacity-0 pointer-events-none'
                }`}
              aria-label="Previous products"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Arrow */}
          {showArrows && (
            <button
              onClick={() => scroll('right')}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 border border-gray-100 ${canScrollRight
                  ? 'hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-green-200/50 hover:scale-110 opacity-0 group-hover/carousel:opacity-100'
                  : 'opacity-0 pointer-events-none'
                }`}
              aria-label="Next products"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Gradient fade edges */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-[5] pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-[5] pointer-events-none" />
          )}

          <div
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide gap-5 py-2 px-1 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex-none w-[260px] sm:w-[280px] lg:w-[300px] snap-start"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <ProductCard data={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ProductCarousel;
