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
  const [imgSrc, setImgSrc] = React.useState(data.srcUrl || '/images/placeholder.jpg');
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
    (item) => Number(item.product_id) === Number(data.id)
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
          unit: data.unit,
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

      {/* ── Image Container ── */}
      <Link
        href={`/shop/product/${data.id}/${productSlug}`}
        className="relative block bg-white w-full overflow-hidden h-[180px] sm:h-[220px] md:h-[240px]"
      >
        {/* Quick View Overlay */}
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

        <Image
          src={imgSrc}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-all duration-700 ease-out group-hover:scale-[1.12] ${data.gallery && data.gallery.length > 0 ? 'group-hover:opacity-0' : ''}`}
          alt={data.title}
          priority
          onError={() => setImgSrc('/images/placeholder.jpg')}
        />

        {/* Secondary Hover Image */}
        {data.gallery && data.gallery.length > 0 && (
          <Image
            src={data.gallery[0]}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-all duration-700 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-[1.12] absolute inset-0"
            alt={`${data.title} alternate view`}
          />
        )}
      </Link>

      {/* ── Content ── */}
      <div className="relative z-10 px-2 sm:px-3 pt-2 pb-2.5 flex flex-col flex-grow border-t border-gray-100/80 bg-white">

        {/* Brand Row */}
        <div className="flex items-center gap-2 mb-1.5 overflow-hidden">
          {(data.brand || data.category) && (
            <span className="bg-[#f0fdf4] text-[#009E3C] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap">
              {data.brand || data.category}
            </span>
          )}
        </div>

        {/* Title */}
        <Link
          href={`/shop/product/${data.id}/${productSlug}`}
          className="text-gray-700 text-[13px] sm:text-[14px] font-normal mb-1 truncate hover:text-[#009E3C] transition-colors duration-200 leading-snug"
        >
          {data.title}
        </Link>

        {/* Price Block */}
        <div className="flex flex-col mt-2">
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
              {(displayPrice || 0).toLocaleString()}
            </span>
            {(hasDiscount || isUsingWholesalePrice) && (
              <span className="text-gray-300 text-[10px] sm:text-xs line-through leading-none">
                UGX {(data.price || 0).toLocaleString()}
              </span>
            )}
          </div>
          {data.unit && (
             <span className="text-[10px] text-gray-400 mt-0.5">per {data.unit}</span>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-0">
            <Rating
              initialValue={data.rating || 0}
              allowFraction
              size={14}
              readonly
              SVGclassName="inline-block"
              emptyClassName="fill-gray-300"
              fillClassName="fill-[#f68b1e]"
            />
            <span className="text-gray-400 text-[11px]">
              ({data.reviews || 0})
            </span>
          </div>
        </div>

        {/* Actions Row */}
        <div className="mt-2 flex items-center gap-2">
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : isInCart
                  ? "active:scale-[0.97] bg-[#009E3C] text-white shadow-[0_4px_12px_rgba(0,158,60,0.25)] hover:shadow-[0_6px_18px_rgba(0,158,60,0.35)]"
                  : "active:scale-[0.97] bg-[#009E3C] hover:bg-[#00752C] text-white shadow-[0_4px_12px_rgba(0,158,60,0.25)] hover:shadow-[0_6px_18px_rgba(0,158,60,0.35)]"
            }`}
          >
            {isOutOfStock ? (
              'Out of Stock'
            ) : isInCart ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                In Cart
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

          {/* WhatsApp Quick Chat Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const productUrl = typeof window !== 'undefined'
                ? `${window.location.origin}/shop/product/${data.id}/${data.slug || 'product'}`
                : `https://nutriblendhaven.com/shop/product/${data.id}/${data.slug || 'product'}`;
              
              const message = encodeURIComponent(`Hello Nutriblend Haven.\nLike to buy ${data.title},\nUGX ${(displayPrice || 0).toLocaleString()},\n${productUrl}`);
              window.open(`https://wa.me/256784640607?text=${message}`, '_blank');
            }}
            className="flex-shrink-0 w-10 h-10 bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-full flex items-center justify-center shadow-md shadow-[#25D366]/20 transition-all duration-300 active:scale-[0.95]"
            title="Chat about this product"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
