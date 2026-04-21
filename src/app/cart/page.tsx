"use client";

import BreadcrumbCart from "@/components/cart-page/BreadcrumbCart";
import ProductCard from "@/components/cart-page/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
    <main className="bg-[#f5f5f5] min-h-screen pb-20">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4">
          <BreadcrumbCart />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {cart && cart.items.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Cart Items — white card box */}
            <div className="flex-1 w-full flex flex-col gap-4">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900">Cart ({cart.items.length} Items)</h2>
                  <span className="text-sm font-medium text-gray-500">Subtotal: UGX {Math.round(adjustedTotalPrice).toLocaleString()}</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {cart.items.map((product, idx) => (
                    <div key={idx} className="p-6">
                      <ProductCard data={product} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="w-full lg:w-[380px] flex flex-col gap-4 sticky top-32">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden">
                <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4 uppercase tracking-wider text-sm">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold text-gray-900 uppercase text-xs">UGX {totalPrice.toLocaleString()}</span>
                  </div>

                  {(totalPrice - adjustedTotalPrice > 0) && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Discount ({Math.round(((totalPrice - adjustedTotalPrice) / totalPrice) * 100)}%)</span>
                      <span className="font-bold text-[#E53935]">-UGX {Math.round(totalPrice - adjustedTotalPrice).toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-bold text-[#009E3C] uppercase text-[10px] bg-[#f4fcf6] px-2 py-0.5 rounded">Calculated at checkout</span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Estimated Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-gray-900">UGX {Math.round(adjustedTotalPrice).toLocaleString()}</span>
                      <p className="text-[10px] text-gray-400 font-medium">VAT Included</p>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6 pt-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MdOutlineLocalOffer className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo Code"
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#009E3C] focus:border-[#009E3C] outline-none transition-all"
                        disabled={promoApplied}
                      />
                    </div>
                    <Button
                      type="button"
                      className="bg-gray-900 hover:bg-black text-white px-4 py-2.5 h-auto text-xs font-bold uppercase tracking-widest rounded-lg"
                      onClick={handleApplyPromo}
                      disabled={promoLoading || promoApplied}
                    >
                      {promoLoading ? "..." : promoApplied ? "Applied" : "Apply"}
                    </Button>
                  </div>
                  {promoApplied && (
                    <p className="text-[#009E3C] text-[10px] font-bold mt-2 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Promo code active! -UGX {discountAmount.toLocaleString()}
                    </p>
                  )}
                </div>

                <Button
                  className="w-full bg-[#009E3C] hover:bg-[#007a2e] text-white py-3.5 h-auto rounded-lg font-bold text-sm shadow-sm group active:scale-[0.98] transition-all"
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
                  Checkout Now
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="mt-6 flex flex-col items-center gap-3">
                  <p className="text-[11px] text-gray-500 font-medium">Supported Payment Methods</p>
                  <div className="flex gap-2">
                    {['MTN', 'Airtel', 'Visa', 'Cash'].map(m => (
                      <span key={m} className="px-2 py-1 bg-gray-50 border border-gray-100 rounded text-[9px] font-bold text-gray-400">{m}</span>
                    ))}
                  </div>
                  <Link href="/shop" className="text-[#009E3C] font-bold text-xs hover:underline mt-2">← Continue Shopping</Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-20 px-4 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <TbBasketExclamation className="text-5xl text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven&apos;t added any health essentials yet. Ready to start your wellness journey?</p>
            <Button
              className="bg-[#009E3C] hover:bg-[#007a2e] text-white px-10 py-6 h-auto rounded-lg text-base font-bold transition-all shadow-md"
              asChild
            >
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}