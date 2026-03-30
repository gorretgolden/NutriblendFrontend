"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient, getImageUrl } from "@/lib/api/client";

// ── Category color palette ─────────────────────────────────
const categoryColors: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  blue:    { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-100",    accent: "bg-blue-500"    },
  pink:    { bg: "bg-pink-50",    text: "text-pink-700",    border: "border-pink-100",    accent: "bg-pink-500"    },
  green:   { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", accent: "bg-emerald-500" },
  red:     { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-100",     accent: "bg-red-500"     },
  orange:  { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-100",  accent: "bg-orange-500"  },
  purple:  { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-100",  accent: "bg-violet-500"  },
};

const defaultColor = categoryColors.green;

const getColors = (color?: string) =>
  (color && categoryColors[color]) ? categoryColors[color] : defaultColor;

// ── Category icons (SVG) ───────────────────────────────────
function CategoryIcon({ name, color }: { name: string; color: string }) {
  const lower = name.toLowerCase();

  if (lower.includes("men") && lower.includes("sexual")) return (
    <svg viewBox="0 0 48 48" className={`w-10 h-10 ${color}`} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="24" cy="16" r="8" />
      <path d="M18 28h12c3.3 0 6 2.7 6 6v6H12v-6c0-3.3 2.7-6 6-6z" />
      <path d="M32 8l6-6m0 0h-4m4 0v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (lower.includes("women") && lower.includes("sexual")) return (
    <svg viewBox="0 0 48 48" className={`w-10 h-10 ${color}`} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="24" cy="14" r="8" />
      <path d="M24 22v8m-5 0h10m-5 0v6" strokeLinecap="round" />
      <path d="M14 42c0-5.5 4.5-10 10-10s10 4.5 10 10" />
    </svg>
  );
  if (lower.includes("nutrition") || lower.includes("supplement")) return (
    <svg viewBox="0 0 48 48" className={`w-10 h-10 ${color}`} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="16" y="8" width="16" height="28" rx="8" />
      <path d="M16 24h16" strokeLinecap="round" />
      <path d="M24 4v4m0 32v4" strokeLinecap="round" />
    </svg>
  );
  if (lower.includes("weight")) return (
    <svg viewBox="0 0 48 48" className={`w-10 h-10 ${color}`} fill="none" stroke="currentColor" strokeWidth="1.8">
      <ellipse cx="24" cy="32" rx="14" ry="8" />
      <path d="M18 32V18a6 6 0 1112 0v14" />
      <path d="M12 20h8m8 0h8" strokeLinecap="round" />
    </svg>
  );
  if (lower.includes("gym") || lower.includes("fitness")) return (
    <svg viewBox="0 0 48 48" className={`w-10 h-10 ${color}`} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="20" width="6" height="8" rx="2" />
      <rect x="38" y="20" width="6" height="8" rx="2" />
      <rect x="10" y="16" width="6" height="16" rx="2" />
      <rect x="32" y="16" width="6" height="16" rx="2" />
      <path d="M16 24h16" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
  if (lower.includes("perfume") || lower.includes("spray") || lower.includes("fragrance")) return (
    <svg viewBox="0 0 48 48" className={`w-10 h-10 ${color}`} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="14" y="20" width="20" height="22" rx="3" />
      <path d="M20 20v-6h8v6" />
      <path d="M24 14v-4" strokeLinecap="round" />
      <path d="M28 10c2-2 4-1 4 1" strokeLinecap="round" />
      <circle cx="24" cy="31" r="3" />
    </svg>
  );
  // fallback
  return (
    <svg viewBox="0 0 48 48" className={`w-10 h-10 ${color}`} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="8" y="12" width="32" height="28" rx="4" />
      <path d="M16 12V8a8 8 0 0116 0v4" strokeLinecap="round" />
    </svg>
  );
}

// ── Skeleton ───────────────────────────────────────────────
function CategorySkeleton() {
  return (
    <section className="py-8 sm:py-10">
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="space-y-2">
          <div className="h-3 w-32 bg-gray-100 animate-shimmer rounded-full" />
          <div className="h-7 w-48 bg-gray-100 animate-shimmer rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="h-36 sm:h-40 bg-gray-50 animate-shimmer rounded-2xl border border-gray-100" />
        ))}
      </div>
    </section>
  );
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cached = localStorage.getItem('homepage_categories_cache_v2');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.data?.categories?.length > 0) {
            setCategories(parsed.data.categories);
            setLoading(false);
          }
        }
      } catch (e) {}

      try {
        const response = await apiClient.getCategoriesTree();
        if (response.status) {
          const rawCats: any = response.data;
          const cats = Array.isArray(rawCats) ? rawCats : (Array.isArray(rawCats?.data) ? rawCats.data : []);
          if (cats && cats.length > 0) {
            setCategories(cats);
            const subs = cats.flatMap((cat: any) => cat.children || []);
            localStorage.setItem('homepage_categories_cache_v2', JSON.stringify({
              data: { categories: cats, subcategories: subs.slice(0, 15) },
              timestamp: Date.now()
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <CategorySkeleton />;

  return (
    <section className="py-8 sm:py-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6 px-1">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-[#009E3C] mb-1">Discover Wellness</p>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="mt-1 text-sm text-gray-500 max-w-md">Explore our curated selection of premium health and wellness products.</p>
        </div>
        <Link
          href="/shop"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#009E3C] hover:text-[#007a2e] transition-colors group"
        >
          View all
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {categories.length === 0 && !loading && (
        <div className="py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-sm">No categories available.</p>
        </div>
      )}

      {/* ── Clean card grid — iHerb style ── */}
      {categories.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((category, idx) => {
            const colors = getColors(category.color);
            return (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className={`
                  group relative flex flex-col items-center justify-center gap-3
                  ${colors.bg} ${colors.border}
                  border rounded-2xl p-5 sm:p-6
                  hover:shadow-lg hover:-translate-y-1
                  transition-all duration-250 ease-out
                  overflow-hidden
                `}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Background accent circle */}
                <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 ${colors.accent}`} />

                {/* Category image or icon */}
                {category.icon ? (
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <img
                      src={getImageUrl(category.icon)}
                      alt={category.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : category.image ? (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className={`w-14 h-14 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0 shadow-sm opacity-50`}>
                    <CategoryIcon name={category.name} color={colors.text} />
                  </div>
                )}

                {/* Name */}
                <span className={`text-[12px] sm:text-[13px] font-bold ${colors.text} text-center leading-tight relative z-10`}>
                  {category.name}
                </span>

                {/* Hover arrow */}
                <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full ${colors.accent} opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
