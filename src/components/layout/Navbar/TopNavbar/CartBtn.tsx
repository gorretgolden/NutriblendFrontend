"use client";

import { useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CartBtn = () => {
  const { cart } = useAppSelector((state: RootState) => state.carts);
  const count = cart?.totalQuantities ?? 0;

  return (
    <Link
      href="/cart"
      className="relative group transition-all duration-300 active:scale-90"
    >
      {/* Ripple/Glow Effect */}
      {count > 0 && (
        <span className="absolute inset-0 rounded-full bg-[#009E3C]/20 animate-ping duration-[2000ms]"></span>
      )}
      
      {/* Main Circular Button */}
      <div className="relative z-10 w-12 h-12 rounded-full bg-[#009E3C] flex items-center justify-center shadow-[0_8px_20px_rgba(0,158,60,0.3)] hover:shadow-[0_12px_28px_rgba(0,158,60,0.45)] transition-all duration-300 group-hover:-translate-y-0.5 overflow-visible">
        <svg 
          className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>

        {/* Dynamic Badge */}
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-white text-[#009E3C] text-[11px] font-black rounded-full min-w-[22px] h-[22px] px-1 flex items-center justify-center shadow-lg ring-2 ring-[#009E3C] animate-in zoom-in duration-500">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </div>
    </Link>
  );
};
export default CartBtn;
