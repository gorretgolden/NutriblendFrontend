import { notFound } from "next/navigation";
import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import Header from "@/components/product-page/Header";
import Tabs from "@/components/product-page/Tabs";
import { apiClient } from "@/lib/api/client";
import { transformProduct } from "@/lib/transformers";
import { Product } from "@/types/product.types";

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const productId = Number(params.slug[0]);
  let productData: Product | null = null;
  let relatedProducts: Product[] = [];

  // ── Fetch the single product ─────────────────────────────────────────────
  try {
    const response = await apiClient.getProduct(productId);
    if (response.status && response.data) {
      // Handle potential Laravel Resource double-wrapping: data.data
      const rawProduct = (response.data as any).data
        ? (response.data as any).data
        : response.data;

      try {
        productData = transformProduct(rawProduct);
      } catch (transformError) {
        console.error("[ProductPage] transformProduct failed:", transformError, rawProduct);
      }
    } else {
      console.error("[ProductPage] API returned non-success:", response.message);
    }
  } catch (fetchError) {
    console.error("[ProductPage] Error fetching product:", fetchError);
  }

  // ── Guard: show 404 if product could not be loaded ───────────────────────
  // Called OUTSIDE the try/catch so Next.js can handle it properly.
  if (!productData) {
    notFound();
  }

  // ── Fetch related products (best-effort, never throws) ───────────────────
  try {
    const relatedRes = await apiClient.getProducts({ per_page: 7 });
    if (relatedRes.status && relatedRes.data) {
      relatedProducts = relatedRes.data.data
        .map((p) => {
          try { return transformProduct(p); } catch { return null; }
        })
        .filter((p): p is Product => p !== null && p.id !== productId)
        .slice(0, 6);
    }
  } catch {
    // Related products are non-critical — silently ignore failures
  }

  return (
    <main className="bg-[#f5f5f5] min-h-screen">
      {/* Breadcrumb bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
          <BreadcrumbProduct title={productData!.title} />
        </div>
      </div>

      {/* Product Detail — Images + Key Info */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Hero Section: Photo + Pricing */}
        <section>
          <Header data={productData!} />
        </section>

        {/* Product Details Section — Main Content */}
        <section id="product-tabs">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <Tabs data={productData!} />
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