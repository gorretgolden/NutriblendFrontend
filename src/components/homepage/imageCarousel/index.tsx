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
    setTimeout(() => setIsTransitioning(false), 600);
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
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 600);
  };

  return (
    <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-white shadow-xl shadow-green-900/8 border border-gray-100/50">
        {/* Slides container */}
        <div className="relative h-60 sm:h-72 md:h-80 lg:h-[340px] xl:h-[380px]">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute top-0 left-0 w-full h-full transition-all duration-600 ease-in-out ${index === currentSlide
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-[1.02] pointer-events-none'
                }`}
            >
              <div className={`flex h-full ${slide.layout === 'imageLeft' ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Image side */}
                <div className="w-1/2 relative overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-contain p-4 md:p-6 transition-transform duration-700"
                  />
                  {/* Decorative wave separator */}
                  <div className={`absolute top-0 h-full w-6 sm:w-8 md:w-10 ${slide.layout === 'imageLeft' ? 'right-0' : 'left-0'}`}>
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                      <defs>
                        <linearGradient id={`grad-${slide.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#22c55e" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                      <path
                        d={slide.layout === 'imageLeft'
                          ? "M0,0 C40,20 20,80 0,100 L0,100 L0,0 Z"
                          : "M100,0 C60,20 80,80 100,100 L100,100 L100,0 Z"
                        }
                        fill={`url(#grad-${slide.id})`}
                      />
                    </svg>
                  </div>
                </div>

                {/* Text content side */}
                <div className="w-1/2 flex items-center justify-center p-5 sm:p-8 md:p-12 bg-gradient-to-br from-gray-50 to-green-50/30">
                  <div className="max-w-sm text-center">
                    <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-3 sm:mb-4">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      Featured
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2 sm:mb-3 tracking-tight leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-4 sm:mb-6 leading-relaxed">
                      {slide.subtitle}
                    </p>
                    {slide.ctaText && (
                      <a
                        href={slide.ctaLink || '#'}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xs sm:text-sm font-bold py-2.5 px-6 sm:py-3 sm:px-8 rounded-full transition-all duration-300 shadow-lg shadow-green-200/50 hover:shadow-xl hover:shadow-green-300/50 active:scale-95"
                      >
                        {slide.ctaText}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
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
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-700 p-2 sm:p-2.5 rounded-full hover:bg-white hover:text-green-600 transition-all duration-300 shadow-lg border border-gray-100 hover:scale-110"
              aria-label="Previous slide"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-700 p-2 sm:p-2.5 rounded-full hover:bg-white hover:text-green-600 transition-all duration-300 shadow-lg border border-gray-100 hover:scale-110"
              aria-label="Next slide"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Indicators - pill style */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${index === currentSlide
                    ? 'bg-green-600 w-6 h-2.5'
                    : 'bg-gray-300 hover:bg-gray-400 w-2.5 h-2.5'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
