"use client";

import React from "react";
import { PiTrashFill } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";
import CartCounter from "@/components/ui/CartCounter";
import { Button } from "../ui/button";
import {
  addToCart,
  CartItem,
  remove,
  removeCartItem,
  updateCartItemAsync,
} from "@/lib/features/carts/cartsSlice";
import { useAppDispatch } from "@/lib/hooks/redux";

type ProductCardProps = {
  data: CartItem;
};

const ProductCard = ({ data }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const { discount = { amount: 0, percentage: 0 } } = data;

  return (
    <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
      <Link
        href={`/shop/product/${data.id}/${(data.name ?? "product").split(" ").join("-")}`}
        className="bg-green-100 rounded-lg w-full min-w-[100px] max-w-[100px] sm:max-w-[124px] aspect-square overflow-hidden flex items-center justify-center"
      >
        <Image
          src={data.srcUrl}
          width={124}
          height={124}
          className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
          alt={data.name ?? "Product"}
          priority
        />
      </Link>

      {/* Product Details */}
      <div className="flex w-full flex-col">
        <div className="flex items-center justify-between mb-2">
          <Link
            href={`/shop/product/${data.id}/${(data.name ?? "product").split(" ").join("-")}`}
            className="text-green-900 font-bold text-base xl:text-xl hover:text-green-700 transition-colors"
          >
            {data.name ?? "Unnamed Product"}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-red-50 transition-colors"
            onClick={() =>
              dispatch(
                remove(data.id)
              )
            }
          >
            <PiTrashFill className="text-xl text-red-500 hover:text-red-600" />
          </Button>
        </div>

        <div className="mb-1">
          <span className="text-green-700 text-xs md:text-sm mr-1">Size:</span>
          <span className="text-green-600 text-xs md:text-sm">
            {data.attributes?.[0] ?? "N/A"}
          </span>
        </div>
        <div className="mb-3">
          <span className="text-green-700 text-xs md:text-sm mr-1">Color:</span>
          <span className="text-green-600 text-xs md:text-sm">
            {data.attributes?.[1] ?? "N/A"}
          </span>
        </div>

        <div className="flex items-center flex-wrap justify-between">
          <div className="flex items-center space-x-2">
            {discount.percentage > 0 ? (
              <span className="font-bold text-green-800 text-lg xl:text-xl">
                {`UGX ${Math.round(
                  data.price - (data.price * discount.percentage) / 100
                ).toLocaleString()}`}
              </span>
            ) : discount.amount > 0 ? (
              <span className="font-bold text-green-800 text-lg xl:text-xl">
                {`UGX ${(data.price - discount.amount).toLocaleString()}`}
              </span>
            ) : (
              <span className="font-bold text-green-800 text-lg xl:text-xl">
                UGX {data.price.toLocaleString()}
              </span>
            )}

            {(discount.percentage > 0 || discount.amount > 0) && (
              <span className="font-bold text-green-400 line-through text-base xl:text-lg">
                UGX {data.price.toLocaleString()}
              </span>
            )}

            {discount.percentage > 0 ? (
              <span className="font-medium text-xs xl:text-sm py-1 px-3 rounded-full bg-green-200 text-green-800">
                {`-${discount.percentage}%`}
              </span>
            ) : (
              discount.amount > 0 && (
                <span className="font-medium text-xs xl:text-sm py-1 px-3 rounded-full bg-green-200 text-green-800">
                  {`-UGX ${discount.amount.toLocaleString()}`}
                </span>
              )
            )}
          </div>

          <CartCounter
            initialValue={data.quantity}
            onAdd={() => dispatch(addToCart({ ...data, quantity: 1 }))}
            onRemove={() =>
              data.quantity === 1
                ? dispatch(remove(data.id))
                : dispatch(updateCartItemAsync({ itemId: data.id, quantity: data.quantity - 1 }))
            }
            isZeroDelete
            className="px-4 py-2 max-h-10 bg-white border border-green-200 rounded-full min-w-[110px] max-w-[130px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;