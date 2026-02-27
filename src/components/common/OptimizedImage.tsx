/**
 * Optimized Image Component for NutriBlend Haven
 * Includes lazy loading, blur placeholder, and error handling
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
    priority?: boolean;
    quality?: number;
    sizes?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    onLoad?: () => void;
    onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    width,
    height,
    fill = false,
    className = '',
    priority = false,
    quality = 85,
    sizes,
    objectFit = 'cover',
    placeholder = 'blur',
    blurDataURL,
    onLoad,
    onError,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [imageSrc, setImageSrc] = useState(src);

    const handleLoad = () => {
        setIsLoading(false);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        setIsLoading(false);
        setImageSrc('/images/placeholder.jpg'); // Fallback image
        onError?.();
    };

    // Generate blur data URL if not provided
    const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f0f0f0" offset="20%" />
          <stop stop-color="#e0e0e0" offset="50%" />
          <stop stop-color="#f0f0f0" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f0f0f0" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `;

    const toBase64 = (str: string) =>
        typeof window === 'undefined'
            ? Buffer.from(str).toString('base64')
            : window.btoa(str);

    const defaultBlurDataURL = `data:image/svg+xml;base64,${toBase64(
        shimmer(width || 700, height || 475)
    )}`;

    const imageProps: any = {
        src: imageSrc,
        alt,
        quality,
        onLoad: handleLoad,
        onError: handleError,
        className: cn(
            'transition-opacity duration-500',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
        ),
        ...(placeholder === 'blur' && {
            placeholder: 'blur',
            blurDataURL: blurDataURL || defaultBlurDataURL,
        }),
        priority,
        sizes: sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    };

    if (fill) {
        imageProps.fill = true;
        imageProps.style = { objectFit };
    } else {
        imageProps.width = width || 700;
        imageProps.height = height || 475;
    }

    return (
        <div className={cn('relative overflow-hidden', fill && 'w-full h-full')}>
            {isLoading && (
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]" />
            )}
            <Image {...imageProps} />
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                    Image not available
                </div>
            )}
        </div>
    );
};

export default OptimizedImage;
