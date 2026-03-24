"use client";

import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { Product } from "@/types/product.types";
import React from "react";

import { toast } from "sonner";

const AddToCartBtn = ({ data }: { data: Product & { quantity: number } }) => {
  const dispatch = useAppDispatch();
  const { sizeSelection, colorSelection, selectedVariationId } = useAppSelector(
    (state: RootState) => state.products
  );
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const isWholesaleUser = isAuthenticated && user?.is_wholesale_approved;

  const hasDiscount = (data.discount?.percentage ?? 0) > 0 || (data.discount?.amount ?? 0) > 0;

  const discountedPrice = (data.discount?.percentage ?? 0) > 0
    ? Math.round(data.price - (data.price * (data.discount?.percentage ?? 0)) / 100)
    : data.price - (data.discount?.amount ?? 0);

  const displayPrice = (isWholesaleUser && data.wholesale_price)
    ? data.wholesale_price
    : (hasDiscount ? discountedPrice : data.price);

  return (
    <button
      type="button"
      className="bg-[#009E3C] hover:bg-[#00752C] w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white transition-all duration-300 shadow-[0_4px_14px_rgba(0,158,60,0.28)] hover:shadow-[0_6px_20px_rgba(0,158,60,0.38)] transform hover:scale-[1.02]"
      onClick={async () => {
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
      Add to Cart
    </button>
  );
};

export default AddToCartBtn;