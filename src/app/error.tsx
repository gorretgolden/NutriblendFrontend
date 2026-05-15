'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <div className="bg-red-50 p-6 rounded-full mb-6">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
                We encountered an unexpected error while processing your request. Please try refreshing the page or try again later.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-[#009E3C] text-white rounded-full font-bold shadow-lg hover:bg-[#00752C] transition-all transform hover:scale-105"
                >
                    Refresh Page
                </button>
                <button
                    onClick={() => reset()}
                    className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-all transform hover:scale-105"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
