'use client';
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LoginModal from '../../SignIn/SignIn';
import SearchWithDropdown from "@/components/homepage/Searchbar";

const Header = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // Navigation data
  const navItems = [
    { name: "Supplements", subItems: ["Vitamins & Minerals", "Protein Powders", "Pre-Workout", "Weight Management", "Omega & Fish Oils"] },
    { name: "Sports", subItems: ["Fitness Accessories", "Yoga & Pilates", "Team Sports", "Water Sports", "Outdoor Recreation"] },
    { name: "Bath", subItems: ["Bath Oils & Salts", "Body Wash & Shower Gel", "Loofahs & Sponges", "Bathrobes & Towels"] },
    { name: "Beauty", subItems: ["Skincare", "Makeup", "Hair Care", "Fragrance", "Men's Grooming"] },
    { name: "Grocery", subItems: ["Fresh Produce", "Dairy & Eggs", "Meat & Seafood", "Bakery", "Beverages"] },
    { name: "Home", subItems: ["Furniture", "Kitchen & Dining", "Bedding", "Home Decor", "Lighting"] },
    { name: "Baby", subItems: ["Diapering", "Feeding", "Baby Gear", "Nursery", "Baby Care"] },
    { name: "Pets", subItems: ["Dog Supplies", "Cat Supplies", "Fish & Aquatics", "Bird Supplies", "Pet Toys"] },
    { name: "Brands A-Z", subItems: ["Nike", "Adidas", "Johnson & Johnson", "Procter & Gamble", "Colgate"] },
    { name: "About Us", href: "/aboutUs" }, 
  ];

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
  {/* Main header */}
  <div className="container mx-auto px-3 py-2 md:py-3">
    <div className="flex items-center justify-between">
      {/* Logo + Brand */}
      <div className="flex items-center">
        <div className="font-bold text-[#4caf50]">
          <Link href="/" className="flex items-center">
            <div className="relative w-8 h-8 md:w-12 md:h-12 rounded-xl overflow-hidden border border-[#4caf50] hover:scale-105 transition-transform duration-300 shadow-md">
              <Image
                src="/images/logo.png"
                alt="Company Logo"
                fill
                className="object-contain p-1"
              />
            </div>
            {/* Brand name (hidden on mobile, visible from md and up) */}
            <span className="hidden md:inline ml-2 text-xl font-semibold whitespace-nowrap">
              NutriBlend
            </span>
          </Link>
        </div>
      </div>

            {/* Search bar */}
            <div className="flex-1 px-2">
              <SearchWithDropdown />
            </div>

            {/* Account + Mobile menu */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Account */}
              <div className="relative">
                <button
                  className="flex items-center space-x-1.5 p-1.5 md:p-2 rounded-lg hover:bg-gray-50 group relative transition-colors duration-200"
                  onMouseEnter={() => setIsAccountOpen(true)}
                  onMouseLeave={() => setIsAccountOpen(false)}
                >
                  <div className="p-1 rounded-full bg-gray-100 group-hover:bg-green-100 transition-colors">
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
                    style={{ transform: isAccountOpen ? "rotate(180deg)" : "rotate(0deg)" }}
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
                    className="absolute right-0 mt-2 w-64 md:w-72 max-w-[90vw] bg-white rounded-xl shadow-lg z-50 border border-gray-100 overflow-hidden text-sm md:text-base"
                    onMouseEnter={() => setIsAccountOpen(true)}
                    onMouseLeave={() => setIsAccountOpen(false)}
                  >
                    <div className="bg-gradient-to-r from-[#4caf50] to-[#45a049] text-white p-3 md:p-4">
                      <h3 className="font-semibold text-base md:text-lg">Welcome!</h3>
                      <p className="text-xs md:text-sm opacity-90">Sign in to access your account</p>
                    </div>
                    <div className="p-2">
                      <div className="space-y-1">
                        {["My Account","Orders","My Lists","Rewards Credit","My Reviews","Messages"].map((label, idx) => (
                          <Link
                            key={idx}
                            href="#"
                            className="flex items-center px-3 py-2 md:px-4 md:py-3 text-gray-700 hover:bg-green-50 hover:text-[#4caf50] rounded-lg transition-colors duration-200"
                          >
                            {label}
                            {label === "Messages" && (
                              <span className="ml-auto bg-[#4caf50] text-white text-[10px] md:text-xs rounded-full px-1.5 py-0.5">3</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="p-2 md:p-3 border-t border-gray-100 bg-gray-50">
                      <button
                        onClick={() => setLoginOpen(true)}
                        className="block w-full bg-[#4caf50] hover:bg-green-600 text-white text-center font-medium py-2 md:py-2.5 px-3 md:px-4 rounded-lg transition-colors duration-200 shadow-sm text-sm md:text-base"
                      >
                        Sign in / Create account
                      </button>
                    </div>
                  </div>
                )}
                <LoginModal visible={loginOpen} onClose={() => setLoginOpen(false)} />
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="border-t border-gray-100">
          <div className="container mx-auto px-3">
            {/* Desktop Navigation */}
            <div className="hidden md:flex justify-center py-2">
              <div className="flex items-center space-x-1">
                {navItems.map((item, index) => (
                  <div key={index} className="relative group">
                    {item.subItems ? (
                      <>
                        <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 flex items-center transition-colors duration-200">
                          {item.name}
                          <svg className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        <div className="absolute left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
                          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-2 bg-white">
                            {item.subItems.map((subItem, subIndex) => (
                              <a
                                key={subIndex}
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-md transition-colors duration-150"
                              >
                                {subItem}
                              </a>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                       <Link
    href={item.href || "/aboutUs"} // Uses /about if available
    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
  >

    {item.name}
  </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
              <div className="md:hidden bg-white">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navItems.map((item, index) => (
                    <div key={index} className="relative">
                      {item.subItems ? (
                        <>
                          <button className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">
                            <div className="flex items-center">{item.name}</div>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <div className="pl-6 mt-1 space-y-1">
                            {item.subItems.map((subItem, subIndex) => (
                              <a
                                key={subIndex}
                                href="#"
                                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50"
                              >
                                {subItem}
                              </a>
                            ))}
                          </div>
                        </>
                      ) : (
                        <></> // ✅ Removed redundant Link for mobile items without subItems
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <style jsx>{`
        .group:hover .group-hover\\:visible {
          visibility: visible;
        }
        .group:hover .group-hover\\:translate-y-0 {
          transform: translateY(0);
        }
        .group:hover .group-hover\\:opacity-100 {
          opacity: 1;
        }
      `}</style>
    </>
  );
};

export default Header;
