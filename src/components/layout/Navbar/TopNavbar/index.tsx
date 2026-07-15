'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LoginModal from '../../SignIn/SignIn';
import SignUpModal from "../../SignIn/signup";
import ForgotPasswordModal from "../../SignIn/ForgotPasswordModal";
import CartBtn from "./CartBtn";
import { apiClient, getImageUrl } from "@/lib/api/client";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { logoutUser, logout } from "@/lib/features/auth/authSlice";
import { clearCartLocal } from "@/lib/features/carts/cartsSlice";
import { clearWishlist } from "@/lib/features/wishlist/wishlistSlice";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);


  const { user } = useAppSelector((state) => state.auth);
  const isWholesaleUser = user?.role === 'Wholesale Customer' || user?.is_wholesale_approved;
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cached = localStorage.getItem('categories_cache_v5');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            setCategories(data);
            return;
          }
        }

        const response = await apiClient.getCategoriesTree();
        if (response.status && response.data) {
          setCategories(response.data);
          localStorage.setItem('categories_cache_v5', JSON.stringify({
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

  // Search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await apiClient.getProducts({
          search: searchQuery,
          per_page: 5
        });
        if (response.status && response.data?.data) {
          setSearchResults(response.data.data);
        }
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Format categories for navigation, limiting to 5 to ensure other menu items are visible
  const dynamicNavItems = categories.slice(0, 5).map(cat => ({
    name: cat.name,
    href: `/shop?category=${cat.slug}`,
    subItems: (cat.children && cat.children.length > 0) ? cat.children.map((child: any) => ({
      name: child.name,
      href: `/shop?category=${child.slug}`
    })) : null
  }));

  const navItems: { name: string; href?: string; subItems?: { name: string; href: string }[] | null }[] = [
    ...dynamicNavItems,
  ];

  // Account menu — proper routes with real SVG icons
  const accountLinks = [
    {
      label: "My Account", href: "/account", icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
      )
    },
    {
      label: "Orders", href: "/account/order", icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
      )
    },
    {
      label: "My Wishlist", href: "/account/mylist", icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
      )
    },
    {
      label: "My Reviews", href: "/account/myreview", icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
      )
    },
    {
      label: "Messages", href: "/account/messages", icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
      )
    },
    {
      label: "Account Settings", href: "/account/manage", icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      )
    },
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
  };

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('show_logout_toast', 'true');
    }
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearCartLocal());
      dispatch(clearWishlist());
      setIsAccountOpen(false);
      window.location.href = "/";
    } catch {
      // Force local logout even if API fails
      dispatch(logout());
      dispatch(clearCartLocal());
      dispatch(clearWishlist());
      setIsAccountOpen(false);
      window.location.href = "/";
    }
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setMobileSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, []);


  // Listen for global 'open-login-modal' events (e.g. from Footer account links)
  useEffect(() => {
    const handleOpenLoginModal = () => {
      openLoginModal();
    };
    window.addEventListener('open-login-modal', handleOpenLoginModal);
    return () => window.removeEventListener('open-login-modal', handleOpenLoginModal);
  }, []);

  return (
    <>
      <header className="bg-white sticky top-0 z-50 border-b border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        {/* Main header */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border-2 border-[#009E3C]/30 bg-white group-hover:border-[#009E3C] transition-all duration-250 shadow-sm group-hover:shadow-[0_4px_12px_rgba(0,158,60,0.20)]">
                  <Image
                    src="/images/logo.png"
                    alt="Company Logo"
                    fill
                    className="object-contain p-1"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Search bar */}
            <div className="hidden md:flex flex-1 px-3 max-w-3xl xl:max-w-4xl">
              <DesktopSearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                isSearching={isSearching}
                categories={categories}
                isWholesaleUser={isWholesaleUser}
              />
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              {/* Mobile Search Icon */}
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#009E3C] hover:bg-[#009E3C]/8 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Account */}
              <div>
                <button
                  className="flex items-center gap-1.5 px-2 py-1.5 md:px-3 rounded-xl hover:bg-gray-50/80 group transition-colors duration-200"
                  onClick={() => user ? setIsAccountOpen(true) : openLoginModal()}
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-[#009E3C]/10 flex items-center justify-center transition-colors duration-200">
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-[#009E3C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                    {user ? `Hi, ${user.first_name || user.name?.split(' ')[0] || 'User'}` : "Account"}
                    {user && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-wider font-bold border ${isWholesaleUser ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}>
                        {isWholesaleUser ? "Wholesale" : "Retail"}
                      </span>
                    )}
                  </span>
                </button>
              </div>

              <CartBtn />

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                >
                  {mobileMenuOpen ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Bar — white iHerb-style */}
        <div className="hidden md:block bg-white border-t border-gray-100 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center overflow-x-auto no-scrollbar">
              {/* All Categories CTA */}
              <Link
                href="/shop"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#009E3C] text-white text-[13px] font-bold whitespace-nowrap hover:bg-[#007a2e] transition-colors flex-shrink-0 rounded-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                All Categories
              </Link>

              {navItems.map((item, index) => (
                <div key={index} className="relative group flex-shrink-0">
                  {item.subItems && item.subItems.length > 0 ? (
                    <>
                      <button className="px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:text-[#009E3C] flex items-center gap-1 transition-colors duration-150 whitespace-nowrap border-b-2 border-transparent group-hover:border-[#009E3C]">
                        {item.name}
                        <svg className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {/* Dropdown */}
                      <div className="absolute left-0 top-full w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50 pt-1.5">
                        <div className="bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.14)] border border-gray-100/80 py-1.5 overflow-hidden">
                          <div className="h-0.5 bg-gradient-to-r from-[#009E3C] to-[#00bc49] rounded-full mx-2 mb-1.5" />
                          {item.subItems.map((subItem: any, subIndex: number) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-[#009E3C]/8 hover:text-[#009E3C] transition-colors duration-120 font-medium"
                            >
                              <span className="w-1 h-1 rounded-full bg-[#009E3C]/40 flex-shrink-0" />
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className="px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:text-[#009E3C] transition-colors duration-150 whitespace-nowrap inline-block border-b-2 border-transparent hover:border-[#009E3C]"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* End links */}
              <div className="ml-auto flex items-center flex-shrink-0 border-l border-gray-100 ml-2">
                {!isWholesaleUser && (
                  <Link href="/wholesale-registration" className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-bold text-[#009E3C] hover:text-[#00752C] hover:bg-green-50 transition-all whitespace-nowrap border border-[#009E3C]/20 rounded-lg mx-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    Join Wholesale
                  </Link>
                )}
                <Link href="/brands" className="px-4 py-2.5 text-[13px] font-semibold text-gray-600 hover:text-[#009E3C] hover:bg-gray-50 transition-colors whitespace-nowrap">
                  Brands
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 top-[56px] z-40 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="bg-white max-h-[82vh] overflow-y-auto shadow-2xl border-t border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top accent */}
              <div className="h-0.5 bg-gradient-to-r from-[#009E3C] via-[#00bc49] to-[#009E3C]" />

              <div className="px-3 pt-3 pb-5 space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 py-1 mb-1">
                  Browse Categories
                </p>

                {navItems.map((item, index) => (
                  <div key={index}>
                    {item.subItems && item.subItems.length > 0 ? (
                      <>
                        <Link
                          href={item.href || "#"}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:text-[#009E3C] hover:bg-[#009E3C]/6 transition-colors duration-150"
                        >
                          <span>{item.name}</span>
                          <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        <div className="pl-5 space-y-0.5 mb-1">
                          {item.subItems.map((subItem: any, subIndex: number) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-[#009E3C] hover:bg-[#009E3C]/5 transition-colors duration-120"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href || "#"}
                        className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:text-[#009E3C] hover:bg-[#009E3C]/6 transition-colors duration-150"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}

                <div className="h-px bg-gray-100 my-3 mx-2" />

                {/* Wholesale CTA Banner */}
                {!isWholesaleUser && (
                  <Link
                    href="/wholesale-registration"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 mx-1 px-4 py-3.5 rounded-xl bg-gradient-to-r from-[#009E3C] to-[#00752C] text-white shadow-md hover:shadow-lg transition-all duration-200 group mb-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">Join Wholesale Program</p>
                      <p className="text-[10px] text-white/75">Get exclusive bulk pricing & priority delivery</p>
                    </div>
                    <svg className="w-4 h-4 text-white/60 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                )}

                {/* Quick links */}
                <div className="grid grid-cols-2 gap-2 px-1">
                  {[
                    { href: "/shop", label: "All Products", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />, className: "" },
                    { href: "/brands", label: "Brands", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />, className: "" },
                    ...(isWholesaleUser ? [] : [{ href: "/wholesale-registration", label: "Wholesale", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />, className: "col-span-2" }]),
                  ].map(({ href, label, icon, className }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-gray-50 hover:bg-[#009E3C]/8 hover:text-[#009E3C] text-gray-600 transition-colors duration-150 ${className || ""}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                      <span className="text-[10px] font-bold">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Search Modal */}
      {mobileSearchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          onClick={() => { setMobileSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
        >
          <div
            className="bg-white w-full max-h-[88vh] overflow-y-auto shadow-2xl animate-fade-in-down"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent bar */}
            <div className="h-0.5 bg-gradient-to-r from-[#009E3C] via-[#00bc49] to-[#009E3C]" />

            {/* Search Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-4 z-50">
              <form onSubmit={handleMobileSearch} className="flex items-center gap-3">
                <div className="flex-1 flex items-center bg-gray-100/80 border border-gray-200/50 rounded-2xl px-4 py-3 focus-within:border-[#009E3C] focus-within:bg-white transition-all duration-300">
                  <svg className="w-5 h-5 text-gray-400 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search Nutriblend..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full bg-transparent outline-none text-[15px] font-medium text-gray-800 placeholder:text-gray-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors flex-shrink-0 ml-2"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-[#009E3C] text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex-shrink-0 shadow-md active:scale-95"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Content */}
            <div className="px-4 py-4">
              {searchQuery.trim() && (
                <div className="mb-5">
                  {isSearching ? (
                    <div className="space-y-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="flex items-center gap-3 p-2">
                          <div className="w-11 h-11 bg-gray-100 rounded-xl animate-shimmer flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 bg-gray-100 rounded animate-shimmer w-4/5" />
                            <div className="h-3 bg-gray-100 rounded animate-shimmer w-1/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Results</p>
                      <div className="space-y-1">
                        {searchResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/shop/product/${product.id}/${product.slug}`}
                            onClick={() => { setMobileSearchOpen(false); setSearchQuery(""); }}
                            className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-xl transition-colors group/res"
                          >
                            <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                              {product.images?.[0] && (
                                <img
                                  src={getImageUrl(product.images[0].image_path || product.images[0])}
                                  alt={product.name}
                                  className="w-full h-full object-contain p-1"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm truncate group-hover/res:text-[#009E3C] transition-colors">{product.name}</p>
                              <div className="flex flex-col mt-0.5">
                                {isWholesaleUser && product.wholesale_price ? (
                                  <p className="text-[9px] text-purple-600 font-bold uppercase tracking-wider mb-0.5">Wholesale Price</p>
                                ) : (
                                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Retail Price</p>
                                )}
                                <p className={`text-xs font-bold ${isWholesaleUser && product.wholesale_price ? "text-purple-600" : "text-[#009E3C]"}`}>
                                  UGX {Number(isWholesaleUser && product.wholesale_price ? product.wholesale_price : product.price).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                        <Link
                          href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                          onClick={() => { setMobileSearchOpen(false); setSearchQuery(""); }}
                          className="flex items-center justify-center gap-1.5 text-[#009E3C] font-bold py-3 bg-[#009E3C]/6 hover:bg-[#009E3C]/10 rounded-xl text-sm mt-2 transition-colors"
                        >
                          View all results
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm font-medium">No results for &quot;{searchQuery}&quot;</p>
                      <p className="text-gray-300 text-xs mt-1">Try different keywords</p>
                    </div>
                  )}
                  <div className="h-px bg-gray-100 my-4" />
                </div>
              )}

              {/* Browse Categories */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Browse Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.slice(0, 8).map((category) => (
                    <Link
                      key={category.id}
                      href={`/shop?category=${category.slug}`}
                      className="bg-gray-50/80 border border-gray-100/80 text-gray-700 hover:bg-[#009E3C] hover:text-white hover:border-[#009E3C] py-3 px-3 rounded-xl text-sm font-semibold text-center transition-all duration-200 active:scale-[0.97]"
                      onClick={() => { setMobileSearchOpen(false); setSearchQuery(""); }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Modal */}
      {isAccountOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
          onClick={() => setIsAccountOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-[fadeIn_200ms_ease-out]" />

          {/* Modal Card */}
          <div
            className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden animate-[scaleIn_250ms_ease-out] z-10 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsAccountOpen(false)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors duration-150"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 md:p-7 flex flex-col items-center text-center">
              {user ? (
                <>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#009E3C] to-[#00bc49] p-0.5 mb-3 shadow-sm">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl font-black text-[#009E3C]">
                        {(user.first_name || user.name || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-extrabold text-[22px] text-gray-800 mb-1">
                    Welcome back, {user.first_name || user.name?.split(' ')[0] || 'User'}!
                  </h3>
                  <p className="text-sm text-gray-400 font-semibold mb-4">
                    Manage your account and orders
                  </p>
                  
                  <div className="w-full space-y-1">
                    {accountLinks.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        onClick={() => setIsAccountOpen(false)}
                        className="group flex items-center gap-4 px-4 py-2.5 text-gray-600 hover:bg-[#009E3C]/8 hover:text-[#009E3C] rounded-xl transition-colors duration-150 font-bold text-[14px]"
                      >
                        <span className="text-gray-400 group-hover:text-[#009E3C] transition-colors scale-110">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="w-full mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-150 text-[14px] border border-red-100 hover:border-red-500"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-[#009E3C]/10 flex items-center justify-center mb-4 relative">
                    <div className="absolute inset-0 rounded-full bg-[#009E3C]/20 animate-ping opacity-20" />
                    <svg className="w-8 h-8 text-[#009E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="font-extrabold text-2xl text-gray-800 mb-2 tracking-tight">
                    Welcome to Nutriblend
                  </h3>
                  <p className="text-sm text-gray-500 font-medium mb-6 leading-relaxed px-1">
                    Sign in to track your orders, manage your wishlist, and access exclusive member deals.
                  </p>
                  
                  <button
                    onClick={() => { setIsAccountOpen(false); openLoginModal(); }}
                    className="w-full bg-[#009E3C] hover:bg-[#008733] text-white text-center font-bold py-2.5 px-4 rounded-xl transition-all duration-150 shadow-[0_4px_12px_rgba(0,158,60,0.25)] hover:shadow-[0_6px_18px_rgba(0,158,60,0.35)] text-[14px] active:scale-[0.98]"
                  >
                    Sign In / Create Account
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <LoginModal
        visible={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToSignUp={() => {
          setLoginOpen(false);
          setSignUpOpen(true);
        }}
        onSwitchToForgot={() => {
          setLoginOpen(false);
          setForgotPasswordOpen(true);
        }}
      />
      
      <ForgotPasswordModal
        visible={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        onSwitchToLogin={() => {
          setForgotPasswordOpen(false);
          setLoginOpen(true);
        }}
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
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(-8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
};

// Desktop Search Component (extracted for cleanliness)
function DesktopSearchBar({
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  categories,
  isWholesaleUser,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: any[];
  isSearching: boolean;
  categories: any[];
  isWholesaleUser: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setOpen(false);
      setSearchQuery("");
    }
  };

  const resolveSearchImage = (product: any) => {
    const rawPath = product.main_image || product.images?.[0]?.image_path || product.images?.[0] || '';
    return getImageUrl(rawPath);
  };

  return (
    <div ref={ref} className="relative flex-1 max-w-3xl xl:max-w-4xl">
      <form
        onSubmit={handleSearch}
        className="flex items-center rounded-full overflow-hidden border-2 border-gray-200 bg-white transition-all duration-300 focus-within:border-[#009E3C] focus-within:shadow-[0_0_0_4px_rgba(0,158,60,0.1)] hover:border-gray-300 group shadow-sm"
      >
        <div className="flex items-center pl-6">
          <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#009E3C] transition-colors duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search products, brands and categories"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full outline-none text-gray-800 placeholder:text-gray-400 bg-transparent text-[15px] font-medium px-4 py-3.5 md:py-4"
        />
        <div className="flex items-center gap-1 pr-1">
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(""); setOpen(false); }}
              className="flex items-center justify-center p-2 text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="bg-[#009E3C] hover:bg-[#00752C] text-white px-8 py-3 md:py-3.5 rounded-full transition-all duration-300 font-black text-xs uppercase tracking-widest active:scale-95 flex-shrink-0 mr-1 shadow-md hover:shadow-lg"
          >
            Search
          </button>
        </div>
      </form>

      {open && (
        <div className="absolute top-full left-0 w-full mt-3 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-3xl p-6 z-50 border border-gray-100/80 max-h-[75vh] overflow-y-auto">
          {!searchQuery.trim() ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-[11px] text-gray-400 uppercase tracking-widest">Trending Searches</h3>
                <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {["Protein", "Vitamins", "Fat Burners", "Creatine", "Multivitamins", "Omega 3", "Pre-workout", "Keto"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      router.push(`/shop?search=${encodeURIComponent(tag)}`);
                      setOpen(false);
                    }}
                    className="px-4 py-2 bg-gray-50 hover:bg-[#009E3C]/10 text-gray-600 hover:text-[#009E3C] rounded-xl text-xs font-bold transition-all duration-200 border border-gray-100 hover:border-[#009E3C]/30"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="font-black text-[11px] text-gray-400 uppercase tracking-widest mb-4">Top Categories</h3>
                <div className="grid grid-cols-2 gap-3">
                  {categories.slice(0, 4).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-white rounded-2xl border border-transparent hover:border-[#009E3C]/20 hover:shadow-sm transition-all duration-200 group/cat"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#009E3C] group-hover/cat:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-gray-700 group-hover/cat:text-[#009E3C]">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-black text-[11px] text-gray-400 uppercase tracking-widest">Search Results</h3>
                {isSearching && <div className="w-3 h-3 border-2 border-[#009E3C] border-t-transparent rounded-full animate-spin" />}
              </div>
              {isSearching ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-2">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl animate-pulse flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-50 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-gray-50 rounded animate-pulse w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/product/${product.id}/${product.slug}`}
                      onClick={() => {
                        setOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-all duration-200 group/result"
                    >
                      <div className="w-16 h-16 bg-white rounded-xl flex-shrink-0 overflow-hidden border border-gray-100 p-1">
                        {(product.main_image || product.images?.[0]) && (
                          <img
                            src={resolveSearchImage(product)}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover/result:scale-110 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-[15px] truncate group-hover/result:text-[#009E3C] transition-colors leading-tight">{product.name}</p>
                        <div className="flex flex-col mt-0.5">
                          {isWholesaleUser && product.wholesale_price ? (
                            <p className="text-[9px] text-purple-600 font-bold uppercase tracking-wider mb-0.5">Wholesale Price</p>
                          ) : (
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Retail Price</p>
                          )}
                          <div className="flex items-center gap-2">
                            <p className={`font-black text-sm ${isWholesaleUser && product.wholesale_price ? "text-purple-600" : "text-[#009E3C]"}`}>
                              UGX {Number(isWholesaleUser && product.wholesale_price ? product.wholesale_price : product.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover/result:bg-[#009E3C] group-hover/result:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => { setOpen(false); setSearchQuery(""); }}
                    className="flex items-center justify-center gap-2 text-white font-black py-4 bg-[#009E3C] hover:bg-[#00752C] rounded-2xl text-xs uppercase tracking-widest mt-4 transition-all shadow-[0_4px_12px_rgba(0,158,60,0.2)] hover:shadow-[0_6px_20px_rgba(0,158,60,0.3)] active:scale-[0.98]"
                  >
                    View all results
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-bold">No results for &quot;{searchQuery}&quot;</p>
                  <p className="text-gray-400 text-xs mt-1">Try protein, vitamins or keto supplements</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Header;