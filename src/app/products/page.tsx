"use client"; // keep it first

import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/common/ProductCard";
import { products as staticProducts } from "@/data/products";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");

  // Filter the products immediately (no useState/useEffect needed)
  const filteredProducts = staticProducts.filter((p) => {
    if (category && p.category.toLowerCase() !== category.toLowerCase())
      return false;
    if (brand && p.brand.toLowerCase() !== brand.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-bold text-black-700 mb-6">
        {category
          ? `Category: ${category}`
          : brand
          ? `Brand: ${brand}`
          : "All Products"}
      </h1>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((item) => (
            <ProductCard key={item.id} data={item} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found.</p>
      )}
    </div>
  );
}
