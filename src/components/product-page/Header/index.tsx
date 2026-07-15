"use client";

import React from "react";
import PhotoSection from "./PhotoSection";
import { Product } from "@/types/product.types";
import { cn } from "@/lib/utils";
import Rating from "@/components/ui/Rating";
import SizeSelection from "./SizeSelection";
import AddToCardSection from "./AddToCardSection";
import { sanitizeRichHtml } from "@/lib/utils/security";
import { useAppSelector } from "@/lib/hooks/redux";
import { toast } from "sonner";

const Header = ({ data }: { data: Product }) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const isWholesaleUser = isAuthenticated && (user?.role === 'Wholesale Customer' || user?.is_wholesale_approved);
  const isUsingWholesalePrice = isWholesaleUser && !!data.wholesale_price;
  const hasDiscount = (data.discount?.percentage ?? 0) > 0 || (data.discount?.amount ?? 0) > 0;
  
  const currentStock = isUsingWholesalePrice 
    ? (data.wholesale_stock_quantity ?? 0) 
    : (data.stock_quantity ?? data.stock ?? 0);

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
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left column — Photo gallery (5 cols) */}
        <div className="lg:col-span-6 bg-white p-4 md:p-10 lg:p-12 border-r border-gray-50 flex flex-col items-center">
          <PhotoSection data={data} />
        </div>

        {/* Right column — Product info (6 cols) */}
        <div className="lg:col-span-6 p-6 md:p-10 lg:p-12 flex flex-col">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#f0fdf4] text-[#009E3C] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border border-[#009E3C]/10">
                {data.brand || data.category || "Authentic"}
              </span>
              {isAuthenticated && (
                <span className={cn(
                  "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border",
                  isWholesaleUser 
                    ? "bg-purple-50 text-purple-600 border-purple-100" 
                    : "bg-blue-50 text-blue-600 border-blue-100"
                )}>
                  {isWholesaleUser ? "Wholesale" : "Retail"}
                </span>
              )}
              {data.sku && (
                <span className="text-[10px] text-gray-400 font-medium tracking-wider">SKU: {data.sku}</span>
              )}
            </div>
            <button
              onClick={handleShareProduct}
              className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-[#009E3C] hover:bg-[#f0fdf4] transition-all group"
              title="Share Product"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 9.316a3 3 0 100-2.684 3 3 0 000 2.684z" />
              </svg>
            </button>
          </div>

          {/* Title & Rating */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 leading-tight tracking-tight capitalize">
            {data.title}
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
              <Rating
                initialValue={data.rating}
                allowFraction
                SVGclassName="inline-block"
                emptyClassName="fill-amber-200"
                fillClassName="fill-amber-500"
                size={18}
                readonly
              />
              <span className="text-amber-700 text-sm font-bold">{data.rating || 0}</span>
            </div>
            <span className="text-gray-400 text-sm font-medium">|</span>
            <span className="text-[#009E3C] text-sm font-bold hover:underline cursor-pointer">
              {data.reviews || 0} Verifed Reviews
            </span>
          </div>

          {/* Main Content Area — Reorganized for Importance */}
          <div className="flex flex-col gap-8">
            {/* Price & Primary Action Section — Left Aligned Stack */}
            <div className="flex flex-col gap-8 items-start">
              {/* Price */}
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">
                  {isUsingWholesalePrice ? "WHOLESALE BULK PRICE (Per Box)" : "Price"}
                </span>
                {isUsingWholesalePrice && (
                  <span className="text-sm text-[#009E3C] font-bold mb-2">
                    *(This box contains {data.wholesale_min_qty || 'multiple'} items)*
                  </span>
                )}
                <div className="flex items-baseline gap-2">
                  {isUsingWholesalePrice ? (
                    <span className="font-black text-blue-600 text-2xl lg:text-3xl">
                      UGX {data.wholesale_price?.toLocaleString()}
                    </span>
                  ) : (data.discount?.percentage ?? 0) > 0 ? (
                    <span className="font-black text-[#E53935] text-2xl lg:text-3xl">
                      UGX {Math.round((data.price || 0) - ((data.price || 0) * (data.discount?.percentage ?? 0)) / 100).toLocaleString()}
                    </span>
                  ) : (
                    <span className="font-black text-gray-900 text-2xl lg:text-3xl">
                      UGX {(data.price || 0).toLocaleString()}
                    </span>
                  )}
                  {(isUsingWholesalePrice ? data.wholesale_unit_name : data.unit_name) ? (
                    <span className="text-sm text-gray-400 font-bold">/ {isUsingWholesalePrice ? data.wholesale_unit_name : data.unit_name}</span>
                  ) : data.unit ? (
                    <span className="text-sm text-gray-400 font-bold">/ {data.unit}</span>
                  ) : null}
                </div>
                <div className="text-sm text-gray-500 font-medium mt-2 flex flex-col gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span>Product Weight:</span>
                    <span className="font-bold text-gray-800">{data.weight ? `${data.weight} ${data.weight_unit || 'kg'}` : 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Selling Unit ({isWholesaleUser ? 'Wholesale' : 'Retail'}):</span>
                    <span className="font-bold text-[#009E3C]">{isWholesaleUser ? (data.wholesale_unit_name || 'Not specified') : (data.unit_name || data.unit || 'Not specified')}</span>
                  </div>
                </div>
                {(hasDiscount || isUsingWholesalePrice) && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-300 line-through text-sm font-medium">UGX {(data.price || 0).toLocaleString()}</span>
                    <span className="text-[#E53935] text-xs font-bold bg-red-50 px-1.5 py-0.5 rounded">
                      {isUsingWholesalePrice ? 'Wholesale Rate' : `Save ${data.discount?.percentage}%`}
                    </span>
                  </div>
                )}
              </div>

              {/* Action */}
              {((data.variations && data.variations.length > 0) || currentStock !== 0) && (
                <div className="flex flex-col gap-4 w-full">
                  <SizeSelection data={data} />
                  {currentStock !== 0 && <AddToCardSection data={data} />}
                </div>
              )}
            </div>

            {/* Availability & Quick Info */}
            <div className="flex flex-wrap gap-4 py-6 border-y border-gray-50">
              {currentStock !== undefined && (
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-bold transition-colors",
                  currentStock > 10 
                    ? "bg-emerald-50 border-emerald-100 text-[#009E3C]"
                    : currentStock > 0 
                      ? "bg-amber-50 border-amber-100 text-amber-600"
                      : "bg-red-50 border-red-100 text-red-600"
                )}>
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    currentStock > 10 ? "bg-emerald-500" : currentStock > 0 ? "bg-amber-500 animate-pulse" : "bg-red-500"
                  )} />
                  {currentStock > 10 ? 'In Stock' : currentStock > 0 ? `Limited: Only ${currentStock} Left` : 'Out of Stock'}
                </div>
              )}
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-gray-100 bg-gray-50/50 text-gray-600 text-sm font-bold">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Direct Sourcing
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-gray-100 bg-gray-50/50 text-gray-600 text-sm font-bold">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Fast Dispatch
              </div>
            </div>

            {/* Highlights Section */}
            {data.shortDescription && (
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Product Highlights</h3>
                <div className="text-base text-gray-600 leading-relaxed prose prose-sm max-w-none"
                     dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(data.shortDescription) }} />
                {data.description && (
                  <button 
                    onClick={() => document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm font-bold text-[#009E3C] mt-2 flex items-center gap-1 hover:underline group"
                  >
                    Read Full Technical Details
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Premium Trust Icons */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                {
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  label: "100% Original",
                  color: "text-emerald-600",
                  bg: "bg-emerald-50"
                },
                {
                  icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
                  label: "Easy Returns",
                  color: "text-blue-600",
                  bg: "bg-blue-50"
                },
                {
                  icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
                  label: "Secure Payment",
                  color: "text-purple-600",
                  bg: "bg-purple-50"
                },
              ].map((item, i) => (
                <div key={i} className={cn("flex flex-col items-center gap-2 p-4 rounded-2xl border border-transparent transition-all hover:shadow-lg hover:bg-white hover:border-gray-50", item.bg)}>
                  <div className={cn("p-2 rounded-full bg-white shadow-sm", item.color)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-black text-gray-900 uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;