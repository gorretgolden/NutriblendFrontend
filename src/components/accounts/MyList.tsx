"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import {
  fetchWishlist,
  removeFromWishlistAsync,
  moveToCartAsync,
} from "@/lib/features/wishlist/wishlistSlice";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/api/client";
import { FiHeart, FiTrash2, FiExternalLink } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const MyList = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading } = useAppSelector((state) => state.wishlist);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = async (productId: number) => {
    try {
      await dispatch(removeFromWishlistAsync(productId)).unwrap();
      toast.success("Removed from wishlist");
    } catch (error: any) {
      toast.error(error || "Failed to remove item");
    }
  };

  const handleMoveToCart = async (productId: number) => {
    try {
      await dispatch(moveToCartAsync({ productId, quantity: 1 })).unwrap();
      toast.success("Moved to cart!");
    } catch (error: any) {
      toast.error(error || "Failed to move to cart");
    }
  };

  const getWhatsAppLink = (product: any) => {
    const message = `Hello Nutriblend Haven, I'm interested in ${product.name || product.title}. Price: UGX ${product.price.toLocaleString()}. Link: ${window.location.origin}/shop/product/${product.id}/${product.slug || ""}`;
    return `https://wa.me/256708453401?text=${encodeURIComponent(message)}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiHeart className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Sign In to View Your Wishlist</h3>
        <p className="text-gray-400 text-sm">Log in to save and manage your favorite products.</p>
      </div>
    );
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
            <div className="bg-gray-100 rounded-xl h-40 mb-4" />
            <div className="bg-gray-100 rounded-lg h-4 w-3/4 mb-3" />
            <div className="bg-gray-100 rounded-lg h-4 w-1/2 mb-4" />
            <div className="flex gap-2">
              <div className="bg-gray-100 rounded-lg h-9 flex-1" />
              <div className="bg-gray-100 rounded-lg h-9 w-9" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiHeart className="w-8 h-8 text-rose-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Wishlist is Empty</h3>
        <p className="text-gray-400 text-sm mb-6">Start adding products you love by clicking the heart icon.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#009E3C] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#00752C] transition-colors"
        >
          Browse Products
          <FiExternalLink className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
          My Wishlist
          <span className="ml-3 text-sm font-bold text-[#009E3C] bg-green-50 px-3 py-1 rounded-full">
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const product = item.product;
          if (!product) return null;

          const imageUrl =
            product.main_image
            || product.product_images?.[0]?.image_url
            || product.product_images?.[0]?.image_path
            || (Array.isArray(product.images) && typeof product.images[0] === 'string' ? product.images[0] : null)
            || product.images?.[0]?.image_url
            || product.images?.[0]?.image_path
            || product.image
            || null;

          const hasDiscount =
            (product.discount?.percentage ?? 0) > 0 || (product.discount?.amount ?? 0) > 0;
          const discountedPrice = hasDiscount
            ? (product.discount?.percentage ?? 0) > 0
              ? Math.round(Number(product.price) - (Number(product.price) * (product.discount?.percentage ?? 0)) / 100)
              : Number(product.price) - (product.discount?.amount ?? 0)
            : Number(product.price);

          return (
            <div
              key={item.id}
              className="group bg-white rounded-[24px] border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100 transition-all duration-500 hover:-translate-y-1 relative"
            >
              {/* Trash/Remove Button - Floating */}
              <button
                onClick={() => handleRemove(item.product_id)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-300"
                title="Remove from wishlist"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>

              {/* Product Image Area */}
              <div className="relative bg-gray-50/50 h-52 flex items-center justify-center p-6 overflow-hidden">
                <Link href={`/shop/product/${product.id}/${product.slug || ""}`} className="relative z-10">
                  {imageUrl ? (
                    <img
                      src={getImageUrl(imageUrl)}
                      alt={product.name || product.title || "Product"}
                      className="object-contain w-[160px] h-[160px] group-hover:scale-110 transition-transform duration-700 ease-out"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                    />
                  ) : (
                    <div className="w-[160px] h-[160px] flex items-center justify-center text-gray-200">
                      <FiHeart className="w-16 h-16" />
                    </div>
                  )}
                </Link>
                {hasDiscount && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg">
                    {(product.discount?.percentage ?? 0) > 0
                      ? `-${product.discount?.percentage}%`
                      : `-UGX ${(product.discount?.amount ?? 0).toLocaleString()}`}
                  </span>
                )}
                
                {/* Heart Badge */}
                <div className="absolute bottom-4 right-4 w-7 h-7 bg-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-200">
                   <FiHeart className="w-3.5 h-3.5 text-white fill-white" />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                {product.brand && (
                  <p className="text-[#009E3C] text-[10px] font-black uppercase tracking-[0.15em] mb-1.5 drop-shadow-sm">
                    {typeof product.brand === "string" ? product.brand : product.brand.name}
                  </p>
                )}
                
                <Link
                  href={`/shop/product/${product.id}/${product.slug || ""}`}
                  className="text-gray-800 text-[15px] font-bold line-clamp-1 hover:text-[#009E3C] transition-colors duration-300 leading-snug mb-2 block"
                >
                  {(product.name || product.title || "").split(",")[0]}
                </Link>

                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[10px] font-bold text-gray-400">UGX</span>
                    <span className="font-black text-gray-900 text-lg tracking-tight">
                      {discountedPrice.toLocaleString()}
                    </span>
                  </div>
                  {hasDiscount && (
                    <span className="text-gray-400 text-xs line-through opacity-60">
                      {Number(product.price).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Side-by-side Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMoveToCart(item.product_id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#009E3C] hover:bg-[#00752C] text-white text-[12px] font-black uppercase tracking-wider py-3 rounded-xl transition-all duration-300 active:scale-95 shadow-md shadow-green-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    Move to Cart
                  </button>
                  <a
                    href={getWhatsAppLink(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-600 hover:bg-emerald-200 hover:text-emerald-700 rounded-xl transition-all duration-300 shadow-sm"
                    title="Inquire on WhatsApp"
                  >
                    <FaWhatsapp className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyList;
