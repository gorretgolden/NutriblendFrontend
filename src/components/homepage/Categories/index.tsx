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
  FaMale,
  FaBolt,
  FaWeight,
  FaSpa,
  FaDna,
  FaBrain,
  FaMoon,
  FaSeedling,
  FaShoppingCart,
  FaPaw,
  FaChild,
  FaHandHoldingHeart,
  FaPaintBrush,
  FaEye,
  FaWind,
} from "react-icons/fa";
import { apiClient } from "@/lib/api/client";

// ═══════════════════════════════════════════════════════
// ICON REGISTRY — Maps backend icon identifiers to React Icons
// Backend stores icon as "capsules", "leaf", etc.
// ═══════════════════════════════════════════════════════
const iconRegistry: Record<string, React.ReactElement> = {
  // Health & Supplements
  capsules: <FaCapsules />,
  leaf: <FaLeaf />,
  herbs: <FaLeaf />,
  heart: <FaHeart />,
  brain: <FaBrain />,
  eye: <FaEye />,
  lungs: <FaWind />,
  dna: <FaDna />,
  liver: <FaLeaf />, // Fallback icon
  gut: <FaCapsules />, // Fallback icon
  immunity: <FaHandHoldingHeart />,

  // Fitness & Body
  dumbbell: <FaDumbbell />,
  running: <FaRunning />,
  muscle: <FaDumbbell />,
  weight: <FaWeight />,
  bolt: <FaBolt />,

  // Bone & Joint
  bone: <FaBone />,
  joint: <FaBone />,

  // Omega & Fish
  fish: <FaFish />,

  // Digestive
  stomach: <FaCapsules />,

  // Beauty & Personal Care
  spa: <FaSpa />,
  paintbrush: <FaPaintBrush />,
  bath: <FaBath />,
  seedling: <FaSeedling />,
  perfume: <FaBath />, // Use bath as scent/perfume icon

  // People
  female: <FaFemale />,
  male: <FaMale />,
  baby: <FaBaby />,
  child: <FaChild />,
  "hand-holding-heart": <FaHandHoldingHeart />,

  // Food & Shopping
  apple: <FaAppleAlt />,
  cart: <FaShoppingCart />,
  "shopping-bag": <FaShoppingBag />,

  // Home & Pets
  home: <FaHome />,
  dog: <FaDog />,
  paw: <FaPaw />,

  // Sleep & Mental
  moon: <FaMoon />,

  // Default
  box: <FaBoxes />,
};

// ═══════════════════════════════════════════════════════
// COLOR MAP — Maps backend color keys to Tailwind classes
// ═══════════════════════════════════════════════════════
const colorMap: Record<string, { text: string; bg: string }> = {
  purple: { text: "text-purple-600", bg: "bg-purple-50 border-purple-100" },
  green: { text: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
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

// ═══════════════════════════════════════════════════════
// FALLBACK — When backend icon/color fields are empty
// ═══════════════════════════════════════════════════════
const fallbackByKeyword: Record<string, { icon: string; color: string }> = {
  supplement: { icon: "capsules", color: "purple" },
  herbal: { icon: "herbs", color: "green" },
  vitamin: { icon: "capsules", color: "amber" },
  immune: { icon: "heart", color: "red" },
  respiratory: { icon: "lungs", color: "sky" },
  detox: { icon: "leaf", color: "emerald" },
  liver: { icon: "leaf", color: "emerald" },
  gut: { icon: "capsules", color: "teal" },
  sexual: { icon: "male", color: "blue" },
  performance: { icon: "bolt", color: "amber" },
  fitness: { icon: "running", color: "indigo" },
  blood: { icon: "heart", color: "red" },
  cardio: { icon: "heart", color: "red" },
  brain: { icon: "brain", color: "violet" },
  pregnancy: { icon: "baby", color: "rose" },
  lactation: { icon: "baby", color: "rose" },
  bone: { icon: "bone", color: "stone" },
  joint: { icon: "bone", color: "stone" },
  skin: { icon: "spa", color: "pink" },
  beauty: { icon: "spa", color: "pink" },
  kids: { icon: "child", color: "orange" },
  perfume: { icon: "perfume", color: "blue" },
  loreal: { icon: "perfume", color: "rose" },
  collection: { icon: "perfume", color: "violet" },
  women: { icon: "female", color: "pink" },
  men: { icon: "male", color: "blue" },
  baby: { icon: "baby", color: "rose" },
};

const getFallback = (name: string) => {
  const lowerName = name.toLowerCase();
  for (const [key, config] of Object.entries(fallbackByKeyword)) {
    if (lowerName.includes(key)) return config;
  }
  return { icon: "box", color: "blue" };
};

/**
 * Gets display config for a category.
 * Priority: backend-provided icon/color > fallback by name keyword
 */
const getCategoryDisplay = (category: any) => {
  const fallback = getFallback(category.name);

  // Color: use backend value, or fallback by name
  const colorKey = category.color || fallback.color;
  const colors = colorMap[colorKey] || colorMap.green;

  // Icon: use backend icon identifier, or fallback by name keyword
  const iconKey = category.icon || fallback.icon;
  const icon = iconRegistry[iconKey] || iconRegistry.box;

  return {
    textColor: colors.text,
    bgColor: colors.bg,
    icon,
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
                  <span className={display.textColor}>
                    {React.cloneElement(display.icon, { size: 48 })}
                  </span>
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
                <span className={display.textColor}>
                  {React.cloneElement(display.icon, { size: 20 })}
                </span>
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
