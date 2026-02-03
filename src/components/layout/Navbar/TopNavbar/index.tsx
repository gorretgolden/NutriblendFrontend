'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LoginModal from '../../SignIn/SignIn';
import SignUpModal from "../../SignIn/signup";
import SearchWithDropdown from "@/components/homepage/Searchbar";
import CartBtn from "./CartBtn";
import { apiClient } from "@/lib/api/client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { logoutUser } from "@/lib/features/auth/authSlice";

// ... imports ...

const Header = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem('categories_cache');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          // Cache for 10 minutes
          if (Date.now() - timestamp < 10 * 60 * 1000) {
            setCategories(data);
            return;
          }
        }

        // Fetch from API
        const response = await apiClient.getCategoriesTree();
        if (response.status && response.data) {
          setCategories(response.data);
          // Cache the response
          localStorage.setItem('categories_cache', JSON.stringify({
            data: response.data,
            timestamp: Date.now()
          }));
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Format categories for navigation
  const dynamicNavItems = categories.map(cat => ({
    name: cat.name,
    href: `/shop?category_id=${cat.id}`,
    subItems: cat.children?.length > 0 ? cat.children.map((child: any) => child.name) : null
  }));

  // Navigation data (Append About Us to dynamic categories)
  const navItems: { name: string; href?: string; subItems?: string[] | null }[] = [
    ...dynamicNavItems,
    { name: "About Us", href: "/aboutUs" },
  ];

  // If no categories yet, ensure we have a fallback for initial render
  const displayItems = navItems.length > 0 ? navItems : [{ name: "About Us", href: "/aboutUs" }];

  // Account menu data
  const accountLinks = [
    { label: "My Account", href: "/account" },
    { label: "Orders", href: "/account/order" },
    { label: "My Lists", href: "/account/mylist" },
    { label: "My Reviews", href: "/account/MyReview" },
    { label: "Messages", href: "/account/message" },
    { label: "Account Management", href: "/account/manage" },
  ];

  // Modal control functions
  const openLoginModal = () => {
    setSignUpOpen(false);
    setLoginOpen(true);
  };

  const openSignUpModal = () => {
    setLoginOpen(false);
    setSignUpOpen(true);
  };

  const closeModals = () => {
    setLoginOpen(false);
    setSignUpOpen(false);
  };

  const handleProfileOpen = () => {
    setIsProfileOpen(true);
    console.log("Opening profile...");
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsAccountOpen(false);
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-green-50/50">
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
                  <span className="hidden md:inline text-sm font-medium">
                    {user ? `Hi, ${user.first_name}` : "Account"}
                  </span>
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
                      <h3 className="font-semibold text-base md:text-lg">
                        {user ? `Welcome, ${user.first_name}!` : "Welcome!"}
                      </h3>
                      <p className="text-xs md:text-sm opacity-90">
                        {user ? "Happy to see you again" : "Sign in to access your account"}
                      </p>
                    </div>
                    <div className="p-2">
                      {user ? (
                        <div className="space-y-1">
                          {accountLinks.map((item, idx) => (
                            <Link
                              key={idx}
                              href={item.href}
                              className="flex items-center px-3 py-2 md:px-4 md:py-3 text-gray-700 hover:bg-green-50 hover:text-[#4caf50] rounded-lg transition-colors duration-200"
                            >
                              {item.label}
                              {item.label === "Messages" && (
                                <span className="ml-auto bg-[#4caf50] text-white text-[10px] md:text-xs rounded-full px-1.5 py-0.5">3</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          Please sign in to access your account features
                        </div>
                      )}
                    </div>
                    <div className="p-2 md:p-3 border-t border-gray-100 bg-gray-50">
                      {user ? (
                        <button
                          onClick={handleLogout}
                          className="block w-full bg-red-500 hover:bg-red-600 text-white text-center font-medium py-2 md:py-2.5 px-3 md:px-4 rounded-lg transition-colors duration-200 shadow-sm text-sm md:text-base"
                        >
                          Sign Out
                        </button>
                      ) : (
                        <button
                          onClick={openLoginModal}
                          className="block w-full bg-[#4caf50] hover:bg-green-600 text-white text-center font-medium py-2 md:py-2.5 px-3 md:px-4 rounded-lg transition-colors duration-200 shadow-sm text-sm md:text-base"
                        >
                          Sign in / Create account
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <CartBtn />

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
                    {item.subItems && item.subItems.length > 0 ? (
                      <>
                        <button className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50/50 flex items-center transition-all duration-300 active:scale-95 group-hover:bg-green-50">
                          {item.name}
                          <svg className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-4 z-50">
                          <div className="rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 p-2 bg-white/95 backdrop-blur-sm border border-green-50">
                            {item.subItems.map((subItem: string, subIndex: number) => (
                              <a
                                key={subIndex}
                                href="#"
                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-green-600 hover:text-white rounded-xl transition-all duration-200"
                              >
                                {subItem}
                              </a>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href || "#"}
                        className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50/50 transition-all duration-300 active:scale-95 whitespace-nowrap"
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
                      {item.subItems && item.subItems.length > 0 ? (
                        <>
                          <button className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">
                            <div className="flex items-center">{item.name}</div>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <div className="pl-6 mt-1 space-y-1">
                            {item.subItems.map((subItem: string, subIndex: number) => (
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
                        <Link
                          href={item.href || "#"}
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <LoginModal
        visible={loginOpen}
        onClose={closeModals}
        onSwitchToSignUp={openSignUpModal}
      />
      <SignUpModal
        visible={signUpOpen}
        onClose={closeModals}
        onSwitchToLogin={openLoginModal}
        onProfileOpen={handleProfileOpen}
      />

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