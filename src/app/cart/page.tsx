"use client";

import BreadcrumbCart from "@/components/cart-page/BreadcrumbCart";
import ProductCard from "@/components/cart-page/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineLocalOffer } from "react-icons/md";
import { TbBasketExclamation } from "react-icons/tb";
import React, { useState } from "react";
import { RootState } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks/redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";

export default function CartPage() {
  const { cart, totalPrice, adjustedTotalPrice } = useAppSelector(
    (state: RootState) => state.carts
  );

  const router = useRouter();
  const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('auth_token');

  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }
    try {
      setPromoLoading(true);
      const response = await apiClient.validateDiscount({
        code: promoCode,
        total_amount: adjustedTotalPrice,
      });
      if (response.status && response.data) {
        setDiscountAmount(response.data.discount_amount);
        setPromoApplied(true);
        toast.success(`Promo applied! You save UGX ${response.data.discount_amount.toLocaleString()}`);
      } else {
        toast.error(response.message || "Invalid promo code");
      }
    } catch {
      toast.error("Failed to apply promo code");
    } finally {
      setPromoLoading(false);
    }
  };

  return (
    <main className="pb-20 bg-white-50 min-h-screen">
      <div className="max-w-frame mx-auto px-4 xl:px-0 py-8">
        {cart && cart.items.length > 0 ? (
          <>
            <BreadcrumbCart />
            <h2
              className={cn([
                integralCF.className,
                "font-bold text-[24px] md:text-[28px] text-dark-800 uppercase mb-6 md:mb-8",
              ])}
            >
              Your Shopping Cart
            </h2>
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
              {/* Cart Items Section */}
              <div className="w-full lg:w-2/3 bg-white p-5 md:p-6 flex-col space-y-5 rounded-2xl shadow-lg border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-green-900">
                    Cart Items ({cart.items.length})
                  </h3>
                  <span className="text-green-600 font-medium">
                    Total: UGX {Math.round(adjustedTotalPrice)}
                  </span>
                </div>

                <div className="space-y-4">
                  {cart.items.map((product, idx, arr) => (
                    <React.Fragment key={idx}>
                      <ProductCard data={product} />
                      {arr.length - 1 !== idx && (
                        <hr className="border-t-green-100" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Order Summary Section */}
              <div className="w-full lg:w-1/3 bg-white p-5 md:p-6 flex-col space-y-5 rounded-2xl shadow-lg border border-green-100 sticky top-6">
                <h3 className="text-xl font-semibold text-dark-900 border-b border-green-100 pb-3">
                  Order Summary
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700">Subtotal</span>
                    <span className="font-semibold">UGX {totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-green-700">
                      Discount (-
                      {Math.round(
                        ((totalPrice - adjustedTotalPrice) / totalPrice) * 100
                      )}
                      %)
                    </span>
                    <span className="font-semibold text-green-600">
                      -UGX {Math.round(totalPrice - adjustedTotalPrice).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-green-700">Delivery Fee</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>

                  <hr className="border-t-green-100" />

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-dark-900">Total</span>
                    <span className="text-xl font-bold text-dark-800">
                      UGX {Math.round(adjustedTotalPrice).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium text-dark-700 mb-3">Have a promo code?</h4>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center bg-green-50 border border-green-200 rounded-full px-4 h-12">
                      <MdOutlineLocalOffer className="text-green-500 text-xl mr-2 flex-shrink-0" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="bg-transparent placeholder:text-dark-400 text-green-800 outline-none w-full"
                        disabled={promoApplied}
                      />
                    </div>
                    <Button
                      type="button"
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 h-12 transition-colors"
                      onClick={handleApplyPromo}
                      disabled={promoLoading || promoApplied}
                    >
                      {promoLoading ? "..." : promoApplied ? "Applied" : "Apply"}
                    </Button>
                  </div>
                  {promoApplied && (
                    <p className="text-green-600 text-xs mt-2">Discount: -UGX {discountAmount.toLocaleString()}</p>
                  )}
                </div>

                {/* Checkout Button */}

                <Button
                  type="button"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 h-14 rounded-xl font-semibold text-lg group transition-all duration-300 hover:shadow-lg"
                  onClick={() => {
                    if (!isAuthenticated) {
                      sessionStorage.setItem('returnUrl', '/cart/checkout');
                      toast.error("Please login to proceed to checkout");
                      router.push('/login');
                      return;
                    }
                    sessionStorage.setItem('checkoutCart', JSON.stringify({
                      items: cart.items,
                      totalPrice,
                      adjustedTotalPrice
                    }));
                    router.push('/cart/checkout');
                  }}
                >
                  Proceed to Checkout
                  <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>

                {/* Continue Shopping Link */}
                <div className="text-center pt-2">
                  <Link
                    href="/shop"
                    className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Empty Cart State
          <div className="flex flex-col items-center justify-center text-center py-20 px-4">
            <div className="bg-green-100 p-6 rounded-full mb-6">
              <TbBasketExclamation strokeWidth={1} className="text-6xl text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-green-900 mb-3">
              Your cart is empty
            </h3>
            <p className="text-green-600 mb-8 max-w-md">
              Looks like you haven't added any items to your cart yet. Start shopping to find amazing products!
            </p>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-6 text-lg font-semibold transition-colors"
              asChild
            >
              <Link href="/shop">
                Start Shopping
              </Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}