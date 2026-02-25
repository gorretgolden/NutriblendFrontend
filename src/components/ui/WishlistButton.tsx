"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import {
    addToWishlistAsync,
    removeFromWishlistAsync,
} from "@/lib/features/wishlist/wishlistSlice";
import { toast } from "sonner";

interface WishlistButtonProps {
    productId: number;
    productName?: string;
    /** "card" = small icon overlay on product card, "detail" = larger button on product detail page */
    variant?: "card" | "detail";
    className?: string;
}

const WishlistButton = ({
    productId,
    productName = "Product",
    variant = "card",
    className = "",
}: WishlistButtonProps) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const wishlistItems = useAppSelector((state) => state.wishlist.items);
    const isInWishlist = wishlistItems.some(
        (item) => item.product_id === productId
    );
    const [isAnimating, setIsAnimating] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Please log in to save items to your wishlist.");
            return;
        }

        if (isProcessing) return;
        setIsProcessing(true);
        setIsAnimating(true);

        try {
            if (isInWishlist) {
                await dispatch(removeFromWishlistAsync(productId)).unwrap();
                toast.success(`Removed from wishlist`);
            } else {
                await dispatch(addToWishlistAsync(productId)).unwrap();
                toast.success(`Added to wishlist!`);
            }
        } catch (error: any) {
            toast.error(error || "Something went wrong");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setIsAnimating(false), 400);
        }
    };

    if (variant === "detail") {
        return (
            <button
                onClick={handleToggle}
                disabled={isProcessing}
                className={`group/wish relative flex items-center justify-center w-11 h-11 md:w-[52px] md:h-[52px] rounded-full border-2 transition-all duration-300 ${isInWishlist
                    ? "border-green-200 bg-green-50 hover:bg-green-100"
                    : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50"
                    } ${isProcessing ? "opacity-60 cursor-wait" : ""} ${className}`}
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
                <svg
                    className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-300 ${isAnimating ? "scale-125" : "scale-100"
                        } ${isInWishlist
                            ? "fill-green-500 text-green-500"
                            : "fill-none text-gray-400 group-hover/wish:text-green-400"
                        }`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={isInWishlist ? 0 : 2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                </svg>
                {/* Pulse animation on click */}
                {isAnimating && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-green-200/50 pointer-events-none" />
                )}
            </button>
        );
    }

    // Card variant — small floating heart on product card
    return (
        <button
            onClick={handleToggle}
            disabled={isProcessing}
            className={`group/wish relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 backdrop-blur-sm ${isInWishlist
                ? "bg-green-500 shadow-lg shadow-green-300/50"
                : "bg-white/90 shadow-md hover:bg-green-50 hover:shadow-lg"
                } ${isProcessing ? "opacity-60 cursor-wait" : ""} ${className}`}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            <svg
                className={`w-4 h-4 transition-all duration-300 ${isAnimating ? "scale-125" : "scale-100"
                    } ${isInWishlist
                        ? "fill-white text-white"
                        : "fill-none text-gray-500 group-hover/wish:text-green-500"
                    }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={isInWishlist ? 0 : 2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
            </svg>
            {/* Pulse animation on click */}
            {isAnimating && (
                <span
                    className={`absolute inset-0 rounded-full animate-ping pointer-events-none ${isInWishlist ? "bg-white/30" : "bg-green-200/50"
                        }`}
                />
            )}
        </button>
    );
};

export default WishlistButton;
