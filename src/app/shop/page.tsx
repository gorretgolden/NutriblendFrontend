import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";
import MobileFilters from "@/components/shop-page/filters/MobileFilters";
import Filters from "@/components/shop-page/filters";
import { FiSliders } from "react-icons/fi";
import ProductCard from "@/components/common/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { apiClient } from "@/lib/api/client";
import { transformProduct } from "@/lib/transformers";
import Link from "next/link";
import { Product } from "@/types/product.types";

interface ShopPageProps {
  searchParams: {
    page?: string;
    sort?: string;
    category?: string; // slug-based
    category_id?: string; // legacy support
    min_price?: string;
    max_price?: string;
    search?: string;
    is_special_offer?: string;
    is_trending?: string;
    is_recommended?: string;
    is_new_arrival?: string;
    on_sale?: string;
    is_featured?: string;
    brand_id?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const page = Number(searchParams.page) || 1;
  const sort = searchParams.sort || "created_at";

  // Prepare API params — prefer slug, fallback to category_id for legacy links
  const apiParams: any = {
    page,
    per_page: 12,
    category_slug: searchParams.category || undefined,
    category_id: !searchParams.category && searchParams.category_id
      ? Number(searchParams.category_id) : undefined,
    brand_id: searchParams.brand_id ? Number(searchParams.brand_id) : undefined,
    search: searchParams.search || undefined,
    is_special_offer: searchParams.is_special_offer === 'true' ? true : undefined,
    is_trending: searchParams.is_trending === 'true' ? true : undefined,
    is_recommended: searchParams.is_recommended === 'true' ? true : undefined,
    is_new_arrival: searchParams.is_new_arrival === 'true' ? true : undefined,
    on_sale: searchParams.on_sale === 'true' ? true : undefined,
    is_featured: searchParams.is_featured === 'true' ? true : undefined,
    sort: sort === 'most-popular' ? 'sales_count'
      : sort === 'low-price' ? 'price_asc'
        : sort === 'high-price' ? 'price_desc'
          : 'created_at'
  };

  // Dynamic page title
  const categoryName = searchParams.category
    ? searchParams.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : null;

  const pageTitle = searchParams.is_special_offer === 'true' ? 'Special Offers'
    : searchParams.is_trending === 'true' ? 'Trending Now'
      : searchParams.is_recommended === 'true' ? 'Recommended For You'
        : searchParams.is_new_arrival === 'true' ? 'New Arrivals'
          : searchParams.on_sale === 'true' ? 'On Sale'
            : searchParams.is_featured === 'true' ? 'Featured Products'
              : searchParams.search ? `Search: "${searchParams.search}"`
                : categoryName ? categoryName
                  : 'All Products';

  // Fetch data
  let products: Product[] = [];
  let meta = {
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0
  };

  try {
    const response = await apiClient.getProducts(apiParams);
    if (response.status && response.data) {
      products = response.data.data.map(transformProduct);
      meta = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total,
        from: response.data.from,
        to: response.data.to
      };
    }
  } catch (error) {
    console.error("Failed to load shop products:", error);
  }

  // Helper to build pagination links
  const getPageLink = (p: number) => {
    const params = new URLSearchParams(searchParams as any);
    params.set('page', p.toString());
    return `/shop?${params.toString()}`;
  };

  // Sort label
  const sortLabel = sort === 'most-popular' ? 'Popular'
    : sort === 'low-price' ? 'Price: Low → High'
      : sort === 'high-price' ? 'Price: High → Low'
        : 'Newest';

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-3 sm:mb-5" />
        <BreadcrumbShop />
        <div className="flex md:space-x-5 items-start">
          {/* Desktop Sidebar Filters */}
          <div className="hidden md:block min-w-[295px] max-w-[295px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filters</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <Filters />
          </div>

          {/* Main Content */}
          <div className="flex flex-col w-full space-y-4 sm:space-y-5">
            {/* Header Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h1 className="font-bold text-xl sm:text-2xl md:text-[32px] truncate">{pageTitle}</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  {meta.total > 0
                    ? `Showing ${meta.from}–${meta.to} of ${meta.total} products`
                    : 'No products found'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Sort badge */}
                <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  {sortLabel}
                </span>
                <MobileFilters />
              </div>
            </div>

            {/* Product Grid — 2 columns on mobile, 3 on tablet, 3 on desktop */}
            {products.length > 0 ? (
              <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} data={product} />
                ))}
              </div>
            ) : (
              <div className="py-16 sm:py-20 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No products found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search</p>
              </div>
            )}

            <hr className="border-t-black/10" />

            {/* Pagination */}
            {meta.last_page > 1 && (
              <Pagination className="justify-between">
                <PaginationPrevious
                  href={meta.current_page > 1 ? getPageLink(meta.current_page - 1) : '#'}
                  className={meta.current_page <= 1 ? "pointer-events-none opacity-50 border border-black/10" : "border border-black/10"}
                />

                <PaginationContent>
                  {meta.current_page > 1 && (
                    <PaginationItem>
                      <PaginationLink href={getPageLink(meta.current_page - 1)} className="text-black/50 font-medium text-sm">
                        {meta.current_page - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationLink href="#" isActive className="font-medium text-sm">
                      {meta.current_page}
                    </PaginationLink>
                  </PaginationItem>

                  {meta.current_page < meta.last_page && (
                    <PaginationItem>
                      <PaginationLink href={getPageLink(meta.current_page + 1)} className="text-black/50 font-medium text-sm">
                        {meta.current_page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {meta.last_page > meta.current_page + 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </PaginationContent>

                <PaginationNext
                  href={meta.current_page < meta.last_page ? getPageLink(meta.current_page + 1) : '#'}
                  className={meta.current_page >= meta.last_page ? "pointer-events-none opacity-50 border border-black/10" : "border border-black/10"}
                />
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
