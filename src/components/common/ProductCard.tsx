"use client";

import React from "react";
import Rating from "../ui/Rating";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/lib/hooks/redux";
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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100/80 shadow-sm hover:shadow-xl hover:shadow-green-900/8 transition-all duration-500 flex flex-col relative h-full hover:-translate-y-1">
      {/* Image Container */}
      <div className="bg-gradient-to-b from-gray-50 to-white rounded-t-2xl w-full h-[230px] flex items-center justify-center p-5 relative overflow-hidden">
        {/* Wishlist Heart Button */}
        <div className="absolute top-3 left-3 z-10">
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
            className="object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
            alt={data.title}
            priority
          />
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg z-10 shadow-lg shadow-red-200/50">
            {data.discount.percentage > 0
              ? `-${data.discount.percentage}%`
              : `-${data.discount.amount.toLocaleString()}`}
          </span>
        )}

        {/* Quick Add Button - Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-4">
          <button
            onClick={handleAddToCart}
            className="bg-green-600 hover:bg-green-700 text-white py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl shadow-green-600/30 active:scale-95 font-semibold text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-grow">
        {/* Brand */}
        {data.brand && (
          <p className="text-green-600 text-[10px] font-bold uppercase tracking-widest mb-1.5 opacity-70">
            {data.brand}
          </p>
        )}

        {/* Product Name */}
        <Link
          href={`/shop/product/${data.id}/${productSlug}`}
          className="text-gray-800 text-sm md:text-base font-bold mb-2 line-clamp-2 hover:text-green-600 transition-colors duration-200 leading-snug"
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
            fillClassName="fill-amber-400"
            size={13}
            readonly
          />
          <span className="text-gray-400 text-[10px] ml-1.5 font-medium">
            ({data.reviews?.toLocaleString() || '0'})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2.5 mt-auto">
          <span className="font-extrabold text-gray-900 text-lg">
            <span className="text-[10px] font-bold text-gray-400 mr-0.5">UGX</span>
            {hasDiscount ? discountedPrice.toLocaleString() : data.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-gray-400 text-xs line-through decoration-red-400/60">
              {data.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;