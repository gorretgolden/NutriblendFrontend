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
  const isOutOfStock = data.stock !== undefined && data.stock === 0;

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
  const discountLabel = data.discount?.percentage > 0
    ? `-${data.discount.percentage}%`
    : data.discount?.amount > 0
      ? `-UGX ${data.discount.amount.toLocaleString()}`
      : null;

  return (
    <div className={`group relative bg-white border rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 ease-out ${
      isOutOfStock
        ? 'border-gray-100 opacity-75'
        : 'border-gray-100 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10),0_4px_10px_rgba(0,0,0,0.06)] hover:border-[#009E3C]/25 glow-on-hover'
    }`}>

      {/* ── Shimmer sheen on hover ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-0">
        <div className="absolute -inset-full top-0 left-[-60%] w-[40%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 group-hover:translate-x-[400%] transition-all duration-700 ease-out" />
      </div>

      {/* ── Quick View Overlay ── */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none group-hover:pointer-events-auto">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/shop/product/${data.id}/${productSlug}`);
          }}
          className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-[#009E3C] text-[11px] font-bold px-4 py-2 rounded-full shadow-lg border border-[#009E3C]/20 hover:bg-[#009E3C] hover:text-white hover:border-[#009E3C] transition-all duration-200 translate-y-3 group-hover:translate-y-0"
          title="Quick View"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Quick View
        </button>
      </div>

      {/* ── Image Container ── */}
      <Link
        href={`/shop/product/${data.id}/${productSlug}`}
        className="relative block bg-gradient-to-b from-gray-50 to-white w-full overflow-hidden aspect-square"
      >
        {/* Wishlist */}
        <div
          className="absolute top-2.5 right-2.5 z-10"
          onClick={(e) => e.preventDefault()}
        >
          <WishlistButton productId={data.id} productName={data.title} variant="card" />
        </div>

        {/* Sale Badge */}
        {hasDiscount && !isUsingWholesalePrice && discountLabel && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-[#E53935] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm tracking-wide">
            {discountLabel}
          </span>
        )}

        {/* Wholesale Badge */}
        {isUsingWholesalePrice && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm tracking-wide">
            WHOLESALE
          </span>
        )}

        {/* Out of Stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <span className="bg-gray-800 text-white text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Low Stock */}
        {!isOutOfStock && data.stock !== undefined && data.stock > 0 && data.stock <= 10 && (
          <span className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 bg-red-50 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded-md border border-red-100">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Only {data.stock} left
          </span>
        )}

        {/* Product Image */}
        <Image
          src={data.srcUrl}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
          alt={data.title}
          priority
        />
      </Link>

      {/* ── Content ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-2 sm:px-3 pt-2 pb-2.5 bg-white/95 backdrop-blur-sm border-t border-gray-100/80">

        {/* Brand */}
        {data.brand && (
          <p className="text-[#009E3C] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest mb-1 truncate">
            {data.brand}
          </p>
        )}

        {/* Title */}
        <Link
          href={`/shop/product/${data.id}/${productSlug}`}
          className="text-gray-900 text-[11px] sm:text-xs font-semibold mb-1 line-clamp-2 hover:text-[#009E3C] transition-colors duration-200 leading-snug"
        >
          {data.title}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-1.5">
          <Rating
            initialValue={data.rating}
            allowFraction
            SVGclassName="inline-block"
            emptyClassName="fill-gray-200"
            fillClassName="fill-amber-400"
            size={12}
            readonly
          />
          <span className="text-gray-400 text-[10px] font-medium">
            ({data.reviews?.toLocaleString() || "0"})
          </span>
        </div>


        {/* Price Block */}
        <div className="flex flex-col mt-auto">
          {isUsingWholesalePrice && (
            <p className="text-[9px] text-blue-600 font-bold uppercase tracking-wider mb-0.5">Wholesale Price</p>
          )}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className={`font-extrabold text-base sm:text-lg leading-none ${
              isUsingWholesalePrice
                ? "text-blue-600"
                : hasDiscount
                  ? "text-[#E53935]"
                  : "text-gray-900"
            }`}>
              <span className="text-[9px] font-semibold text-gray-400 mr-0.5 align-baseline">UGX</span>
              {displayPrice.toLocaleString()}
            </span>
            {(hasDiscount || isUsingWholesalePrice) && (
              <span className="text-gray-300 text-[10px] sm:text-xs line-through leading-none">
                UGX {data.price.toLocaleString()}
              </span>
            )}
          </div>
          {data.unit && (
            <span className="text-[10px] text-gray-400 mt-0.5">per {data.unit}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`mt-2 w-full py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 flex items-center justify-center gap-1 ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              : isInCart
                ? "active:scale-[0.97] bg-[#f0fbf4] text-[#009E3C] border-2 border-[#009E3C]/30 hover:bg-[#e4f8ec] hover:border-[#009E3C]/50"
                : "active:scale-[0.97] bg-[#009E3C] hover:bg-[#00752C] text-white shadow-[0_4px_12px_rgba(0,158,60,0.25)] hover:shadow-[0_6px_18px_rgba(0,158,60,0.35)]"
          }`}
        >
          {isOutOfStock ? (
            'Out of Stock'
          ) : isInCart ? (
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
