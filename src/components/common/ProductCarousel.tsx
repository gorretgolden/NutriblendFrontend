'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Product } from '@/types/product.types';

interface ProductCarouselProps {
  products: Product[];
  title: string;
  subtitle?: string;
  badge?: string;
  viewAllLink?: string;
  hideHeader?: boolean;
  autoPlay?: boolean;
  interval?: number;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  title,
  subtitle,
  badge,
  viewAllLink = "#",
  hideHeader = false,
  autoPlay = true,
  interval = 5000
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

  const [isPaused, setIsPaused] = useState(false);
  const [isWindowScrolling, setIsWindowScrolling] = useState(false);

  useEffect(() => {
    updateScrollState();
    const ref = carouselRef.current;
    if (ref) {
      ref.addEventListener('scroll', updateScrollState);
    }
    window.addEventListener('resize', updateScrollState);

    // Pause on window scroll
    let scrollTimeout: NodeJS.Timeout;
    const handleWindowScroll = () => {
      setIsWindowScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsWindowScrolling(false), 200);
    };
    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    // Auto-play logic
    let autoPlayTimer: NodeJS.Timeout;
    if (autoPlay && products.length > 0 && !isPaused && !isWindowScrolling) {
      autoPlayTimer = setInterval(() => {
        if (carouselRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
          // If we're at the end, scroll back to the start
          if (scrollLeft >= scrollWidth - clientWidth - 5) {
            carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scroll('right');
          }
        }
      }, interval);
    }

    return () => {
      if (ref) ref.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      window.removeEventListener('scroll', handleWindowScroll);
      if (autoPlayTimer) clearInterval(autoPlayTimer);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [products, autoPlay, interval, isPaused, isWindowScrolling]);

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  return (
    <section className={hideHeader ? "my-0" : "my-6 sm:my-8 md:my-14"}>
      <div className={hideHeader ? "" : "max-w-[1600px] mx-auto px-4 sm:px-6"}>
        {/* Header */}
        {!hideHeader && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 sm:mb-8 gap-2 sm:gap-3">
            <div>
              <div className="flex items-center gap-3 mb-1">
                {badge && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#009E3C] text-white shadow-md shadow-[#009E3C]/25 animate-pulse">
                    {badge}
                  </span>
                )}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
              </div>
              {subtitle && (
                <p className="text-gray-500 text-sm md:text-base mt-1">{subtitle}</p>
              )}
            </div>

            <a
              href={viewAllLink}
              className="group inline-flex items-center gap-1.5 sm:gap-2 text-green-600 hover:text-green-700 font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 bg-green-50 hover:bg-green-100 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full"
            >
              View All
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}

        {/* Carousel */}
        <div className="relative group/carousel">
          {/* Left Arrow */}
          {showArrows && (
            <button
              onClick={() => scroll('left')}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 border border-gray-100 ${canScrollLeft
                ? 'hover:bg-[#009E3C] hover:text-white hover:border-[#009E3C] hover:shadow-[#009E3C]/20 hover:scale-110 opacity-0 group-hover/carousel:opacity-100'
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
                ? 'hover:bg-[#009E3C] hover:text-white hover:border-[#009E3C] hover:shadow-[#009E3C]/20 hover:scale-110 opacity-0 group-hover/carousel:opacity-100'
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
            onMouseEnter={pause}
            onMouseLeave={resume}
            onTouchStart={pause}
            onTouchEnd={resume}
            className={`flex overflow-x-auto scrollbar-hide gap-3 sm:gap-5 py-2 ${hideHeader ? 'px-0' : 'px-1'} snap-x snap-mandatory`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex-none w-[165px] sm:w-[260px] md:w-[280px] lg:w-[300px] snap-start"
              >
                <ProductCard data={product} />
              </motion.div>
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
