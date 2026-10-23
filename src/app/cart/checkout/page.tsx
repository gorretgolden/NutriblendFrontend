"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import { clearCartAsync, clearCartLocal, fetchCart } from "@/lib/features/carts/cartsSlice";
import { fetchUserProfile } from "@/lib/features/auth/authSlice";
import { apiClient, type Region, type Town } from "@/lib/api/client";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import SuccessModal from "@/components/checkout/SuccessModal";
import {
  isValidPhone,
  loadGuestContact,
  saveGuestContact,
  type GuestContact,
} from "@/lib/guestCheckout";

export default function Checkout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cart, adjustedTotalPrice, isLoading: cartLoading, error: cartError } = useAppSelector((state) => state.carts);
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
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [checkoutErrors, setCheckoutErrors] = useState<Record<string, string | undefined>>({});
  const [settings, setSettings] = useState<Record<string, any> | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isOrderSuccessful, setIsOrderSuccessful] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');
  const [guestContact, setGuestContact] = useState<GuestContact>({ name: '', phone: '', email: '' });
  const [rememberDetails, setRememberDetails] = useState(true);
  const [savedGuestContact, setSavedGuestContact] = useState<GuestContact | null>(null);
  const hasPrepopulated = useRef(false);
  const [activeStep, setActiveStep] = useState(1);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Staff (Admin / Super Admin / Branch Manager) order on behalf of clients:
  // they pick a retail or wholesale order type, edit each selling price, and
  // enter the client's details. Regular customers never see this panel.
  const isStaff = !!user && ['Admin', 'Super Admin', 'Branch Manager'].includes(user?.role || '');
  const [orderType, setOrderType] = useState<'retail' | 'wholesale'>('retail');
  const [staffClient, setStaffClient] = useState({ name: '', phone: '', email: '' });
  const [priceEdits, setPriceEdits] = useState<Record<number, string>>({});
  const priceSeedMode = useRef<'retail' | 'wholesale'>('retail');

  const catalogPriceFor = (item: any, mode: 'retail' | 'wholesale'): number => {
    const fallback = Number(item.price || item.product?.price || 0);
    if (mode === 'wholesale') {
      const wholesale = Number(item.wholesale_price);
      return wholesale > 0 ? wholesale : fallback;
    }
    const retail = Number(item.retail_price);
    return retail > 0 ? retail : fallback;
  };

  const staffUnitPrice = (index: number): number => {
    const item = (cart?.items || [])[index];
    if (!item) return 0;
    const raw = priceEdits[index];
    if (raw !== undefined && raw !== '') {
      const n = Number(raw);
      if (Number.isFinite(n) && n >= 0) return n;
    }
    return catalogPriceFor(item, orderType);
  };

  const staffSubtotal = isStaff && (cart?.items || []).length > 0
    ? (cart?.items || []).reduce((sum: number, item: any, i: number) => sum + staffUnitPrice(i) * item.quantity, 0)
    : 0;

  // Seed each editable price from the catalog for the chosen order type.
  // Toggling retail/wholesale reloads catalog prices; manual edits survive
  // while the mode stays the same.
  useEffect(() => {
    if (!isStaff || !cart?.items?.length) return;
    const modeChanged = priceSeedMode.current !== orderType;
    setPriceEdits((prev) => {
      const next: Record<number, string> = {};
      cart.items.forEach((item: any, i: number) => {
        next[i] = !modeChanged && prev[i] !== undefined ? prev[i] : String(catalogPriceFor(item, orderType));
      });
      return next;
    });
    priceSeedMode.current = orderType;
  }, [isStaff, cart?.items, orderType]);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiClient.getPublicSettings();
        if (res.status && res.data) {
          setSettings(res.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();
  }, []);

  // An account is optional here: a guest orders with a name and a phone number.
  useEffect(() => {
    // Don't touch the profile while auth state is still loading
    if (authLoading) return;

    if (isAuthenticated || hasToken) {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, hasToken, dispatch]);

  // Details saved by an earlier guest order on this device
  useEffect(() => {
    setSavedGuestContact(loadGuestContact());
  }, []);

  // Pre-populate logic
  useEffect(() => {
    // Don't redirect while auth state is still loading
    if (authLoading) return;

    if (!isOrderSuccessful && !showSuccessModal && !cartLoading && cart && cart.items.length === 0) {
      toast.error("Your cart is empty");
      router.push('/cart');
      return;
    }

    // A guest with nothing in the cart has no checkout to show
    if (!isAuthenticated && !hasToken && !isOrderSuccessful && !showSuccessModal && !cartLoading && !authLoading && !cart) {
      toast.error("Your cart is empty");
      router.push('/cart');
      return;
    }

    // Pre-populate location from user profile ONCE when user data becomes available
    if (user && !hasPrepopulated.current) {
      if (user.region_id && !selectedRegion) {
        setSelectedRegion(Number(user.region_id));
      }
      if (user.location && !address) {
        setAddress(user.location);
      }
      if (user.region_id || user.location) {
        hasPrepopulated.current = true;
      }
    }
  }, [isAuthenticated, authLoading, cart, cartLoading, router, user]);

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

    if (cart?.items && cart.items.length > 0) {
      fetchRegions();
    }
  }, [cart]);

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
          
          // If we have a user town_id and no town is selected yet, set it
          if (user?.town_id && !selectedTown) {
            const townExists = response.data.some((t: Town) => t.id === Number(user.town_id));
            if (townExists) {
              const townId = Number(user.town_id);
              setSelectedTown(townId);
              const townObj = response.data.find((t: Town) => t.id === townId);
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
  }, [selectedRegion, user?.town_id]);

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

  const subtotal = isStaff ? staffSubtotal : (Number(adjustedTotalPrice) || 0);
  const actualDeliveryFee = deliveryMethod === 'pickup' ? 0 : Number(deliveryFee);
  const finalTotal = subtotal + actualDeliveryFee - Number(discountAmount);

  // Payment method is recorded on the order — no online payment gateway.

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error("Please enter a discount code");
      return;
    }

    try {
      const response = await apiClient.validateDiscount({
        code: discountCode,
        total_amount: subtotal + deliveryFee,
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
    const errors: Record<string, string> = {};

    if (!isAuthenticated || isStaff) {
      const contact = isStaff ? staffClient : guestContact;
      if (!contact.name.trim()) errors.customer_name = isStaff ? "Please enter the client's full name" : "Please enter your full name";
      if (!contact.phone.trim()) {
        errors.customer_phone = isStaff ? "Please enter the client's phone number" : "Please enter the phone number we should call about this order";
      } else if (!isValidPhone(contact.phone)) {
        errors.customer_phone = "That phone number looks incomplete. Use 10 digits, for example 0771234567.";
      }
      if (contact.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
        errors.customer_email = "Check the email address, it is missing an @ or a domain";
      }
    }

    if (deliveryMethod === 'delivery') {
      if (!selectedRegion) errors.region = "Please select a delivery region";
      if (!selectedTown) errors.town = "Please select a delivery town";
      if (!address.trim()) errors.address = "Please enter your delivery address";
    }

    if (Object.keys(errors).length > 0) {
      setCheckoutErrors(errors);
      const fields = [
        errors.customer_name && 'your name',
        errors.customer_phone && 'your phone number',
        errors.customer_email && 'your email address',
        errors.region && 'delivery region',
        errors.town && 'delivery town',
        errors.address && 'delivery address',
      ].filter(Boolean).join(', ');
      toast.error(`Please check ${fields}`);
      return;
    }

    try {
      setLoading(true);

      const orderData: any = {
        items: (cart?.items || []).map((item: any, i: number) => {
          const line: any = {
            product_id: item.product_id,
            quantity: item.quantity,
            variation_id: item.variation_id,
          };
          // Staff always send the selling price shown in their pricing panel,
          // so the order uses it instead of the catalog selling price.
          if (isStaff) {
            line.unit_price = staffUnitPrice(i);
          }
          return line;
        }),
        delivery_method: deliveryMethod,
        delivery_fee: deliveryMethod === 'pickup' ? 0 : (Number(deliveryFee) || 0),
        discount_code: discountCode || undefined,
        notes: notes || undefined,
        payment_method: paymentMethod,
        chosen_payment_method: paymentMethod,
      };

      if (isStaff) {
        // Staff order on behalf of a client: the order keeps the staff member
        // as its creator and records the client's details on it.
        orderData.price_mode = orderType;
        orderData.customer_name = staffClient.name.trim();
        orderData.customer_phone = staffClient.phone.trim();
        orderData.customer_email = staffClient.email.trim() || undefined;
      } else if (!isAuthenticated) {
        // Guests identify themselves on the order itself, not through an account.
        orderData.customer_name = guestContact.name.trim();
        orderData.customer_phone = guestContact.phone.trim();
        orderData.customer_email = guestContact.email.trim() || undefined;
      }

      if (deliveryMethod === 'delivery') {
        orderData.delivery_region_id = selectedRegion;
        orderData.delivery_town_id = selectedTown;
        orderData.delivery_address = address;
      } else {
        orderData.delivery_address = `Store Pickup - ${settings?.address || 'Shop C212, Nakivubo Trading Center, Kampala'}`;
      }

      // All payment methods just place the order — money is handled manually offline.

      const response = await apiClient.createOrder(orderData);

      if (response.status && response.data) {
        // Show Success Modal
        setPlacedOrderNumber((response.data as any).order_number || '');
        setShowSuccessModal(true);
        setIsOrderSuccessful(true);

        if (!isAuthenticated) {
          dispatch(clearCartLocal());
          if (rememberDetails) {
            saveGuestContact({
              name: guestContact.name.trim(),
              phone: guestContact.phone.trim(),
              email: guestContact.email.trim(),
            });
          }
        } else {
          // Clear cart from backend and Redux state
          try {
            await dispatch(clearCartAsync()).unwrap();
          } catch {
            // Cart clear failed silently — order was still placed
          }
        }
        sessionStorage.removeItem('checkoutCart');

        // Redirect is handled by the modal after a delay
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
      // ALWAYS set loading to false in finally block to avoid "endless processing"
      setLoading(false);
    }
  };

  // Track which checkout section is on screen so the step chips stay in sync,
  // and let a chip scroll back to its section.
  const steps = [
    { id: 1, full: isStaff ? 'Client Details' : (isAuthenticated ? 'Customer Information' : 'Your Details'), short: 'Details' },
    { id: 2, full: 'Delivery Details', short: 'Delivery' },
    { id: 3, full: 'Payment Method', short: 'Payment' },
  ];

  useEffect(() => {
    const sections = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const topEntry = visible[0];
        if (!topEntry) return;
        const index = sections.indexOf(topEntry.target as HTMLDivElement);
        if (index >= 0) setActiveStep(index + 1);
      },
      { rootMargin: '-25% 0px -60% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [cart]);

  const scrollToStep = (step: number) => {
    setActiveStep(step);
    stepRefs.current[step - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Cart failed to load (timeout/network) — offer retry instead of an endless spinner
  if (!isOrderSuccessful && !showSuccessModal && !cart && !cartLoading && !authLoading && (isAuthenticated || hasToken)) {
    return (
      <div className="min-h-screen bg-[#f4f6f9]">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-frame mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/cart')} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Back to cart">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Checkout</h1>
            </div>
          </div>
        </header>

        <main className="max-w-frame mx-auto px-4 py-10 md:py-16">
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-[#009E3C] via-[#009E3C]/40 to-transparent" />
            <div className="p-6 md:p-8 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#009E3C]/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#009E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-bold text-gray-900">Couldn&apos;t load your cart</h2>
              <p className="mt-1.5 text-sm text-gray-500">
                {cartError || "The connection timed out. Please check your internet and try again."}
              </p>
              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={() => dispatch(fetchCart() as any)}
                  className="px-5 py-2.5 bg-[#009E3C] text-white rounded-xl text-sm font-bold hover:bg-[#00752C] transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/cart')}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!isOrderSuccessful && !showSuccessModal && (!cart || cartLoading || authLoading)) {
    return (
      <div className="min-h-screen bg-[#f4f6f9]">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-frame mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/cart')} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Back to cart">
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
          {/* Wait card */}
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-[#009E3C] via-[#009E3C]/40 to-transparent" />
            <div className="p-6 md:p-8 text-center">
              <div className="relative w-14 h-14 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-[#009E3C]/10" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#009E3C] animate-spin" />
                <svg className="absolute inset-0 m-auto h-6 w-6 text-[#009E3C]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="mt-5 text-lg font-bold text-gray-900">Preparing your checkout</h2>
              <p className="mt-1.5 text-sm text-gray-500">Fetching your cart, delivery areas and payment options.</p>

              {/* Step preview */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-y-3 gap-x-1">
                {['Your Details', 'Delivery', 'Payment'].map((step, i) => (
                  <div key={step} className="flex items-center">
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ${i === 0 ? 'bg-[#009E3C] text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {i + 1}
                    </span>
                    <span className={`ml-2 text-xs font-semibold ${i === 0 ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
                    {i < 2 && <span className="w-6 h-px bg-gray-200 mx-2" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skeleton of the checkout layout */}
          <div className="mt-6 flex flex-col lg:flex-row gap-6 lg:gap-8 animate-pulse">
            <div className="lg:w-2/3 space-y-5">
              {[1, 2, 3].map((step) => (
                <div key={step} className="bg-white rounded-xl border border-gray-200/70 overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-full bg-[#009E3C]/15 flex-shrink-0" />
                    <div className="h-4 w-36 bg-gray-200 rounded" />
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="h-4 w-3/4 bg-gray-100 rounded" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-11 bg-gray-100 rounded-xl" />
                      <div className="h-11 bg-gray-100 rounded-xl" />
                    </div>
                    <div className="h-11 w-full bg-gray-100 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                </div>
                <div className="p-5 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-full bg-gray-100 rounded" />
                        <div className="h-3.5 w-1/2 bg-gray-100 rounded" />
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-4 space-y-2.5">
                    <div className="h-3.5 w-full bg-gray-100 rounded" />
                    <div className="h-3.5 w-2/3 bg-gray-100 rounded" />
                  </div>
                  <div className="h-12 w-full bg-[#009E3C]/20 rounded-xl" />
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
            <Link href="/cart" aria-label="Back to cart" className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-gray-100 transition-colors group">
              <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 hidden sm:inline">Back</span>
            </Link>
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
        {/* Breadcrumb: always a way home or back to the cart */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm mb-2">
          <Link href="/" className="font-medium text-gray-500 hover:text-[#009E3C] transition-colors">Home</Link>
          <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/cart" className="font-medium text-gray-500 hover:text-[#009E3C] transition-colors">Cart</Link>
          <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span aria-current="page" className="font-semibold text-gray-900">Checkout</span>
        </nav>

        {/* Clickable step navigation */}
        <div className="sticky top-0 z-30 pb-4">
          <nav aria-label="Checkout steps" className="flex justify-center">
            <div className="inline-flex items-center bg-white rounded-full border border-gray-200 shadow-sm px-2 sm:px-3 py-1.5 gap-0.5 sm:gap-1">
              {steps.map((step, i) => (
                <div key={step.id} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => scrollToStep(step.id)}
                    aria-current={activeStep === step.id ? 'step' : undefined}
                    className={`flex items-center gap-1.5 sm:gap-2 rounded-full px-2 sm:px-3 py-1 text-xs font-bold transition-colors ${activeStep === step.id ? 'bg-[#009E3C]/10 text-[#009E3C]' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                  >
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${activeStep === step.id ? 'bg-[#009E3C] text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {step.id}
                    </span>
                    <span className="sm:hidden">{step.short}</span>
                    <span className="hidden sm:inline">{step.full}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <span className={`w-4 sm:w-6 h-px mx-0.5 sm:mx-1 ${activeStep > step.id ? 'bg-[#009E3C]/50' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

            {/* Left Column — Form */}
            <div className="lg:w-2/3 space-y-5">
              <fieldset disabled={loading} className="space-y-5 border-none p-0 m-0">

                {/* Staff: Order Type & Selling Prices */}
                {isStaff && (
                  <div className="bg-white rounded-xl border-2 border-[#009E3C]/25 overflow-hidden shadow-sm">
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-[#009E3C]/5">
                      <svg className="w-5 h-5 text-[#009E3C] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="min-w-0">
                        <h2 className="font-semibold text-gray-900">Order Type & Selling Prices</h2>
                        <p className="text-xs text-gray-500 truncate">Signed in as {user?.first_name || user?.name} (staff). This order will be recorded as made by you.</p>
                      </div>
                      <span className="ml-auto flex-shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#009E3C]">Staff Ordering</span>
                    </div>
                    <div className="p-5 space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">This order is for a...</p>
                        <div className="grid grid-cols-2 gap-3">
                          <label className={`border-2 rounded-xl p-3 cursor-pointer flex items-center gap-2.5 transition-all duration-200 ${orderType === 'retail' ? 'border-[#009E3C] bg-[#009E3C]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input
                              type="radio"
                              name="staffOrderType"
                              disabled={loading}
                              className="h-4 w-4 accent-[#009E3C]"
                              checked={orderType === 'retail'}
                              onChange={() => setOrderType('retail')}
                            />
                            <span className="text-sm font-medium text-gray-800">Retail Customer</span>
                          </label>
                          <label className={`border-2 rounded-xl p-3 cursor-pointer flex items-center gap-2.5 transition-all duration-200 ${orderType === 'wholesale' ? 'border-[#009E3C] bg-[#009E3C]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input
                              type="radio"
                              name="staffOrderType"
                              disabled={loading}
                              className="h-4 w-4 accent-[#009E3C]"
                              checked={orderType === 'wholesale'}
                              onChange={() => setOrderType('wholesale')}
                            />
                            <span className="text-sm font-medium text-gray-800">Wholesale Customer</span>
                          </label>
                        </div>
                        <p className="mt-2 text-xs text-gray-400">
                          {orderType === 'wholesale'
                            ? 'Wholesale prices are per box. The quantity in the cart is the number of boxes.'
                            : 'Retail prices are per unit.'}{' '}
                          Changing the type reloads each price from the catalog. You can still edit any price below.
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        {(cart?.items || []).map((item: any, i: number) => {
                          const catalog = catalogPriceFor(item, orderType);
                          const unit = staffUnitPrice(i);
                          const isEdited = Number(priceEdits[i]) !== catalog;
                          return (
                            <div key={i} className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/60">
                              <div className="flex-1 min-w-[200px]">
                                <p className="text-sm font-semibold text-gray-900 truncate">{item.name || item.product?.name}</p>
                                <p className="text-xs text-gray-500">
                                  {item.quantity} {orderType === 'wholesale' ? (item.quantity === 1 ? 'box' : 'boxes') : (item.quantity === 1 ? 'unit' : 'units')} · Catalog {orderType} price: UGX {catalog.toLocaleString()}
                                </p>
                              </div>
                              <label className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500">Selling price UGX</span>
                                <input
                                  type="number"
                                  min={0}
                                  step="any"
                                  disabled={loading}
                                  value={priceEdits[i] ?? ''}
                                  onChange={(e) => setPriceEdits((prev) => ({ ...prev, [i]: e.target.value }))}
                                  className={`w-36 border rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none transition-colors ${isEdited ? 'border-[#009E3C]/60 bg-[#009E3C]/5 font-bold' : 'border-gray-300'}`}
                                />
                              </label>
                              <span className="text-sm font-bold text-gray-900 w-32 text-right tabular-nums">
                                = UGX {(unit * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className="text-sm font-bold text-gray-900">Order total before delivery</span>
                        <span className="text-lg font-black text-gray-900 tabular-nums">UGX {staffSubtotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Customer Info */}
                <div ref={(el) => { stepRefs.current[0] = el; }} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm scroll-mt-24">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#009E3C] text-white text-xs font-bold flex items-center justify-center">1</span>
                    <h2 className="font-semibold text-gray-900">{isStaff ? 'Client Details' : (isAuthenticated ? 'Customer Information' : 'Your Details')}</h2>
                    {!isAuthenticated && (
                      <span className="ml-auto text-[11px] font-bold uppercase tracking-wider text-gray-400">No account needed</span>
                    )}
                    {isStaff && (
                      <span className="ml-auto text-[11px] font-bold uppercase tracking-wider text-[#009E3C]">On behalf of a client</span>
                    )}
                  </div>
                  <div className="p-5">
                    {isStaff ? (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                          Enter the details of the client this order is for. We use them to confirm the order and to find it again if they call us.
                        </p>

                        {(settings?.default_wholesale_customer?.name || settings?.default_wholesale_customer?.phone || settings?.default_retail_customer?.name || settings?.default_retail_customer?.phone) && (
                          <div className="flex flex-wrap gap-2">
                            {(settings?.default_wholesale_customer?.name || settings?.default_wholesale_customer?.phone) && (
                              <button
                                type="button"
                                onClick={() => setStaffClient({
                                  name: settings?.default_wholesale_customer?.name || '',
                                  phone: settings?.default_wholesale_customer?.phone || '',
                                  email: settings?.default_wholesale_customer?.email || '',
                                })}
                                className="border border-[#009E3C]/30 bg-[#009E3C]/5 text-[#009E3C] rounded-xl px-3.5 py-2 text-sm font-bold hover:bg-[#009E3C]/10 transition-colors"
                              >
                                Use default wholesale customer
                              </button>
                            )}
                            {(settings?.default_retail_customer?.name || settings?.default_retail_customer?.phone) && (
                              <button
                                type="button"
                                onClick={() => setStaffClient({
                                  name: settings?.default_retail_customer?.name || '',
                                  phone: settings?.default_retail_customer?.phone || '',
                                  email: settings?.default_retail_customer?.email || '',
                                })}
                                className="border border-[#009E3C]/30 bg-[#009E3C]/5 text-[#009E3C] rounded-xl px-3.5 py-2 text-sm font-bold hover:bg-[#009E3C]/10 transition-colors"
                              >
                                Use default retail customer
                              </button>
                            )}
                          </div>
                        )}

                        <div>
                          <label htmlFor="staffClientName" className="block text-sm font-medium text-gray-700 mb-1.5">Client Full Name</label>
                          <input
                            id="staffClientName"
                            type="text"
                            autoComplete="off"
                            disabled={loading}
                            value={staffClient.name}
                            onChange={(e) => {
                              setStaffClient((prev) => ({ ...prev, name: e.target.value }));
                              if (checkoutErrors.customer_name) setCheckoutErrors((prev) => ({ ...prev, customer_name: undefined }));
                            }}
                            placeholder="e.g. Aisha Namutebi"
                            className={`w-full border rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none transition-colors ${checkoutErrors.customer_name ? 'border-red-400 bg-red-50' : 'border-gray-300'} ${loading ? 'bg-gray-50' : ''}`}
                          />
                          {checkoutErrors.customer_name && (
                            <p className="mt-1 text-xs text-red-500">{checkoutErrors.customer_name}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="staffClientPhone" className="block text-sm font-medium text-gray-700 mb-1.5">Client Phone Number</label>
                          <input
                            id="staffClientPhone"
                            type="tel"
                            inputMode="tel"
                            autoComplete="off"
                            disabled={loading}
                            value={staffClient.phone}
                            onChange={(e) => {
                              setStaffClient((prev) => ({ ...prev, phone: e.target.value }));
                              if (checkoutErrors.customer_phone) setCheckoutErrors((prev) => ({ ...prev, customer_phone: undefined }));
                            }}
                            placeholder="0771234567"
                            className={`w-full border rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none transition-colors ${checkoutErrors.customer_phone ? 'border-red-400 bg-red-50' : 'border-gray-300'} ${loading ? 'bg-gray-50' : ''}`}
                          />
                          {checkoutErrors.customer_phone ? (
                            <p className="mt-1 text-xs text-red-500">{checkoutErrors.customer_phone}</p>
                          ) : (
                            <p className="mt-1 text-xs text-gray-400">The client will need this number to track the order.</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="staffClientEmail" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                          </label>
                          <input
                            id="staffClientEmail"
                            type="email"
                            autoComplete="off"
                            disabled={loading}
                            value={staffClient.email}
                            onChange={(e) => {
                              setStaffClient((prev) => ({ ...prev, email: e.target.value }));
                              if (checkoutErrors.customer_email) setCheckoutErrors((prev) => ({ ...prev, customer_email: undefined }));
                            }}
                            placeholder="you@example.com"
                            className={`w-full border rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none transition-colors ${checkoutErrors.customer_email ? 'border-red-400 bg-red-50' : 'border-gray-300'} ${loading ? 'bg-gray-50' : ''}`}
                          />
                          {checkoutErrors.customer_email ? (
                            <p className="mt-1 text-xs text-red-500">{checkoutErrors.customer_email}</p>
                          ) : (
                            <p className="mt-1 text-xs text-gray-400">Add one if the client wants the order confirmation by email.</p>
                          )}
                        </div>
                      </div>
                    ) : isAuthenticated ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#009E3C] flex items-center justify-center text-white font-bold text-sm shadow-[0_4px_10px_rgba(0,158,60,0.30)]">
                          {(user?.first_name || user?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user?.first_name || user?.name?.split(' ')[0]} {user?.last_name || (user?.name?.split(' ').slice(1).join(' ') || '')}</p>
                          <p className="text-sm text-gray-500">{user?.email}{user?.phone ? ` · ${user.phone}` : ''}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                          Just your name and a phone number. We use them to confirm the order and to find it again if you call us.
                        </p>

                        {savedGuestContact && !guestContact.name && !guestContact.phone && (
                          <button
                            type="button"
                            onClick={() => setGuestContact(savedGuestContact)}
                            className="w-full flex items-center justify-center gap-2 border border-[#009E3C]/30 bg-[#009E3C]/5 text-[#009E3C] rounded-xl px-4 py-2.5 text-sm font-bold hover:bg-[#009E3C]/10 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Use my details from last time
                          </button>
                        )}

                        <div>
                          <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                          <input
                            id="guestName"
                            type="text"
                            autoComplete="name"
                            disabled={loading}
                            value={guestContact.name}
                            onChange={(e) => {
                              setGuestContact((prev) => ({ ...prev, name: e.target.value }));
                              if (checkoutErrors.customer_name) setCheckoutErrors((prev) => ({ ...prev, customer_name: undefined }));
                            }}
                            placeholder="e.g. Aisha Namutebi"
                            className={`w-full border rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none transition-colors ${checkoutErrors.customer_name ? 'border-red-400 bg-red-50' : 'border-gray-300'} ${loading ? 'bg-gray-50' : ''}`}
                          />
                          {checkoutErrors.customer_name && (
                            <p className="mt-1 text-xs text-red-500">{checkoutErrors.customer_name}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="guestPhone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                          <input
                            id="guestPhone"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            disabled={loading}
                            value={guestContact.phone}
                            onChange={(e) => {
                              setGuestContact((prev) => ({ ...prev, phone: e.target.value }));
                              if (checkoutErrors.customer_phone) setCheckoutErrors((prev) => ({ ...prev, customer_phone: undefined }));
                            }}
                            placeholder="0771234567"
                            className={`w-full border rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none transition-colors ${checkoutErrors.customer_phone ? 'border-red-400 bg-red-50' : 'border-gray-300'} ${loading ? 'bg-gray-50' : ''}`}
                          />
                          {checkoutErrors.customer_phone ? (
                            <p className="mt-1 text-xs text-red-500">{checkoutErrors.customer_phone}</p>
                          ) : (
                            <p className="mt-1 text-xs text-gray-400">You will need this number to track the order.</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                          </label>
                          <input
                            id="guestEmail"
                            type="email"
                            autoComplete="email"
                            disabled={loading}
                            value={guestContact.email}
                            onChange={(e) => {
                              setGuestContact((prev) => ({ ...prev, email: e.target.value }));
                              if (checkoutErrors.customer_email) setCheckoutErrors((prev) => ({ ...prev, customer_email: undefined }));
                            }}
                            placeholder="you@example.com"
                            className={`w-full border rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none transition-colors ${checkoutErrors.customer_email ? 'border-red-400 bg-red-50' : 'border-gray-300'} ${loading ? 'bg-gray-50' : ''}`}
                          />
                          {checkoutErrors.customer_email ? (
                            <p className="mt-1 text-xs text-red-500">{checkoutErrors.customer_email}</p>
                          ) : (
                            <p className="mt-1 text-xs text-gray-400">Add one if you want the order confirmation by email.</p>
                          )}
                        </div>

                        <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rememberDetails}
                            onChange={(e) => setRememberDetails(e.target.checked)}
                            className="mt-0.5 h-4 w-4 accent-[#009E3C]"
                          />
                          <span>Remember these details on this device so my next order is faster</span>
                        </label>

                        <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                          <Link href="/login" className="font-bold text-[#009E3C] hover:text-[#00752C] transition-colors">
                            I already have an account
                          </Link>
                          <span className="text-gray-400">You can create an account with a password after this order.</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2: Delivery */}
                <div ref={(el) => { stepRefs.current[1] = el; }} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm scroll-mt-24">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#009E3C] text-white text-xs font-bold flex items-center justify-center">2</span>
                    <h2 className="font-semibold text-gray-900">{deliveryMethod === 'pickup' ? 'Pickup Location' : 'Delivery Details'}</h2>
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
                        <p className="text-sm text-green-700">{settings?.address || 'Shop C212, Nakivubo Trading Center, Kampala, Uganda'}</p>
                        <p className="text-xs text-green-600 mt-1">{settings?.opening_hours || 'Mon–Sat: 8:00 AM – 7:00 PM | Sun: 10:00 AM – 5:00 PM'}</p>
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
                <div ref={(el) => { stepRefs.current[2] = el; }} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm scroll-mt-24">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#009E3C] text-white text-xs font-bold flex items-center justify-center">3</span>
                    <h2 className="font-semibold text-gray-900">Payment Method</h2>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={`border-2 rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-all duration-200 ${paymentMethod === 'Cash' ? 'border-[#009E3C] bg-[#009E3C]/5' : 'border-gray-200 hover:border-gray-300'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                          type="radio"
                          disabled={loading}
                          className="h-4 w-4 accent-[#009E3C]"
                          checked={paymentMethod === 'Cash'}
                          onChange={() => setPaymentMethod('Cash')}
                        />
                        <div className="flex items-center gap-2.5">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-800">Cash</span>
                        </div>
                      </label>

                      <label className={`border-2 rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-all duration-200 ${paymentMethod === 'Mobile Money' ? 'border-[#009E3C] bg-[#009E3C]/5' : 'border-gray-200 hover:border-gray-300'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                          type="radio"
                          disabled={loading}
                          className="h-4 w-4 accent-[#009E3C]"
                          checked={paymentMethod === 'Mobile Money'}
                          onChange={() => setPaymentMethod('Mobile Money')}
                        />
                        <div className="flex items-center gap-2.5">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                          </svg>
                          <span className="text-sm font-medium text-gray-800">Mobile Money</span>
                        </div>
                      </label>
                    </div>

                    {/* Payment Info Note */}
                    <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
                      <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        How Payment Works
                      </h3>
                      <div className="flex flex-wrap gap-3 mb-3">
                        <span className="px-2 py-1 bg-white rounded border border-blue-200 text-[10px] font-bold text-blue-700">MTN MoMo</span>
                        <span className="px-2 py-1 bg-white rounded border border-blue-200 text-[10px] font-bold text-blue-700">Airtel Money</span>
                        <span className="px-2 py-1 bg-white rounded border border-blue-200 text-[10px] font-bold text-blue-700">Cash</span>
                      </div>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        <strong>Note:</strong> Your selected payment method will be recorded on the order. Our team will contact you to arrange and confirm payment after your order is approved.
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
                    Cart Summary
                  </h2>
                </div>

                <div className="p-5">
                  {/* Items */}
                  <div className="space-y-3 mb-5">
                    {(cart?.items || []).map((item: any, index: number) => {
                      const itemPrice = isStaff ? staffUnitPrice(index) : Number(item.unit_price || item.price || item.product?.price || 0);
                      return (
                      <div key={index} className="flex justify-between items-center text-sm group">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex-shrink-0 w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-gray-200">
                            {item.quantity}
                          </div>
                          <div className="min-w-0">
                            <p className="text-gray-900 font-semibold truncate leading-tight">{item.name || item.product?.name}</p>
                            {item.short_description && (
                              <p className="text-[10px] text-gray-400 truncate mt-0.5">{item.short_description}</p>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-gray-900 ml-4">UGX {(itemPrice * item.quantity).toLocaleString()}</span>
                      </div>
                      );
                    })}
                              <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Subtotal</span>
                      <span className="font-bold text-gray-900">UGX {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Delivery Fee</span>
                      <span className="font-bold text-gray-900">
                        {deliveryMethod === 'pickup' ? (
                          <span className="text-[#009E3C]">Free (Pickup)</span>
                        ) : deliveryFee > 0 ? (
                          `UGX ${deliveryFee.toLocaleString()}`
                        ) : (
                          <span className="text-[#009E3C]">Free</span>
                        )}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-[#009E3C] bg-[#009E3C]/5 px-3 py-2 rounded-lg">
                        <span className="font-medium">Discount Applied</span>
                        <span className="font-bold">-UGX {discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Delivery & Payment Preview */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 border border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                      {deliveryMethod === 'pickup' ? 'Pickup Location' : 'Delivery Address'}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-[#009E3C] flex-shrink-0 shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        {deliveryMethod === 'pickup' ? (
                          <p className="text-xs font-bold text-gray-700">Store Pickup (Kampala)</p>
                        ) : (
                          <div className="text-xs font-bold text-gray-700 leading-snug">
                            {selectedRegion ? regions.find(r => r.id === selectedRegion)?.name : <span className="text-gray-300 italic font-normal">Select region</span>}
                            {selectedTown && `, ${towns.find(t => t.id === selectedTown)?.name}`}
                            {address && <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">{address}</p>}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0 shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Payment Method</p>
                        <p className="text-xs font-bold text-gray-700">
                          {paymentMethod === 'Cash' ? 'Cash on Delivery' : paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Discount Code */}
                  <div className="mb-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        disabled={loading}
                        placeholder="Promo code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.replace(/-/g, ''))}
                        className={`flex-1 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none text-sm transition-all ${loading ? 'bg-gray-50 opacity-70' : ''}`}
                      />
                      <button
                        onClick={handleApplyDiscount}
                        disabled={loading || !discountCode.trim()}
                        className="bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all text-sm font-bold disabled:bg-gray-200 disabled:text-gray-400 shadow-sm active:scale-95"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-100 pt-5 mb-6">
                    <span className="text-gray-900 font-bold">Total Amount</span>
                    <span className="text-2xl font-black text-gray-900">UGX {Math.round(finalTotal).toLocaleString()}</span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full bg-[#009E3C] text-white py-4 rounded-xl font-bold hover:bg-[#00752C] transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:shadow-none disabled:hover:translate-y-0 flex items-center justify-center gap-3 shadow-[0_4px_14px_rgba(0,158,60,0.30)] hover:shadow-[0_6px_20px_rgba(0,158,60,0.40)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {loading ? 'Processing...' : 'Confirm Order'}
                  </button>

                  <p className="text-[11px] text-gray-400 text-center mt-5 leading-relaxed font-medium">
                    By confirming, you agree to our{' '}
                    <a href="/terms" className="underline hover:text-gray-600 transition-colors">Terms of Service</a>.
                  </p>
                </div>
              </div>
            </div>          </div>
        </div>
      </main>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderNumber={placedOrderNumber}
        isGuest={!isAuthenticated}
      />
    </div>
  );
}