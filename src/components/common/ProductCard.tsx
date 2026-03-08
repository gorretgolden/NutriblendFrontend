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
      await dispatch(
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

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-premium hover:border-[#009E3C]/30 transition-all duration-500 flex flex-col relative h-full glow-on-hover">
      {/* Quick Action Overlay (Unique Feature) */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none group-hover:pointer-events-auto">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/shop/product/${data.id}/${productSlug}`);
          }}
          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#009E3C] hover:bg-[#009E3C] hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
          title="Quick View"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        </button>
      </div>

      {/* Image Container — clean 1:1 ratio like iHerb */}
      <Link href={`/shop/product/${data.id}/${productSlug}`} className="block relative bg-white w-full aspect-square flex items-center justify-center p-3 sm:p-5 overflow-hidden">
        {/* Wishlist */}
        <div className="absolute top-2 right-2 z-10 scale-90 sm:scale-100" onClick={(e) => e.preventDefault()}>
          <WishlistButton productId={data.id} productName={data.title} variant="card" />
        </div>

        {/* Discount Badge — top left, bold red like iHerb */}
        {hasDiscount && !isUsingWholesalePrice && (
          <span className="absolute top-2 left-2 bg-[#E53935] text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded z-10">
            {data.discount.percentage > 0
              ? `-${data.discount.percentage}%`
              : `-UGX ${data.discount.amount.toLocaleString()}`}
          </span>
        )}

        {/* Wholesale Badge */}
        {isUsingWholesalePrice && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
            WHOLESALE
          </span>
        )}

        {/* Low Stock */}
        {data.stock !== undefined && data.stock > 0 && data.stock <= 10 && (
          <span className="absolute bottom-2 left-2 bg-red-50 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded z-10 border border-red-100">
            Only {data.stock} left
          </span>
        )}

        <Image
          src={data.srcUrl}
          width={220}
          height={220}
          className="object-contain max-h-full w-auto group-hover:scale-105 transition-transform duration-500"
          alt={data.title}
          priority
        />
      </Link>

      {/* Content — tight, dense info like iHerb */}
      <div className="px-3 sm:px-4 pt-2 pb-3 sm:pb-4 flex flex-col flex-grow border-t border-gray-100">
        {/* Brand */}
        {data.brand && (
          <p className="text-[#009E3C] text-[10px] sm:text-[11px] font-bold uppercase tracking-wide mb-1 truncate">
            {data.brand}
          </p>
        )}

        {/* Title — 2 lines max */}
        <Link
          href={`/shop/product/${data.id}/${productSlug}`}
          className="text-gray-900 text-xs sm:text-sm font-semibold mb-1.5 line-clamp-2 hover:text-[#009E3C] transition-colors leading-snug"
        >
          {data.title}
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <Rating
            initialValue={data.rating}
            allowFraction
            SVGclassName="inline-block"
            emptyClassName="fill-gray-200"
            fillClassName="fill-amber-400"
            size={12}
            readonly
          />
          <span className="text-gray-400 text-[10px] ml-1 font-medium">
            ({data.reviews?.toLocaleString() || '0'})
          </span>
        </div>

        {/* Health Verification Badge (Unique Feature) */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex -space-x-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-4 h-4 rounded-full border border-white bg-green-50 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-[#009E3C]" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
              </div>
            ))}
          </div>
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Verified Purity</span>
        </div>

        {/* Price Block — pushed to bottom */}
        <div className="flex flex-col mt-auto">
          {isUsingWholesalePrice && (
            <p className="text-[9px] text-blue-600 font-bold uppercase mb-0.5">Wholesale Price</p>
          )}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className={`font-extrabold text-base sm:text-lg ${isUsingWholesalePrice ? 'text-blue-600' : hasDiscount ? 'text-[#E53935]' : 'text-gray-900'}`}>
              <span className="text-[9px] font-semibold text-gray-400 mr-0.5">UGX</span>
              {displayPrice.toLocaleString()}
            </span>
            {(hasDiscount || isUsingWholesalePrice) && (
              <span className="text-gray-400 text-[10px] sm:text-xs line-through">
                UGX {data.price.toLocaleString()}
              </span>
            )}
          </div>
          {data.unit && (
            <span className="text-[10px] text-gray-400 mt-0.5">per {data.unit}</span>
          )}
        </div>

        {/* Add to Cart Button — always visible, green like iHerb */}
        <button
          onClick={handleAddToCart}
          className={`mt-2.5 w-full py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-bold active:scale-[0.97] transition-all flex items-center justify-center gap-1.5 ${isInCart
            ? "bg-[#f4fcf6] text-[#009E3C] border border-[#009E3C]/30"
            : "bg-[#009E3C] hover:bg-[#007a2e] text-white shadow-sm"
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
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;