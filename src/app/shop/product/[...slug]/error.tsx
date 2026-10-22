'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ProductError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[ProductPage] Error boundary caught:', error);
    }, [error]);

    return (
        <main className="bg-[#f5f5f5] min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
                {/* Icon */}
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h1 className="text-2xl font-black text-gray-900 mb-2">Product Unavailable</h1>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    We couldn&apos;t load this product right now. This might be a temporary issue. Please try again or browse other products.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-[#009E3C] text-white rounded-full font-bold text-sm hover:bg-[#007a2e] transition-all hover:scale-105 shadow-md shadow-[#009E3C]/20"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/shop"
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-full font-bold text-sm hover:bg-gray-50 transition-all hover:scale-105"
                    >
                        Browse Shop
                    </Link>
                </div>
            </div>
        </main>
    );
}
