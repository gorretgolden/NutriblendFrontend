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

  return (
    <button
      type="button"
      className="bg-green-600 hover:bg-green-700 w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
      onClick={async () => {
        try {
          await dispatch(
            addToCart({
              product_id: data.id,
              variation_id: selectedVariationId ?? undefined,
              name: data.title,
              srcUrl: data.srcUrl,
              price: data.price,
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