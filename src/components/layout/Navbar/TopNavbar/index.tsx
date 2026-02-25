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

  // Account menu — proper routes
  const accountLinks = [
    { label: "My Account", href: "/account", icon: "👤" },
    { label: "Orders", href: "/account/order", icon: "📦" },
    { label: "My Wishlist", href: "/account/mylist", icon: "❤️" },
    { label: "My Reviews", href: "/account/myreview", icon: "⭐" },
    { label: "Messages", href: "/account/messages", icon: "✉️" },
    { label: "Account Settings", href: "/account/manage", icon: "⚙️" },
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

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-green-50/50">
        {/* Main header */}
        <div className="max-w-[1600px] mx-auto px-3 py-2 md:py-3">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="relative w-8 h-8 md:w-12 md:h-12 rounded-xl overflow-hidden border border-[#4caf50] hover:scale-105 transition-transform duration-300 shadow-md">
                  <Image
                    src="/images/logo.png"
                    alt="Company Logo"
                    fill
                    className="object-contain p-1"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Search bar - hidden on mobile */}
            <div className="hidden md:flex flex-1 px-2 max-w-4xl">
              <DesktopSearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                isSearching={isSearching}
                categories={categories}
              />
            </div>

            {/* Right icons */}
            <div className="flex items-center space-x-1 md:space-x-3 flex-shrink-0">
              {/* Mobile Search Icon */}
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="md:hidden p-2 rounded-full hover:bg-green-50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Account */}
              <div className="relative">
                <button
                  className="flex items-center space-x-1 p-1.5 md:p-2 rounded-lg hover:bg-gray-50 group relative transition-colors duration-200"
                  onMouseEnter={() => setIsAccountOpen(true)}
                  onMouseLeave={() => setIsAccountOpen(false)}
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
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
                    {user ? `Hi, ${user.first_name || user.name?.split(' ')[0] || 'User'}` : "Account"}
                  </span>
                  <svg
                    className="hidden md:block ml-1 w-3 h-3 text-gray-400 transition-transform duration-200"
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
                        {user ? `Welcome, ${user.first_name || user.name?.split(' ')[0] || 'User'}!` : "Welcome!"}
                      </h3>
                      <p className="text-xs md:text-sm opacity-90">
                        {user ? "Happy to see you again" : "Sign in to access your account"}
                      </p>
                    </div>
                    <div className="p-2">
                      {user ? (
                        <div className="space-y-0.5">
                          {accountLinks.map((item, idx) => (
                            <Link
                              key={idx}
                              href={item.href}
                              onClick={() => setIsAccountOpen(false)}
                              className="flex items-center px-3 py-2 md:px-4 md:py-2.5 text-gray-700 hover:bg-green-50 hover:text-[#4caf50] rounded-lg transition-colors duration-200"
                            >
                              <span className="mr-2.5 text-sm">{item.icon}</span>
                              {item.label}
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
                  {mobileMenuOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Bar */}
        <div className="border-t border-gray-100 hidden md:block">
          <div className="max-w-[1600px] mx-auto px-3">
            <div className="flex justify-center py-2">
              <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
                {navItems.map((item, index) => (
                  <div key={index} className="relative group">
                    {item.subItems && item.subItems.length > 0 ? (
                      <>
                        <button className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50/50 flex items-center transition-all duration-300 active:scale-95 group-hover:bg-green-50 whitespace-nowrap">
                          {item.name}
                          <svg className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-4 z-50">
                          <div className="rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 p-2 bg-white/95 backdrop-blur-sm border border-green-50">
                            {item.subItems.map((subItem: any, subIndex: number) => (
                              <Link
                                key={subIndex}
                                href={subItem.href}
                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-green-600 hover:text-white rounded-xl transition-all duration-200"
                              >
                                {subItem.name}
                              </Link>
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
          </div>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[56px] z-40 bg-black/30" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-white max-h-[80vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="px-4 pt-3 pb-4 space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Categories</p>
                {navItems.map((item, index) => (
                  <div key={index}>
                    {item.subItems && item.subItems.length > 0 ? (
                      <>
                        <Link
                          href={item.href || "#"}
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
                        >
                          <span>{item.name}</span>
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        <div className="pl-6 space-y-0.5">
                          {item.subItems.map((subItem: any, subIndex: number) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-green-600 hover:bg-green-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href || "#"}
                        className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}

                <div className="border-t border-gray-100 my-3" />
                <Link
                  href="/shop"
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-green-600 hover:bg-green-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🛍️ View All Products
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Search Modal */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={() => { setMobileSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}>
          <div
            className="bg-white w-full max-h-[85vh] overflow-y-auto animate-in slide-in-from-top duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4">
              <form onSubmit={handleMobileSearch} className="flex items-center gap-2">
                <div className="flex-1 flex items-center bg-gray-100 rounded-xl px-3 py-2.5">
                  <svg className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full bg-transparent outline-none text-sm text-gray-700"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => { setMobileSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
                  className="text-sm text-gray-500 font-medium px-2"
                >
                  Cancel
                </button>
              </form>
            </div>

            {/* Search Results */}
            <div className="p-4">
              {searchQuery.trim() && (
                <div className="mb-6">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Results</p>
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/shop/product/${product.id}/${product.slug}`}
                          onClick={() => { setMobileSearchOpen(false); setSearchQuery(""); }}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                            {product.images?.[0] && (
                              <img
                                src={getImageUrl(product.images[0].image_path || product.images[0])}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate text-sm">{product.name}</p>
                            <p className="text-sm text-green-600 font-semibold">
                              UGX {Number(product.price).toLocaleString()}
                            </p>
                          </div>
                        </Link>
                      ))}
                      <Link
                        href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => { setMobileSearchOpen(false); setSearchQuery(""); }}
                        className="block text-center text-green-600 font-medium py-3 hover:bg-green-50 rounded-xl"
                      >
                        View all results →
                      </Link>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8 text-sm">No products found for &quot;{searchQuery}&quot;</p>
                  )}
                  <hr className="my-4" />
                </div>
              )}

              {/* Browse Categories */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Browse Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.slice(0, 8).map((category) => (
                    <Link
                      key={category.id}
                      href={`/shop?category=${category.slug}`}
                      className="bg-gray-50 hover:bg-green-500 hover:text-white p-3 rounded-xl text-sm font-medium text-center transition-colors duration-200"
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

  return (
    <div ref={ref} className="relative flex-1 max-w-4xl">
      <form
        onSubmit={handleSearch}
        className="flex shadow-lg rounded-full overflow-hidden border border-green-100 bg-white/50 backdrop-blur-sm transition-all duration-300 focus-within:ring-4 focus-within:ring-green-500/20 focus-within:border-green-300 group shadow-green-900/5 hover:shadow-green-900/10"
      >
        <div className="flex items-center pl-5 md:pl-6">
          <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search for supplements, proteins..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full outline-none text-gray-700 bg-transparent text-sm md:text-base px-4 py-3 pl-3"
        />
        <button
          type="submit"
          className="flex items-center justify-center bg-green-500 text-white px-6 sm:px-7 py-3 hover:bg-green-600 transition-all duration-300 font-semibold active:scale-95"
        >
          Search
        </button>
      </form>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 w-full mt-3 bg-white shadow-2xl rounded-2xl p-4 sm:p-6 z-50 border border-gray-100 max-h-[70vh] overflow-y-auto">
          {searchQuery.trim() && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700">Search Results</h3>
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4caf50]"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/product/${product.id}/${product.slug}`}
                      onClick={() => {
                        setOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                        {product.images?.[0] && (
                          <img
                            src={getImageUrl(product.images[0].image_path || product.images[0])}
                            alt={product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-[#4caf50] font-semibold">
                          UGX {Number(product.price).toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => {
                      setOpen(false);
                      setSearchQuery("");
                    }}
                    className="block text-center text-[#4caf50] font-medium py-2 hover:underline"
                  >
                    View all results for &quot;{searchQuery}&quot;
                  </Link>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No products found for &quot;{searchQuery}&quot;</p>
              )}
              <hr className="my-5" />
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-3 text-gray-700">Browse Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.slice(0, 9).map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className="block bg-gray-50 hover:bg-[#4caf50] hover:text-white p-3 sm:p-4 rounded-xl text-sm font-medium text-center transition-colors duration-200"
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