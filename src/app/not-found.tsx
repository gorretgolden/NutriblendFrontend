import React from 'react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4caf50]/10 via-white to-[#4caf50]/5">
            <div className="text-center px-4 max-w-2xl mx-auto">
                {/* Animated 404 */}
                <div className="mb-8 relative">
                    <h1 className="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4caf50] to-[#45a049] leading-none animate-pulse-glow">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-[#4caf50]/20 rounded-full blur-3xl animate-pulse"></div>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 animate-fade-in">
                    Page Not Found
                </h2>
                <p className="text-lg md:text-xl text-gray-600 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    Oops! The page you're looking for seems to have wandered off. Let's get you back on track.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <Link
                        href="/"
                        className="group relative px-8 py-4 bg-[#4caf50] text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                    >
                        <span className="relative z-10">Go Home</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#45a049] to-[#4caf50] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>

                    <Link
                        href="/shop"
                        className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-200 hover:border-[#4caf50] hover:text-[#4caf50] transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
                    >
                        Browse Products
                    </Link>
                </div>

                {/* Decorative Elements */}
                <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto opacity-50">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-2 bg-gradient-to-r from-[#4caf50] to-[#45a049] rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
