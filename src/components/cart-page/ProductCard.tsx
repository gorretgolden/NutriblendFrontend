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
    <div className="flex gap-4 sm:gap-6 items-start group">
      {/* Product Image — white card border like iHerb */}
      <Link
        href={`/shop/product/${data.id}/${(data.name ?? "product").split(" ").join("-")}`}
        className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-white border border-gray-100 rounded-lg overflow-hidden"
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
          <div>
            <Link
              href={`/shop/product/${data.id}/${(data.name ?? "product").split(" ").join("-")}`}
              className="text-gray-900 font-bold text-sm sm:text-base hover:text-[#009E3C] transition-colors line-clamp-2 leading-tight"
            >
              {data.name ?? "Unnamed Product"}
            </Link>

            {(data.attributes?.[0] || data.variation_name) && (
              <p className="mt-1 text-[11px] text-gray-400 font-medium">
                Variant: <span className="text-gray-600 uppercase tracking-wider">{data.variation_name || data.attributes?.[0] || "Standard"}</span>
              </p>
            )}

            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-extrabold text-gray-900 text-lg">
                UGX {displayPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-gray-400 line-through text-xs font-medium">
                  UGX {data.price.toLocaleString()}
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="text-[#E53935] text-[10px] font-bold">SAVING UGX {(data.price - displayPrice).toLocaleString()}</span>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-full"
            onClick={() => dispatch(removeFromCart(data.id))}
          >
            <PiTrashFill className="text-xl" />
          </Button>
        </div>

        {/* Quantity Controls */}
        <div className="mt-4 flex items-center gap-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantity</span>
          <CartCounter
            initialValue={data.quantity}
            onAdd={() => dispatch(updateCartItemAsync({ itemId: data.id, quantity: data.quantity + 1 }))}
            onRemove={() =>
              data.quantity === 1
                ? dispatch(removeFromCart(data.id))
                : dispatch(updateCartItemAsync({ itemId: data.id, quantity: data.quantity - 1 }))
            }
            isZeroDelete
            className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg min-w-[110px] scale-90 sm:scale-100 origin-left"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;