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
    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
      {/* Product Image */}
      <Link
        href={`/shop/product/${data.id}/${(data.name ?? "product").split(" ").join("-")}`}
        className="bg-green-100 rounded-lg w-20 h-20 sm:w-[100px] sm:h-[100px] overflow-hidden flex items-center justify-center flex-shrink-0"
      >
        <Image
          src={data.srcUrl}
          width={100}
          height={100}
          className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
          alt={data.name ?? "Product"}
          priority
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        {/* Name + Delete */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link
            href={`/shop/product/${data.id}/${(data.name ?? "product").split(" ").join("-")}`}
            className="text-green-900 font-bold text-sm sm:text-base xl:text-xl hover:text-green-700 transition-colors line-clamp-2"
          >
            {data.name ?? "Unnamed Product"}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-red-50 transition-colors flex-shrink-0"
            onClick={() =>
              dispatch(removeFromCart(data.id))
            }
          >
            <PiTrashFill className="text-lg sm:text-xl text-red-500 hover:text-red-600" />
          </Button>
        </div>

        {/* Variation */}
        {(data.attributes?.[0] || data.variation_name) && (
          <div className="mb-2">
            <span className="text-green-700 text-xs mr-1">Variation:</span>
            <span className="text-green-600 text-xs">
              {data.variation_name || data.attributes?.[0] || "Standard"}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          <span className="font-bold text-green-800 text-sm sm:text-lg">
            UGX {displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="font-medium text-green-400 line-through text-xs sm:text-sm">
              UGX {data.price.toLocaleString()}
            </span>
          )}
          {discount.percentage > 0 && (
            <span className="font-medium text-[10px] sm:text-xs py-0.5 px-2 rounded-full bg-green-200 text-green-800">
              -{discount.percentage}%
            </span>
          )}
        </div>

        {/* Quantity Counter */}
        <div className="flex justify-end">
          <CartCounter
            initialValue={data.quantity}
            onAdd={() => dispatch(updateCartItemAsync({ itemId: data.id, quantity: data.quantity + 1 }))}
            onRemove={() =>
              data.quantity === 1
                ? dispatch(removeFromCart(data.id))
                : dispatch(updateCartItemAsync({ itemId: data.id, quantity: data.quantity - 1 }))
            }
            isZeroDelete
            className="px-3 py-1.5 sm:px-4 sm:py-2 max-h-9 sm:max-h-10 bg-white border border-green-200 rounded-full min-w-[100px] max-w-[120px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;