"use client";

import React from "react";
import Rating from "../ui/Rating";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { addToCart } from "@/lib/features/carts/cartsSlice";
import WishlistButton from "@/components/ui/WishlistButton";
import { Product } from "@/types/product.types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ProductCardProps = {
  data: Product;
};

const ProductCard = ({ data }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const hasDiscount = (data.discount?.percentage ?? 0) > 0 || (data.discount?.amount ?? 0) > 0;

  const discountedPrice = (data.discount?.percentage ?? 0) > 0
    ? Math.round(data.price - (data.price * (data.discount?.percentage ?? 0)) / 100)
    : data.price - (data.discount?.amount ?? 0);

  // Check if product is already in cart
  const cartItems = useAppSelector((state) => state.carts.cart?.items ?? []);
  const isInCart = cartItems.some(
    (item) => item.product_id === data.id
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCart) {
      router.push("/cart");
      return;
    }

    try {
      const result = await dispatch(
        addToCart({
          product_id: data.id,
          name: data.title,
          srcUrl: data.srcUrl,
          price: data.price,
          quantity: 1,
        })
      ).unwrap();
      toast.success(`${data.title} added to cart!`);
    } catch (error: any) {
      toast.error(error || "Failed to add to cart. Please try again.");
    }
  };

  const productSlug = data.slug;

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/shop/product/${data.id}/${productSlug}`);
  };

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100/80 shadow-sm hover:shadow-xl hover:shadow-green-900/8 transition-all duration-500 flex flex-col relative h-full hover:-translate-y-1">
      {/* Image Container */}
      <div className="bg-gradient-to-b from-gray-50 to-white rounded-t-xl sm:rounded-t-2xl w-full h-[160px] sm:h-[200px] md:h-[230px] flex items-center justify-center p-3 sm:p-5 relative overflow-hidden">
        {/* Wishlist Heart Button */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
          <WishlistButton productId={data.id} productName={data.title} variant="card" />
        </div>

        <div
          className="w-full h-full flex items-center justify-center cursor-pointer"
          onClick={handleImageClick}
        >
          <Image
            src={data.srcUrl}
            width={200}
            height={200}
            className="object-contain max-h-full group-hover:scale-105 transition-transform duration-700 ease-out"
            alt={data.title}
            priority
          />
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg z-10 shadow-lg shadow-red-200/50">
            {data.discount.percentage > 0
              ? `-${data.discount.percentage}%`
              : `-${data.discount.amount.toLocaleString()}`}
          </span>
        )}

        {/* Quick Add Button - Overlay (hidden on mobile, tap to go to product) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none hidden sm:flex items-end justify-center pb-4">
          <button
            onClick={handleAddToCart}
            className={`pointer-events-auto py-2 px-5 sm:py-2.5 sm:px-6 rounded-xl flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl active:scale-95 font-semibold text-xs sm:text-sm ${
              isInCart
                ? "bg-white text-green-700 border-2 border-green-500 shadow-green-200/30"
                : "bg-green-600 hover:bg-green-700 text-white shadow-green-600/30"
            }`}
          >
            {isInCart ? (
              <>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                In Cart
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-grow">
        {/* Brand */}
        {data.brand && (
          <p className="text-green-600 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1 sm:mb-1.5 opacity-70">
            {data.brand}
          </p>
        )}

        {/* Product Name */}
        <Link
          href={`/shop/product/${data.id}/${productSlug}`}
          className="text-gray-800 text-xs sm:text-sm md:text-base font-bold mb-1.5 sm:mb-2 line-clamp-2 hover:text-green-600 transition-colors duration-200 leading-snug"
        >
          {data.title.split(',')[0]}
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-2 sm:mb-3">
          <Rating
            initialValue={data.rating}
            allowFraction
            SVGclassName="inline-block"
            emptyClassName="fill-gray-200"
            fillClassName="fill-amber-400"
            size={11}
            readonly
          />
          <span className="text-gray-400 text-[9px] sm:text-[10px] ml-1 sm:ml-1.5 font-medium">
            ({data.reviews?.toLocaleString() || '0'})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 mt-auto flex-wrap">
          <span className="font-extrabold text-gray-900 text-sm sm:text-base md:text-lg">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 mr-0.5">UGX</span>
            {hasDiscount ? discountedPrice.toLocaleString() : data.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-gray-400 text-[10px] sm:text-xs line-through decoration-red-400/60">
              {data.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Mobile Add to Cart / In Cart button */}
        <button
          onClick={handleAddToCart}
          className={`sm:hidden mt-2 w-full py-2 rounded-lg text-xs font-semibold active:scale-95 transition-all flex items-center justify-center gap-1.5 ${
            isInCart
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {isInCart ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              In Cart — View
            </>
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;