import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { redirect } from "next/navigation";
import Link from "next/link";
import { Product } from "@/types/product.types";

interface ShopPageProps {
  searchParams: {
    page?: string;
    sort?: string;
    category?: string;
    min_price?: string;
    max_price?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const page = Number(searchParams.page) || 1;
  const sort = searchParams.sort || "created_at"; // default sort

  // Prepare API params
  const apiParams: any = {
    page,
    per_page: 9, // Grid layout fits 3 columns usually
    category_id: searchParams.category_id ? Number(searchParams.category_id) : undefined,
    search: searchParams.search || undefined,
    sort: sort === 'most-popular' ? 'sales_count'
      : sort === 'low-price' ? 'price_asc'
        : sort === 'high-price' ? 'price_desc'
          : 'created_at'
  };

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

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />
        <div className="flex md:space-x-5 items-start">
          <div className="hidden md:block min-w-[295px] max-w-[295px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filters</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <Filters />
          </div>
          <div className="flex flex-col w-full space-y-5">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl md:text-[32px]">All Products</h1>
                <MobileFilters />
              </div>
              <div className="flex flex-col sm:items-center sm:flex-row">
                <span className="text-sm md:text-base text-black/60 mr-3">
                  Showing {meta.from}-{meta.to} of {meta.total} Products
                </span>

                {/* 
                  Note: Client component for real-time sorting would act better here, 
                  but we can use simple links or a client wrapper for Select 
                */}
                <div className="flex items-center">
                  {/* Fallback sort display since Select requires client interactivity for routing */}
                  <span className="text-sm font-medium">Sort: {sort}</span>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
              <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} data={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-gray-500">
                No products found.
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
                  {/* Simple pagination logic: show current, prev, next */}
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
