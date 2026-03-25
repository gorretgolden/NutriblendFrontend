"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductCarousel from "@/components/common/ProductCarousel";
import { Product } from "@/types/product.types";

const FlashSale = ({ products }: { products: Product[] | null }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 0,
    seconds: 39
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <section className="w-full mb-8 md:mb-14">
      {/* Flash Sale Header Bar */}
      <div className="bg-[#009E3C] text-white py-3 px-4 sm:px-6 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 2v10h3v9l7-12h-4l4-7z"/>
            </svg>
            <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter">Flash Sales</h2>
          </div>
          <div className="hidden lg:flex items-center space-x-2">
            <span className="text-sm font-medium opacity-90 uppercase">Time Left:</span>
            <div className="flex items-center space-x-1 font-mono font-bold text-lg">
              <span className="bg-black/20 px-1.5 py-0.5 rounded">{timeLeft.hours.toString().padStart(2, '0')}</span>
              <span>:</span>
              <span className="bg-black/20 px-1.5 py-0.5 rounded">{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span>:</span>
              <span className="bg-black/20 px-1.5 py-0.5 rounded">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
        
        <Link href="/shop?on_sale=true" className="text-sm font-bold uppercase hover:underline flex items-center">
          See All 
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Carousel Container */}
      <div className="bg-white border-x border-b border-[#009E3C]/15 shadow-xl shadow-[#009E3C]/5 rounded-b-2xl overflow-hidden pt-4">
        <ProductCarousel 
          products={products} 
          title="" 
          hideHeader={true}
        />
      </div>
    </section>
  );
};

export default FlashSale;
