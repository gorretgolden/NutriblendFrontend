"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient, getImageUrl } from "@/lib/api/client";

export default function SearchWithDropdown() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Detect mobile
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cached = localStorage.getItem('search_categories_cache_v2');
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
          localStorage.setItem('search_categories_cache_v2', JSON.stringify({
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

  // Search products with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close on outside click
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

  const handleToggle = () => setOpen((s) => !s);

  const containerClasses = isMobile
    ? "relative flex-1 max-w-md mx-4 my-4"
    : "relative flex-1 max-w-4xl mx-4 lg:mx-8 my-4";

  const inputPadding = isMobile ? "px-4 py-2" : "px-6 py-3";
  const buttonPadding = isMobile ? "px-4 py-2" : "px-6 sm:px-7 py-3";
  const iconSize = isMobile ? "w-5 h-5" : "w-6 h-6";

  return (
    <div ref={ref} className={containerClasses}>
      {/* Search Form */}
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
          className={`w-full outline-none text-gray-700 bg-transparent text-sm md:text-base ${inputPadding} pl-3`}
        />
        <button
          type="submit"
          className={`flex items-center justify-center bg-green-500 text-white ${buttonPadding} hover:bg-green-600 transition-all duration-300 font-semibold active:scale-95`}
        >
          Search
        </button>
      </form>

      {/* Dropdown / Overlay */}
      {open && (
        <div className="absolute top-full left-0 w-full mt-3 bg-white shadow-2xl rounded-2xl p-4 sm:p-6 z-50 border border-gray-100 max-h-[70vh] overflow-y-auto">
          {/* Search Results */}
          {searchQuery.trim() && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700">Search Results</h3>
              {isLoading ? (
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
                            src={getImageUrl(product.images[0].image_path)}
                            alt={product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-[#4caf50] font-semibold">
                          UGX {product.price.toLocaleString()}
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
                    View all results for "{searchQuery}"
                  </Link>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No products found for "{searchQuery}"</p>
              )}
              <hr className="my-5" />
            </div>
          )}

          {/* Browse Categories */}
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
