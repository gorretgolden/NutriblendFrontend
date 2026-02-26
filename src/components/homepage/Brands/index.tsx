"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClient, getImageUrl } from "@/lib/api/client";

export default function BrandsSection() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const cached = localStorage.getItem('brands_cache_v2');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 15 * 60 * 1000) {
            setBrands(data);
            setLoading(false);
            return;
          }
        }

        const response = await apiClient.getBrands();
        if (response.status && response.data) {
          setBrands(response.data.slice(0, 8));
          localStorage.setItem('brands_cache_v2', JSON.stringify({
            data: response.data.slice(0, 8),
            timestamp: Date.now()
          }));
        }
      } catch (error) {
        console.error("Failed to fetch brands", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="text-center mb-10">
            <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-3 animate-pulse" />
            <div className="h-4 w-64 bg-gray-100 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-28 md:h-32 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-shimmer rounded-2xl"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  // Color accents for letter avatars
  const accentColors = [
    { bg: 'bg-emerald-600', ring: 'ring-emerald-200' },
    { bg: 'bg-blue-600', ring: 'ring-blue-200' },
    { bg: 'bg-amber-600', ring: 'ring-amber-200' },
    { bg: 'bg-rose-600', ring: 'ring-rose-200' },
    { bg: 'bg-violet-600', ring: 'ring-violet-200' },
    { bg: 'bg-cyan-600', ring: 'ring-cyan-200' },
    { bg: 'bg-green-600', ring: 'ring-green-200' },
    { bg: 'bg-fuchsia-600', ring: 'ring-fuchsia-200' },
  ];

  return (
    <section className="w-full py-12 md:py-16 bg-gradient-to-b from-gray-50/80 to-white">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-green-600">
                Trusted Brands
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Brand</span>
            </h2>
          </div>
          <Link
            href="/brands"
            className="group flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-5 py-2.5 rounded-full transition-all duration-300"
          >
            See All Brands
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
          {brands.map((brand, i) => {
            const accent = accentColors[i % accentColors.length];
            return (
              <Link
                key={brand.id}
                href={`/shop?brand_id=${brand.id}`}
                className={`${i >= 4 ? "hidden sm:flex" : "flex"} 
                  relative flex-col items-center justify-center 
                  bg-white rounded-2xl overflow-hidden 
                  border border-gray-100
                  shadow-sm hover:shadow-lg
                  transition-all duration-400 hover:-translate-y-1
                  group p-5 md:p-6 min-h-[120px] sm:min-h-[140px]`}
              >
                {/* Logo or Avatar */}
                {brand.logo ? (
                  <div className="flex items-center justify-center flex-1 w-full">
                    <img
                      src={getImageUrl(brand.logo)}
                      alt={brand.name}
                      className="max-w-full max-h-[60px] md:max-h-[70px] object-contain group-hover:scale-105 transition-transform duration-400"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center flex-1">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${accent.bg} ring-4 ${accent.ring} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                      <span className="text-xl md:text-2xl font-bold text-white">
                        {brand.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Brand Name */}
                <div className="mt-3 w-full text-center">
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors duration-300 line-clamp-1">
                    {brand.name}
                  </span>
                  {brand.products_count > 0 && (
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      {brand.products_count} product{brand.products_count !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Hover bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}