"use client";

import React from "react";
import PhotoSection from "./PhotoSection";
import { Product } from "@/types/product.types";
import { cn } from "@/lib/utils";
import Rating from "@/components/ui/Rating";
import SizeSelection from "./SizeSelection";
import AddToCardSection from "./AddToCardSection";
import ChatHelp from "./ChatHelp";
import { sanitizeRichHtml } from "@/lib/utils/security";
import { useAppSelector } from "@/lib/hooks/redux";
import { toast } from "sonner";

const Header = ({ data }: { data: Product }) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const isWholesaleUser = isAuthenticated && user?.is_wholesale_approved;
  const isUsingWholesalePrice = isWholesaleUser && !!data.wholesale_price;

  const handleShareProduct = async () => {
    const shareUrl = typeof window !== 'undefined'
      ? window.location.href
      : `https://nutriblendhaven.com/shop/product/${data.id}/${data.slug || 'product'}`;

    const sharePayload = {
      title: data.title,
      text: `Check out ${data.title} on NutriBlend Haven`,
      url: shareUrl,
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(sharePayload);
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Product link copied to clipboard');
        return;
      }

      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    } catch {
      toast.error('Unable to share right now. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.07),0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left column — Photo gallery (5 cols) */}
        <div className="lg:col-span-5 bg-white p-4 md:p-8 border-r border-gray-100">
          <PhotoSection data={data} />
        </div>

        {/* Right column — Product info (7 cols) */}
        <div className="lg:col-span-7 p-5 md:p-8 flex flex-col">
          {/* Brand + SKU bar */}
          <div className="flex flex-wrap items-center gap-x-2.5 text-sm mb-3 pb-3 border-b border-gray-100">
            <span className="text-gray-400">Brand:</span>
            <span className="font-bold text-[#009E3C] hover:underline cursor-pointer">
              {data.brand || "Generic"}
            </span>
            <span className="text-gray-200">|</span>
            <span className="text-gray-400 hover:underline cursor-pointer text-xs">
              More from {data.brand || "this brand"}
            </span>
            {data.sku && (
              <>
                <span className="text-gray-200">|</span>
                <span className="text-gray-400 text-xs">SKU: {data.sku}</span>
              </>
            )}
          </div>

          {/* Product Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold text-gray-900 mb-3 leading-tight capitalize">
            {data.title}
          </h1>

          {/* Rating row */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <Rating
              initialValue={data.rating}
              allowFraction
              SVGclassName="inline-block"
              emptyClassName="fill-gray-200"
              fillClassName="fill-amber-400"
              size={20}
              readonly
            />
            <span className="text-[#009E3C] text-sm font-semibold hover:underline cursor-pointer">
              {data.reviews || 0} Ratings
            </span>
            <button
              onClick={handleShareProduct}
              className="flex items-center gap-1 ml-auto text-gray-400 hover:text-[#009E3C] transition-colors group"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 9.316a3 3 0 100-2.684 3 3 0 000 2.684z" />
              </svg>
              <span className="text-xs font-medium">Share</span>
            </button>
          </div>

          {/* Price Block — iHerb-style prominent pricing */}
          <div className="bg-gradient-to-br from-[#f0fbf4] to-[#f8fffe] rounded-xl p-4 mb-4 border border-[#009E3C]/12">
            {isUsingWholesalePrice && (
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded">WHOLESALE</span>
                <span className="text-xs text-blue-600 font-bold">Approved Business Rate</span>
              </div>
            )}
            <div className="flex items-baseline gap-3 flex-wrap">
              {isUsingWholesalePrice ? (
                <>
                  <span className="font-extrabold text-blue-600 text-3xl lg:text-4xl">
                    UGX {data.wholesale_price?.toLocaleString()}
                  </span>
                  <span className="text-gray-400 line-through text-lg">
                    UGX {data.price.toLocaleString()}
                  </span>
                </>
              ) : (data.discount?.percentage ?? 0) > 0 ? (
                <>
                  <span className="font-extrabold text-[#E53935] text-3xl lg:text-4xl">
                    UGX {Math.round(data.price - (data.price * (data.discount?.percentage ?? 0)) / 100).toLocaleString()}
                  </span>
                  <span className="text-gray-400 line-through text-lg">
                    UGX {data.price.toLocaleString()}
                  </span>
                  <span className="bg-[#E53935] text-white font-bold text-xs px-2.5 py-1 rounded">
                    Save {data.discount?.percentage}%
                  </span>
                </>
              ) : (data.discount?.amount ?? 0) > 0 ? (
                <>
                  <span className="font-extrabold text-[#E53935] text-3xl lg:text-4xl">
                    UGX {(data.price - (data.discount?.amount ?? 0)).toLocaleString()}
                  </span>
                  <span className="text-gray-400 line-through text-lg">
                    UGX {data.price.toLocaleString()}
                  </span>
                  <span className="bg-[#E53935] text-white font-bold text-xs px-2.5 py-1 rounded">
                    -UGX {data.discount?.amount.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="font-extrabold text-gray-900 text-3xl lg:text-4xl">
                  UGX {data.price.toLocaleString()}
                </span>
              )}
              {data.unit && <span className="text-sm text-gray-400 font-normal">/ {data.unit}</span>}
            </div>
            {isUsingWholesalePrice && (
              <p className="text-[10px] text-gray-500 mt-1 italic">* Business pricing applied based on your account status.</p>
            )}
          </div>

          {/* Low Stock Warning */}
          {(data.stock !== undefined && data.stock > 0 && data.stock <= 10) && (
            <div className="flex items-center gap-2 mb-4 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-red-600 font-bold text-sm">
                Low Stock — Only {data.stock} units remaining
              </span>
            </div>
          )}

          {/* Short Description */}
          {data.shortDescription && (
            <div className="mb-5">
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
                {data.shortDescription}
              </p>
              {data.description && (
                <button 
                  onClick={() => document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-xs font-bold text-[#009E3C] mt-2 hover:underline cursor-pointer"
                >
                  View Full Details
                </button>
              )}
            </div>
          )}

          {/* Size/Variant selection */}
          <SizeSelection data={data} />

          {/* Add to cart section */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <AddToCardSection data={data} />
          </div>

          {/* Trust indicators */}
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                label: "100% Authentic",
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />,
                label: "Fast Delivery",
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
                label: "Easy Returns",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-[#f0fbf4] border border-[#009E3C]/10 text-center">
                <svg className="w-5 h-5 text-[#009E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {item.icon}
                </svg>
                <span className="text-[11px] sm:text-xs font-bold text-[#007a2e] leading-tight">{item.label}</span>
              </div>
            ))}
          </div>

          <ChatHelp />
        </div>
      </div>
    </div>
  );
};

export default Header;