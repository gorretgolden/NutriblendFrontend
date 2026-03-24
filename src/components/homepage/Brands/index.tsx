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
      <section className="relative w-full py-12 md:py-20 overflow-hidden bg-white rounded-2xl border border-gray-100">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end mb-10">
            <div className="space-y-3">
              <div className="h-3.5 w-28 bg-gray-100 animate-shimmer rounded-full" />
              <div className="h-9 w-56 bg-gray-100 animate-shimmer rounded-xl" />
              <div className="h-4 w-80 bg-gray-100 animate-shimmer rounded-full" />
            </div>
            <div className="h-11 w-36 bg-gray-100 animate-shimmer rounded-full hidden sm:block" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="aspect-square bg-gray-50 animate-shimmer rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section className="relative w-full py-12 md:py-20 overflow-hidden bg-white rounded-2xl border border-gray-100">

      {/* ── Decorative blobs ── */}
      <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-80 h-80 bg-[#009E3C]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-72 h-72 bg-[#F3911E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1560px] mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="max-w-xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#009E3C]/8 border border-[#009E3C]/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#009E3C] animate-pulse" />
              <span className="text-[10px] font-black tracking-widest text-[#009E3C] uppercase">Trusted Partners</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-3">
              Premium{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009E3C] to-[#00bc49]">
                Clinical Brands
              </span>
            </h2>

            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              World-class pharmaceutical and wellness brands — renowned for certified
              efficacy and rigorous quality standards.
            </p>
          </div>

          <Link
            href="/brands"
            className="group inline-flex items-center gap-2 h-11 px-6 rounded-full border-2 border-gray-900 text-gray-900 font-bold text-sm hover:bg-gray-900 hover:text-white transition-all duration-250 flex-shrink-0"
          >
            Explore All Brands
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* ── Brands grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {brands.map((brand, i) => (
            <Link
              key={brand.id}
              href={`/shop?brand_id=${brand.id}`}
              className="group relative flex flex-col items-center justify-center p-5 md:p-7 rounded-2xl bg-white border border-gray-100 hover:border-[#009E3C]/25 transition-all duration-350 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 overflow-hidden aspect-square"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#009E3C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 rounded-2xl" />

              {/* Top-right accent dot */}
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#009E3C]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Logo */}
              <div className="relative z-10 w-full flex-1 flex items-center justify-center max-w-[110px]">
                {brand.image ? (
                  <img
                    src={getImageUrl(brand.image)}
                    alt={brand.name}
                    className="w-full h-auto max-h-[64px] object-contain filter grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 scale-100 group-hover:scale-105 transition-all duration-400"
                  />
                ) : (
                  <div className="text-2xl font-black text-gray-200 group-hover:text-[#009E3C]/60 transition-colors duration-400 tracking-tight uppercase select-none">
                    {brand.name.substring(0, 2)}
                  </div>
                )}
              </div>

              {/* Name & count */}
              <div className="relative z-10 mt-4 text-center w-full">
                <h3 className="font-bold text-gray-800 group-hover:text-gray-900 text-xs md:text-sm truncate transition-colors duration-200 mb-0.5">
                  {brand.name}
                </h3>
                {brand.products_count > 0 && (
                  <p className="text-[10px] text-gray-400 group-hover:text-[#009E3C] transition-colors duration-300 font-medium">
                    {brand.products_count} Formula{brand.products_count !== 1 ? "s" : ""}
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
