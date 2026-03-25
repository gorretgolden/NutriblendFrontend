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
    setTimeout(() => setIsTransitioning(false), 650);
  }, [isTransitioning, slides.length]);

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 650);
  };

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length, goToNext]);

  const goToSlide = (index: number) => {
    if (index === currentSlide || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 650);
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full max-w-[1560px] mx-auto px-3 sm:px-5 lg:px-8 py-3 md:py-5">
      {/* ── Main carousel wrapper ── */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100/70">

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-100/60 z-30">
          <div
            key={currentSlide}
            className="h-full bg-gradient-to-r from-[#009E3C] to-[#00bc49] rounded-full"
            style={{
              animation: autoPlay ? `progressBar ${interval}ms linear forwards` : 'none',
            }}
          />
        </div>

        {/* Slide stack */}
        <div className="relative h-52 xs:h-64 sm:h-80 md:h-96 lg:h-[440px] xl:h-[500px] 2xl:h-[540px]">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="absolute inset-0 w-full h-full"
              style={{
                opacity: index === currentSlide ? 1 : 0,
                transform: index === currentSlide ? 'scale(1)' : 'scale(1.015)',
                transition: 'opacity 650ms cubic-bezier(0.4,0,0.2,1), transform 650ms cubic-bezier(0.4,0,0.2,1)',
                pointerEvents: index === currentSlide ? 'auto' : 'none',
                zIndex: index === currentSlide ? 10 : 0,
              }}
            >
              <div className={`flex h-full ${slide.layout === 'imageLeft' ? 'flex-row' : 'flex-row-reverse'}`}>

                {/* Image panel */}
                <div className="w-[48%] sm:w-1/2 relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#f8fdf9] to-[#eef9f0]">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-contain p-5 md:p-8 transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)' }}
                  />

                  {/* Wave edge separator */}
                  <div
                    className={`absolute top-0 h-full w-8 sm:w-10 md:w-14 pointer-events-none ${
                      slide.layout === 'imageLeft' ? 'right-0' : 'left-0'
                    }`}
                  >
                    <svg viewBox="0 0 100 200" preserveAspectRatio="none" className="h-full w-full">
                      <defs>
                        <linearGradient id={`wgrad-${slide.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%"   stopColor="#ffffff" />
                          <stop offset="50%"  stopColor="#fafffe" />
                          <stop offset="100%" stopColor="#f8fdf9" />
                        </linearGradient>
                      </defs>
                      <path
                        d={
                          slide.layout === 'imageLeft'
                            ? 'M100,0 C60,25 80,75 100,100 C80,125 60,175 100,200 L100,0 Z'
                            : 'M0,0 C40,25 20,75 0,100 C20,125 40,175 0,200 L0,0 Z'
                        }
                        fill={`url(#wgrad-${slide.id})`}
                      />
                    </svg>
                  </div>
                </div>

                {/* Text panel */}
                <div className="w-[52%] sm:w-1/2 flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 bg-white relative">

                  {/* Decorative blob */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-green-50/60 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-50/40 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 max-w-xs lg:max-w-sm xl:max-w-md">
                    {/* Eyebrow */}
                    <div className="inline-flex items-center gap-1.5 bg-[#009E3C]/10 border border-[#009E3C]/20 text-[#009E3C] px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black tracking-widest uppercase mb-3 sm:mb-4">
                      <span className="w-1.5 h-1.5 bg-[#009E3C] rounded-full animate-pulse" />
                      Featured
                    </div>

                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2rem] xl:text-[2.25rem] font-black text-gray-900 mb-2 sm:mb-3 leading-tight tracking-tight">
                      {slide.title}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-[11px] sm:text-sm md:text-base lg:text-[15px] xl:text-base text-gray-500 mb-4 sm:mb-6 leading-relaxed">
                      {slide.subtitle}
                    </p>

                    {/* CTA */}
                    {slide.ctaText && (
                      <a
                        href={slide.ctaLink || '#'}
                        className="inline-flex items-center gap-2 bg-[#009E3C] hover:bg-[#00752C] text-white text-[11px] sm:text-sm font-black py-2.5 px-5 sm:py-3 sm:px-7 rounded-xl transition-all duration-250 shadow-[0_6px_20px_rgba(0,158,60,0.30)] hover:shadow-[0_8px_28px_rgba(0,158,60,0.40)] active:scale-[0.97] group/cta"
                      >
                        {slide.ctaText}
                        <svg
                          className="w-3.5 h-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5"
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
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

        {/* ── Navigation arrows ── */}
        {slides.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.12)] border border-gray-100 hover:bg-white hover:text-[#009E3C] hover:scale-110 hover:shadow-[0_4px_20px_rgba(0,0,0,0.16)] transition-all duration-200"
              aria-label="Previous slide"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.12)] border border-gray-100 hover:bg-white hover:text-[#009E3C] hover:scale-110 hover:shadow-[0_4px_20px_rgba(0,0,0,0.16)] transition-all duration-200"
              aria-label="Next slide"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* ── Dot indicators ── */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.10)] border border-gray-100/80">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-350 ease-out ${
                  index === currentSlide
                    ? 'bg-[#009E3C] w-6 sm:w-7 h-2'
                    : 'bg-gray-300 hover:bg-[#009E3C]/50 w-2 h-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Slide counter badge */}
        {slides.length > 1 && (
          <div className="absolute top-4 right-4 z-20 bg-black/30 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full hidden sm:flex items-center gap-1">
            <span>{currentSlide + 1}</span>
            <span className="opacity-50">/</span>
            <span className="opacity-70">{slides.length}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
