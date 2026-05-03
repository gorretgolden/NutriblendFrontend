import { notFound } from "next/navigation";
import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import Header from "@/components/product-page/Header";
import Tabs from "@/components/product-page/Tabs";
import { apiClient } from "@/lib/api/client";
import { transformProduct } from "@/lib/transformers";
import { Product } from "@/types/product.types";

export async function generateStaticParams() {
  let allSlugs: { slug: string[] }[] = [];
  try {
    let page = 1;
    let lastPage = 1;
    do {
      const response = await apiClient.getProducts({ per_page: 100, page });
      if (response.status && response.data?.data) {
        const paths = response.data.data.map((p: any) => ({
          slug: [p.id.toString(), p.slug || "product"],
        }));
        allSlugs = [...allSlugs, ...paths];
        lastPage = response.data.last_page || 1;
      } else {
        break;
      }
      page++;
    } while (page <= lastPage);
  } catch (error) {
    console.error("Failed to fetch products for static paths:", error);
  }
  
  return allSlugs;
}

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