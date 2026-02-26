import { Product } from "@/types/product.types";
import React from "react";

const ProductDetails = ({ data }: { data: Product }) => {
  const specsData = [
    { label: "SKU", value: data.sku || "N/A" },
    { label: "Brand", value: data.brand || "Generic" },
    { label: "Weight", value: data.weight ? `${data.weight} kg` : "N/A" },
    { label: "Stock", value: data.inStock ? "In Stock" : "Out of Stock" },
    { label: "Model", value: data.title },
  ];

  return (
    <>
      {specsData.map((item, i) => (
        <div className="grid grid-cols-3 border-b border-gray-100 last:border-0" key={i}>
          <div className="bg-gray-50">
            <p className="text-[13px] py-2 px-4 leading-6 text-neutral-500 font-medium">
              {item.label}
            </p>
          </div>
          <div className="col-span-2 py-2 px-4">
            <p className="text-[13px] w-full leading-6 text-neutral-800">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductDetails;
