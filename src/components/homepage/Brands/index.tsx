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
        const cached = localStorage.getItem('brands_cache_v4');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 15 * 60 * 1000) {
            setBrands(data.slice(0, 10));
            setLoading(false);
            return;
          }
        }

        const response = await apiClient.getBrands();
        if (response.status && response.data) {
          const fetched = response.data.slice(0, 10);
          setBrands(fetched);
          localStorage.setItem('brands_cache_v4', JSON.stringify({
            data: fetched,
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
      <section className="relative w-full py-16 md:py-24 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-4">
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-full" />
              <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-3xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 mb-4 border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold tracking-wider text-green-700 uppercase">Trusted Partners</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">Clinical Brands</span>
            </h2>
            <p className="mt-4 text-gray-500 text-lg">
              Explore our curation of world-class pharmaceutical and wellness brands, renowned for their certified efficacy and rigorous quality standards.
            </p>
          </div>
          <Link
            href="/brands"
            className="group inline-flex items-center gap-2 h-12 px-6 rounded-full bg-gray-900 text-white font-medium hover:bg-green-600 transition-colors duration-300"
          >
            Explore Directory
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Brands Grid (Staggered modern layout) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {brands.map((brand, i) => (
            <Link
              key={brand.id}
              href={`/shop?brand_id=${brand.id}`}
              className="group relative flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl bg-white border border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-2 overflow-hidden aspect-[4/3] sm:aspect-square"
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 w-full flex-1 flex items-center justify-center max-w-[120px]">
                {brand.image ? (
                  <img
                    src={getImageUrl(brand.image)}
                    alt={brand.name}
                    className="w-full h-auto max-h-[70px] object-contain filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="text-3xl font-black text-gray-300 group-hover:text-green-500 transition-colors duration-500 tracking-tighter uppercase">
                    {brand.name.substring(0, 2)}
                  </div>
                )}
              </div>

              <div className="relative z-10 mt-6 text-center w-full">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate truncate mb-1 border-b border-transparent group-hover:border-green-200 pb-1 w-max mx-auto transition-all duration-300">
                  {brand.name}
                </h3>
                {brand.products_count > 0 && (
                  <p className="text-xs text-gray-400 group-hover:text-green-600 transition-colors duration-300">
                    {brand.products_count} Formula{brand.products_count !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}