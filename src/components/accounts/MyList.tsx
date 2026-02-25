"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import {
  fetchWishlist,
  removeFromWishlistAsync,
  moveToCartAsync,
} from "@/lib/features/wishlist/wishlistSlice";
import { toast } from "sonner";
import { FiHeart, FiShoppingCart, FiTrash2, FiExternalLink } from "react-icons/fi";

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
          className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
        >
          Browse Products
          <FiExternalLink className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">
          My Wishlist
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => {
          const product = item.product;
          if (!product) return null;

          const imageUrl = product.images?.[0]?.image_url
            || product.images?.[0]?.image_path
            || "/placeholder-product.png";

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
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-green-900/5 transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Product Image */}
              <div className="relative bg-gradient-to-b from-gray-50 to-white h-44 flex items-center justify-center p-4">
                <Link href={`/shop/product/${product.id}/${product.slug || ""}`}>
                  <Image
                    src={imageUrl}
                    alt={product.name || product.title || "Product"}
                    width={140}
                    height={140}
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                {hasDiscount && (
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                    {(product.discount?.percentage ?? 0) > 0
                      ? `-${product.discount?.percentage}%`
                      : `-UGX ${(product.discount?.amount ?? 0).toLocaleString()}`}
                  </span>
                )}
                {/* Filled heart indicator */}
                <div className="absolute top-3 left-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-300/40">
                    <svg className="w-4 h-4 fill-white text-white" viewBox="0 0 24 24">
                      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {product.brand && (
                  <p className="text-green-600 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">
                    {typeof product.brand === "string" ? product.brand : product.brand.name}
                  </p>
                )}
                <Link
                  href={`/shop/product/${product.id}/${product.slug || ""}`}
                  className="text-gray-800 text-sm font-bold line-clamp-2 hover:text-green-600 transition-colors duration-200 leading-snug mb-2 block"
                >
                  {(product.name || product.title || "").split(",")[0]}
                </Link>

                <div className="flex items-center gap-2 mb-4">
                  <span className="font-extrabold text-gray-900 text-base">
                    <span className="text-[10px] font-bold text-gray-400 mr-0.5">UGX</span>
                    {discountedPrice.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-gray-400 text-xs line-through">
                      {Number(product.price).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMoveToCart(item.product_id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
                  >
                    <FiShoppingCart className="w-4 h-4" />
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item.product_id)}
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-200 active:scale-95"
                    title="Remove from wishlist"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
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
