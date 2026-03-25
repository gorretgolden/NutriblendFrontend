"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const PromoBanners = () => {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">

        {/* Banner 1 — Gym & Fitness */}
        <Link
          href="/shop?category=gym-and-fitness"
          className="relative h-[200px] md:h-[260px] lg:h-[300px] rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500"
        >
          <Image
            src="/images/one.avif"
            alt="Gym and Fitness"
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/85 via-[#0f172a]/50 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-center px-7 md:px-9 text-white">
            <span className="inline-flex items-center gap-1.5 bg-[#F3911E] text-white text-[9px] font-black px-2.5 py-1 rounded-full w-fit mb-3 uppercase tracking-widest shadow-sm">
              <span className="w-1 h-1 bg-white rounded-full" />
              Hot Category
            </span>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 leading-none tracking-tight">
              Gym &amp;<br />Fitness
            </h3>
            <p className="text-sm text-white/80 mb-5 font-medium max-w-[200px] leading-snug">
              Optimum Nutrition, MuscleTech &amp; Mega Sport
            </p>
            <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white bg-white/15 border border-white/25 backdrop-blur-sm px-4 py-2 rounded-full w-fit group-hover:bg-white group-hover:text-gray-900 transition-all duration-300">
              Shop Now
              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Banner 2 — Perfumes & Sprays */}
        <Link
          href="/shop?category=perfumes-and-sprays"
          className="relative h-[200px] md:h-[260px] lg:h-[300px] rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500"
        >
          <Image
            src="/images/43.avif"
            alt="Perfumes and Sprays"
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          />
          {/* Purple-toned overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2e1065]/85 via-[#4c1d95]/50 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-center px-7 md:px-9 text-white">
            <span className="inline-flex items-center gap-1.5 bg-[#8b5cf6] text-white text-[9px] font-black px-2.5 py-1 rounded-full w-fit mb-3 uppercase tracking-widest shadow-sm">
              <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
              New Collection
            </span>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 leading-none tracking-tight">
              Luxury<br />Fragrances
            </h3>
            <p className="text-sm text-white/80 mb-5 font-medium max-w-[200px] leading-snug">
              Lattafa, Dior, Davidoff &amp; Fragrance World
            </p>
            <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white bg-white/15 border border-white/25 backdrop-blur-sm px-4 py-2 rounded-full w-fit group-hover:bg-white group-hover:text-gray-900 transition-all duration-300">
              Explore
              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

      </div>
    </section>
  );
};

export default PromoBanners;
