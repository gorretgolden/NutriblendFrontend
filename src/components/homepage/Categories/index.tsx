"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  FaAppleAlt,
  FaDumbbell,
  FaBath,
  FaFemale,
  FaShoppingBag,
  FaHome,
  FaBaby,
  FaDog,
  FaChevronLeft,
  FaChevronRight,
  FaBoxes,
  FaLeaf,
  FaHeart,
  FaBone,
  FaFish,
  FaRunning,
  FaCapsules,
} from "react-icons/fa";
import { apiClient } from "@/lib/api/client";

// Tailwind color map — maps color keys from backend to actual classes
const colorMap: Record<string, { text: string; bg: string }> = {
  purple: { text: "text-purple-600", bg: "bg-purple-50 border-purple-100" },
  green: { text: "text-green-600", bg: "bg-green-50 border-green-100" },
  pink: { text: "text-pink-500", bg: "bg-pink-50 border-pink-100" },
  blue: { text: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
  red: { text: "text-red-500", bg: "bg-red-50 border-red-100" },
  orange: { text: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
  amber: { text: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
  teal: { text: "text-teal-600", bg: "bg-teal-50 border-teal-100" },
  cyan: { text: "text-cyan-600", bg: "bg-cyan-50 border-cyan-100" },
  indigo: { text: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
  rose: { text: "text-rose-500", bg: "bg-rose-50 border-rose-100" },
  emerald: { text: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  sky: { text: "text-sky-600", bg: "bg-sky-50 border-sky-100" },
  violet: { text: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
  yellow: { text: "text-yellow-600", bg: "bg-yellow-50 border-yellow-100" },
  stone: { text: "text-stone-600", bg: "bg-stone-50 border-stone-100" },
};

// Fallback icon mapping (used when backend has no icon_emoji set)
const fallbackIcons: Record<string, any> = {
  supplements: <FaCapsules />,
  herbal: <FaLeaf />,
  protein: <FaDumbbell />,
  fitness: <FaRunning />,
  vitamin: <FaCapsules />,
  immune: <FaHeart />,
  bone: <FaBone />,
  joint: <FaBone />,
  omega: <FaFish />,
  fish: <FaFish />,
  weight: <FaDumbbell />,
  women: <FaFemale />,
  men: <FaRunning />,
  mother: <FaBaby />,
  baby: <FaBaby />,
  food: <FaAppleAlt />,
  beauty: <FaFemale />,
  bath: <FaBath />,
  grocery: <FaShoppingBag />,
  home: <FaHome />,
  pet: <FaDog />,
  energy: <FaDumbbell />,
};

// Fallback color mapping by keyword
const fallbackColors: Record<string, string> = {
  supplements: "purple", herbal: "green", protein: "orange", fitness: "blue",
  vitamin: "amber", immune: "red", bone: "teal", joint: "teal",
  omega: "cyan", fish: "cyan", weight: "indigo", women: "pink",
  men: "blue", mother: "rose", baby: "rose", food: "green",
  beauty: "pink", bath: "sky", grocery: "amber", home: "stone",
  pet: "yellow", energy: "green",
};

const getFallbackIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  for (const [key, icon] of Object.entries(fallbackIcons)) {
    if (lowerName.includes(key)) return icon;
  }
  return <FaBoxes />;
};

const getFallbackColor = (name: string): string => {
  const lowerName = name.toLowerCase();
  for (const [key, color] of Object.entries(fallbackColors)) {
    if (lowerName.includes(key)) return color;
  }
  return "green";
};

/**
 * Gets display config for a category.
 * Priority: backend-provided icon_emoji/color > fallback by name keyword
 */
const getCategoryDisplay = (category: any) => {
  // Color: use backend value, or fallback by name
  const colorKey = category.color || getFallbackColor(category.name);
  const colors = colorMap[colorKey] || colorMap.green;

  // Icon: use backend emoji, or fallback react-icon
  const hasEmoji = category.icon_emoji && category.icon_emoji.trim();

  return {
    colorKey,
    textColor: colors.text,
    bgColor: colors.bg,
    emoji: hasEmoji ? category.icon_emoji : null,
    fallbackIcon: hasEmoji ? null : getFallbackIcon(category.name),
  };
};

export default function CategoryGrid() {
  const mainScrollRef = useRef<HTMLDivElement | null>(null);
  const pillScrollRef = useRef<HTMLDivElement | null>(null);

  const [showMainLeft, setShowMainLeft] = useState(false);
  const [showPillLeft, setShowPillLeft] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.getCategoriesTree();
        if (response.status && response.data) {
          const cats = response.data;
          setCategories(cats);

          const subs = cats.flatMap((cat: any) => cat.children || []);
          setSubcategories(subs.slice(0, 15));

          localStorage.setItem('homepage_categories_cache_v2', JSON.stringify({
            data: { categories: cats, subcategories: subs.slice(0, 15) },
            timestamp: Date.now()
          }));
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const scrollMainLeft = () => {
    mainScrollRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  };
  const scrollMainRight = () => {
    mainScrollRef.current?.scrollBy({ left: 250, behavior: "smooth" });
  };
  const handleMainScroll = () => {
    if (mainScrollRef.current) {
      setShowMainLeft(mainScrollRef.current.scrollLeft > 0);
    }
  };

  const scrollPillLeft = () => {
    pillScrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };
  const scrollPillRight = () => {
    pillScrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };
  const handlePillScroll = () => {
    if (pillScrollRef.current) {
      setShowPillLeft(pillScrollRef.current.scrollLeft > 0);
    }
  };

  if (loading) {
    return (
      <section className="py-6 sm:py-8">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4 sm:mb-6">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:gap-10 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-full h-20 sm:w-32 sm:h-32 rounded-xl sm:rounded-full animate-shimmer" />
              <div className="mt-2 h-3 w-16 animate-shimmer rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-8">
      <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4 sm:mb-6">
        Shop by Category
      </h2>

      {categories.length === 0 && !loading && (
        <div className="py-8 sm:py-10 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed">
          <p>No categories found. Please check backend settings.</p>
        </div>
      )}

      {/* Desktop/Large screens: scrollable categories with arrows */}
      <div className="relative mb-6 hidden md:block">
        {showMainLeft && (
          <button
            onClick={scrollMainLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white border rounded-full p-3 shadow-md z-10 hover:bg-gray-50 transition"
            aria-label="Scroll left"
          >
            <FaChevronLeft size={20} />
          </button>
        )}

        <div
          ref={mainScrollRef}
          onScroll={handleMainScroll}
          className="flex items-center gap-10 overflow-x-auto hide-scrollbar px-6"
        >
          {categories.map((category) => {
            const display = getCategoryDisplay(category);
            return (
              <Link
                href={`/shop?category=${category.slug}`}
                key={category.id}
                className="flex flex-col items-center flex-shrink-0 group"
              >
                <div className={`w-32 h-32 flex items-center justify-center rounded-full ${display.bgColor} border shadow-md group-hover:scale-105 transition duration-300`}>
                  {display.emoji ? (
                    <span className="text-5xl">{display.emoji}</span>
                  ) : (
                    <span className={display.textColor}>
                      {React.cloneElement(display.fallbackIcon, { size: 48 })}
                    </span>
                  )}
                </div>
                <span className="mt-3 text-base font-medium text-gray-800 text-center">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>

        <button
          onClick={scrollMainRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white border rounded-full p-3 shadow-md z-10 hover:bg-gray-50 transition"
          aria-label="Scroll right"
        >
          <FaChevronRight size={20} />
        </button>
      </div>

      {/* Mobile view: attractive card grid */}
      <div className="grid grid-cols-2 gap-3 md:hidden mb-6">
        {categories.map((category) => {
          const display = getCategoryDisplay(category);
          return (
            <Link
              href={`/shop?category=${category.slug}`}
              key={category.id}
              className={`flex items-center gap-3 ${display.bgColor} border rounded-xl p-3 hover:shadow-md hover:scale-[1.02] transition-all duration-300 active:scale-95`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white/60 flex-shrink-0`}>
                {display.emoji ? (
                  <span className="text-xl">{display.emoji}</span>
                ) : (
                  <span className={display.textColor}>
                    {React.cloneElement(display.fallbackIcon, { size: 20 })}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Subcategory pills label */}
      {subcategories.length > 0 && (
        <h3 className="text-sm sm:text-md font-semibold mb-3 text-gray-600 px-1">
          Popular subcategories
        </h3>
      )}

      {/* Scrollable Pills - Subcategories */}
      {subcategories.length > 0 && (
        <div className="relative">
          {showPillLeft && (
            <button
              onClick={scrollPillLeft}
              className="flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white border rounded-full p-2 shadow-md z-10 hover:bg-gray-50 transition"
              aria-label="Scroll left"
            >
              <FaChevronLeft />
            </button>
          )}

          <div
            ref={pillScrollRef}
            onScroll={handlePillScroll}
            className="flex items-center gap-2 sm:gap-3 overflow-x-auto hide-scrollbar px-1 sm:px-2"
          >
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/shop?category=${sub.slug}`}
                className="flex-shrink-0 bg-white border border-gray-200 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition cursor-pointer whitespace-nowrap text-xs sm:text-sm font-medium"
              >
                {sub.name}
              </Link>
            ))}
          </div>

          <button
            onClick={scrollPillRight}
            className="flex absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow-md z-10 hover:bg-gray-50 transition"
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}
