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

    // Fetch related products (e.g., from same category or just random for now)
    // Ideally we'd use response.data.category_id to filter, but we need to await the first call.
    // Parallelizing is harder if we need dependency. Let's just fetch generic suggestions or use category if available.

    // Simplistic approach: just get some products
    const relatedRes = await apiClient.getProducts({ per_page: 4 });
    if (relatedRes.status && relatedRes.data) {
      relatedProducts = relatedRes.data.data
        .map(transformProduct)
        .filter(p => p.id !== productId)
        .slice(0, 4);
    }

  } catch (error) {
    console.error("Error fetching product:", error);
  }

  if (!productData) {
    notFound();
  }

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-green-200 mb-5 sm:mb-6" />
        <BreadcrumbProduct title={productData.title} />
        <section className="mb-11">
          <Header data={productData} />
        </section>
        <section className="mb-12">
          <Tabs data={productData} />
        </section>
      </div>
      <div className="mb-[50px] sm:mb-20">
        {relatedProducts.length > 0 && (
          <ProductListSec title="You might also like" data={relatedProducts} />
        )}
      </div>
    </main>
  );
}