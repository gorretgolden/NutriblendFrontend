import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave';
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'text',
    width,
    height,
    animation = 'pulse',
}) => {
    const baseClasses = 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]';

    const animationClasses = {
        pulse: 'animate-pulse',
        wave: 'animate-shimmer',
    };

    const variantClasses = {
        text: 'rounded h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-md',
    };

    const style: React.CSSProperties = {
        width: width || (variant === 'circular' ? '40px' : '100%'),
        height: height || (variant === 'circular' ? '40px' : undefined),
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
            style={style}
        />
    );
};

export const ProductCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        <Skeleton variant="rectangular" height={200} />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <div className="flex justify-between items-center">
            <Skeleton variant="text" width={80} />
            <Skeleton variant="rectangular" width={100} height={36} />
        </div>
    </div>
);

export const PageSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
        {/* Hero Skeleton */}
        <div className="bg-gray-300 h-48 animate-pulse" />

        {/* Content Skeleton */}
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-lg p-6 space-y-3">
                        <Skeleton variant="circular" width={48} height={48} />
                        <Skeleton variant="text" width="70%" />
                        <Skeleton variant="text" width="100%" />
                        <Skeleton variant="text" width="90%" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const NavSkeleton = () => (
    <div className="flex space-x-4">
        {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="text" width={80} height={20} />
        ))}
    </div>
);

export default Skeleton;
