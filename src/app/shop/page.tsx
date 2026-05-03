export const dynamic = 'force-dynamic';

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
import { apiClient, getImageUrl } from "@/lib/api/client";
import { transformProduct } from "@/lib/transformers";
import Link from "next/link";
import { Product } from "@/types/product.types";

interface ShopPageProps {
  searchParams: {
    page?: string;
    sort?: string;
    category?: string;
    category_id?: string;
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

  const apiParams: any = {
    page,
    per_page: 24,
    category_slug: searchParams.category || undefined,
    category_id: !searchParams.category && searchParams.category_id
      ? Number(searchParams.category_id) : undefined,
    brand_id: searchParams.brand_id ? Number(searchParams.brand_id) : undefined,
    min_price: searchParams.min_price ? Number(searchParams.min_price) : undefined,
    max_price: searchParams.max_price ? Number(searchParams.max_price) : undefined,
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

  const categoryName = searchParams.category
    ? searchParams.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : null;

  const pageTitle = searchParams.is_special_offer === 'true' ? 'Special Offers'
    : searchParams.is_trending === 'true' ? 'Trending Now'
      : searchParams.is_recommended === 'true' ? 'Recommended For You'
        : searchParams.is_new_arrival === 'true' ? 'New Arrivals'
          : searchParams.on_sale === 'true' ? 'On Sale'
            : searchParams.is_featured === 'true' ? 'Featured Products'
              : searchParams.search ? `Results for "${searchParams.search}"`
                : categoryName ? categoryName
                  : 'All Products';

  let products: Product[] = [];
  let meta = { current_page: 1, last_page: 1, total: 0, from: 0, to: 0 };
  let selectedCategory: any = null;

  try {
    if (searchParams.category) {
      const catRes = await apiClient.getCategoryBySlug(searchParams.category);
      if (catRes.status) {
        selectedCategory = catRes.data;
      }
    }

    const response = await apiClient.getProducts(apiParams);
    if (response.status && response.data) {
      const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
      const metaObj = (response as any).meta || response.data;

      products = items.map(transformProduct);
      meta = {
        current_page: metaObj.current_page || 1,
        last_page: metaObj.last_page || 1,
        total: metaObj.total || 0,
        from: metaObj.from || 0,
        to: metaObj.to || 0
      };
    }
  } catch (error) {
    console.error("Failed to load shop products:", error);
  }

  const getPageLink = (p: number) => {
    const params = new URLSearchParams(searchParams as any);
    params.set('page', p.toString());
    return `/shop?${params.toString()}`;
  };

  const sortOptions = [
    { value: 'created_at', label: 'Newest' },
    { value: 'most-popular', label: 'Best Selling' },
    { value: 'low-price', label: 'Price: Low to High' },
    { value: 'high-price', label: 'Price: High to Low' },
  ];

  const getSortLink = (sortValue: string) => {
    const params = new URLSearchParams(searchParams as any);
    params.set('sort', sortValue);
    params.delete('page');
    return `/shop?${params.toString()}`;
  };

  return (
    <main className="bg-[#f5f5f5] min-h-screen pb-16">
      {/* Breadcrumb bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
          <BreadcrumbShop />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-6">
        <div className="flex gap-6 items-start">
          {/* Sidebar Filters */}
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

          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* Category Header */}
            {selectedCategory ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                {(selectedCategory.full_banner_url || selectedCategory.banner || selectedCategory.image) ? (
                  <div className="relative h-[200px] sm:h-[260px] w-full overflow-hidden">
                    <img 
                      src={getImageUrl(selectedCategory.full_banner_url || selectedCategory.banner || selectedCategory.image)} 
                      alt={selectedCategory.name} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-white">
                      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 drop-shadow-md">
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
                    {meta.total > 0 ? `Showing ${meta.from}–${meta.to} of ${meta.total} products` : 'No products found'}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                    {sortOptions.map((opt) => (
                      <Link 
                        key={opt.value} 
                        href={getSortLink(opt.value)} 
                        className={`whitespace-nowrap text-[11px] px-3 py-1.5 rounded-full border transition-all duration-200 font-semibold ${sort === opt.value ? 'bg-[#009E3C] text-white border-[#009E3C]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#009E3C]'}`}
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
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 sm:px-6 py-3 mb-5 flex items-center justify-between gap-3">
                <p className="text-[12px] font-bold text-gray-400">
                  {meta.total > 0 ? `Showing ${meta.from}–${meta.to} of ${meta.total} items` : 'No items available'}
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {sortOptions.map((opt) => (
                      <Link 
                        key={opt.value} 
                        href={getSortLink(opt.value)} 
                        className={`whitespace-nowrap text-[11px] px-3 py-1.5 rounded-full border transition-all duration-200 font-semibold ${sort === opt.value ? 'bg-[#009E3C] text-white border-[#009E3C]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#009E3C]'}`}
                      >
                        {opt.label}
                      </Link>
                    ))}
                  </div>
                  <MobileFilters />
                </div>
              </div>
            )}

            {/* Product Grid */}
            {products.length > 0 ? (
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

            {/* Pagination */}
            {meta.last_page > 1 && (
              <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-4">
                <Pagination className="justify-between">
                  <PaginationPrevious
                    href={meta.current_page > 1 ? getPageLink(meta.current_page - 1) : '#'}
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
                    href={meta.current_page < meta.last_page ? getPageLink(meta.current_page + 1) : '#'}
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
