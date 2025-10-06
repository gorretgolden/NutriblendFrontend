"use client";

import React, { useRef, useState } from "react";
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
} from "react-icons/fa";

const mainCategories = [
  { name: "Supplements", icon: <FaAppleAlt />, link: "/products?category=Supplements" },
  { name: "Sports", icon: <FaDumbbell />, link: "/products?category=Sports" },
  { name: "Personal Care", icon: <FaBath />, link: "/products?category=Personal%20Care" },
  { name: "Beauty", icon: <FaFemale />, link: "/products?category=Beauty" },
  { name: "Grocery", icon: <FaShoppingBag />, link: "/products?category=Grocery" },
  { name: "Home", icon: <FaHome />, link: "/products?category=Home" },
  { name: "Baby & Kids", icon: <FaBaby />, link: "/products?category=Baby%20%26%20Kids" },
  { name: "Pets", icon: <FaDog />, link: "/products?category=Pets" },
];

const pillCategories = [
  "Immune Support",
  "Vitamins",
  "Mood Balance & Anxiety",
  "Sexual Health",
  "Herbs",
  "Minerals",
  "Arthritis",
  "Heart",
  "Energy",
  "Weight Management",
  "Skin Care",
  "Digestive Health",
  "Brain & Memory",
];

export default function CategoryGrid() {
  const mainScrollRef = useRef<HTMLDivElement | null>(null);
  const pillScrollRef = useRef<HTMLDivElement | null>(null);

  const [showMainLeft, setShowMainLeft] = useState(false);
  const [showPillLeft, setShowPillLeft] = useState(false);

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
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white border rounded-full p-3 shadow-md z-10"
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
          {mainCategories.map((category, index) => (
            <Link
              href={category.link}
              key={index}
              className="flex flex-col items-center flex-shrink-0"
            >
              <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 text-green-600 shadow-md hover:bg-green-50 hover:scale-105 transition duration-300">
                {React.cloneElement(category.icon, { size: 48 })}
              </div>
              <span className="mt-3 text-base font-medium text-gray-800 text-center">
                {category.name}
              </span>
            </Link>
          ))}
        </div>

        <button
          onClick={scrollMainRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white border rounded-full p-3 shadow-md z-10"
          aria-label="Scroll right"
        >
          <FaChevronRight size={20} />
        </button>
      </div>

      {/* Mobile view: grid layout, rectangular items with uniform size */}
<div className="grid grid-cols-2 gap-4 md:hidden mb-6 px-4">
  {mainCategories.map((category, index) => (
    <Link
      href={category.link}
      key={index}
      className="flex items-center gap-3 bg-gray-100 rounded-lg shadow-md hover:bg-green-50 hover:scale-105 transition duration-300 w-full h-20 justify-center"
    >
      <div className="text-green-600 flex-shrink-0">
        {React.cloneElement(category.icon, { size: 28 })}
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

      {/* Scrollable Pills */}
      <div className="relative">
        {showPillLeft && (
          <button
            onClick={scrollPillLeft}
            className="flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white border rounded-full p-2 shadow-md z-10"
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
          {pillCategories.map((pill, index) => (
            <Link
  key={index}
  href={`/products?category=${encodeURIComponent(pill)}`}
  className="flex-shrink-0 bg-gray-100 text-gray-800 px-4 py-2 rounded-full hover:bg-green-50 hover:text-green-700 transition cursor-pointer whitespace-nowrap"
>
  {pill}
</Link>
          ))}
        </div>

        <button
          onClick={scrollPillRight}
          className="flex absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow-md z-10"
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
}
