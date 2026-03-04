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

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const isWholesaleUser = isAuthenticated && user?.is_wholesale_approved;

  const discountedPrice = (data.discount?.percentage ?? 0) > 0
    ? Math.round(data.price - (data.price * (data.discount?.percentage ?? 0)) / 100)
    : data.price - (data.discount?.amount ?? 0);

  const displayPrice = (isWholesaleUser && data.wholesale_price)
    ? data.wholesale_price
    : (hasDiscount ? discountedPrice : data.price);

  const isUsingWholesalePrice = isWholesaleUser && !!data.wholesale_price;

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
          price: displayPrice,
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
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100/50 shadow-premium hover-lift transition-all duration-500 flex flex-col relative h-full">
      {/* Image Container */}
      <div className="bg-gradient-to-b from-green-50/30 to-white w-full h-[180px] sm:h-[220px] md:h-[250px] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Wishlist Heart Button - Floating Glass */}
        <div className="absolute top-3 left-3 z-10 scale-90 sm:scale-100">
          <WishlistButton productId={data.id} productName={data.title} variant="card" />
        </div>

        <div
          className="w-full h-full flex items-center justify-center cursor-pointer relative z-0"
          onClick={handleImageClick}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-green-100/20 to-transparent rounded-full blur-3xl scale-75 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <Image
            src={data.srcUrl}
            width={220}
            height={220}
            className="object-contain max-h-full group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.33,1,0.68,1)]"
            alt={data.title}
            priority
          />
        </div>

        {/* Low Stock Badge - Pulse Glow */}
        {data.stock !== undefined && data.stock > 0 && data.stock <= 10 && (
          <span className="absolute top-3 left-12 bg-white/90 backdrop-blur-sm text-red-600 text-[9px] font-black px-2.5 py-1 rounded-full border border-red-100 z-10 shadow-sm animate-pulse-slow flex items-center">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-1.5 animate-pulse"></span>
            ONLY {data.stock} LEFT
          </span>
        )}

        {/* Discount Badge - Glassmorphism */}
        {hasDiscount && !isUsingWholesalePrice && (
          <span className="absolute top-3 right-3 glass bg-red-500/90 text-white text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full z-10 shadow-lg border-none">
            {data.discount.percentage > 0
              ? `Save ${data.discount.percentage}%`
              : `-${data.discount.amount.toLocaleString()}`}
          </span>
        )}

        {/* Wholesale Badge - Sleek Indigo Glass */}
        {isUsingWholesalePrice && (
          <span className="absolute top-3 right-3 glass bg-indigo-600/90 text-white text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full z-10 shadow-lg border-none">
            WHOLESALE
          </span>
        )}

        {/* Quick Add Button - Floating Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none hidden sm:flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            className={`pointer-events-auto py-3 px-8 rounded-full flex items-center justify-center gap-2 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-2xl active:scale-95 font-bold text-sm ${isInCart
              ? "bg-white text-green-700 border border-green-200 shadow-white/50"
              : "bg-green-700 hover:bg-green-800 text-white shadow-green-900/40"
              }`}
          >
            {isInCart ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                In Cart
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex flex-col flex-grow bg-white relative z-10">
        {/* Brand */}
        {data.brand && (
          <p className="text-green-600/60 text-[10px] font-extrabold uppercase tracking-[0.2em] mb-2">
            {data.brand}
          </p>
        )}

        {/* Product Name */}
        <Link
          href={`/shop/product/${data.id}/${productSlug}`}
          className="text-gray-900 text-sm sm:text-base font-bold mb-2.5 line-clamp-2 hover:text-green-700 transition-colors duration-300 leading-tight"
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
        <div className="flex flex-col mt-auto">
          {isUsingWholesalePrice && (
            <p className="text-[9px] text-blue-600 font-bold uppercase tracking-tighter mb-0.5">Wholesale Member Price</p>
          )}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
            <span className={`font-extrabold text-sm sm:text-base md:text-lg ${isUsingWholesalePrice ? 'text-blue-600' : 'text-gray-900'}`}>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 mr-0.5">UGX</span>
              {displayPrice.toLocaleString()}
              {data.unit && <span className="text-[10px] text-gray-500 font-normal ml-1">/ {data.unit}</span>}
            </span>
            {(hasDiscount || isUsingWholesalePrice) && (
              <span className="text-gray-400 text-[10px] sm:text-xs line-through decoration-red-400/60">
                {data.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Mobile Add to Cart / In Cart button */}
        <button
          onClick={handleAddToCart}
          className={`sm:hidden mt-2 w-full py-2 rounded-lg text-xs font-semibold active:scale-95 transition-all flex items-center justify-center gap-1.5 ${isInCart
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