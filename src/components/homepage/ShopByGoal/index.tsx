"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";

interface GoalItem {
  label: string;
  href: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

// Icons extracted from the previous static implementation for reuse
const Icons = {
  Vitamins: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
    </svg>
  ),
  MensHealth: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  WomensHealth: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full">
      <circle cx="12" cy="8" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v8m-3-3h6" />
    </svg>
  ),
  Fitness: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  WeightLoss: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  Perfumes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  ),
  Beauty: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
    </svg>
  ),
  Immune: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  Heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  Brain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  Default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )
};

const getIcon = (name: string, slug: string) => {
  const n = (name + " " + slug).toLowerCase();
  if (n.includes('vitamin') || n.includes('mineral') || n.includes('supplement')) return Icons.Vitamins;
  if (n.includes('men')) return Icons.MensHealth;
  if (n.includes('women')) return Icons.WomensHealth;
  if (n.includes('fitness') || n.includes('gym') || n.includes('sport')) return Icons.Fitness;
  if (n.includes('weight') || n.includes('diet') || n.includes('slim')) return Icons.WeightLoss;
  if (n.includes('perfume') || n.includes('spray') || n.includes('fragrance') || n.includes('scent')) return Icons.Perfumes;
  if (n.includes('beauty') || n.includes('skin') || n.includes('care')) return Icons.Beauty;
  if (n.includes('immune')) return Icons.Immune;
  if (n.includes('heart')) return Icons.Heart;
  if (n.includes('brain') || n.includes('focus') || n.includes('memory')) return Icons.Brain;
  return Icons.Default;
};

const getColor = (name: string, slug: string) => {
  const n = (name + " " + slug).toLowerCase();
  if (n.includes('vitamin')) return { color: "#f97316", bgColor: "#fff7ed" };
  if (n.includes('men')) return { color: "#3b82f6", bgColor: "#eff6ff" };
  if (n.includes('women')) return { color: "#ec4899", bgColor: "#fdf2f8" };
  if (n.includes('fitness')) return { color: "#8b5cf6", bgColor: "#f5f3ff" };
  if (n.includes('weight')) return { color: "#14b8a6", bgColor: "#f0fdfa" };
  if (n.includes('perfume')) return { color: "#a855f7", bgColor: "#faf5ff" };
  if (n.includes('beauty')) return { color: "#f43f5e", bgColor: "#fff1f2" };
  if (n.includes('immune')) return { color: "#009E3C", bgColor: "#f0fdf4" };
  if (n.includes('heart')) return { color: "#ef4444", bgColor: "#fef2f2" };
  if (n.includes('brain')) return { color: "#6366f1", bgColor: "#eef2ff" };
  return { color: "#64748b", bgColor: "#f8fafc" };
};

export default function ShopByGoal() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const cached = localStorage.getItem('categories_cache_v4');
        let categories = [];
        
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 2 * 60 * 1000) {
            categories = data;
          }
        }

        if (categories.length === 0) {
          const response = await apiClient.getCategoriesTree();
          if (response.status && response.data) {
            categories = response.data;
          }
        }

        if (categories.length > 0) {
          const mappedGoals = categories
            .filter((cat: any) => cat.is_featured) // Only show featured categories
            .slice(0, 12)
            .map((cat: any) => {
            const { color, bgColor } = getColor(cat.name, cat.slug);
            return {
              label: cat.name,
              href: `/shop?category=${cat.slug}`,
              color: cat.color || color,
              bgColor: cat.bgColor || bgColor,
              imageUrl: cat.full_image_url || cat.full_icon_url || null, // Use full image for banner first
              fallbackIcon: getIcon(cat.name, cat.slug)
            };
          });
          
          // If no featured categories, fallback to first 12
          const finalGoals = mappedGoals.length > 0 ? mappedGoals : categories.slice(0, 12).map((cat: any) => {
            const { color, bgColor } = getColor(cat.name, cat.slug);
            return {
              label: cat.name,
              href: `/shop?category=${cat.slug}`,
              color: cat.color || color,
              bgColor: cat.bgColor || bgColor,
              imageUrl: cat.full_image_url || cat.full_icon_url || null,
              fallbackIcon: getIcon(cat.name, cat.slug)
            };
          });

          setGoals(finalGoals);
        }
      } catch (error) {
        console.error("Failed to fetch goals", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  if (loading && goals.length === 0) {
    return (
      <div className="w-full bg-white py-6 animate-pulse">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="h-8 w-64 bg-gray-100 rounded-lg mb-6" />
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="flex flex-col items-center gap-3 flex-none">
                <div className="w-20 h-20 rounded-full bg-gray-100" />
                <div className="h-3 w-16 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (goals.length === 0) return null;

  return (
    <section className="w-full bg-white border-b border-gray-100 py-6 sm:py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#009E3C] mb-1">Our Collection</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Shop by Categories</h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#009E3C] hover:text-[#007a2e] transition-all group pb-1 border-b-2 border-transparent hover:border-[#009E3C]"
          >
            Explore all
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Dynamic Category List */}
        <div
          className="flex md:flex-wrap md:justify-start gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {goals.map((goal) => (
            <Link
              key={goal.label}
              href={goal.href}
              className="flex flex-col items-start gap-4 flex-none group w-[100px] sm:w-[120px]"
            >
              <div
                className="w-full aspect-square rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-emerald-100 border border-gray-100 group-hover:border-emerald-200 overflow-hidden bg-white relative"
              >
                {goal.imageUrl ? (
                  <img 
                    src={goal.imageUrl} 
                    alt={goal.label} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                    style={{ color: goal.color, backgroundColor: goal.bgColor }}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
                      {goal.fallbackIcon}
                    </div>
                  </div>
                )}
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
              </div>
              <div className="space-y-1 w-full text-left">
                <span className="block text-[14px] sm:text-[15px] font-black text-gray-900 leading-tight group-hover:text-[#009E3C] transition-colors line-clamp-2">
                  {goal.label}
                </span>
                <span className="text-[11px] font-bold text-[#009E3C] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0 duration-300 block">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar { display: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}

