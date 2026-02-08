"use client";

import { Product } from "@/types/product.types";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

const PhotoSection = ({ data }: { data: Product }) => {
  const [selected, setSelected] = useState<string>(data.srcUrl);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const magnifierSize = 150;

  // Update selected image when data changes (essential for client-side navigation)
  useEffect(() => {
    setSelected(data.srcUrl);
  }, [data.srcUrl]);

  // Handle touch events for mobile zoom
  const handleTouch = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom gesture
      e.preventDefault();
      setIsZoomed(true);
    } else if (e.touches.length === 1 && isZoomed) {
      // Pan gesture when zoomed
      e.preventDefault();
    }
  };

  // Handle mouse move for magnifier
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setMagnifierPosition({ x, y });
  };

  // Close magnifier when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (imageRef.current && !imageRef.current.contains(e.target as Node)) {
        setShowMagnifier(false);
        setIsZoomed(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col-reverse lg:flex-row lg:space-x-3.5">
      {data?.gallery && data.gallery.length > 0 && (
        <div className="flex lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3.5 w-full lg:w-fit items-center lg:justify-start justify-center">
          {data.gallery.map((photo, index) => (
            <button
              key={index}
              type="button"
              className={`
                rounded-[13px] xl:rounded-[20px] w-full max-w-[111px] xl:max-w-[152px] max-h-[106px] xl:max-h-[167px] xl:min-h-[167px] 
                aspect-square overflow-hidden border-2 transition-all duration-300
                ${selected === photo
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-green-100 bg-green-50 hover:border-green-300 hover:bg-green-100'
                }
              `}
              onClick={() => setSelected(photo)}
            >
              <Image
                src={photo}
                width={152}
                height={167}
                className="rounded-md w-full h-full object-cover hover:scale-110 transition-all duration-500"
                alt={data.title}
                priority
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex items-center justify-center bg-green-50 rounded-[13px] sm:rounded-[20px] w-full sm:w-96 md:w-full mx-auto h-full max-h-[530px] min-h-[330px] lg:min-h-[380px] xl:min-h-[530px] overflow-hidden mb-3 lg:mb-0 border border-green-100">
        {/* Main image with zoom functionality */}
        <div
          ref={imageRef}
          className={`relative w-full h-full cursor-zoom-in ${isZoomed ? 'cursor-zoom-out' : ''}`}
          onClick={() => setIsZoomed(!isZoomed)}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowMagnifier(true)}
          onMouseLeave={() => setShowMagnifier(false)}
          onTouchStart={handleTouch}
          onTouchMove={handleTouch}
        >
          <Image
            src={selected}
            width={444}
            height={530}
            className={`rounded-md w-full h-full object-contain transition-transform duration-300 ${isZoomed ? 'scale-150' : 'hover:scale-110'
              }`}
            alt={data.title}
            priority
            unoptimized
          />

          {/* Magnification glass */}
          {showMagnifier && !isZoomed && (
            <div
              className="absolute pointer-events-none border-2 border-green-400 rounded-full overflow-hidden shadow-lg z-10"
              style={{
                width: `${magnifierSize}px`,
                height: `${magnifierSize}px`,
                left: `${magnifierPosition.x}%`,
                top: `${magnifierPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                backgroundImage: `url(${selected})`,
                backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                backgroundSize: `${isZoomed ? '150%' : '200%'}`,
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}

          {/* Zoom indicator */}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isZoomed ? 'Click to zoom out' : 'Click to zoom'}
          </div>

          {/* Mobile zoom controls */}
          <div className="lg:hidden absolute bottom-3 left-3 flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(true);
              }}
              className="bg-green-600 text-white p-2 rounded-full shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            {isZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(false);
                }}
                className="bg-green-600 text-white p-2 rounded-full shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Magnifying glass icon */}
        <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md">
          <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PhotoSection;