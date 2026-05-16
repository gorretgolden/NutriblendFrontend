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
          className="text-gray-700 text-[13px] sm:text-[14px] font-bold mb-1 line-clamp-2 hover:text-[#009E3C] transition-colors duration-200 leading-snug text-left h-[40px]"
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
        <div className="mt-auto pt-3 flex items-center gap-2">
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : isInCart
                  ? "bg-[#009E3C] text-white shadow-md active:scale-95"
                  : "bg-[#009E3C] hover:bg-[#00752C] text-white shadow-md active:scale-95"
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
                Add to cart
              </>
            )}
          </button>

          {/* WhatsApp Action Button */}
          <a
            href={`https://wa.me/256784640607?text=Hello Nutriblend, I'm interested in ${data.title} (Price: UGX ${displayPrice.toLocaleString()}). Link: ${typeof window !== 'undefined' ? window.location.origin : ''}/shop/product/${data.id}/${productSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center bg-[#25D366] hover:bg-[#128C7E] text-white shadow-md transition-all duration-200 active:scale-95"
            title="Inquire on WhatsApp"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.956-.5-5.705-1.448l-6.305 1.656zm6.357-3.912c1.533.91 3.383 1.39 5.271 1.391 5.405 0 9.803-4.398 9.806-9.803.002-2.62-1.022-5.085-2.885-6.948a9.717 9.717 0 00-6.924-2.865c-5.406 0-9.803 4.397-9.806 9.803-.001 1.733.454 3.426 1.316 4.921l-.815 2.977 3.037-.796zm12.01-6.498c-.329-.165-1.947-.96-2.248-1.07-.3-.109-.518-.165-.736.165-.217.329-.841 1.07-1.03 1.29-.19.217-.379.247-.708.082-.329-.165-1.389-.512-2.645-1.633-.977-.872-1.637-1.95-1.828-2.28-.19-.329-.02-.507.145-.671.148-.147.329-.384.494-.576.165-.192.219-.329.329-.548.11-.219.055-.411-.027-.576-.082-.165-.736-1.775-1.008-2.433-.265-.64-.537-.554-.736-.564-.188-.01-.403-.012-.618-.012s-.565.081-.861.411c-.296.329-1.131 1.106-1.131 2.697s1.159 3.125 1.32 3.344c.162.219 2.278 3.48 5.523 4.882.771.333 1.373.533 1.846.684.776.247 1.48.212 2.037.129.622-.092 1.947-.795 2.221-1.564.274-.768.274-1.426.192-1.564-.081-.137-.296-.219-.625-.384z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
