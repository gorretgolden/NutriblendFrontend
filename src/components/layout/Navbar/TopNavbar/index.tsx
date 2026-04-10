'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LoginModal from '../../SignIn/SignIn';
import SignUpModal from "../../SignIn/signup";
import CartBtn from "./CartBtn";
import { apiClient, getImageUrl } from "@/lib/api/client";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { logoutUser } from "@/lib/features/auth/authSlice";
import { clearCartLocal } from "@/lib/features/carts/cartsSlice";
import { clearWishlist } from "@/lib/features/wishlist/wishlistSlice";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cached = localStorage.getItem('categories_cache_v2');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 10 * 60 * 1000) {
            setCategories(data);
            return;
          }
        }

        const response = await apiClient.getCategoriesTree();
        if (response.status && response.data) {
          setCategories(response.data);
          localStorage.setItem('categories_cache_v2', JSON.stringify({
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

  // Format categories for navigation
  const dynamicNavItems = categories.map(cat => ({
    name: cat.name,
    href: `/shop?category=${cat.slug}`,
    subItems: cat.children?.length > 0 ? cat.children.map((child: any) => ({
      name: child.name,
      href: `/shop?category=${child.slug}`
    })) : null
  }));

  const navItems: { name: string; href?: string; subItems?: string[] | null }[] = [
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
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearCartLocal());
      dispatch(clearWishlist());
      setIsAccountOpen(false);
      toast.success("You have been logged out successfully");
      router.push("/");
    } catch {
      // Force local logout even if API fails
      dispatch(clearCartLocal());
      dispatch(clearWishlist());
      setIsAccountOpen(false);
      toast.success("You have been logged out");
      router.push("/");
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
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative w-9 h-9 md:w-11 md:h-11 rounded-xl overflow-hidden border-2 border-[#009E3C]/30 bg-white group-hover:border-[#009E3C] transition-all duration-250 shadow-sm group-hover:shadow-[0_4px_12px_rgba(0,158,60,0.20)]">
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
              <div className="relative">
                <button
                  className="flex items-center gap-1.5 px-2 py-1.5 md:px-3 rounded-xl hover:bg-gray-50/80 group transition-colors duration-200"
                  onMouseEnter={() => setIsAccountOpen(true)}
                  onMouseLeave={() => setIsAccountOpen(false)}
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-[#009E3C]/10 flex items-center justify-center transition-colors duration-200">
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-[#009E3C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="hidden md:inline text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                    {user ? `Hi, ${user.first_name || user.name?.split(' ')[0] || 'User'}` : "Account"}
                  </span>
                  <svg
                    className="hidden md:block w-3 h-3 text-gray-400 transition-transform duration-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{ transform: isAccountOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {isAccountOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 md:w-72 max-w-[92vw] bg-white rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.14),0_4px_12px_rgba(0,0,0,0.06)] z-50 border border-gray-100/80 overflow-hidden text-sm"
                    onMouseEnter={() => setIsAccountOpen(true)}
                    onMouseLeave={() => setIsAccountOpen(false)}
                  >
                    {/* Dropdown header */}
                    <div className="relative bg-gradient-to-br from-[#009E3C] to-[#00752C] text-white p-4 overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/8 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <h3 className="font-extrabold text-base relative z-10">
                        {user ? `Welcome back, ${user.first_name || user.name?.split(' ')[0] || 'User'}!` : "Welcome!"}
                      </h3>
                      <p className="text-xs text-white/80 mt-0.5 relative z-10">
                        {user ? "Great to see you again" : "Sign in to access your account"}
                      </p>
                    </div>

                    {/* Links */}
                    <div className="p-1.5">
                      {user ? (
                        <div className="space-y-0.5">
                          {accountLinks.map((item, idx) => (
                            <Link
                              key={idx}
                              href={item.href}
                              onClick={() => setIsAccountOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-[#009E3C]/6 hover:text-[#009E3C] rounded-xl transition-colors duration-150 font-medium"
                            >
                              <span className="text-gray-400 group-hover:text-[#009E3C] flex-shrink-0 w-4">{item.icon}</span>
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-5">
                          <p className="text-gray-500 text-sm mb-1">Access your orders, wishlist & more</p>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="px-2.5 pb-2.5 pt-1 border-t border-gray-100/80">
                      {user ? (
                        <button
                          onClick={handleLogout}
                          className="w-full bg-red-50 hover:bg-red-500 text-red-600 hover:text-white text-center font-bold py-2.5 px-4 rounded-xl transition-all duration-200 text-sm border border-red-100 hover:border-red-500"
                        >
                          Sign Out
                        </button>
                      ) : (
                        <button
                          onClick={openLoginModal}
                          className="w-full bg-[#009E3C] hover:bg-[#00752C] text-white text-center font-bold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-[0_4px_12px_rgba(0,158,60,0.25)] hover:shadow-[0_6px_18px_rgba(0,158,60,0.35)] text-sm"
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
          <div className="max-w-[1600px] mx-auto px-3">
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
                <Link href="/shop?on_sale=true" className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
                  Sale
                </Link>
                <Link href="/wholesale-registration" className="px-4 py-2.5 text-[13px] font-semibold text-gray-600 hover:text-[#009E3C] hover:bg-gray-50 transition-colors whitespace-nowrap">
                  Wholesale
                </Link>
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

                {/* Quick links */}
                <div className="grid grid-cols-3 gap-2 px-1">
                  {[
                    { href: "/shop", label: "All Products", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /> },
                    { href: "/shop?on_sale=true", label: "Sale", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /> },
                    { href: "/brands", label: "Brands", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /> },
                  ].map(({ href, label, icon }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-gray-50 hover:bg-[#009E3C]/8 hover:text-[#009E3C] text-gray-600 transition-colors duration-150"
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
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3.5">
              <form onSubmit={handleMobileSearch} className="flex items-center gap-2.5">
                <div className="flex-1 flex items-center bg-gray-100/80 border border-gray-200/60 rounded-xl px-3 py-2.5 focus-within:border-[#009E3C] focus-within:bg-white transition-all duration-200">
                  <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products, brands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                      className="w-5 h-5 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => { setMobileSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
                  className="text-sm text-[#009E3C] font-bold px-1 flex-shrink-0"
                >
                  Cancel
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
                              <p className="text-xs text-[#009E3C] font-bold mt-0.5">
                                UGX {Number(product.price).toLocaleString()}
                              </p>
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
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
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
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: any[];
  isSearching: boolean;
  categories: any[];
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
        className="flex rounded-full overflow-hidden border-2 border-gray-200 bg-white transition-all duration-250 focus-within:border-[#009E3C] focus-within:shadow-[0_0_0_3px_rgba(0,158,60,0.12)] hover:border-gray-300 group shadow-sm"
      >
        <div className="flex items-center pl-5">
          <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#009E3C] transition-colors duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search for supplements, brands, health products..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full outline-none text-gray-800 placeholder:text-gray-400 bg-transparent text-sm px-3 py-3 md:py-3.5"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => { setSearchQuery(""); setOpen(false); }}
            className="flex items-center justify-center px-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <button
          type="submit"
          className="flex items-center justify-center bg-[#009E3C] hover:bg-[#00752C] text-white px-6 sm:px-8 py-3 md:py-3.5 transition-colors duration-200 font-bold text-sm active:scale-95 flex-shrink-0 gap-2 rounded-r-full"
        >
          <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 w-full mt-2.5 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.14)] rounded-2xl p-4 sm:p-5 z-50 border border-gray-100/80 max-h-[72vh] overflow-y-auto">
          {searchQuery.trim() && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest">Search Results</h3>
                {isSearching && <div className="w-3 h-3 border-2 border-[#009E3C] border-t-transparent rounded-full animate-spin" />}
              </div>
              {isSearching ? (
                <div className="space-y-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-3 p-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg animate-shimmer flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-gray-100 rounded animate-shimmer w-3/4" />
                        <div className="h-3 bg-gray-100 rounded animate-shimmer w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/product/${product.id}/${product.slug}`}
                      onClick={() => {
                        setOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-xl transition-colors duration-150 group/result"
                    >
                      <div className="w-11 h-11 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100">
                        {(product.main_image || product.images?.[0]) && (
                          <img
                            src={resolveSearchImage(product)}
                            alt={product.name}
                            className="w-full h-full object-contain p-1"
                            loading="eager"
                            decoding="async"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.onerror = null;
                              target.src = '/images/placeholder.jpg';
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate group-hover/result:text-[#009E3C] transition-colors">{product.name}</p>
                        <p className="text-xs text-[#009E3C] font-bold mt-0.5">
                          UGX {Number(product.price).toLocaleString()}
                        </p>
                      </div>
                      <svg className="w-3.5 h-3.5 text-gray-300 group-hover/result:text-[#009E3C] flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                  <Link
                    href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => { setOpen(false); setSearchQuery(""); }}
                    className="flex items-center justify-center gap-2 text-[#009E3C] font-bold py-2.5 bg-[#009E3C]/6 hover:bg-[#009E3C]/10 rounded-xl text-sm transition-colors"
                  >
                    View all results for &quot;{searchQuery}&quot;
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-5">
                  <p className="text-gray-400 text-sm font-medium">No results for &quot;{searchQuery}&quot;</p>
                  <p className="text-gray-300 text-xs mt-1">Try different keywords</p>
                </div>
              )}
              <div className="h-px bg-gray-100 my-4" />
            </div>
          )}

          <div>
            <h3 className="font-extrabold mb-3 text-gray-400 text-[10px] uppercase tracking-widest">Browse Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.slice(0, 9).map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className="block bg-gray-50/80 hover:bg-[#009E3C] hover:text-white text-gray-700 px-3 py-2.5 rounded-xl text-xs font-semibold text-center transition-all duration-200 border border-gray-100/80 hover:border-[#009E3C] hover:shadow-[0_4px_12px_rgba(0,158,60,0.20)] active:scale-[0.97]"
                  onClick={() => setOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;