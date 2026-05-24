"use client";

import { useEffect, useState } from "react";
import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import Header from "@/components/product-page/Header";
import Tabs from "@/components/product-page/Tabs";
import { apiClient } from "@/lib/api/client";
import { transformProduct } from "@/lib/transformers";
import { Product } from "@/types/product.types";
import ProductDetailsLoading from "./loading";

interface ProductDetailClientProps {
  initialProductId: number;
}

export default function ProductDetailClient({ initialProductId }: ProductDetailClientProps) {
  const [productData, setProductData] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialProductId) return;

    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.getProduct(initialProductId);
        if (!isMounted) return;

        if (response.status && response.data) {
          const rawProduct = (response.data as any).data
            ? (response.data as any).data
            : response.data;

          try {
            const transformed = transformProduct(rawProduct);
            setProductData(transformed);
          } catch (transformError) {
            console.error("[ProductPage] transformProduct failed:", transformError, rawProduct);
            setError("Could not parse product data");
          }
        } else {
          setError(response.message || "Product not found");
        }
      } catch (fetchError: any) {
        console.error("[ProductPage] Error fetching product:", fetchError);
        setError(fetchError.message || "Error loading product");
      } finally {
        if (isMounted) setLoading(false);
      }

      // Fetch related products best-effort
      try {
        const relatedRes = await apiClient.getProducts({ per_page: 7 });
        if (!isMounted) return;

        if (relatedRes.status && relatedRes.data) {
          const items = relatedRes.data.data
            .map((p) => {
              try { return transformProduct(p); } catch { return null; }
            })
            .filter((p): p is Product => p !== null && p.id !== initialProductId)
            .slice(0, 6);
          setRelatedProducts(items);
        }
      } catch {
        // silently ignore related products errors
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [initialProductId]);

  if (loading) {
    return <ProductDetailsLoading />;
  }

  if (error || !productData) {
    return (
      <main className="bg-[#f5f5f5] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Product Unavailable</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            We couldn't load this product right now. This might be a temporary issue — please try again or browse other products.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#009E3C] text-white rounded-full font-bold text-sm hover:bg-[#007a2e] transition-all hover:scale-105 shadow-md shadow-[#009E3C]/20"
            >
              Try Again
            </button>
            <a
              href="/shop"
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-full font-bold text-sm hover:bg-gray-50 transition-all hover:scale-105"
            >
              Browse Shop
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f5f5f5] min-h-screen">
      {/* Breadcrumb bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
          <BreadcrumbProduct title={productData.title} />
        </div>
      </div>

      {/* Product Detail — Images + Key Info */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Hero Section: Photo + Pricing */}
        <section>
          <Header data={productData} />
        </section>

        {/* Product Details Section — Main Content */}
        <section id="product-tabs">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <Tabs data={productData} />
          </div>
        </section>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-white border-t border-gray-200 py-10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <ProductListSec title="Customers Also Viewed" data={relatedProducts} />
          </div>
        </div>
      )}
    </main>
  );
}
