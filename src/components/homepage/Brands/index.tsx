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
    <section className="relative w-full py-10 md:py-16 overflow-hidden bg-white rounded-3xl border border-gray-50">
      {/* ── Decorative elements ── */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-emerald-50/40 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative max-w-[1560px] mx-auto px-4 sm:px-6">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 md:mb-14">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-5"
            >
              <span className="w-2 h-2 rounded-full bg-[#009E3C] animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.15em] text-[#009E3C] uppercase">Trusted Partners</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.1] mb-5"
            >
              Premium{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009E3C] to-[#00bc49]">
                Clinical Brands
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 text-base md:text-lg leading-relaxed font-medium"
            >
              Partnering with global pharmaceutical leaders to bring you 
              certified efficacy and rigorous wellness standards.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/brands"
              className="group inline-flex items-center gap-3 h-14 px-8 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-[#009E3C] transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-emerald-100"
            >
              Explore All Brands
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* ── Auto-Scrolling Brands Row ── */}
        <div className="relative group">
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <motion.div 
              animate={{ x: [0, -1000] }}
              transition={{ 
                duration: 40, 
                repeat: Infinity, 
                ease: "linear",
                repeatType: "loop"
              }}
              className="flex gap-4 md:gap-6 py-4 pr-6 shrink-0"
            >
              {/* Duplicate brands for infinite scroll */}
              {[...brands, ...brands, ...brands].map((brand, i) => (
                <Link
                  key={`${brand.id}-${i}`}
                  href={`/shop?brand_id=${brand.id}`}
                  className="group/card relative flex flex-col items-center justify-center p-6 rounded-3xl bg-white border border-gray-100 hover:border-emerald-200 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,158,60,0.1)] overflow-hidden aspect-square w-[160px] md:w-[200px] shrink-0"
                >
                  {/* Subtle hover background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                  
                  {/* Logo Container */}
                  <div className="relative z-10 w-full flex-1 flex items-center justify-center">
                    {brand.image ? (
                      <img
                        src={getImageUrl(brand.image)}
                        alt={brand.name}
                        className="w-full h-auto max-h-[80px] object-contain filter grayscale group-hover/card:grayscale-0 opacity-70 group-hover/card:opacity-100 scale-100 group-hover/card:scale-110 transition-all duration-700 ease-out"
                      />
                    ) : (
                      <div className="text-3xl font-black text-gray-200 group-hover/card:text-[#009E3C]/40 transition-all duration-500 tracking-tighter uppercase">
                        {brand.name.substring(0, 2)}
                      </div>
                    )}
                  </div>

                  {/* Brand Info */}
                  <div className="relative z-10 mt-4 text-center w-full">
                    <h3 className="font-extrabold text-gray-800 group-hover/card:text-gray-900 text-sm md:text-base truncate transition-colors duration-300">
                      {brand.name}
                    </h3>
                    <div className="h-1 w-0 group-hover/card:w-8 bg-[#009E3C] mx-auto mt-2 rounded-full transition-all duration-500" />
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
