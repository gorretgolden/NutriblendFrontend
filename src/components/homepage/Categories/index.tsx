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
} from "react-icons/fa";
import { apiClient } from "@/lib/api/client";

// Icon mapping for categories
const categoryIcons: Record<string, any> = {
  supplements: <FaAppleAlt />,
  sports: <FaDumbbell />,
  bath: <FaBath />,
  beauty: <FaFemale />,
  grocery: <FaShoppingBag />,
  home: <FaHome />,
  baby: <FaBaby />,
  pets: <FaDog />,
  default: <FaBoxes />,
};

const getIconForCategory = (name: string) => {
  const lowerName = name.toLowerCase();
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (lowerName.includes(key)) return icon;
  }
  return categoryIcons.default;
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
        // Check cache first
        const cached = localStorage.getItem('homepage_categories_cache');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 10 * 60 * 1000) {
            setCategories(data.categories);
            setSubcategories(data.subcategories);
            setLoading(false);
            return;
          }
        }

        const response = await apiClient.getCategoriesTree();
        if (response.status && response.data) {
          const cats = response.data;
          setCategories(cats);

          // Flatten subcategories
          const subs = cats.flatMap((cat: any) => cat.children || []);
          setSubcategories(subs.slice(0, 15)); // Limit to 15 subcategories

          // Cache the response
          localStorage.setItem('homepage_categories_cache', JSON.stringify({
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
      <section className="py-8">
        <h2 className="text-2xl font-bold text-green-800 mb-6">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:flex md:gap-10 gap-4 px-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
              <div className="mt-3 h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-green-800 mb-6">
        Shop by Category
      </h2>

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
          {categories.map((category) => (
            <Link
              href={`/shop?category_id=${category.id}`}
              key={category.id}
              className="flex flex-col items-center flex-shrink-0 group"
            >
              <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 text-green-600 shadow-md group-hover:bg-green-50 group-hover:scale-105 transition duration-300">
                {React.cloneElement(getIconForCategory(category.name), { size: 48 })}
              </div>
              <span className="mt-3 text-base font-medium text-gray-800 text-center">
                {category.name}
              </span>
            </Link>
          ))}
        </div>

        <button
          onClick={scrollMainRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white border rounded-full p-3 shadow-md z-10 hover:bg-gray-50 transition"
          aria-label="Scroll right"
        >
          <FaChevronRight size={20} />
        </button>
      </div>

      {/* Mobile view: grid layout */}
      <div className="grid grid-cols-2 gap-4 md:hidden mb-6 px-4">
        {categories.map((category) => (
          <Link
            href={`/shop?category_id=${category.id}`}
            key={category.id}
            className="flex items-center gap-3 bg-gray-100 rounded-lg shadow-md hover:bg-green-50 hover:scale-105 transition duration-300 w-full h-20 justify-center"
          >
            <div className="text-green-600 flex-shrink-0">
              {React.cloneElement(getIconForCategory(category.name), { size: 28 })}
            </div>
            <span className="text-sm font-medium text-gray-800 text-center">
              {category.name}
            </span>
          </Link>
        ))}
      </div>

      <h3 className="text-md font-semibold mb-3 block md:hidden px-2">
        Recommended for you
      </h3>

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
            className="flex items-center gap-3 overflow-x-auto hide-scrollbar px-2"
          >
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/shop?category_id=${sub.id}`}
                className="flex-shrink-0 bg-gray-100 text-gray-800 px-4 py-2 rounded-full hover:bg-green-50 hover:text-green-700 transition cursor-pointer whitespace-nowrap"
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
