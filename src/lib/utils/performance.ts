/**
 * Performance Utilities for NutriBlend Haven
 * Optimizes loading, lazy loading, and resource management
 */

/**
 * Lazy load images with Intersection Observer
 */
export const lazyLoadImage = (imageElement: HTMLImageElement) => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target as HTMLImageElement;
                const src = img.dataset.src;
                if (src) {
                    img.src = src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });

    imageObserver.observe(imageElement);
};

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for scroll and resize events
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Preload critical resources
 */
export const preloadResource = (href: string, as: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
};

/**
 * Prefetch page for faster navigation
 */
export const prefetchPage = (url: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
};

/**
 * Check if device prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get optimal image format based on browser support
 */
export const getOptimalImageFormat = (): 'avif' | 'webp' | 'jpg' => {
    const canvas = document.createElement('canvas');

    // Check AVIF support
    if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
        return 'avif';
    }

    // Check WebP support
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
        return 'webp';
    }

    return 'jpg';
};

/**
 * Measure and log performance metrics
 */
export const logPerformanceMetrics = () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;

        console.log('Performance Metrics:', {
            pageLoadTime: `${pageLoadTime}ms`,
            connectTime: `${connectTime}ms`,
            renderTime: `${renderTime}ms`
        });
    }
};

/**
 * Request Idle Callback polyfill for older browsers
 */
export const requestIdleCallback = (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions
): number => {
    if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(callback, options);
    }

    // Fallback for browsers that don't support requestIdleCallback
    return setTimeout(() => {
        const start = Date.now();
        callback({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
        });
    }, 1) as unknown as number;
};

/**
 * Cancel Idle Callback
 */
export const cancelIdleCallback = (id: number): void => {
    if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(id);
    } else {
        clearTimeout(id);
    }
};
