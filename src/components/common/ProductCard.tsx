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
  const hasDiscount = data.discount.percentage > 0 || data.discount.amount > 0;
  const discountedPrice = data.discount.percentage > 0 
    ? Math.round(data.price - (data.price * data.discount.percentage) / 100)
    : data.price - data.discount.amount;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add product to cart using Redux
    dispatch(
      addToCart({
        id: data.id,
        name: data.title,
        srcUrl: data.srcUrl,
        price: data.price,
        attributes: [],
        discount: data.discount ?? { amount: 0, percentage: 0 },
        quantity: 1,
      })
    );
  };

  // Function to handle image click navigation
  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Navigate to product detail page
    router.push(`/shop/product/${data.id}/${data.title.split(" ").join("-")}`);
  };

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-md shadow-green-700 hover:shadow-green-900 transition-all duration-300 flex flex-col relative max-h-[420px]">
  <div className="bg-white-50 rounded-t-lg w-full h-[180px] flex items-center justify-center p-2 relative overflow-hidden">
    {/* Make the entire image area clickable */}
    <div 
      className="w-full h-full flex items-center justify-center cursor-pointer"
      onClick={handleImageClick}
    >
      <Image
        src={data.srcUrl}
        width={200}
        height={200}
        className="object-contain group-hover:scale-105 transition-all duration-300"
        alt={data.title}
        priority
      />
    </div>

    {hasDiscount && (
      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
        {data.discount.percentage > 0 
          ? `-${data.discount.percentage}%` 
          : `-$${data.discount.amount}`}
      </span>
    )}

    {/* Add to Cart Button - Slides up from bottom of image */}
    <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
      <button 
        onClick={handleAddToCart}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Add to Cart
      </button>
    </div>
  </div>

  {/* Divider line */}
  <div className="border-t border-gray-200"></div>

  <div className="p-4 flex flex-col flex-grow">
    {/* Brand Name */}
    {data.brand && (
      <p className="text-green-700 text-sm font-semibold mb-1">
        {data.brand}
      </p>
    )}

    {/* Product Name (short version) */}
    <Link 
      href={`/shop/product/${data.id}/${data.title.split(" ").join("-")}`}
      className="text-black text-base font-semibold mb-2 line-clamp-1 hover:text-green-700 transition-colors"
    >
      {data.title.split(',')[0]}
    </Link>

    {/* Full Product Name (full version) */}
    <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
      {data.title}
    </p>

    <div className="flex items-center mb-2">
      <Rating
        initialValue={data.rating}
        allowFraction
        SVGclassName="inline-block"
        emptyClassName="fill-gray-200"
        fillClassName="fill-yellow-400"
        size={16}
        readonly
      />
      <span className="text-gray-500 text-xs ml-2">
        {data.reviews ? data.reviews.toLocaleString() : '0'}
      </span>
    </div>

    <div className="flex items-center gap-2 mt-auto">
      <span className="font-bold text-green-800 text-lg">
        UGX {hasDiscount ? discountedPrice.toLocaleString() : data.price.toLocaleString()}
      </span>
      {hasDiscount && (
        <span className="text-gray-500 text-sm line-through">
          UGX {data.price.toLocaleString()}
        </span>
      )}
    </div>
  </div>
</div>

  );
};

export default ProductCard;