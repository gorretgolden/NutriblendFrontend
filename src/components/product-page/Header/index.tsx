"use client";

import React from "react";
import PhotoSection from "./PhotoSection";
import { Product } from "@/types/product.types";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Rating from "@/components/ui/Rating";
import SizeSelection from "./SizeSelection";
import AddToCardSection from "./AddToCardSection";
import ChatHelp from "./ChatHelp";
import { sanitizeRichHtml } from "@/lib/utils/security";
import { useAppSelector } from "@/lib/hooks/redux";

const Header = ({ data }: { data: Product }) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const isWholesaleUser = isAuthenticated && user?.is_wholesale_approved;
  const isUsingWholesalePrice = isWholesaleUser && !!data.wholesale_price;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <PhotoSection data={data} />
        </div>
        <div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-x-2 text-xs mb-2">
              <span className="text-gray-500">Brand:</span>
              <span className="font-semibold text-green-700 hover:underline cursor-pointer">
                {data.brand || "Generic"}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 hover:underline cursor-pointer">
                Similar products from {data.brand || "Generic"}
              </span>
              {data.sku && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">SKU: {data.sku}</span>
                </>
              )}
              <div className="flex items-center ml-auto gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-100 shadow-sm animate-pulse-slow">
                <span className="text-[10px] uppercase font-bold text-green-700 tracking-wider">A Product of</span>
                <span className="text-[10px] font-black text-green-800">Rasmus Pharmaceuticals</span>
              </div>
            </div>
            <h1
              className={cn([
                "text-xl md:text-2xl lg:text-3xl mb-3 capitalize text-dark-800 font-bold",
              ])}
            >
              {data.title}
            </h1>

            <div className="flex flex-col mb-4">
              {isUsingWholesalePrice && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm">WHOLESALE PRICE</span>
                  <span className="text-xs text-blue-600 font-bold uppercase tracking-wide">Approved Business Member Rate</span>
                </div>
              )}
              <div className="flex items-center space-x-3">
                {isUsingWholesalePrice ? (
                  <>
                    <span className="font-bold text-blue-600 text-2xl lg:text-3xl">
                      {`UGX ${data.wholesale_price?.toLocaleString()}`}
                    </span>
                    <span className="text-gray-400 line-through text-lg">
                      UGX {data.price.toLocaleString()}
                    </span>
                  </>
                ) : (data.discount?.percentage ?? 0) > 0 ? (
                  <>
                    <span className="font-bold text-dark-800 text-2xl lg:text-3xl">
                      {`UGX ${Math.round(
                        data.price - (data.price * (data.discount?.percentage ?? 0)) / 100
                      ).toLocaleString()}`}
                    </span>
                    <span className="text-gray-400 line-through text-lg">
                      UGX {data.price.toLocaleString()}
                    </span>
                    <span className="bg-orange-100 text-orange-600 font-bold text-xs px-2 py-1 rounded">
                      {`-${data.discount?.percentage}%`}
                    </span>
                  </>
                ) : (data.discount?.amount ?? 0) > 0 ? (
                  <>
                    <span className="font-bold text-dark-800 text-2xl lg:text-3xl">
                      {`UGX ${(data.price - (data.discount?.amount ?? 0)).toLocaleString()}`}
                    </span>
                    <span className="text-gray-400 line-through text-lg">
                      UGX {data.price.toLocaleString()}
                    </span>
                    <span className="bg-orange-100 text-orange-600 font-bold text-xs px-2 py-1 rounded">
                      {`-UGX ${data.discount?.amount.toLocaleString()}`}
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-dark-800 text-2xl lg:text-3xl">
                    UGX {data.price.toLocaleString()}
                  </span>
                )}
              </div>
              {isUsingWholesalePrice && (
                <p className="text-[10px] text-gray-500 mt-1 italic">* Business pricing applied based on your account status.</p>
              )}
            </div>

            {(data.stock !== undefined && data.stock > 0 && data.stock <= 10) && (
              <div className="flex items-center space-x-2 mb-4 animate-pulse">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-600 font-bold text-sm">
                  {data.stock} units left
                </span>
              </div>
            )}

            <div className="flex items-center mb-6">
              <Rating
                initialValue={data.rating}
                allowFraction
                SVGclassName="inline-block"
                emptyClassName="fill-gray-200"
                fillClassName="fill-yellow-400"
                size={18}
                readonly
              />
              <span className="text-blue-600 text-sm ml-2 hover:underline cursor-pointer">
                ({data.reviews || 0} verified ratings)
              </span>
              <button className="flex items-center gap-1 ml-auto text-dark-500 hover:text-green-700 transition-colors group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 9.316a3 3 0 100-2.684 3 3 0 000 2.684z" />
                </svg>
                <span className="text-xs font-semibold">Share</span>
              </button>
            </div>
            {data.shortDescription ? (
              <p className="text-sm sm:text-base text-dark-700/80 mb-5">
                {data.shortDescription}
              </p>
            ) : data.description ? (
              <div
                className="text-sm sm:text-base text-dark-700/80 mb-5 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(data.description) }}
              />
            ) : null}
            <hr className="h-[1px] border-t-green-200 my-5" />
            <SizeSelection data={data} />
            <hr className="hidden md:block h-[1px] border-t-green-200 my-5" />
            <AddToCardSection data={data} />
            <ChatHelp />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;