import { notFound } from "next/navigation";
import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import Header from "@/components/product-page/Header";
import Tabs from "@/components/product-page/Tabs";
import { apiClient } from "@/lib/api/client";
import { transformProduct } from "@/lib/transformers";
import { Product } from "@/types/product.types";

export default async function ProductPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const productId = Number(params.slug[0]);
  let productData: Product | null = null;
  let relatedProducts: Product[] = [];

  try {
    const response = await apiClient.getProduct(productId);
    if (response.status && response.data) {
      productData = transformProduct(response.data);
    }

    const relatedRes = await apiClient.getProducts({ per_page: 6 });
    if (relatedRes.status && relatedRes.data) {
      relatedProducts = relatedRes.data.data
        .map(transformProduct)
        .filter(p => p.id !== productId)
        .slice(0, 6);
    }

  } catch (error) {
    console.error("Error fetching product:", error);
  }

  if (!productData) {
    notFound();
  }

  return (
    <main className="bg-[#f5f5f5] min-h-screen">
      {/* Breadcrumb bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
          <BreadcrumbProduct title={productData.title} />
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <section className="mb-8">
          <Header data={productData} />
        </section>

        <section className="mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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