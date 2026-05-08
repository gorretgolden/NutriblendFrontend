"use client";

import React from "react";
import { PiTrashFill } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";
import CartCounter from "@/components/ui/CartCounter";
import { Button } from "../ui/button";
import {
  CartItem,
  removeFromCart,
  updateCartItemAsync,
} from "@/lib/features/carts/cartsSlice";
import { useAppDispatch } from "@/lib/hooks/redux";

type ProductCardProps = {
  data: CartItem;
};

const ProductCard = ({ data }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const { discount = { amount: 0, percentage: 0 } } = data;

  const getDisplayPrice = () => {
    if (discount.percentage > 0) {
      return Math.round(data.price - (data.price * discount.percentage) / 100);
    }
    if (discount.amount > 0) {
      return data.price - discount.amount;
    }
    return data.price;
  };

  const displayPrice = getDisplayPrice();
  const hasDiscount = discount.percentage > 0 || discount.amount > 0;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md group mb-4">
      <div className="flex gap-4 sm:gap-6 items-start">
        {/* Product Image */}
        <Link
          href={`/shop/product/${data.product_id}/${(data.name ?? "product").split(" ").join("-")}`}
          className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-50"
        >
          <Image
            src={data.srcUrl}
            fill
            sizes="(max-width: 640px) 128px, 192px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            alt={data.name ?? "Product"}
            priority
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <Link
                href={`/shop/product/${data.product_id}/${(data.name ?? "product").split(" ").join("-")}`}
                className="text-gray-900 font-bold text-sm sm:text-base hover:text-[#009E3C] transition-colors line-clamp-2 leading-tight"
              >
                {data.name ?? "Unnamed Product"}
              </Link>

              {/* Stock Warning */}
              {data.stock_quantity !== undefined && data.stock_quantity > 0 && data.stock_quantity <= 10 && (
                <p className="mt-1.5 flex items-center gap-1.5 text-[#E53935] text-[11px] font-bold">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Only {data.stock_quantity} units left
                </p>
              )}

              {/* Badges */}
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#009E3C]/10 text-[#009E3C] border border-[#009E3C]/20">
                  Nutriblend Express
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="flex flex-col items-end">
                <span className="font-extrabold text-gray-900 text-base sm:text-lg">
                  UGX {displayPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-gray-400 line-through text-[11px] font-medium">
                      UGX {data.price.toLocaleString()}
                    </span>
                    <span className="bg-[#009E3C]/10 text-[#009E3C] text-[10px] font-black px-1.5 py-0.5 rounded border border-[#009E3C]/20">
                      -{discount.percentage || Math.round((data.price - displayPrice) / data.price * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Actions Row */}
          <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              {/* Remove Action - Visible by Default */}
              <button
                onClick={() => dispatch(removeFromCart(data.id))}
                className="flex items-center gap-2 text-[#009E3C] hover:text-[#007a2e] transition-colors py-1 group/remove"
              >
                <PiTrashFill className="text-lg text-gray-400 group-hover/remove:text-[#009E3C] transition-colors" />
                <span className="text-xs font-bold uppercase tracking-wide">Remove</span>
              </button>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qty:</span>
              <CartCounter
                initialValue={data.quantity}
                onAdd={() => dispatch(updateCartItemAsync({ itemId: data.id, quantity: data.quantity + 1 }))}
                onRemove={() =>
                  data.quantity === 1
                    ? dispatch(removeFromCart(data.id))
                    : dispatch(updateCartItemAsync({ itemId: data.id, quantity: data.quantity - 1 }))
                }
                isZeroDelete
                className="h-9 px-2 bg-gray-50 border border-gray-200 rounded-lg min-w-[100px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;