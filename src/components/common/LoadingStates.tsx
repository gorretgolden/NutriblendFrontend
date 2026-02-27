/**
 * Loading Components for NutriBlend Haven
 * Includes various loading states with premium animations
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Product Card Skeleton
export const ProductCardSkeleton = () => {
    return (
        <div className="rounded-xl overflow-hidden border border-gray-200 animate-pulse">
            <div className="aspect-square bg-gray-200 skeleton" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded skeleton w-3/4" />
                <div className="h-3 bg-gray-200 rounded skeleton w-1/2" />
                <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded skeleton w-1/4" />
                    <div className="h-8 bg-gray-200 rounded skeleton w-1/3" />
                </div>
            </div>
        </div>
    );
};

// Grid of Product Skeletons
export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    );
};

// Page Loading Spinner
export const PageLoader = () => {
    return (
        <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 animate-pulse">
                    Loading...
                </p>
            </div>
        </div>
    );
};

// Button Loading Spinner
export const ButtonLoader = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-5 h-5 border-2',
        lg: 'w-6 h-6 border-3',
    };

    return (
        <div
            className={cn(
                'inline-block rounded-full border-white border-t-transparent animate-spin',
                sizeClasses[size]
            )}
        />
    );
};

// Shimmer text loader
export const TextSkeleton = ({
    lines = 3,
    className = ''
}: {
    lines?: number;
    className?: string;
}) => {
    return (
        <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        'h-4 bg-gray-200 rounded skeleton',
                        index === lines - 1 && 'w-3/4'
                    )}
                />
            ))}
        </div>
    );
};

// Cart Item Skeleton
export const CartItemSkeleton = () => {
    return (
        <div className="flex gap-4 py-4 border-b border-gray-200 animate-pulse">
            <div className="w-20 h-20 bg-gray-200 rounded-lg skeleton" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded skeleton w-3/4" />
                <div className="h-3 bg-gray-200 rounded skeleton w-1/2" />
                <div className="h-5 bg-gray-200 rounded skeleton w-1/4" />
            </div>
        </div>
    );
};

// Hero Section Skeleton
export const HeroSkeleton = () => {
    return (
        <div className="w-full h-[500px] bg-gray-200 rounded-2xl animate-pulse skeleton" />
    );
};

// Category Card Skeleton
export const CategoryCardSkeleton = () => {
    return (
        <div className="rounded-xl overflow-hidden border border-gray-200 animate-pulse">
            <div className="aspect-video bg-gray-200 skeleton" />
            <div className="p-4 space-y-2">
                <div className="h-5 bg-gray-200 rounded skeleton w-2/3" />
                <div className="h-3 bg-gray-200 rounded skeleton w-1/2" />
            </div>
        </div>
    );
};

// Inline Loader (for lazy loading content)
export const InlineLoader = ({ message = 'Loading...' }: { message?: string }) => {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
            </div>
        </div>
    );
};

// Pulsing Dots Loader
export const DotsLoader = () => {
    return (
        <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="w-2 h-2 bg-primary rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.15}s` }}
                />
            ))}
        </div>
    );
};

// Full Screen Overlay Loader with Progress
export const FullScreenLoader = ({
    progress,
    message = 'Loading...'
}: {
    progress?: number;
    message?: string;
}) => {
    return (
        <div className="fixed inset-0 bg-gradient-hero flex items-center justify-center z-50">
            <div className="text-center space-y-6 px-4">
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-white/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin" />
                </div>
                <div className="space-y-3">
                    <p className="text-white text-xl font-semibold">{message}</p>
                    {progress !== undefined && (
                        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default {
    ProductCardSkeleton,
    ProductGridSkeleton,
    PageLoader,
    ButtonLoader,
    TextSkeleton,
    CartItemSkeleton,
    HeroSkeleton,
    CategoryCardSkeleton,
    InlineLoader,
    DotsLoader,
    FullScreenLoader,
};
