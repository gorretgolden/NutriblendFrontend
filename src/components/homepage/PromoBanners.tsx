"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const PromoBanners = () => {
  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 mb-8 md:mb-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Banner 1: Tech/Vitamins Sale */}
        <Link href="/shop" className="relative h-[200px] md:h-[280px] rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-500">
          <Image 
            src="/images/one.avif" 
            alt="Promotion 1" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent flex flex-col justify-center px-8 text-white">
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-3 uppercase tracking-wider">Limited Offer</span>
            <h3 className="text-2xl md:text-3xl font-black mb-2 uppercase leading-none">Vibrant Health<br/>Big Sale</h3>
            <p className="text-sm md:text-base opacity-90 mb-4 font-medium">Up to 60% OFF on selected items</p>
            <div className="flex items-center text-sm font-bold uppercase group-hover:translate-x-2 transition-transform">
              Shop Now
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Banner 2: Newsletter/Deal */}
        <Link href="/shop" className="relative h-[200px] md:h-[280px] rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-500">
          <Image 
            src="/images/43.avif" 
            alt="Promotion 2" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-transparent flex flex-col justify-center px-8 text-white">
            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-3 uppercase tracking-wider">New Arrival</span>
            <h3 className="text-2xl md:text-3xl font-black mb-2 uppercase leading-none">Pure Organic<br/>Proteins</h3>
            <p className="text-sm md:text-base opacity-90 mb-4 font-medium">Natural fueling for your body</p>
            <div className="flex items-center text-sm font-bold uppercase group-hover:translate-x-2 transition-transform">
              Discover
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default PromoBanners;
