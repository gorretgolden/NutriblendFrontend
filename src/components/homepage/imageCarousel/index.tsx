// components/HeroCarousel.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CarouselSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  layout: 'imageLeft' | 'imageRight';
}

interface HeroCarouselProps {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  interval?: number;
}

export default function HeroCarousel({ 
  slides = [], 
  autoPlay = true, 
  interval = 5000
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, slides.length]);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length, goToNext]);

  const goToSlide = (index: number) => {
    if (index === currentSlide || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return (
    <div className="relative w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto overflow-hidden rounded-lg bg-white shadow-lg">
      {/* Slides container */}
      <div className="relative h-48 sm:h-64">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className={`flex h-full ${slide.layout === 'imageLeft' ? 'flex-row' : 'flex-row-reverse'}`}>
              {/* Image side */}
              <div className="w-1/2 relative">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-contain"
                />
                <div className={`absolute top-0 h-full w-4 sm:w-6 md:w-8 ${slide.layout === 'imageLeft' ? 'right-0' : 'left-0'}`}>
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                    <path 
                      d={slide.layout === 'imageLeft' 
                        ? "M0,0 C30,0 30,100 0,100 L0,100 L0,0 Z" 
                        : "M100,0 C70,0 70,100 100,100 L100,100 L100,0 Z"
                      } 
                      fill="#4CAF50"
                    />
                  </svg>
                </div>
              </div>
              
              {/* Text content side */}
              <div className="w-1/2 flex items-center justify-center p-4 sm:p-6 bg-gray-50">
                <div className="max-w-xs text-center">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                    {slide.title}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                    {slide.subtitle}
                  </p>
                  {slide.ctaText && (
                    <a
                      href={slide.ctaLink || '#'}
                      className="inline-block bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs sm:text-sm font-medium py-2 px-4 sm:py-2 sm:px-6 rounded-full transition-colors shadow-md hover:shadow-lg"
                    >
                      {slide.ctaText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-800 p-1 sm:p-2 rounded-full hover:bg-opacity-100 transition-all shadow-md"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-800 p-1 sm:p-2 rounded-full hover:bg-opacity-100 transition-all shadow-md"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-[#4CAF50]' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
