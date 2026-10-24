"use client";

import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { useWholesaleView } from "@/lib/viewMode";
import { RootState } from "@/lib/store";
import { Product } from "@/types/product.types";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AddToCartBtn = ({ data }: { data: Product & { quantity: number } }) => {
  const dispatch = useAppDispatch();
  const { sizeSelection, colorSelection, selectedVariationId } = useAppSelector(
    (state: RootState) => state.products
  );
  const isWholesaleUser = useWholesaleView();

  const hasDiscount = (data.discount?.percentage ?? 0) > 0 || (data.discount?.amount ?? 0) > 0;

  const discountedPrice = (data.discount?.percentage ?? 0) > 0
    ? Math.round(data.price - (data.price * (data.discount?.percentage ?? 0)) / 100)
    : data.price - (data.discount?.amount ?? 0);

  const displayPrice = (isWholesaleUser && data.wholesale_price)
    ? data.wholesale_price
    : (hasDiscount ? discountedPrice : data.price);

  const cartItems = useAppSelector((state) => state.carts.cart?.items ?? []);
  const isInCart = cartItems.some(
    (item) => Number(item.product_id) === Number(data.id)
  );

  const router = useRouter();

  if (data.stock_quantity !== undefined && data.stock_quantity <= 0) {
    return (
      <div className="w-full rounded-full h-11 md:h-[52px] text-sm sm:text-base flex items-center justify-center font-bold bg-gray-100 text-gray-500 cursor-not-allowed">
        Out of Stock
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`group w-full rounded-2xl h-14 md:h-[60px] text-base transition-all duration-300 transform active:scale-[0.98] flex items-center justify-start px-8 gap-3 font-black uppercase tracking-widest shadow-lg ${
        isInCart
          ? "bg-[#009E3C] text-white shadow-[#009E3C]/20"
          : "bg-[#009E3C] hover:bg-[#00752C] text-white shadow-[#009E3C]/30 hover:shadow-[#009E3C]/40"
      }`}
      onClick={async () => {
        if (isInCart) {
          router.push("/cart");
          return;
        }

        try {
          await dispatch(
            addToCart({
              product_id: data.id,
              variation_id: selectedVariationId ?? undefined,
              name: data.title,
              srcUrl: data.srcUrl,
              price: displayPrice,
              quantity: data.quantity,
            })
          ).unwrap();
          toast.success(`${data.title} added to cart!`);
        } catch (error: any) {
          toast.error(error || "Failed to add to cart. Please try again.");
        }
      }}
    >
      {isInCart ? (
        <>
          <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          In Cart — View Now
        </>
      ) : (
        <>
          <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add to Cart
        </>
      )}
    </button>
  );
};

export default AddToCartBtn;