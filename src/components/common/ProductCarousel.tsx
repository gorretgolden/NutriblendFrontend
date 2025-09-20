'use client';

import React, { useRef, useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types/product.types';

interface ProductCarouselProps {
  products: Product[];
  title: string;
  viewAllLink?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  title,
  viewAllLink = "#"
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(true);

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
    const checkScroll = () => {
      if (carouselRef.current) {
        const { scrollWidth, clientWidth } = carouselRef.current;
        setShowArrows(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  return (
    <section className="my-12">
      {/* Wider container than before */}
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-900">{title}</h2>
          <a 
            href={viewAllLink} 
            className="text-green-600 hover:text-green-800 font-semibold flex items-center gap-1 transition-colors"
          >
            See more
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        
        {/* Carousel */}
        <div className="relative">
          {showArrows && (
            <>
              <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
                aria-label="Previous products"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
                aria-label="Next products"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide space-x-6 py-2 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map(product => (
              <div key={product.id} className="flex-none w-64 lg:w-72">
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
