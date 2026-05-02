export default function Loading() {
    return (
        <main className="bg-[#f4f6f9] w-full min-h-screen">

            {/* ── 1. Hero Carousel Shimmer ── */}
            <section className="bg-white shadow-sm border-b border-gray-200/80">
                <div className="max-w-[1500px] mx-auto">
                    <div className="relative w-full max-w-[1560px] mx-auto px-3 sm:px-5 lg:px-8 py-3 md:py-5">
                        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100/70 animate-pulse">
                            {/* Progress bar shimmer */}
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-100/60 z-30">
                                <div className="h-full w-1/3 bg-gray-200 rounded-full" />
                            </div>

                            {/* Slide area — matching real hero height */}
                            <div className="relative h-52 xs:h-64 sm:h-80 md:h-96 lg:h-[440px] xl:h-[500px] 2xl:h-[540px]">
                                <div className="absolute inset-0 w-full h-full flex flex-row">
                                    {/* Image panel shimmer */}
                                    <div className="w-[48%] sm:w-1/2 relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-b from-gray-100 to-gray-200" />

                                    {/* Text panel shimmer */}
                                    <div className="w-[52%] sm:w-1/2 flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 bg-white relative">
                                        <div className="relative z-10 max-w-xs lg:max-w-sm xl:max-w-md w-full space-y-4">
                                            {/* Eyebrow badge */}
                                            <div className="h-6 w-24 bg-gray-100 rounded-full" />

                                            {/* Title lines */}
                                            <div className="space-y-2.5">
                                                <div className="h-6 sm:h-8 md:h-9 w-full bg-gray-200 rounded-lg" />
                                                <div className="h-6 sm:h-8 md:h-9 w-3/4 bg-gray-200 rounded-lg" />
                                            </div>

                                            {/* Subtitle lines */}
                                            <div className="space-y-2">
                                                <div className="h-4 w-full bg-gray-100 rounded-md" />
                                                <div className="h-4 w-5/6 bg-gray-100 rounded-md" />
                                            </div>

                                            {/* CTA button */}
                                            <div className="h-11 w-40 bg-gray-200 rounded-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation arrows shimmer */}
                            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 border border-gray-200" />
                            <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 border border-gray-200" />

                            {/* Dot indicators shimmer */}
                            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full border border-gray-100/80">
                                <div className="w-6 sm:w-7 h-2 bg-gray-200 rounded-full" />
                                <div className="w-2 h-2 bg-gray-200 rounded-full" />
                                <div className="w-2 h-2 bg-gray-200 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 2. Shop by Category shimmer ── */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 animate-pulse">
                <div className="h-5 w-32 bg-gray-200 rounded-md mb-1" />
                <div className="h-7 w-56 bg-gray-200 rounded-md mb-5" />
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-2xl" />
                            <div className="h-3 w-16 bg-gray-100 rounded" />
                        </div>
                    ))}
                </div>
            </div>

            {/* ── 3. Trust Signals Bar shimmer ── */}
            <div className="bg-white border-b border-gray-100 animate-pulse">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-gray-100">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3 md:px-6 md:first:pl-0 md:last:pr-0">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0" />
                                <div className="space-y-1.5">
                                    <div className="h-4 w-24 bg-gray-200 rounded" />
                                    <div className="h-3 w-32 bg-gray-100 rounded hidden sm:block" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── 4. Product Section shimmer ── */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 animate-pulse">
                <div className="bg-white rounded-2xl px-4 py-5 md:px-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="h-3 w-20 bg-gray-200 rounded mb-1" />
                            <div className="h-6 w-40 bg-gray-200 rounded" />
                        </div>
                        <div className="h-8 w-24 bg-gray-100 rounded-full hidden sm:block" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-3 space-y-3">
                                <div className="aspect-square w-full bg-gray-100 rounded-xl" />
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-gray-200 rounded" />
                                    <div className="h-4 w-2/3 bg-gray-100 rounded" />
                                    <div className="h-5 w-24 bg-gray-200 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── 5. Brands Section shimmer ── */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-4 animate-pulse">
                <div className="bg-white rounded-2xl px-4 py-5 md:px-6 border border-gray-100 shadow-sm">
                    <div className="h-6 w-36 bg-gray-200 rounded mb-4" />
                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── 6. Another Product Section shimmer ── */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-4 animate-pulse">
                <div className="bg-white rounded-2xl px-4 py-5 md:px-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="h-3 w-24 bg-gray-200 rounded mb-1" />
                            <div className="h-6 w-48 bg-gray-200 rounded" />
                        </div>
                        <div className="h-8 w-24 bg-gray-100 rounded-full hidden sm:block" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-3 space-y-3">
                                <div className="aspect-square w-full bg-gray-100 rounded-xl" />
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-gray-200 rounded" />
                                    <div className="h-4 w-2/3 bg-gray-100 rounded" />
                                    <div className="h-5 w-24 bg-gray-200 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
