"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { motion } from "framer-motion";

const BADGE_COLORS = [
  { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", hover: "hover:bg-emerald-100" },
  { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100", hover: "hover:bg-blue-100" },
  { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100", hover: "hover:bg-indigo-100" },
  { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100", hover: "hover:bg-rose-100" },
  { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", hover: "hover:bg-amber-100" },
  { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-100", hover: "hover:bg-violet-100" },
  { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-100", hover: "hover:bg-sky-100" },
  { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-100", hover: "hover:bg-teal-100" },
  { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-100", hover: "hover:bg-pink-100" },
  { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-100", hover: "hover:bg-orange-100" },
];

export default function BrandsSection() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const cached = localStorage.getItem('brands_cache_v5');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            setBrands(data.slice(0, 15));
            setLoading(false);
            return;
          }
        }

        const response = await apiClient.getBrands();
        if (response.status && response.data) {
          const fetched = response.data;
          setBrands(fetched.slice(0, 15));
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
      <section className="relative w-full py-10 md:py-16 overflow-hidden bg-white">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end mb-10">
            <div className="h-10 w-64 bg-gray-50 animate-pulse rounded-xl" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-12 w-32 bg-gray-50 animate-pulse rounded-full shrink-0" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section className="relative w-full py-6 md:py-10 overflow-hidden bg-white">
      <div className="relative max-w-[1560px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-8 mb-6">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[20px] sm:text-[28px] font-[900] text-gray-900 tracking-tight"
          >
            Shop by <span className="text-[#009E3C]">Brand</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/brands"
              className="group flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 text-xs font-bold text-gray-600 hover:border-[#009E3C] hover:text-[#009E3C] transition-all duration-300"
            >
              View all
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Scrolling Brands Row */}
        <div className="relative">
          {/* Fades for smooth entry/exit */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div className="flex overflow-hidden">
            <motion.div 
              animate={{ x: [0, -2000] }}
              transition={{ 
                duration: 40, 
                repeat: Infinity, 
                ease: "linear",
                repeatType: "loop"
              }}
              className="flex gap-3 py-1 pr-4 shrink-0"
            >
              {/* Triple brands for seamless loop */}
              {[...brands, ...brands, ...brands].map((brand, i) => {
                const color = BADGE_COLORS[i % BADGE_COLORS.length];
                return (
                  <Link
                    key={`${brand.id}-${i}`}
                    href={`/shop?brand_id=${brand.id}`}
                    className={`
                      group/badge relative px-5 py-2.5 rounded-full border transition-all duration-300
                      flex items-center justify-center whitespace-nowrap shadow-sm
                      ${color.bg} ${color.text} ${color.border} ${color.hover}
                      hover:shadow-md hover:-translate-y-0.5
                    `}
                  >
                    <span className="text-sm md:text-base font-extrabold tracking-tight">
                      {brand.name}
                    </span>
                  </Link>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
