"use client";

import React from "react";
import Rating from "../ui/Rating";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addToCart } from "@/lib/features/carts/cartsSlice";
import { Product } from "@/types/product.types";
import { useRouter } from "next/navigation"; // Import useRouter

type ProductCardProps = {
  data: Product;
};

const ProductCard = ({ data }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter(); // Initialize router
  const hasDiscount = (data.discount?.percentage ?? 0) > 0 || (data.discount?.amount ?? 0) > 0;

  const discountedPrice = (data.discount?.percentage ?? 0) > 0
    ? Math.round(data.price - (data.price * (data.discount?.percentage ?? 0)) / 100)
    : data.price - (data.discount?.amount ?? 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Add product to cart using Redux unified thunk
    dispatch(
      addToCart({
        product_id: data.id,
        name: data.title,
        srcUrl: data.srcUrl,
        price: data.price,
        quantity: 1,
      })
    );
  };

  const productSlug = data.slug;

  // Function to handle image click navigation
  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/shop/product/${data.id}/${productSlug}`);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-green-50 shadow-sm hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-500 flex flex-col relative h-full">
      <div className="bg-white rounded-t-2xl w-full h-[220px] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Make the entire image area clickable */}
        <div
          className="w-full h-full flex items-center justify-center cursor-pointer"
          onClick={handleImageClick}
        >
          <Image
            src={data.srcUrl}
            width={200}
            height={200}
            className="object-contain group-hover:scale-110 transition-transform duration-500"
            alt={data.title}
            priority
          />
        </div>

        {hasDiscount && (
          <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-lg">
            {data.discount.percentage > 0
              ? `-${data.discount.percentage}%`
              : `-$${data.discount.amount}`}
          </span>
        )}

        {/* Add to Cart Button - Overlay style */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            className="bg-green-600 hover:bg-green-700 text-white py-2.5 px-6 rounded-full flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl active:scale-95 font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow bg-white">
        {/* Brand Name */}
        {data.brand && (
          <p className="text-green-600 text-[11px] font-bold uppercase tracking-wider mb-1.5 opacity-80">
            {data.brand}
          </p>
        )}

        {/* Product Name (short version) */}
        <Link
          href={`/shop/product/${data.id}/${productSlug}`}
          className="text-gray-900 text-base font-bold mb-1.5 line-clamp-1 hover:text-green-600 transition-colors"
        >
          {data.title.split(',')[0]}
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <Rating
            initialValue={data.rating}
            allowFraction
            SVGclassName="inline-block"
            emptyClassName="fill-gray-200"
            fillClassName="fill-yellow-400"
            size={14}
            readonly
          />
          <span className="text-gray-400 text-[10px] ml-2 font-medium">
            ({data.reviews?.toLocaleString() || '0'})
          </span>
        </div>

        <div className="flex items-center gap-3 mt-auto">
          <span className="font-extrabold text-green-900 text-xl">
            {hasDiscount ? discountedPrice.toLocaleString() : data.price.toLocaleString()}
            <span className="text-[10px] font-bold ml-1 text-green-700/60 uppercase">UGX</span>
          </span>
          {hasDiscount && (
            <span className="text-gray-400 text-sm line-through decoration-red-400/50">
              {data.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;