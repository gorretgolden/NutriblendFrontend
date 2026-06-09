import { Product } from "@/types/product.types";
import React from "react";

const ProductDetails = ({ data }: { data: Product }) => {
  const specsData = [
    { label: "SKU", value: data.sku || "N/A" },
    { label: "Brand", value: data.brand || "Generic" },
    { label: "Weight", value: data.weight ? `${data.weight} ${data.weight_unit || 'kg'}` : "N/A" },
    { label: "Stock", value: data.inStock ? "In Stock" : "Out of Stock" },
    { label: "Model", value: data.title },
  ];

  return (
    <>
      {specsData.map((item, i) => (
        <div className="grid grid-cols-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors" key={i}>
          <div className="bg-gray-50/80">
            <p className="text-sm sm:text-[15px] py-3 sm:py-3.5 px-5 sm:px-6 leading-6 text-gray-500 font-semibold">
              {item.label}
            </p>
          </div>
          <div className="col-span-2 py-3 sm:py-3.5 px-5 sm:px-6">
            <p className="text-sm sm:text-[15px] w-full leading-6 text-gray-800 font-medium">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductDetails;
