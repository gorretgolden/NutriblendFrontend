"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiClient, getImageUrl } from "@/lib/api/client";

interface BannerItem {
  image: string;
  alt: string;
  href: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
}

const BADGE_COLORS = ["#f97316", "#009E3C", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6"];
const BADGE_LABELS = ["Hot Category", "Best Sellers", "New Arrivals", "Top Picks", "Trending", "Popular"];

function mapCategoryToBanner(cat: any, idx: number): BannerItem {
  const slug = cat.slug || "";
  const name = cat.name || "Category";
  // Prioritize banner for featured section
  const rawImage = cat.full_banner_url || cat.banner || cat.full_image_url || cat.image || "";
  const image = getImageUrl(rawImage);

  return {
    image,
    alt: name,
    href: `/shop?category=${slug}`,
    badge: BADGE_LABELS[idx % BADGE_LABELS.length],
    badgeColor: BADGE_COLORS[idx % BADGE_COLORS.length],
    title: name,
    subtitle: cat.description || "Premium range",
  };
}

export default function ThreeColBanners() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiClient.getCategories();
        if (cancelled) return;

        // The API returns { data: [...], status: true }
        const allCats = Array.isArray(res?.data) ? res.data : [];

        // Strictly only show featured categories, max 3
        const featured = allCats.filter((c: any) => c.is_featured).slice(0, 3);
        
        setBanners(featured.map(mapCategoryToBanner));
      } catch (error) {
        console.error("Failed to fetch featured categories:", error);
      } finally {
        setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Return null if loading or no featured categories exist - removes static fallback data
  if (isLoading || banners.length === 0) return null;

  const [large, topRight, bottomRight] = banners;

  return (
    <section className="w-full">
      <div className={`grid grid-cols-1 ${topRight ? 'md:grid-cols-2' : ''} gap-4 md:gap-5`}>

        {/* ── Large left banner (always shown if banners.length > 0) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href={large.href}
            className="relative block rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500 h-[300px] md:h-full md:min-h-[460px]"
          >
            <Image
              src={large.image}
              alt={large.alt}
              fill
              className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/85 via-[#0f172a]/40 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end px-7 md:px-9 pb-8 text-white">
              <span
                className="inline-flex items-center gap-1.5 text-white text-[9px] font-black px-2.5 py-1 rounded-full w-fit mb-3 uppercase tracking-widest shadow-sm"
                style={{ backgroundColor: large.badgeColor }}
              >
                <span className="w-1 h-1 bg-white rounded-full" />
                {large.badge}
              </span>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-black mb-2 leading-none tracking-tight">
                {large.title}
              </h3>
              <p className="text-sm text-white/80 mb-5 font-medium leading-snug max-w-md line-clamp-2">
                {large.subtitle}
              </p>
              <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white bg-white/15 border border-white/25 backdrop-blur-sm px-4 py-2 rounded-full w-fit group-hover:bg-white group-hover:text-gray-900 transition-all duration-300">
                Shop Now
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* ── Right column: stacked banners (only if more than 1 featured category) ── */}
        {(topRight || bottomRight) && (
          <div className="flex flex-col gap-4 md:gap-5">
            {/* Top right */}
            {topRight && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-full"
              >
                <Link
                  href={topRight.href}
                  className={`relative block rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500 ${bottomRight ? 'h-[200px] md:h-[218px]' : 'h-full'}`}
                >
                  <Image
                    src={topRight.image}
                    alt={topRight.alt}
                    fill
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/80 via-[#0f172a]/35 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-8 text-white">
                    <span
                      className="inline-flex items-center gap-1.5 text-white text-[9px] font-black px-2.5 py-1 rounded-full w-fit mb-2.5 uppercase tracking-widest shadow-sm"
                      style={{ backgroundColor: topRight.badgeColor }}
                    >
                      <span className="w-1 h-1 bg-white rounded-full" />
                      {topRight.badge}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black mb-1.5 leading-none tracking-tight">
                      {topRight.title}
                    </h3>
                    <p className="text-xs text-white/80 mb-4 font-medium leading-snug line-clamp-2">
                      {topRight.subtitle}
                    </p>
                    <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white bg-white/15 border border-white/25 backdrop-blur-sm px-3.5 py-1.5 rounded-full w-fit group-hover:bg-white group-hover:text-gray-900 transition-all duration-300">
                      Explore
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Bottom right */}
            {bottomRight && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link
                  href={bottomRight.href}
                  className="relative block rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500 h-[200px] md:h-[218px]"
                >
                  <Image
                    src={bottomRight.image}
                    alt={bottomRight.alt}
                    fill
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/80 via-[#0f172a]/35 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-8 text-white">
                    <span
                      className="inline-flex items-center gap-1.5 text-white text-[9px] font-black px-2.5 py-1 rounded-full w-fit mb-2.5 uppercase tracking-widest shadow-sm"
                      style={{ backgroundColor: bottomRight.badgeColor }}
                    >
                      <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                      {bottomRight.badge}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black mb-1.5 leading-none tracking-tight">
                      {bottomRight.title}
                    </h3>
                    <p className="text-xs text-white/80 mb-4 font-medium leading-snug line-clamp-2">
                      {bottomRight.subtitle}
                    </p>
                    <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white bg-white/15 border border-white/25 backdrop-blur-sm px-3.5 py-1.5 rounded-full w-fit group-hover:bg-white group-hover:text-gray-900 transition-all duration-300">
                      Explore
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
