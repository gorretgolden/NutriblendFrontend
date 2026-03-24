"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  FaAppleAlt, FaDumbbell, FaBath, FaFemale, FaShoppingBag,
  FaHome, FaBaby, FaDog, FaChevronLeft, FaChevronRight, FaBoxes,
  FaLeaf, FaHeart, FaBone, FaFish, FaRunning, FaCapsules, FaMale,
  FaBolt, FaWeight, FaSpa, FaDna, FaBrain, FaMoon, FaSeedling,
  FaShoppingCart, FaPaw, FaChild, FaHandHoldingHeart, FaPaintBrush,
  FaEye, FaWind,
} from "react-icons/fa";
import { apiClient } from "@/lib/api/client";

// ── Icon Registry ──────────────────────────────────────────
const iconRegistry: Record<string, React.ReactElement> = {
  capsules: <FaCapsules />, leaf: <FaLeaf />, herbs: <FaLeaf />,
  heart: <FaHeart />, brain: <FaBrain />, eye: <FaEye />,
  lungs: <FaWind />, dna: <FaDna />, liver: <FaLeaf />,
  gut: <FaCapsules />, immunity: <FaHandHoldingHeart />,
  dumbbell: <FaDumbbell />, running: <FaRunning />, muscle: <FaDumbbell />,
  weight: <FaWeight />, bolt: <FaBolt />, bone: <FaBone />,
  joint: <FaBone />, fish: <FaFish />, stomach: <FaCapsules />,
  spa: <FaSpa />, paintbrush: <FaPaintBrush />, bath: <FaBath />,
  seedling: <FaSeedling />, perfume: <FaBath />, female: <FaFemale />,
  male: <FaMale />, baby: <FaBaby />, child: <FaChild />,
  "hand-holding-heart": <FaHandHoldingHeart />, apple: <FaAppleAlt />,
  cart: <FaShoppingCart />, "shopping-bag": <FaShoppingBag />,
  home: <FaHome />, dog: <FaDog />, paw: <FaPaw />, moon: <FaMoon />,
  box: <FaBoxes />,
};

// ── Color Map ──────────────────────────────────────────────
const colorMap: Record<string, { text: string; bg: string; ring: string }> = {
  purple:  { text: "text-purple-600",  bg: "bg-purple-50  border-purple-100",  ring: "group-hover:ring-purple-200"  },
  green:   { text: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", ring: "group-hover:ring-emerald-200" },
  pink:    { text: "text-pink-500",    bg: "bg-pink-50    border-pink-100",    ring: "group-hover:ring-pink-200"    },
  blue:    { text: "text-blue-600",    bg: "bg-blue-50    border-blue-100",    ring: "group-hover:ring-blue-200"    },
  red:     { text: "text-red-500",     bg: "bg-red-50     border-red-100",     ring: "group-hover:ring-red-200"     },
  orange:  { text: "text-orange-600",  bg: "bg-orange-50  border-orange-100",  ring: "group-hover:ring-orange-200"  },
  amber:   { text: "text-amber-600",   bg: "bg-amber-50   border-amber-100",   ring: "group-hover:ring-amber-200"   },
  teal:    { text: "text-teal-600",    bg: "bg-teal-50    border-teal-100",    ring: "group-hover:ring-teal-200"    },
  cyan:    { text: "text-cyan-600",    bg: "bg-cyan-50    border-cyan-100",    ring: "group-hover:ring-cyan-200"    },
  indigo:  { text: "text-indigo-600",  bg: "bg-indigo-50  border-indigo-100",  ring: "group-hover:ring-indigo-200"  },
  rose:    { text: "text-rose-500",    bg: "bg-rose-50    border-rose-100",    ring: "group-hover:ring-rose-200"    },
  emerald: { text: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", ring: "group-hover:ring-emerald-200" },
  sky:     { text: "text-sky-600",     bg: "bg-sky-50     border-sky-100",     ring: "group-hover:ring-sky-200"     },
  violet:  { text: "text-violet-600",  bg: "bg-violet-50  border-violet-100",  ring: "group-hover:ring-violet-200"  },
  yellow:  { text: "text-yellow-600",  bg: "bg-yellow-50  border-yellow-100",  ring: "group-hover:ring-yellow-200"  },
  stone:   { text: "text-stone-600",   bg: "bg-stone-50   border-stone-100",   ring: "group-hover:ring-stone-200"   },
};

// ── Fallback keyword → icon/color ─────────────────────────
const fallbackByKeyword: Record<string, { icon: string; color: string }> = {
  supplement: { icon: "capsules", color: "purple" },
  herbal:     { icon: "herbs",    color: "green"  },
  vitamin:    { icon: "capsules", color: "amber"  },
  immune:     { icon: "heart",    color: "red"    },
  respiratory:{ icon: "lungs",    color: "sky"    },
  detox:      { icon: "leaf",     color: "emerald"},
  liver:      { icon: "leaf",     color: "emerald"},
  gut:        { icon: "capsules", color: "teal"   },
  sexual:     { icon: "male",     color: "blue"   },
  performance:{ icon: "bolt",     color: "amber"  },
  fitness:    { icon: "running",  color: "indigo" },
  blood:      { icon: "heart",    color: "red"    },
  cardio:     { icon: "heart",    color: "red"    },
  brain:      { icon: "brain",    color: "violet" },
  pregnancy:  { icon: "baby",     color: "rose"   },
  lactation:  { icon: "baby",     color: "rose"   },
  bone:       { icon: "bone",     color: "stone"  },
  joint:      { icon: "bone",     color: "stone"  },
  skin:       { icon: "spa",      color: "pink"   },
  beauty:     { icon: "spa",      color: "pink"   },
  kids:       { icon: "child",    color: "orange" },
  perfume:    { icon: "perfume",  color: "blue"   },
  loreal:     { icon: "perfume",  color: "rose"   },
  collection: { icon: "perfume",  color: "violet" },
  women:      { icon: "female",   color: "pink"   },
  men:        { icon: "male",     color: "blue"   },
  baby:       { icon: "baby",     color: "rose"   },
};

const getFallback = (name: string) => {
  const lower = name.toLowerCase();
  for (const [key, config] of Object.entries(fallbackByKeyword)) {
    if (lower.includes(key)) return config;
  }
  return { icon: "box", color: "blue" };
};

const getCategoryDisplay = (category: any) => {
  const fallback = getFallback(category.name);
  const colorKey = category.color || fallback.color;
  const colors = colorMap[colorKey] || colorMap.green;
  const iconKey = category.icon || fallback.icon;
  const icon = iconRegistry[iconKey] || iconRegistry.box;
  return { textColor: colors.text, bgColor: colors.bg, ringColor: colors.ring, icon };
};

// ── Loading Skeleton ───────────────────────────────────────
function CategorySkeleton() {
  return (
    <section className="py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-100 animate-shimmer rounded-full" />
          <div className="h-7 w-44 bg-gray-100 animate-shimmer rounded-lg" />
        </div>
      </div>
      <div className="hidden md:flex items-center gap-8 px-4 overflow-hidden">
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="flex flex-col items-center flex-shrink-0">
            <div className="w-28 h-28 rounded-full bg-gray-100 animate-shimmer" />
            <div className="mt-3 h-3 w-20 bg-gray-100 animate-shimmer rounded-full" />
          </div>
        ))}
      </div>
      <div className="md:hidden grid grid-cols-2 gap-3">
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="h-14 bg-gray-100 animate-shimmer rounded-xl" />
        ))}
      </div>
    </section>
  );
}

export default function CategoryGrid() {
  const mainScrollRef = useRef<HTMLDivElement | null>(null);
  const pillScrollRef = useRef<HTMLDivElement | null>(null);

  const [showMainLeft, setShowMainLeft] = useState(false);
  const [showMainRight, setShowMainRight] = useState(true);
  const [showPillLeft, setShowPillLeft] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cached = localStorage.getItem('homepage_categories_cache_v2');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.data?.categories?.length > 0) {
            setCategories(parsed.data.categories);
            setSubcategories(parsed.data.subcategories || []);
            setLoading(false);
          }
        }
      } catch (e) {}

      try {
        const response = await apiClient.getCategoriesTree();
        if (response.status) {
          const rawCats = response.data;
          const cats = Array.isArray(rawCats) ? rawCats : (Array.isArray(rawCats?.data) ? rawCats.data : []);
          if (cats && cats.length > 0) {
            setCategories(cats);
            const subs = cats.flatMap((cat: any) => cat.children || []);
            setSubcategories(subs.slice(0, 15));
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

  const handleMainScroll = () => {
    if (mainScrollRef.current) {
      const el = mainScrollRef.current;
      setShowMainLeft(el.scrollLeft > 10);
      setShowMainRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }
  };

  const scrollMainLeft  = () => mainScrollRef.current?.scrollBy({ left: -260, behavior: 'smooth' });
  const scrollMainRight = () => mainScrollRef.current?.scrollBy({ left: 260, behavior: 'smooth' });
  const scrollPillLeft  = () => pillScrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  const scrollPillRight = () => pillScrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  const handlePillScroll = () => {
    if (pillScrollRef.current) {
      setShowPillLeft(pillScrollRef.current.scrollLeft > 10);
    }
  };

  if (loading) return <CategorySkeleton />;

  return (
    <section className="py-5 sm:py-7">

      {/* ── Section header ── */}
      <div className="flex items-center justify-between mb-5 sm:mb-7 px-1">
        <div>
          <div className="inline-flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#009E3C] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#009E3C]">All Categories</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">
            Shop by Category
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#009E3C] hover:text-[#007a2e] transition-colors group"
        >
          View all
          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {categories.length === 0 && !loading && (
        <div className="py-10 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-sm">No categories available. Check backend settings.</p>
        </div>
      )}

      {/* ── Desktop: horizontal scroll with circular icons ── */}
      {categories.length > 0 && (
        <div className="relative mb-6 hidden md:block">
          {/* Left fade + arrow */}
          {showMainLeft && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none rounded-l-xl" />
              <button
                onClick={scrollMainLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-[#009E3C] hover:border-[#009E3C]/30 hover:scale-110 transition-all duration-200 z-20"
                aria-label="Scroll left"
              >
                <FaChevronLeft size={14} />
              </button>
            </>
          )}

          <div
            ref={mainScrollRef}
            onScroll={handleMainScroll}
            className="flex items-end gap-6 lg:gap-8 overflow-x-auto hide-scrollbar px-2 pb-2"
          >
            {categories.map((category, idx) => {
              const display = getCategoryDisplay(category);
              return (
                <Link
                  href={`/shop?category=${category.slug}`}
                  key={category.id}
                  className="flex flex-col items-center flex-shrink-0 group cursor-pointer"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  {/* Circle icon */}
                  <div
                    className={`
                      w-24 h-24 lg:w-28 lg:h-28 flex items-center justify-center rounded-full border
                      ${display.bgColor}
                      shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                      group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]
                      group-hover:scale-105 group-hover:-translate-y-1
                      ring-4 ring-transparent group-hover:ring-white
                      transition-all duration-300 ease-out
                    `}
                  >
                    <span className={`${display.textColor} transition-transform duration-300 group-hover:scale-110`}>
                      {React.cloneElement(display.icon, { size: 36 })}
                    </span>
                  </div>

                  {/* Label */}
                  <span className="mt-2.5 text-[13px] font-semibold text-gray-700 group-hover:text-[#009E3C] text-center transition-colors duration-200 max-w-[90px] leading-tight">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right fade + arrow */}
          <>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none rounded-r-xl" />
            <button
              onClick={scrollMainRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-[#009E3C] hover:border-[#009E3C]/30 hover:scale-110 transition-all duration-200 z-20"
              aria-label="Scroll right"
            >
              <FaChevronRight size={14} />
            </button>
          </>
        </div>
      )}

      {/* ── Mobile: 2-column card grid ── */}
      {categories.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5 md:hidden mb-6">
          {categories.map((category) => {
            const display = getCategoryDisplay(category);
            return (
              <Link
                href={`/shop?category=${category.slug}`}
                key={category.id}
                className={`
                  group flex items-center gap-3 px-3 py-3 rounded-xl border
                  ${display.bgColor}
                  hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]
                  hover:-translate-y-0.5
                  active:scale-[0.97]
                  transition-all duration-250
                `}
              >
                <div className="w-9 h-9 rounded-lg bg-white/70 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className={display.textColor}>
                    {React.cloneElement(display.icon, { size: 18 })}
                  </span>
                </div>
                <span className="text-[12px] font-bold text-gray-800 group-hover:text-gray-900 leading-tight line-clamp-2">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Subcategory pills ── */}
      {subcategories.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="h-px flex-1 bg-gray-100" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex-shrink-0">
              Popular Sub-categories
            </p>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div className="relative">
            {showPillLeft && (
              <>
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <button
                  onClick={scrollPillLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-7 h-7 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-[#009E3C] hover:border-[#009E3C]/30 transition-all duration-200 z-20"
                  aria-label="Scroll left"
                >
                  <FaChevronLeft size={10} />
                </button>
              </>
            )}

            <div
              ref={pillScrollRef}
              onScroll={handlePillScroll}
              className="flex items-center gap-2 overflow-x-auto hide-scrollbar px-1 py-1"
            >
              {subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/shop?category=${sub.slug}`}
                  className="flex-shrink-0 bg-white border border-gray-200 text-gray-600 text-xs font-semibold px-3.5 py-1.5 rounded-full hover:bg-[#009E3C]/8 hover:text-[#009E3C] hover:border-[#009E3C]/30 transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-[0_2px_8px_rgba(0,158,60,0.15)]"
                >
                  {sub.name}
                </Link>
              ))}
            </div>

            <>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
              <button
                onClick={scrollPillRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-7 h-7 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-[#009E3C] hover:border-[#009E3C]/30 transition-all duration-200 z-20"
                aria-label="Scroll right"
              >
                <FaChevronRight size={10} />
              </button>
            </>
          </div>
        </>
      )}
    </section>
  );
}
