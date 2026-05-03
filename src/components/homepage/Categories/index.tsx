"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
    <svg viewBox="0 0 48 48" className={`w-8 h-8 ${color}`} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="24" cy="16" r="8" />
      <path d="M18 28h12c3.3 0 6 2.7 6 6v6H12v-6c0-3.3 2.7-6 6-6z" />
      <path d="M32 8l6-6m0 0h-4m4 0v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (lower.includes("women") && lower.includes("sexual")) return (
    <svg viewBox="0 0 48 48" className={`w-8 h-8 ${color}`} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="24" cy="14" r="8" />
      <path d="M24 22v8m-5 0h10m-5 0v6" strokeLinecap="round" />
      <path d="M14 42c0-5.5 4.5-10 10-10s10 4.5 10 10" />
    </svg>
  );
  if (lower.includes("nutrition") || lower.includes("supplement")) return (
    <svg viewBox="0 0 48 48" className={`w-8 h-8 ${color}`} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="16" y="8" width="16" height="28" rx="8" />
      <path d="M16 24h16" strokeLinecap="round" />
      <path d="M24 4v4m0 32v4" strokeLinecap="round" />
    </svg>
  );
  if (lower.includes("weight")) return (
    <svg viewBox="0 0 48 48" className={`w-8 h-8 ${color}`} fill="none" stroke="currentColor" strokeWidth="1.8">
      <ellipse cx="24" cy="32" rx="14" ry="8" />
      <path d="M18 32V18a6 6 0 1112 0v14" />
      <path d="M12 20h8m8 0h8" strokeLinecap="round" />
    </svg>
  );
  if (lower.includes("gym") || lower.includes("fitness")) return (
    <svg viewBox="0 0 48 48" className={`w-8 h-8 ${color}`} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="20" width="6" height="8" rx="2" />
      <rect x="38" y="20" width="6" height="8" rx="2" />
      <rect x="10" y="16" width="6" height="16" rx="2" />
      <rect x="32" y="16" width="6" height="16" rx="2" />
      <path d="M16 24h16" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
  if (lower.includes("perfume") || lower.includes("spray") || lower.includes("fragrance")) return (
    <svg viewBox="0 0 48 48" className={`w-8 h-8 ${color}`} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="14" y="20" width="20" height="22" rx="3" />
      <path d="M20 20v-6h8v6" />
      <path d="M24 14v-4" strokeLinecap="round" />
      <path d="M28 10c2-2 4-1 4 1" strokeLinecap="round" />
      <circle cx="24" cy="31" r="3" />
    </svg>
  );
  // fallback
  return (
    <svg viewBox="0 0 48 48" className={`w-8 h-8 ${color}`} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="8" y="12" width="32" height="28" rx="4" />
      <path d="M16 12V8a8 8 0 0116 0v4" strokeLinecap="round" />
    </svg>
  );
}

// ── Skeleton ───────────────────────────────────────────────
function CategorySkeleton() {
  return (
    <section className="py-6 sm:py-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-100 animate-pulse rounded-full" />
          <div className="h-6 w-40 bg-gray-100 animate-pulse rounded-lg" />
        </div>
      </div>
      <div className="flex gap-3 overflow-hidden">
        {[1,2,3,4,5,6,7,8].map((i) => (
          <div key={i} className="flex-shrink-0 w-24 h-24 bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
        ))}
      </div>
    </section>
  );
}

// ── Single category card ───────────────────────────────────
function CategoryCard({ category, idx }: { category: any; idx: number }) {
  const colors = getColors(category.color);
  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className={`
        group relative flex-shrink-0 flex flex-col items-center justify-center gap-2
        ${colors.bg} ${colors.border}
        border rounded-2xl p-3
        w-24 h-24
        hover:shadow-md hover:-translate-y-0.5
        transition-all duration-200 ease-out
        overflow-hidden
      `}
      style={{ animationDelay: `${idx * 40}ms` }}
    >
      {/* Subtle accent circle */}
      <div className={`absolute -top-3 -right-3 w-12 h-12 rounded-full opacity-10 ${colors.accent}`} />

      {/* Image / icon */}
      {category.icon ? (
        <img
          src={getImageUrl(category.icon)}
          alt={category.name}
          className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300"
        />
      ) : category.image ? (
        <img
          src={getImageUrl(category.image)}
          alt={category.name}
          className="w-8 h-8 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className={`w-8 h-8 flex items-center justify-center opacity-60`}>
          <CategoryIcon name={category.name} color={colors.text} />
        </div>
      )}

      {/* Name */}
      <span className={`text-[10px] font-bold ${colors.text} text-center leading-tight line-clamp-2 relative z-10`}>
        {category.name}
      </span>
    </Link>
  );
}

// ── Main component ─────────────────────────────────────────
export default function CategoryGrid() {
  const [parentCategories, setParentCategories] = useState<any[]>([]);
  const [allCategories, setAllCategories]       = useState<any[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [showAll, setShowAll]                   = useState(false);
  const [loadingAll, setLoadingAll]             = useState(false);

  const scrollRef    = useRef<HTMLDivElement>(null);
  const autoScrollId = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStartId  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Fetch parent categories on mount ──
  useEffect(() => {
    const fetchCategories = async () => {
      // Try cache first
      try {
        const cached = localStorage.getItem('homepage_parent_categories_v3');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.cats?.length > 0 && Date.now() - parsed.ts < 5 * 60 * 1000) {
            setParentCategories(parsed.cats);
            setLoading(false);
          }
        }
      } catch {}

      try {
        // /categories/tree returns only active parents with their children
        const response = await apiClient.getCategoriesTree();
        if (response.status) {
          const raw: any = response.data;
          const cats = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
          if (cats.length > 0) {
            setParentCategories(cats);
            localStorage.setItem('homepage_parent_categories_v3', JSON.stringify({ cats, ts: Date.now() }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ── Auto-scroll: starts after 1 minute, scrolls left slowly ──
  const startAutoScroll = useCallback(() => {
    if (!scrollRef.current) return;
    autoScrollId.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      // Wrap around
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 96, behavior: "smooth" }); // one card width
      }
    }, 2000); // scroll one card every 2s
  }, []);

  useEffect(() => {
    autoStartId.current = setTimeout(startAutoScroll, 60_000); // start after 1 minute
    return () => {
      if (autoStartId.current)  clearTimeout(autoStartId.current);
      if (autoScrollId.current) clearInterval(autoScrollId.current);
    };
  }, [startAutoScroll]);

  // Pause auto-scroll when user touches/hovers the row
  const pauseScroll = () => {
    if (autoScrollId.current) { clearInterval(autoScrollId.current); autoScrollId.current = null; }
  };
  const resumeScroll = () => {
    if (!autoScrollId.current) startAutoScroll();
  };

  // ── Fetch all categories when "See All" is clicked ──
  const handleSeeAll = async () => {
    if (showAll) { setShowAll(false); return; }
    if (allCategories.length > 0) { setShowAll(true); return; }

    setLoadingAll(true);
    try {
      const response = await apiClient.getCategories();
      if (response.status) {
        const raw: any = response.data;
        const cats = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
        setAllCategories(cats);
      }
    } catch {}
    setLoadingAll(false);
    setShowAll(true);
  };

  if (loading) return <CategorySkeleton />;

  const displayedCategories = showAll ? allCategories : parentCategories;

  return (
    <section className="py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#009E3C] mb-0.5">Discover Wellness</p>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Shop by Category</h2>
          <p className="mt-0.5 text-xs text-gray-400 max-w-sm">Explore our premium selection curated just for you.</p>
        </div>
        <button
          onClick={handleSeeAll}
          disabled={loadingAll}
          className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#009E3C] hover:text-[#007a2e] transition-colors group border border-[#009E3C]/30 rounded-full px-3 py-1.5 hover:bg-[#009E3C]/5"
        >
          {loadingAll ? (
            <span className="w-3 h-3 border-2 border-[#009E3C] border-t-transparent rounded-full animate-spin" />
          ) : showAll ? (
            <>Show Less <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></>
          ) : (
            <>See All Categories <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg></>
          )}
        </button>
      </div>

      {/* Empty state */}
      {parentCategories.length === 0 && (
        <div className="py-10 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-sm">No categories available.</p>
        </div>
      )}

      {/* ── DEFAULT VIEW: scrollable row of parent categories ── */}
      {!showAll && parentCategories.length > 0 && (
        <div
          ref={scrollRef}
          onMouseEnter={pauseScroll}
          onMouseLeave={resumeScroll}
          onTouchStart={pauseScroll}
          onTouchEnd={resumeScroll}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {parentCategories.map((category, idx) => (
            <div key={category.id} className="snap-start">
              <CategoryCard category={category} idx={idx} />
            </div>
          ))}
        </div>
      )}

      {/* ── EXPANDED VIEW: grid of all categories ── */}
      {showAll && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {loadingAll
            ? [1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="w-24 h-24 bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
              ))
            : allCategories.map((category, idx) => (
                <CategoryCard key={category.id} category={category} idx={idx} />
              ))
          }
        </div>
      )}

      {/* Mobile "See All" button */}
      <div className="mt-4 flex sm:hidden justify-center">
        <button
          onClick={handleSeeAll}
          disabled={loadingAll}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#009E3C] border border-[#009E3C]/30 rounded-full px-4 py-1.5 hover:bg-[#009E3C]/5"
        >
          {loadingAll ? (
            <span className="w-3 h-3 border-2 border-[#009E3C] border-t-transparent rounded-full animate-spin" />
          ) : showAll ? "Show Less" : "See All Categories"}
        </button>
      </div>
    </section>
  );
}
