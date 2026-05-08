"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import { clearCartAsync } from "@/lib/features/carts/cartsSlice";
import { apiClient, type Region, type Town } from "@/lib/api/client";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

export default function Checkout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cart, adjustedTotalPrice, isLoading: cartLoading } = useAppSelector((state) => state.carts);
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('auth_token');

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
  const [loadingTowns, setLoadingTowns] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [checkoutErrors, setCheckoutErrors] = useState<Record<string, string | undefined>>({});
  const [hasPrepopulated, setHasPrepopulated] = useState(false);

  // Check authentication — wait for auth to load, also check localStorage as fallback
  useEffect(() => {
    // Don't redirect while auth state is still loading
    if (authLoading) return;

    if (!isAuthenticated && !hasToken) {
      toast.error("Please login to checkout");
      router.push('/cart');
      return;
    }

    if (!cartLoading && cart && cart.items.length === 0) {
      toast.error("Your cart is empty");
      router.push('/cart');
      return;
    }

    // Pre-populate location from user profile
    if (user && !hasPrepopulated) {
      if (user.region_id) {
        setSelectedRegion(user.region_id);
      }
      if (user.location) {
        setAddress(user.location);
      }
      setHasPrepopulated(true);
    }
  }, [isAuthenticated, authLoading, cart, cartLoading, router, user, hasPrepopulated]);

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

    if ((isAuthenticated || hasToken) && cart?.items && cart.items.length > 0) {
      fetchRegions();
    }
  }, [isAuthenticated, hasToken, cart]);

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
        setLoadingTowns(true);
        setTowns([]);
        setSelectedTown(null);
        const response = await apiClient.getTowns(selectedRegion!);
        if (response.status && response.data) {
          setTowns(response.data);
          
          // If we're pre-populating and have a user town_id, set it
          if (hasPrepopulated && user?.town_id && !selectedTown) {
            const townExists = response.data.some((t: Town) => t.id === user.town_id);
            if (townExists) {
              setSelectedTown(user.town_id);
              const townObj = response.data.find((t: Town) => t.id === user.town_id);
              if (townObj?.delivery_fee) {
                setDeliveryFee(Number(townObj.delivery_fee));
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching towns:", error);
        toast.error("Failed to load towns");
      } finally {
        setLoadingTowns(false);
      }
    }

    fetchTowns();
  }, [selectedRegion, user?.town_id, hasPrepopulated]);

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
          setDeliveryFee(Number(response.data.fee) || 0);
        }
      } catch (error) {
        console.error("Error calculating delivery fee:", error);
      }
    }

    calculateFee();
  }, [selectedRegion, selectedTown]);

  const subtotal = Number(adjustedTotalPrice) || 0;
  const actualDeliveryFee = deliveryMethod === 'pickup' ? 0 : Number(deliveryFee);
  const finalTotal = subtotal + actualDeliveryFee - Number(discountAmount);

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '',
    tx_ref: `NB-${Date.now()}`,
    amount: Math.round(finalTotal),
    currency: 'UGX',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.email || '',
      phone_number: user?.phone || '',
      name: `${user?.first_name || user?.name || ''} ${user?.last_name || ''}`,
    },
    customizations: {
      title: 'NutriBlend Haven',
      description: 'Payment for wellness products',
      logo: 'https://nutriblendhaven.com/logo.png',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

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
    if (deliveryMethod === 'delivery') {
      const errors: Record<string, string> = {};
      if (!selectedRegion) errors.region = "Please select a delivery region";
      if (!selectedTown) errors.town = "Please select a delivery town";
      if (!address.trim()) errors.address = "Please enter your delivery address";

      if (Object.keys(errors).length > 0) {
        setCheckoutErrors(errors);
        toast.error("Please fill in all delivery details");
        return;
      }
    }

    try {
      setLoading(true);

      const orderData: any = {
        items: (cart?.items || []).map((item: any) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          variation_id: item.variation_id,
        })),
        delivery_method: deliveryMethod,
        delivery_fee: deliveryMethod === 'pickup' ? 0 : (Number(deliveryFee) || 0),
        discount_code: discountCode || undefined,
        notes: notes || undefined,
        payment_method: paymentMethod,
      };

      if (deliveryMethod === 'delivery') {
        orderData.delivery_region_id = selectedRegion;
        orderData.delivery_town_id = selectedTown;
        orderData.delivery_address = address;
      } else {
        orderData.delivery_address = 'Store Pickup - Shop C212, Nakivubo Trading Center, Kampala';
      }

      if (paymentMethod === 'flutterwave') {
        handleFlutterPayment({
          callback: async (response) => {
            if (response.status === "successful") {
              const apiOrderData = { ...orderData, payment_id: response.transaction_id };
              const apiResponse = await apiClient.createOrder(apiOrderData);

              if (apiResponse.status && apiResponse.data) {
                toast.success("Order placed and payment successful!");
                await dispatch(clearCartAsync()).unwrap();
                router.push(`/account/order`);
              } else {
                toast.error(apiResponse.message || "Failed to finalize order");
              }
            } else {
              toast.error("Payment failed or cancelled");
            }
            closePaymentModal();
          },
          onClose: () => {
            setLoading(false);
          },
        });
        return;
      }

      const response = await apiClient.createOrder(orderData);

      if (response.status && response.data) {
        toast.success("Order placed successfully!");

        // Clear cart from backend and Redux state
        try {
          await dispatch(clearCartAsync()).unwrap();
        } catch {
          // Cart clear failed silently — order was still placed
        }
        sessionStorage.removeItem('checkoutCart');

        // Redirect to orders tab
        router.push(`/account/order`);
      } else {
        if ((response.message || '').toLowerCase().includes('unauthenticated')) {
          toast.error('Session expired. Please log in again.');
          router.push('/login');
          return;
        }
        toast.error(response.message || "Failed to create order");
      }
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast.error(error.message || "Failed to place order");
    } finally {
      if (paymentMethod !== 'flutterwave') {
        setLoading(false);
      }
    }
  };

  if (!cart || (!isAuthenticated && !authLoading) || cartLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-frame mx-auto px-4 py-4 flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
        </header>
        <main className="max-w-frame mx-auto px-4 py-6 md:py-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="lg:w-2/3 space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                    <Skeleton className="w-7 h-7 rounded-full" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-12 w-full" />
                    {i === 2 && <Skeleton className="h-24 w-full" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <Skeleton className="h-14 w-full" />
                <div className="p-5 space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-frame mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Checkout</h1>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <svg className="h-4 w-4 text-[#009E3C]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="max-w-frame mx-auto px-4 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

            {/* Left Column — Form */}
            <div className="lg:w-2/3 space-y-5">
              <fieldset disabled={loading} className="space-y-5 border-none p-0 m-0">

                {/* Step 1: Customer Info */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#009E3C] text-white text-xs font-bold flex items-center justify-center">1</span>
                    <h2 className="font-semibold text-gray-900">Customer Information</h2>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#009E3C] flex items-center justify-center text-white font-bold text-sm shadow-[0_4px_10px_rgba(0,158,60,0.30)]">
                        {(user?.first_name || user?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user?.first_name || user?.name?.split(' ')[0]} {user?.last_name || (user?.name?.split(' ').slice(1).join(' ') || '')}</p>
                        <p className="text-sm text-gray-500">{user?.email}{user?.phone ? ` · ${user.phone}` : ''}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Delivery */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#009E3C] text-white text-xs font-bold flex items-center justify-center">2</span>
                    <h2 className="font-semibold text-gray-900">Delivery Method</h2>
                  </div>
                  <div className="p-5 space-y-4">
                    {/* Delivery Method Toggle */}
                    <div className="grid grid-cols-2 gap-3">
                      <label htmlFor="deliveryMethodDelivery" className={`border-2 rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-all duration-200 ${deliveryMethod === 'delivery' ? 'border-[#009E3C] bg-[#009E3C]/5' : 'border-gray-200 hover:border-gray-300'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                          id="deliveryMethodDelivery"
                          name="deliveryMethod"
                          type="radio"
                          disabled={loading}
                          className="h-4 w-4 accent-[#009E3C]"
                          checked={deliveryMethod === 'delivery'}
                          onChange={() => {
                            setDeliveryMethod('delivery');
                          }}
                        />
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                          </svg>
                          <span className="text-sm font-medium text-gray-800">Delivery</span>
                        </div>
                      </label>

                      <label htmlFor="deliveryMethodPickup" className={`border-2 rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-all duration-200 ${deliveryMethod === 'pickup' ? 'border-[#009E3C] bg-[#009E3C]/5' : 'border-gray-200 hover:border-gray-300'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                          id="deliveryMethodPickup"
                          name="deliveryMethod"
                          type="radio"
                          disabled={loading}
                          className="h-4 w-4 accent-[#009E3C]"
                          checked={deliveryMethod === 'pickup'}
                          onChange={() => {
                            setDeliveryMethod('pickup');
                            setSelectedRegion(null);
                            setSelectedTown(null);
                            setDeliveryFee(0);
                          }}
                        />
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-800">Store Pickup</span>
                        </div>
                      </label>
                    </div>

                    {deliveryMethod === 'pickup' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-green-800 mb-1">Pickup Location</p>
                        <p className="text-sm text-green-700">Shop C212, Nakivubo Trading Center, Kampala, Uganda</p>
                        <p className="text-xs text-green-600 mt-1">Mon–Sat: 8:00 AM – 7:00 PM | Sun: 10:00 AM – 5:00 PM</p>
                      </div>
                    )}

                    {deliveryMethod === 'delivery' && (
                    <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Region */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Region</label>
                        <SearchableSelect
                          value={selectedRegion ? String(selectedRegion) : ""}
                          onChange={(value) => {
                            if (!value) {
                              setSelectedRegion(null);
                              return;
                            }
                            setSelectedRegion(Number(value));
                            if (checkoutErrors.region) setCheckoutErrors((prev) => ({ ...prev, region: undefined }));
                          }}
                          options={regions.map((region) => ({ value: String(region.id), label: region.name }))}
                          placeholder="Select Region"
                          disabled={loadingRegions || loading}
                          className={`w-full border rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none transition-colors text-left ${checkoutErrors.region ? 'border-red-400 bg-red-50' : 'border-gray-300'} ${loading ? 'bg-gray-50' : ''}`}
                        />
                        {checkoutErrors.region && (
                          <p className="mt-1 text-xs text-red-500">{checkoutErrors.region}</p>
                        )}
                      </div>

                      {/* Town */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Town</label>
                        <SearchableSelect
                          value={selectedTown ? String(selectedTown) : ""}
                          onChange={(value) => {
                            if (!value) {
                              setSelectedTown(null);
                              setDeliveryFee(0);
                              return;
                            }

                            const townId = Number(value);
                            setSelectedTown(townId);
                            if (checkoutErrors.town) setCheckoutErrors((prev) => ({ ...prev, town: undefined }));
                            const selectedTownObj = towns.find((t) => t.id === townId);
                            if (selectedTownObj?.delivery_fee) {
                              setDeliveryFee(selectedTownObj.delivery_fee);
                            }
                          }}
                          options={towns.map((town) => ({
                            value: String(town.id),
                            label: `${town.name}${town.delivery_fee ? ` (Fee: UGX ${Number(town.delivery_fee).toLocaleString()})` : ""}`,
                          }))}
                          placeholder={loadingTowns ? "Loading towns..." : "Select Town"}
                          disabled={!selectedRegion || loadingTowns || loading}
                          isLoading={loadingTowns}
                          className={`w-full border rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none transition-colors text-left ${checkoutErrors.town ? 'border-red-400 bg-red-50' : 'border-gray-300'} ${loading ? 'bg-gray-50' : ''}`}
                        />
                        {checkoutErrors.town && (
                          <p className="mt-1 text-xs text-red-500">{checkoutErrors.town}</p>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address</label>
                      <textarea
                        value={address}
                        disabled={loading}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          if (checkoutErrors.address) setCheckoutErrors((prev) => ({ ...prev, address: undefined }));
                        }}
                        placeholder="e.g. Plot 12, Kampala Road, near Total Petrol Station..."
                        className={`w-full border rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none transition-colors resize-none ${checkoutErrors.address ? 'border-red-400 bg-red-50' : 'border-gray-300'} ${loading ? 'bg-gray-50' : ''}`}
                        rows={3}
                      />
                      {checkoutErrors.address && (
                        <p className="mt-1 text-xs text-red-500">{checkoutErrors.address}</p>
                      )}
                    </div>
                    </>
                    )}

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Order Notes <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <textarea
                        value={notes}
                        disabled={loading}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special instructions for delivery..."
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none transition-colors resize-none ${loading ? 'bg-gray-50' : ''}`}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Payment */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#009E3C] text-white text-xs font-bold flex items-center justify-center">3</span>
                    <h2 className="font-semibold text-gray-900">Payment Method</h2>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={`border-2 rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-all duration-200 ${paymentMethod === 'cod' ? 'border-[#009E3C] bg-[#009E3C]/5' : 'border-gray-200 hover:border-gray-300'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                          type="radio"
                          disabled={loading}
                          className="h-4 w-4 accent-[#009E3C]"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                        />
                        <div className="flex items-center gap-2.5">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-800">Cash on Delivery</span>
                        </div>
                      </label>

                      <label className={`border-2 rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-all duration-200 ${paymentMethod === 'flutterwave' ? 'border-[#009E3C] bg-[#009E3C]/5' : 'border-gray-200 hover:border-gray-300'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                          type="radio"
                          disabled={loading}
                          className="h-4 w-4 accent-[#009E3C]"
                          checked={paymentMethod === 'flutterwave'}
                          onChange={() => setPaymentMethod('flutterwave')}
                        />
                        <div className="flex items-center gap-2.5">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-800">Card / Mobile Money</span>
                        </div>
                      </label>
                    </div>

                    {/* Manual Payment Note */}
                    <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-100">
                      <h3 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Supported Payment Methods
                      </h3>
                      <div className="flex flex-wrap gap-3 mb-3">
                        <span className="px-2 py-1 bg-white rounded border border-amber-200 text-[10px] font-bold text-amber-700">MTN</span>
                        <span className="px-2 py-1 bg-white rounded border border-amber-200 text-[10px] font-bold text-amber-700">Airtel</span>
                        <span className="px-2 py-1 bg-white rounded border border-amber-200 text-[10px] font-bold text-amber-700">Visa</span>
                        <span className="px-2 py-1 bg-white rounded border border-amber-200 text-[10px] font-bold text-amber-700">Cash</span>
                      </div>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        <strong>Note:</strong> We don't handle MTN/Airtel Money directly via the site. If you choose Mobile Money, you must perform the transaction manually to our merchant code provided after confirmation.
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>

            {/* Right Column — Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm sticky top-20">
                <div className="bg-gradient-to-br from-[#009E3C] to-[#007a2e] px-5 py-4">
                  <h2 className="font-semibold text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    Order Summary
                  </h2>
                </div>

                <div className="p-5">
                  {/* Items */}
                  <div className="space-y-3 mb-5">
                    {cart.items.map((item: any, index: number) => {
                      const itemPrice = Number(item.unit_price || item.price || item.product?.price || 0);
                      return (
                      <div key={index} className="flex justify-between items-start text-sm">
                        <div className="flex-1 min-w-0 mr-3">
                          <span className="text-gray-700 font-medium line-clamp-1">{item.name || item.product?.name}</span>
                          {item.short_description && (
                            <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{item.short_description}</p>
                          )}
                          <span className="text-gray-400 text-xs"> × {item.quantity}</span>
                        </div>
                        <span className="font-semibold text-gray-900 whitespace-nowrap">UGX {(itemPrice * item.quantity).toLocaleString()}</span>
                      </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-2.5 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium text-gray-900">UGX {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Delivery Fee</span>
                      <span className="font-medium text-gray-900">{deliveryMethod === 'pickup' ? 'Free (Pickup)' : deliveryFee > 0 ? `UGX ${deliveryFee.toLocaleString()}` : 'Free'}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-[#009E3C]">
                        <span>Discount</span>
                        <span>-UGX {discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Discount Code */}
                  <div className="mb-5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        disabled={loading}
                        placeholder="Enter promo code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className={`flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none text-sm ${loading ? 'bg-gray-50 opacity-70' : ''}`}
                      />
                      <button
                        onClick={handleApplyDiscount}
                        disabled={loading || !discountCode.trim()}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium disabled:bg-gray-400"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-5">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">UGX {Math.round(finalTotal).toLocaleString()}</span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || (deliveryMethod === 'delivery' && (!selectedRegion || !selectedTown || !address))}
                    className="w-full bg-[#009E3C] text-white py-3.5 rounded-xl font-bold hover:bg-[#00752C] transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,158,60,0.30)] hover:shadow-[0_6px_20px_rgba(0,158,60,0.40)] disabled:shadow-none active:scale-[0.98]"
                  >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {loading ? 'Processing...' : 'Confirm Order'}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                    By placing your order, you agree to our{' '}
                    <a href="/terms" className="underline hover:text-gray-600">Terms & Conditions</a>.
                  </p>
                </div>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}