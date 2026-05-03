"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { apiClient, getImageUrl } from "@/lib/api/client";

export default function ShopByGoal() {
  const [parentCategories, setParentCategories] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollId = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStartId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cached = localStorage.getItem('homepage_parent_categories_v4');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.cats?.length > 0 && Date.now() - parsed.ts < 5 * 60 * 1000) {
            setParentCategories(parsed.cats);
            setLoading(false);
          }
        }

        const response = await apiClient.getCategoriesTree();
        if (response.status) {
          const raw: any = response.data;
          const cats = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
          if (cats.length > 0) {
            setParentCategories(cats);
            localStorage.setItem('homepage_parent_categories_v4', JSON.stringify({ cats, ts: Date.now() }));
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

  const startAutoScroll = useCallback(() => {
    if (!scrollRef.current) return;
    autoScrollId.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 160, behavior: "smooth" }); // scroll by approximately one card
      }
    }, 2000); // every 2s
  }, []);

  useEffect(() => {
    autoStartId.current = setTimeout(startAutoScroll, 60_000); // 1 minute
    return () => {
      if (autoStartId.current) clearTimeout(autoStartId.current);
      if (autoScrollId.current) clearInterval(autoScrollId.current);
    };
  }, [startAutoScroll]);

  const pauseScroll = () => {
    if (autoScrollId.current) { clearInterval(autoScrollId.current); autoScrollId.current = null; }
  };
  const resumeScroll = () => {
    if (!autoScrollId.current) startAutoScroll();
  };

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

  if (loading && parentCategories.length === 0) {
    return (
      <div className="w-full bg-white py-6 animate-pulse border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="h-8 w-64 bg-gray-100 rounded-lg mb-6" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex flex-col flex-none w-[160px] sm:w-[180px]">
                <div className="w-full aspect-[5/4] rounded-t-2xl bg-gray-100" />
                <div className="h-10 w-full bg-gray-50 rounded-b-2xl border-t border-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (parentCategories.length === 0) return null;

  const CategoryCardItem = ({ cat }: { cat: any }) => {
    // Priority: icon (Category Image square) -> image (Banner)
    let imageUrl = cat.full_icon_url || cat.full_image_url || null;
    if (!imageUrl) {
      if (cat.icon) imageUrl = getImageUrl(cat.icon);
      else if (cat.image) imageUrl = getImageUrl(cat.image);
    }

    return (
      <Link
        href={`/shop?category=${cat.slug}`}
        className="flex flex-col group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-[0_12px_28px_rgba(0,158,60,0.08)] hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1 bg-white h-full"
      >
        <div className="w-full aspect-[5/4] bg-[#f8f9fa] flex items-center justify-center relative overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={cat.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('fallback-bg');
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="w-full bg-[#f1f5f9] py-3 px-2 flex items-center justify-center border-t border-gray-100 mt-auto">
          <span className="block text-[13.5px] sm:text-[14.5px] font-[800] text-gray-700 leading-tight group-hover:text-[#009E3C] transition-colors text-center line-clamp-1">
            {cat.name}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <section className="w-full bg-white border-b border-gray-100 py-6 sm:py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div className="space-y-1">
            <h2 className="text-[26px] sm:text-[34px] font-[900] text-gray-900 tracking-tight leading-none">Shop by Category</h2>
            <p className="text-gray-500 text-sm sm:text-base font-medium">Explore our premium selection curated just for you.</p>
          </div>
          <button
            onClick={handleSeeAll}
            disabled={loadingAll}
            className="hidden sm:inline-flex items-center gap-2.5 text-[15px] font-extrabold text-[#009E3C] hover:text-[#007a2e] transition-all group px-5 py-2.5 bg-emerald-50 rounded-full hover:bg-emerald-100"
          >
            {loadingAll ? (
              <span className="w-4 h-4 border-2 border-[#009E3C] border-t-transparent rounded-full animate-spin" />
            ) : showAll ? (
              <>Show Less</>
            ) : (
              <>
                See All Categories
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Category List */}
        {!showAll ? (
          <div
            ref={scrollRef}
            onMouseEnter={pauseScroll}
            onMouseLeave={resumeScroll}
            onTouchStart={pauseScroll}
            onTouchEnd={resumeScroll}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {parentCategories.map((cat) => (
              <div key={cat.id} className="snap-start flex-none w-[160px] sm:w-[180px]">
                <CategoryCardItem cat={cat} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {(allCategories.length > 0 ? allCategories : parentCategories).map((cat) => (
              <CategoryCardItem key={cat.id} cat={cat} />
            ))}
          </div>
        )}

        <div className="mt-4 flex sm:hidden justify-center">
          <button
            onClick={handleSeeAll}
            disabled={loadingAll}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#009E3C] border border-[#009E3C]/30 rounded-full px-5 py-2 hover:bg-[#009E3C]/5"
          >
            {loadingAll ? (
              <span className="w-4 h-4 border-2 border-[#009E3C] border-t-transparent rounded-full animate-spin" />
            ) : showAll ? "Show Less" : "See All Categories"}
          </button>
        </div>

      </div>

      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style>
    </section>
  );
}
