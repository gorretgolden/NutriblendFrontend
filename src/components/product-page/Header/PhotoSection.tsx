"use client";

import { Product } from "@/types/product.types";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { apiClient } from "@/lib/api/client";

const PhotoSection = ({ data }: { data: Product }) => {
  const [selected, setSelected] = useState<string>(data.srcUrl);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [settings, setSettings] = useState<Record<string, any> | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const magnifierSize = 150;

  const getProductUrl = () => {
    if (typeof window !== 'undefined') return window.location.href;
    return `https://nutriblendhaven.com/shop/product/${data.id}/${data.slug || 'product'}`;
  };

  const getDefaultShareLink = (platform: 'facebook' | 'x' | 'whatsapp') => {
    const productUrl = getProductUrl();
    const encodedUrl = encodeURIComponent(productUrl);
    const encodedText = encodeURIComponent(`Check out ${data.title} on NutriBlend Haven`);

    if (platform === 'facebook') {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }
    if (platform === 'x') {
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
    }
    return `https://wa.me/?text=${encodeURIComponent(`Check out ${data.title} on NutriBlend Haven: ${productUrl}`)}`;
  };

  const resolveShareLink = (platform: 'facebook' | 'x' | 'whatsapp') => {
    const productUrl = getProductUrl();
    const encodedUrl = encodeURIComponent(productUrl);
    const encodedText = encodeURIComponent(`Check out ${data.title} on NutriBlend Haven`);

    const customMap: Record<'facebook' | 'x' | 'whatsapp', string | undefined> = {
      facebook: settings?.product_share_facebook_url || settings?.facebook_url,
      x: settings?.product_share_x_url || settings?.twitter_url,
      whatsapp: settings?.product_share_whatsapp_url || settings?.whatsapp_url,
    };

    const customUrl = customMap[platform];
    if (!customUrl) return getDefaultShareLink(platform);

    if (customUrl.includes('{url}') || customUrl.includes('{title}')) {
      return customUrl
        .replaceAll('{url}', encodedUrl)
        .replaceAll('{title}', encodedText);
    }

    // If admin entered a profile URL, keep product sharing functional via defaults.
    if (
      customUrl.includes('facebook.com') && !customUrl.includes('sharer.php') ||
      customUrl.includes('twitter.com') && !customUrl.includes('/intent/tweet') ||
      customUrl.includes('x.com') && !customUrl.includes('/intent/tweet') ||
      customUrl.includes('instagram.com')
    ) {
      return getDefaultShareLink(platform);
    }

    // If admin entered a share endpoint, use it as-is.
    return customUrl;
  };

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

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiClient.getPublicSettings();
        if (res.status && res.data) {
          setSettings(res.data);
        }
      } catch {
        // Optional enhancement only; defaults still provide working share links.
      }
    };
    fetchSettings();
  }, []);

  return (
    <>
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
                  className="rounded-md w-full h-full object-cover mix-blend-multiply hover:scale-110 transition-all duration-500"
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
              className={`rounded-md w-full h-full object-contain mix-blend-multiply transition-transform duration-300 ${isZoomed ? 'scale-150' : 'hover:scale-110'
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
                className="bg-[#009E3C] text-white p-2 rounded-full shadow-md"
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
                  className="bg-[#009E3C] text-white p-2 rounded-full shadow-md"
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
      <div className="mt-6 flex flex-col">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Share this product</span>
        <div className="flex space-x-3">
          <a
            href={resolveShareLink('facebook')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors"
          >
            <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
          </a>
          <a
            href={resolveShareLink('x')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
          </a>
          <a
            href={resolveShareLink('whatsapp')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-green-50 hover:border-green-200 transition-colors"
          >
            <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.029c0 2.119.554 4.188 1.608 6.059L0 24l6.104-1.602a11.834 11.834 0 005.943 1.597h.005c6.634 0 12.031-5.391 12.035-12.028a11.795 11.795 0 00-3.417-8.467z" /></svg>
          </a>
        </div>
      </div>
    </>
  );
};

export default PhotoSection;