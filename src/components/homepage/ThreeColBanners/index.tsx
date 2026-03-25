"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface BannerItem {
  image: string;
  alt: string;
  href: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
}

const banners: BannerItem[] = [
  {
    image: "/images/one.avif",
    alt: "Gym and Fitness",
    href: "/shop?category=gym-and-fitness",
    badge: "Hot Category",
    badgeColor: "#f97316",
    title: "Gym & Fitness",
    subtitle: "Build your best body",
  },
  {
    image: "/images/bottle1.avif",
    alt: "Nutritional Supplements",
    href: "/shop?category=nutritional-supplements",
    badge: "Best Sellers",
    badgeColor: "#009E3C",
    title: "Supplements",
    subtitle: "Fuel from inside out",
  },
  {
    image: "/images/bottle2.avif",
    alt: "Weight Management",
    href: "/shop?category=weight-management",
    badge: "New Arrivals",
    badgeColor: "#3b82f6",
    title: "Weight Loss",
    subtitle: "Reach your goals",
  },
];

export default function ThreeColBanners() {
  const [large, topRight, bottomRight] = banners;

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5" style={{ gridTemplateRows: "auto" }}>

        {/* ── Large left banner (spans 2 rows on md+) ── */}
        <Link
          href={large.href}
          className="relative rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500 h-[260px] md:h-full md:min-h-[460px]"
        >
          <Image
            src={large.image}
            alt={large.alt}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/85 via-[#0f172a]/50 to-transparent" />

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
            <p className="text-sm text-white/80 mb-5 font-medium leading-snug">
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

        {/* ── Right column: 2 stacked banners ── */}
        <div className="flex flex-col gap-4 md:gap-5">

          {/* Top right */}
          <Link
            href={topRight.href}
            className="relative rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500 h-[200px] md:h-[218px]"
          >
            <Image
              src={topRight.image}
              alt={topRight.alt}
              fill
              className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/80 via-[#0f172a]/45 to-transparent" />

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
              <p className="text-xs text-white/80 mb-4 font-medium leading-snug">
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

          {/* Bottom right */}
          <Link
            href={bottomRight.href}
            className="relative rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500 h-[200px] md:h-[218px]"
          >
            <Image
              src={bottomRight.image}
              alt={bottomRight.alt}
              fill
              className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/80 via-[#0f172a]/45 to-transparent" />

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
              <p className="text-xs text-white/80 mb-4 font-medium leading-snug">
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

        </div>
      </div>
    </section>
  );
}
