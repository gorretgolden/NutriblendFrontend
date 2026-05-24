"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";
import MobileFilters from "@/components/shop-page/filters/MobileFilters";
import Filters from "@/components/shop-page/filters";
import { FiSliders } from "react-icons/fi";
import ProductCard from "@/components/common/ProductCard";
import ProductCardSkeleton from "@/components/common/ProductCardSkeleton";
import Loading from "./loading";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { apiClient, getImageUrl } from "@/lib/api/client";
import { transformProduct } from "@/lib/transformers";
import Link from "next/link";
import { Product } from "@/types/product.types";

function ShopClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 });
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getParam = (paramName: string): string | undefined => {
    return searchParams.get(paramName) || undefined;
  };

  const page = Number(getParam("page")) || 1;
  const sort = getParam("sort") || "created_at";
  const searchStr = getParam("search");
  const categorySlug = getParam("category");

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      const apiParams: any = {
        page,
        per_page: 24,
        category_slug: categorySlug || undefined,
        category_id: !categorySlug && getParam("category_id") ? Number(getParam("category_id")) : undefined,
        brand_id: getParam("brand_id") ? Number(getParam("brand_id")) : undefined,
        min_price: getParam("min_price") ? Number(getParam("min_price")) : undefined,
        max_price: getParam("max_price") ? Number(getParam("max_price")) : undefined,
        search: searchStr || undefined,
        is_special_offer: getParam("is_special_offer") === "true" ? true : undefined,
        is_trending: getParam("is_trending") === "true" ? true : undefined,
        is_recommended: getParam("is_recommended") === "true" ? true : undefined,
        is_new_arrival: getParam("is_new_arrival") === "true" ? true : undefined,
        on_sale: getParam("on_sale") === "true" ? true : undefined,
        is_featured: getParam("is_featured") === "true" ? true : undefined,
        sort: sort === "most-popular" ? "sales_count"
          : sort === "low-price" ? "price_asc"
            : sort === "high-price" ? "price_desc"
              : "created_at"
      };

      try {
        if (categorySlug) {
          const catRes = await apiClient.getCategoryBySlug(categorySlug);
          if (isMounted) {
            if (catRes.status) {
              setSelectedCategory(catRes.data);
            } else {
              setSelectedCategory(null);
            }
          }
        } else {
          if (isMounted) setSelectedCategory(null);
        }

        const response = await apiClient.getProducts(apiParams);
        if (!isMounted) return;

        if (response.status && response.data) {
          const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
          const metaObj = (response as any).meta || (response.data as any).meta || response.data;

          setProducts(items.map(transformProduct));
          const lastPage = Math.min(Number(metaObj.last_page) || 1, 500);
          setMeta({
            current_page: Number(metaObj.current_page) || 1,
            last_page: lastPage,
            total: Number(metaObj.total) || 0,
            from: Number(metaObj.from) || 0,
            to: Number(metaObj.to) || 0
          });
        } else {
          console.error("API Error Response:", response);
          setError(response.message || "Failed to load products. Please try again later.");
        }
      } catch (err: any) {
        console.error("Failed to load shop products:", err);
        if (isMounted) {
          setError(err.message || "An unexpected error occurred while loading products.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [searchParams.toString(), page, sort, searchStr, categorySlug]);

  const categoryName = categorySlug
    ? categorySlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : null;

  const pageTitle = getParam("is_special_offer") === "true" ? "Special Offers"
    : getParam("is_trending") === "true" ? "Trending Now"
      : getParam("is_recommended") === "true" ? "Recommended For You"
        : getParam("is_new_arrival") === "true" ? "New Arrivals"
          : getParam("on_sale") === "true" ? "On Sale"
            : getParam("is_featured") === "true" ? "Featured Products"
              : searchStr ? `Results for "${searchStr}"`
                : categoryName ? categoryName
                  : "All Products";

  const getPageLink = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    return `/shop?${params.toString()}`;
  };

  const sortOptions = [
    { value: "created_at", label: "Newest" },
    { value: "most-popular", label: "Best Selling" },
    { value: "low-price", label: "Price: Low to High" },
    { value: "high-price", label: "Price: High to Low" },
  ];

  const getSortLink = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortValue);
    params.delete("page");
    return `/shop?${params.toString()}`;
  };

  return (
    <main className="bg-[#f5f5f5] min-h-screen pb-16">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
          <BreadcrumbShop />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-6">
        <div className="flex gap-6 items-start">
          <div className="hidden lg:block w-[260px] flex-shrink-0 sticky top-32">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
                <span className="font-bold text-gray-900 text-base">Filters</span>
                <FiSliders className="text-lg text-gray-400" />
              </div>
              <div className="px-5 py-4">
                <Filters />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {selectedCategory ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                {(selectedCategory.full_banner_url || selectedCategory.banner || selectedCategory.image) ? (
                  <div className="relative h-[200px] sm:h-[260px] w-full overflow-hidden">
                    <img 
                      src={getImageUrl(selectedCategory.full_banner_url || selectedCategory.banner || selectedCategory.image)} 
                      alt={selectedCategory.name} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/20 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                    <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-white">
                      <h1 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 drop-shadow-md">
                        {selectedCategory.name}
                      </h1>
                      <p className="text-sm sm:text-base font-medium text-gray-100 max-w-xl opacity-90">
                        {selectedCategory.description || "Premium selection of health and wellness products."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-6 px-8 py-10 max-w-4xl">
                    {selectedCategory.icon && (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                        <img 
                          src={getImageUrl(selectedCategory.icon)} 
                          alt={selectedCategory.name} 
                          className="w-full h-full object-contain filter drop-shadow-xl" 
                        />
                      </div>
                    )}
                    <div className="text-center sm:text-left">
                      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter mb-2">
                        {selectedCategory.name}
                      </h1>
                      <p className="text-sm sm:text-base text-gray-500 font-medium max-w-xl leading-relaxed">
                        {selectedCategory.description || "Explore our curated range of wellness essentials."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 sm:px-6 py-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-extrabold text-xl sm:text-2xl text-gray-900 leading-tight">{pageTitle}</h1>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5 font-medium">
                    {loading ? "Loading products..." : meta.total > 0 ? `Showing ${meta.from}–${meta.to} of ${meta.total} products` : "No products found"}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                    {sortOptions.map((opt) => (
                      <Link 
                        key={opt.value} 
                        href={getSortLink(opt.value)} 
                        className={`whitespace-nowrap text-[11px] px-3 py-1.5 rounded-full border transition-all duration-200 font-semibold ${sort === opt.value ? "bg-[#009E3C] text-white border-[#009E3C]" : "bg-white text-gray-600 border-gray-200 hover:border-[#009E3C]"}`}
                      >
                        {opt.label}
                      </Link>
                    ))}
                  </div>
                  <MobileFilters />
                </div>
              </div>
            )}

            {selectedCategory && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 sm:px-6 py-3 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-[12px] font-bold text-gray-400">
                  {loading ? "Loading products..." : meta.total > 0 ? `Showing ${meta.from}–${meta.to} of ${meta.total} items` : "No items available"}
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {sortOptions.map((opt) => (
                      <Link 
                        key={opt.value} 
                        href={getSortLink(opt.value)} 
                        className={`whitespace-nowrap text-[11px] px-3 py-1.5 rounded-full border transition-all duration-200 font-semibold ${sort === opt.value ? "bg-[#009E3C] text-white border-[#009E3C]" : "bg-white text-gray-600 border-gray-200 hover:border-[#009E3C]"}`}
                      >
                        {opt.label}
                      </Link>
                    ))}
                  </div>
                  <MobileFilters />
                </div>
              </div>
            )}

            {loading ? (
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg border border-red-100 py-16 px-6 text-center shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-gray-900 font-bold text-xl mb-2">Service Temporarily Unavailable</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                  {error}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
                  <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-all shadow-md">
                    Try Again
                  </button>
                  <Link href="/" className="px-6 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all">
                    Return Home
                  </Link>
                </div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} data={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 py-20 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-semibold text-lg">No products found</p>
                <p className="text-gray-400 text-sm mt-1.5">Try adjusting your filters or browse our categories</p>
                <Link href="/shop" className="inline-block mt-4 px-6 py-2.5 bg-[#009E3C] text-white rounded-lg font-semibold text-sm hover:bg-[#007a2e] transition-colors">
                  Browse All Products
                </Link>
              </div>
            )}

            {!loading && meta.last_page > 1 && (
              <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-4">
                <Pagination className="justify-between">
                  <PaginationPrevious
                    href={meta.current_page > 1 ? getPageLink(meta.current_page - 1) : "#"}
                    className={meta.current_page <= 1 ? "pointer-events-none opacity-50 border border-gray-200" : "border border-gray-200 hover:bg-[#009E3C] hover:text-white hover:border-[#009E3C]"}
                  />

                  <PaginationContent>
                    {Array.from({ length: meta.last_page }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href={getPageLink(i + 1)}
                          isActive={meta.current_page === i + 1}
                          className={meta.current_page === i + 1 ? "bg-[#009E3C] text-white hover:bg-[#007a2e] hover:text-white" : "hover:text-[#009E3C] transition-colors"}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  </PaginationContent>

                  <PaginationNext
                    href={meta.current_page < meta.last_page ? getPageLink(meta.current_page + 1) : "#"}
                    className={meta.current_page >= meta.last_page ? "pointer-events-none opacity-50 border border-gray-200" : "border border-gray-200 hover:bg-[#009E3C] hover:text-white hover:border-[#009E3C]"}
                  />
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ShopClient />
    </Suspense>
  );
}
