"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useAppSelector } from "@/lib/hooks/redux";
import { apiClient, type Region, type Town } from "@/lib/api/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const router = useRouter();
  const { cart, adjustedTotalPrice } = useAppSelector((state) => state.carts);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [regions, setRegions] = useState<Region[]>([]);
  const [towns, setTowns] = useState<Town[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedTown, setSelectedTown] = useState<number | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to checkout");
      router.push('/cart');
      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty");
      router.push('/cart');
      return;
    }
  }, [isAuthenticated, cart, router]);

  // Fetch regions
  useEffect(() => {
    async function fetchRegions() {
      try {
        setLoadingRegions(true);
        const response = await apiClient.getRegions();
        if (response.status && response.data) {
          setRegions(response.data);
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
        toast.error("Failed to load delivery regions");
      } finally {
        setLoadingRegions(false);
      }
    }

    if (isAuthenticated && cart?.items.length > 0) {
      fetchRegions();
    }
  }, [isAuthenticated, cart]);

  // Fetch towns when region changes
  useEffect(() => {
    if (!selectedRegion) {
      setTowns([]);
      setSelectedTown(null);
      setDeliveryFee(0);
      return;
    }

    async function fetchTowns() {
      try {
        const response = await apiClient.getTowns(selectedRegion!);
        if (response.status && response.data) {
          setTowns(response.data);
        }
      } catch (error) {
        console.error("Error fetching towns:", error);
        toast.error("Failed to load towns");
      }
    }

    fetchTowns();
  }, [selectedRegion]);

  // Calculate delivery fee when town changes
  useEffect(() => {
    if (!selectedRegion || !selectedTown) {
      setDeliveryFee(0);
      return;
    }

    async function calculateFee() {
      try {
        const response = await apiClient.calculateDeliveryFee({
          region_id: selectedRegion!,
          town_id: selectedTown!,
        });
        if (response.status && response.data) {
          setDeliveryFee(response.data.fee);
        }
      } catch (error) {
        console.error("Error calculating delivery fee:", error);
      }
    }

    calculateFee();
  }, [selectedRegion, selectedTown]);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error("Please enter a discount code");
      return;
    }

    try {
      const response = await apiClient.validateDiscount({
        code: discountCode,
        total_amount: adjustedTotalPrice + deliveryFee,
      });

      if (response.status && response.data) {
        setDiscountAmount(response.data.discount_amount);
        toast.success(`Discount applied: UGX ${response.data.discount_amount.toLocaleString()}`);
      } else {
        toast.error(response.message || "Invalid discount code");
      }
    } catch (error) {
      toast.error("Failed to apply discount code");
    }
  };

  const handlePlaceOrder = async () => {
    // Validation
    if (!selectedRegion || !selectedTown) {
      toast.error("Please select delivery region and town");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        items: cart.items.map((item: any) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          variation_id: item.variation_id,
        })),
        delivery_region_id: selectedRegion,
        delivery_town_id: selectedTown,
        delivery_address: address,
        discount_code: discountCode || undefined,
        notes: notes || undefined,
        payment_method: paymentMethod,
      };

      const response = await apiClient.createOrder(orderData);

      if (response.status && response.data) {
        toast.success("Order placed successfully!");

        // Clear cart (you'll need to add this action to cartsSlice)
        sessionStorage.removeItem('checkoutCart');

        // Redirect to order confirmation
        router.push(`/account/order?orderNumber=${response.data.order_number}`);
      } else {
        toast.error(response.message || "Failed to create order");
      }
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast.error(error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  const subtotal = adjustedTotalPrice;
  const finalTotal = subtotal + deliveryFee - discountAmount;

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-frame mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-green-600">Checkout</div>
          <div className="flex items-center text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure Checkout
          </div>
        </div>
      </header>

      <main className="max-w-frame mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="lg:w-2/3">
            <Button
              variant="link"
              className="text-green-600 mb-6 p-0 h-auto font-semibold"
              onClick={() => router.back()}
            >
              ← Go back to cart
            </Button>

            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 mb-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">1. CUSTOMER INFORMATION</h2>
              <div className="text-green-800">
                <p className="font-semibold text-green-600">{user?.first_name} {user?.last_name}</p>
                <p>{user?.email} | {user?.phone}</p>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 mb-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">2. DELIVERY INFORMATION</h2>

              <div className="space-y-4">
                {/* Region Selection */}
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Region</label>
                  <select
                    value={selectedRegion || ""}
                    onChange={(e) => setSelectedRegion(Number(e.target.value))}
                    className="w-full border border-green-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    disabled={loadingRegions}
                  >
                    <option value="">Select Region</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>{region.name}</option>
                    ))}
                  </select>
                </div>

                {/* Town Selection */}
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Town</label>
                  <select
                    value={selectedTown || ""}
                    onChange={(e) => setSelectedTown(Number(e.target.value))}
                    className="w-full border border-green-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    disabled={!selectedRegion || towns.length === 0}
                  >
                    <option value="">Select Town</option>
                    {towns.map((town) => (
                      <option key={town.id} value={town.id}>
                        {town.name} (Fee: UGX {town.delivery_fee.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Delivery Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full delivery address..."
                    className="w-full border border-green-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    rows={3}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Order Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions for delivery..."
                    className="w-full border border-green-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">3. PAYMENT METHOD</h2>
              <div className="space-y-4">
                <label className={`border-2 rounded-xl p-4 cursor-pointer flex items-center ${paymentMethod === 'cod' ? 'border-green-600 bg-green-50' : 'border-green-100'}`}>
                  <input
                    type="radio"
                    className="h-5 w-5 text-green-600"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <span className="ml-3 text-sm font-medium text-green-800">Cash on Delivery (COD)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-green-900 mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {cart.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-green-700">{item.name} × {item.quantity}</span>
                    <span className="font-medium">UGX {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-green-200 pt-4 space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-green-700">Subtotal</span>
                  <span className="font-medium">UGX {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-green-700">Delivery Fee</span>
                  <span className="font-medium">UGX {deliveryFee.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-UGX {discountAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Discount Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="flex-1 border border-green-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                  />
                  <button
                    onClick={handleApplyDiscount}
                    className="bg-green-600 text-white px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    APPLY
                  </button>
                </div>
              </div>

              <div className="flex justify-between border-t border-green-200 pt-4 mb-6">
                <span className="text-lg font-bold text-green-900">Total</span>
                <span className="text-lg font-bold text-green-600">UGX {Math.round(finalTotal).toLocaleString()}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedRegion || !selectedTown || !address}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Processing...' : 'Confirm Order'}
              </button>

              <p className="text-xs text-green-500 text-center mt-4">
                By proceeding, you are automatically accepting the Terms & Conditions.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}