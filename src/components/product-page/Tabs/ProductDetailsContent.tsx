import { Product } from "@/types/product.types";
import React from "react";
import ProductDetails from "./ProductDetails";

import { sanitizeRichHtml } from "@/lib/utils/security";

const ProductDetailsContent = ({ data }: { data: Product }) => {
  return (
    <div className="space-y-8 px-4 sm:px-6 md:px-8 pb-8">
      {/* Short Description Section */}
      {data.shortDescription && (
        <section className="prose prose-lg max-w-none">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 tracking-tight">
            About this product
          </h3>
          <div className="text-sm sm:text-base md:text-[16px] leading-relaxed text-gray-600">
            {data.shortDescription}
          </div>
        </section>
      )}

      {/* Full Description Section */}
      {data.description && (
        <section className="prose prose-lg max-w-none">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 tracking-tight">
            Product Description
          </h3>
          <div 
            className="text-sm sm:text-base md:text-[16px] leading-relaxed text-gray-600 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1.5 [&_strong]:text-gray-800 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-4 [&_h3]:mb-2"
            dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(data.description) }}
          />
        </section>
      )}

      {/* Key Features Section */}
      {data.keyFeatures && data.keyFeatures.length > 0 && (
        <section className="bg-gradient-to-br from-[#f8fdf9] to-white p-5 sm:p-6 md:p-8 rounded-2xl border border-[#009E3C]/10">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-5 tracking-tight flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#009E3C]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4.5 h-4.5 text-[#009E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            Key Features
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {data.keyFeatures.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm sm:text-base md:text-[16px] text-gray-700 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-[#009E3C]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-[#009E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Specifications Section */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 sm:px-6 md:px-8 py-4 sm:py-5 bg-gray-50/80 border-b border-gray-100">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Specifications
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          <ProductDetails data={data} />
        </div>
      </section>

      {/* What's in the box Section */}
      {data.whatsInBox && (
        <section className="bg-gradient-to-br from-blue-50/50 to-white p-5 sm:p-6 md:p-8 rounded-2xl border border-blue-100/50">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 tracking-tight flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4.5 h-4.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </span>
            What&apos;s in the box
          </h3>
          <div className="text-sm sm:text-base md:text-[16px] text-gray-700 leading-relaxed whitespace-pre-wrap">
            {data.whatsInBox}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailsContent;
