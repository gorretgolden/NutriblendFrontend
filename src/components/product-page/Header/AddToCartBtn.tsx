"use client";

import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
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
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const isWholesaleUser = isAuthenticated && user?.is_wholesale_approved;

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
      className={`w-full rounded-full h-11 md:h-[52px] text-sm sm:text-base transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 font-bold ${
        isInCart
          ? "bg-[#009E3C] text-white shadow-[0_4px_14px_rgba(0,158,60,0.28)]"
          : "bg-[#009E3C] hover:bg-[#00752C] text-white shadow-[0_4px_14px_rgba(0,158,60,0.28)] hover:shadow-[0_6px_20px_rgba(0,158,60,0.38)]"
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
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          In Cart — View
        </>
      ) : (
        "Add to Cart"
      )}
    </button>
  );
};

export default AddToCartBtn;