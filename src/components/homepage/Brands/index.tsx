"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClient, getImageUrl } from "@/lib/api/client";
import { motion } from "framer-motion";

export default function BrandsSection() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // Cache name with v5 for fresh latest sorting
        const cached = localStorage.getItem('brands_cache_v5');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 5 * 60 * 1000) { // 5 min cache
            setBrands(data.slice(0, 8));
            setLoading(false);
            return;
          }
        }

        const response = await apiClient.getBrands();
        if (response.status && response.data) {
          // The backend now returns latest first
          const fetched = response.data;
          setBrands(fetched.slice(0, 8));
          localStorage.setItem('brands_cache_v5', JSON.stringify({
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
      <section className="relative w-full py-10 md:py-16 overflow-hidden bg-white rounded-3xl border border-gray-50">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-4">
              <div className="h-4 w-32 bg-gray-100 animate-pulse rounded-full" />
              <div className="h-10 w-64 bg-gray-100 animate-pulse rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square bg-gray-50 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section className="relative w-full py-8 md:py-12 overflow-hidden bg-white">
      <div className="relative max-w-[1560px] mx-auto px-4 sm:px-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-8 mb-8 md:mb-10">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight"
            >
              Shop by <span className="text-[#009E3C]">Brands</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/brands"
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#009E3C] hover:text-[#007a2e] transition-colors"
            >
              View all
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* ── Auto-Scrolling Brands Row ── */}
        <div className="relative group">
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
            <motion.div 
              animate={{ x: [0, -1200] }}
              transition={{ 
                duration: 45, 
                repeat: Infinity, 
                ease: "linear",
                repeatType: "loop"
              }}
              className="flex gap-4 md:gap-5 py-4 pr-5 shrink-0"
            >
              {/* Duplicate brands for infinite scroll */}
              {[...brands, ...brands, ...brands].map((brand, i) => (
                <Link
                  key={`${brand.id}-${i}`}
                  href={`/shop?brand_id=${brand.id}`}
                  className="group/card relative flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 transition-all duration-500 hover:shadow-lg overflow-hidden aspect-square w-[130px] md:w-[160px] shrink-0"
                >
                  {/* Logo Container */}
                  <div className="relative z-10 w-full flex-1 flex items-center justify-center">
                    {brand.image ? (
                      <img
                        src={getImageUrl(brand.image)}
                        alt={brand.name}
                        className="w-full h-auto max-h-[70px] object-contain group-hover/card:scale-110 transition-all duration-700 ease-out"
                      />
                    ) : (
                      <div className="text-2xl font-black text-gray-200 group-hover/card:text-[#009E3C]/40 transition-all duration-500 tracking-tighter uppercase">
                        {brand.name.substring(0, 2)}
                      </div>
                    )}
                  </div>

                  {/* Brand Info */}
                  <div className="relative z-10 mt-3 text-center w-full">
                    <h3 className="font-bold text-gray-700 group-hover/card:text-[#009E3C] text-[13px] md:text-sm truncate transition-colors duration-300">
                      {brand.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
      </div>
    </section>
  );
}
