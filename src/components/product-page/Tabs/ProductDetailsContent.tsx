import { Product } from "@/types/product.types";
import React from "react";
import ProductDetails from "./ProductDetails";

import { sanitizeRichHtml } from "@/lib/utils/security";

const ProductDetailsContent = ({ data }: { data: Product }) => {
  return (
    <div className="space-y-8 px-6 pb-8">
      {/* Full Description Section */}
      {data.description && (
        <section className="prose prose-sm max-w-none text-gray-700">
          <h3 className="text-xl font-bold text-black mb-4">
            Product Description
          </h3>
          <div 
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(data.description) }}
          />
        </section>
      )}
      {/* Key Features Section */}
      {data.keyFeatures && data.keyFeatures.length > 0 && (
        <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-black mb-4">
            Key Features
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 list-disc list-inside text-gray-700">
            {data.keyFeatures.map((feature, idx) => (
              <li key={idx} className="text-sm leading-relaxed">{feature}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Specifications Section */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <h3 className="text-lg font-bold text-black">
            Specifications
          </h3>
        </div>
        <div>
          <ProductDetails data={data} />
        </div>
      </section>

      {/* What's in the box Section */}
      {data.whatsInBox && (
        <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-black mb-4">
            What&apos;s in the box
          </h3>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {data.whatsInBox}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailsContent;
