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
        // Check cache first
        const cached = localStorage.getItem('brands_cache');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 15 * 60 * 1000) { // 15 minutes
            setBrands(data);
            setLoading(false);
            return;
          }
        }

        const response = await apiClient.getBrands();
        if (response.status && response.data) {
          setBrands(response.data.slice(0, 6)); // Show first 6 brands

          // Cache the response
          localStorage.setItem('brands_cache', JSON.stringify({
            data: response.data.slice(0, 6),
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
      <section className="w-full px-4 sm:px-6 lg:px-20 pt-4 pb-10 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800">
            Featured Brands
          </h2>
          <Link
            href="/brands"
            className="text-sm sm:text-base font-semibold text-green-800 hover:underline"
          >
            See All Brands
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="w-full h-28 sm:h-32 md:h-36 lg:h-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-xl"
            />
          ))}
        </div>
      </section>
    );
  }

  if (brands.length === 0) {
    return null; // Don't show section if no brands
  }

  return (
    <section className="w-full px-4 sm:px-6 lg:px-20 pt-4 pb-10 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800">
          Featured Brands
        </h2>
        <Link
          href="/brands"
          className="text-sm sm:text-base font-semibold text-green-800 hover:underline"
        >
          See All Brands
        </Link>
      </div>

      {/* Grid: mobile = 3 cols (only first 3 brands), sm+ = full list */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {brands.map((brand, i) => (
          <Link
            key={brand.id}
            href={`/shop?brand_id=${brand.id}`}
            className={`${i >= 3 ? "hidden sm:block" : "block"} 
                        relative w-full h-28 sm:h-32 md:h-36 lg:h-40 
                        bg-white border border-green-50 rounded-2xl overflow-hidden shadow-sm group hover:shadow-xl hover:border-green-200 transition-all duration-500 hover:-translate-y-1`}
          >
            {/* Logo fills rectangle */}
            {brand.logo ? (
              <img
                src={getImageUrl(brand.logo)}
                alt={brand.name}
                className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-green-800/30 font-bold text-lg group-hover:text-green-600 transition-colors">
                {brand.name}
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Name visible only on hover */}
            <span className="absolute bottom-2 left-2 right-2 text-white text-[10px] sm:text-xs font-bold text-center tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}