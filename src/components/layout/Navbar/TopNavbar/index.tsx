"use client";

import React, { useState } from "react";
import Link from "next/link"; 
import Image from "next/image";
import CartBtn from "./CartBtn";
import SearchWithDropdown from "@/components/homepage/Searchbar";

const Header = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Supplements",
      subItems: [
        "Vitamins & Minerals",
        "Protein Powders",
        "Pre-Workout",
        "Weight Management",
        "Omega & Fish Oils",
      ],
    },
    {
      name: "Sports",
      subItems: [
        "Fitness Accessories",
        "Yoga & Pilates",
        "Team Sports",
        "Water Sports",
        "Outdoor Recreation",
      ],
    },
    {
      name: "Bath",
      subItems: [
        "Bath Oils & Salts",
        "Body Wash & Shower Gel",
        "Loofahs & Sponges",
        "Bathrobes & Towels",
      ],
    },
    {
      name: "Beauty",
      subItems: ["Skincare", "Makeup", "Hair Care", "Fragrance", "Men's Grooming"],
    },
    {
      name: "Grocery",
      subItems: ["Fresh Produce", "Dairy & Eggs", "Meat & Seafood", "Bakery", "Beverages"],
    },
    {
      name: "Home",
      subItems: ["Furniture", "Kitchen & Dining", "Bedding", "Home Decor", "Lighting"],
    },
    {
      name: "Baby",
      subItems: ["Diapering", "Feeding", "Baby Gear", "Nursery", "Baby Care"],
    },
    {
      name: "Pets",
      subItems: ["Dog Supplies", "Cat Supplies", "Fish & Aquatics", "Bird Supplies", "Pet Toys"],
    },
    {
      name: "Brands A-Z",
      subItems: ["Nike", "Adidas", "Johnson & Johnson", "Procter & Gamble", "Colgate"],
    },
    {
      name: "Health Topics",
      subItems: ["Diabetes", "Heart Health", "Digestive Health", "Joint Health", "Mental Wellness"],
    },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Main header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left - Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-[#4caf50]">
              <Link href="/" className="flex items-center">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-[#4caf50] hover:scale-105 transition-transform duration-300 shadow-md">
                  <Image
                    src="/images/logo.png"
                    alt="Company Logo"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <span className="ml-2 text-xl font-semibold hidden sm:block">NutriBlend</span>
              </Link>
            </div>
          </div>

          {/* Center - Search */}
          <SearchWithDropdown />

          {/* Right - Account + Cart */}
          <div className="flex items-center space-x-3">
            {/* Account Dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-1.5 p-2 rounded-lg hover:bg-gray-50 group relative transition-colors duration-200"
                onMouseEnter={() => setIsAccountOpen(true)}
                onMouseLeave={() => setIsAccountOpen(false)}
              >
                <div className="p-1.5 rounded-full bg-gray-100 group-hover:bg-green-100 transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-600 group-hover:text-[#4caf50] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className="hidden md:inline text-sm font-medium">Account</span>
                <svg
                  className="ml-1 w-3 h-3 text-gray-400 transition-transform duration-200"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  style={{
                    transform: isAccountOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isAccountOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg z-50 border border-gray-100 overflow-hidden"
                  onMouseEnter={() => setIsAccountOpen(true)}
                  onMouseLeave={() => setIsAccountOpen(false)}
                >
                  <div className="bg-gradient-to-r from-[#4caf50] to-[#45a049] text-white p-4">
                    <h3 className="font-semibold text-lg">Welcome!</h3>
                    <p className="text-sm opacity-90">Sign in to access your account</p>
                  </div>

                  <div className="p-2 space-y-1">
                    <Link href="/account" className="block px-4 py-3 text-sm hover:bg-green-50">
                      My Account
                    </Link>
                    <Link href="/account/order" className="block px-4 py-3 text-sm hover:bg-green-50">
                      Orders
                    </Link>
                    <Link href="/account/mylist" className="block px-4 py-3 text-sm hover:bg-green-50">
                      My Lists
                    </Link>
                    <Link href="/account/rewards" className="block px-4 py-3 text-sm hover:bg-green-50">
                      Rewards Credit
                    </Link>
                    <Link href="/account/myreview" className="block px-4 py-3 text-sm hover:bg-green-50">
                      My Reviews
                    </Link>
                    <Link href="/account/messages" className="flex items-center px-4 py-3 text-sm hover:bg-green-50">
                      Messages
                      <span className="ml-auto bg-[#4caf50] text-white text-xs rounded-full px-2 py-1">3</span>
                    </Link>
                  </div>

                  <div className="p-3 border-t bg-gray-50">
                    <Link
                      href="/login"
                      className="block w-full bg-[#4caf50] hover:bg-green-600 text-white text-center py-2.5 rounded-lg"
                    >
                      Sign in / Create account
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
             <CartBtn />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex justify-center py-2">
            <div className="flex items-center space-x-1">
              {navItems.map((item, index) => (
                <div key={index} className="relative group">
                  <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 flex items-center">
                    {item.name}
                    <svg
                      className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-2 bg-white">
                      {item.subItems.map((subItem, subIndex) => (
                        <a
                          key={subIndex}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
         
        </div>
      </div>
    </header>
  );
};

export default Header;
