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

  // Premium color palette for brand cards
  const cardStyles = [
    'from-emerald-50 to-teal-50 border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-100/50',
    'from-blue-50 to-indigo-50 border-blue-100 hover:border-blue-300 hover:shadow-blue-100/50',
    'from-amber-50 to-orange-50 border-amber-100 hover:border-amber-300 hover:shadow-amber-100/50',
    'from-rose-50 to-pink-50 border-rose-100 hover:border-rose-300 hover:shadow-rose-100/50',
    'from-violet-50 to-purple-50 border-violet-100 hover:border-violet-300 hover:shadow-violet-100/50',
    'from-cyan-50 to-sky-50 border-cyan-100 hover:border-cyan-300 hover:shadow-cyan-100/50',
    'from-lime-50 to-green-50 border-lime-100 hover:border-lime-300 hover:shadow-lime-100/50',
    'from-fuchsia-50 to-pink-50 border-fuchsia-100 hover:border-fuchsia-300 hover:shadow-fuchsia-100/50',
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

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
          {brands.map((brand, i) => (
            <Link
              key={brand.id}
              href={`/shop?brand_id=${brand.id}`}
              className={`${i >= 4 ? "hidden sm:flex" : "flex"} 
                relative flex-col items-center justify-center 
                h-28 sm:h-32 md:h-36 
                bg-gradient-to-br ${cardStyles[i % cardStyles.length]}
                border rounded-2xl overflow-hidden 
                shadow-sm hover:shadow-xl 
                transition-all duration-500 hover:-translate-y-1.5
                group`}
            >
              {/* Logo */}
              {brand.logo ? (
                <img
                  src={getImageUrl(brand.logo)}
                  alt={brand.name}
                  className="w-full h-full object-contain p-5 md:p-6 group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-4">
                  <div className="w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                    <span className="text-lg font-bold text-gray-700">
                      {brand.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 text-center leading-tight">
                    {brand.name}
                  </span>
                </div>
              )}

              {/* Bottom name bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 py-3 px-3">
                <span className="text-white text-xs font-bold tracking-wider uppercase text-center block drop-shadow-lg">
                  {brand.name}
                </span>
              </div>

              {/* Subtle shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}