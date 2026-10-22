"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { apiClient, type TrackedOrder } from "@/lib/api/client";
import { isValidPhone, loadGuestContact } from "@/lib/guestCheckout";

const STEPS = [
  { key: 'pending', label: 'Placed' },
  { key: 'approved', label: 'Approved' },
  { key: 'processing', label: 'Preparing' },
  { key: 'shipped', label: 'On The Way' },
  { key: 'delivered', label: 'Completed' },
];

const STEP_ORDER: Record<string, number> = {
  pending: 0,
  approved: 1,
  processing: 2,
  shipped: 3,
  in_transit: 3,
  delivered: 4,
  completed: 4,
};

function formatDate(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function money(value: number) {
  return `UGX ${Math.round(Number(value) || 0).toLocaleString()}`;
}

export default function TrackOrderClient() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // The confirmation email links here with the order number already filled in.
  useEffect(() => {
    const fromLink = searchParams.get('order');
    if (fromLink) setOrderNumber(fromLink.trim());
    const saved = loadGuestContact();
    if (saved?.phone) setPhone(saved.phone);
  }, [searchParams]);

  const handleTrack = async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (!orderNumber.trim()) {
      setErrorMessage('Enter the order number from your confirmation message.');
      return;
    }
    if (!phone.trim() || !isValidPhone(phone)) {
      setErrorMessage('Enter the phone number you used for the order, for example 0771234567.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    try {
      const response = await apiClient.trackOrder(orderNumber, phone);
      if (response.status && response.data) {
        setOrder(response.data);
      } else {
        setOrder(null);
        setErrorMessage(response.message || 'We could not find that order.');
        toast.error(response.message || 'Order not found');
      }
    } catch {
      setErrorMessage('The connection failed. Please check your internet and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeStep = order ? STEP_ORDER[order.status] ?? -1 : -1;
  const isClosed = order ? order.status === 'cancelled' || order.status === 'rejected' : false;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">Track Your Order</h1>
          <p className="text-sm text-gray-500 mt-2">
            Use the order number and the phone number from when you ordered. No account needed.
          </p>
        </div>

        <form onSubmit={handleTrack} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="trackOrderNumber" className="block text-sm font-medium text-gray-700 mb-1.5">Order Number</label>
              <input
                id="trackOrderNumber"
                type="text"
                value={orderNumber}
                onChange={(e) => { setOrderNumber(e.target.value.toUpperCase()); setErrorMessage(''); }}
                placeholder="NB00123"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="trackPhone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input
                id="trackPhone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setErrorMessage(''); }}
                placeholder="0771234567"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#009E3C] text-white py-3.5 rounded-xl font-bold hover:bg-[#00752C] transition-all disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
            {submitting ? 'Checking...' : 'Find My Order'}
          </button>

          <p className="text-[11px] text-gray-400 text-center">
            Your phone number is sent to us when you press the button and is never shown in the web address.
          </p>
        </form>

        {order && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 md:px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order</p>
                <p className="text-lg font-black text-gray-900">{order.order_number}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Placed</p>
                <p className="text-sm font-bold text-gray-700">{formatDate(order.placed_at) || 'Not recorded'}</p>
              </div>
            </div>

            <div className="p-5 md:p-6 space-y-6">
              {isClosed ? (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-sm font-bold text-red-700 capitalize">Order {order.status}</p>
                  <p className="text-sm text-red-600 mt-1">{order.next_step}</p>
                </div>
              ) : (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 text-center">Progress</p>
                  <ol className="flex items-start justify-center gap-1 md:gap-2">
                    {STEPS.map((step, index) => {
                      const done = index <= activeStep;
                      return (
                        <li key={step.key} className="flex flex-col items-center w-16 md:w-24">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${done ? 'bg-[#009E3C] text-white' : 'bg-gray-100 text-gray-400'}`}>
                            {done ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : index + 1}
                          </span>
                          <span className={`mt-2 text-[10px] md:text-xs font-bold text-center ${done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}

              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 w-24 flex-shrink-0 pt-0.5">Next Step</span>
                  <p className="text-sm text-gray-700">{order.next_step}</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 w-24 flex-shrink-0 pt-0.5">Payment</span>
                  <p className="text-sm font-bold text-gray-900 capitalize">{String(order.payment_status).replace(/_/g, ' ')}</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 w-24 flex-shrink-0 pt-0.5">
                    {order.delivery_method === 'pickup' ? 'Pickup' : 'Delivery'}
                  </span>
                  <p className="text-sm text-gray-700">
                    {order.delivery_method === 'pickup'
                      ? `Collect at ${order.branch_name || 'our shop'}`
                      : `${order.branch_name ? order.branch_name + ', ' : ''}${order.delivery_status ? String(order.delivery_status).replace(/_/g, ' ') : 'not dispatched yet'}`}
                    {order.expected_delivery_date && ` by ${formatDate(order.expected_delivery_date)}`}
                  </p>
                </div>
                {order.delivered_at && (
                  <div className="flex items-start gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 w-24 flex-shrink-0 pt-0.5">Delivered</span>
                    <p className="text-sm text-gray-700">{formatDate(order.delivered_at)}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Items</p>
                <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {order.items.map((item, index) => (
                    <li key={`${item.product_name}-${index}`} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                      <span className="text-gray-800 font-medium">
                        <span className="text-gray-400 font-bold mr-2">{item.quantity} x</span>
                        {item.product_name}
                      </span>
                      <span className="font-bold text-gray-900 whitespace-nowrap">{money(item.total_price)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-gray-900">{money(order.totals.subtotal)}</span>
                </div>
                {Number(order.totals.discount_amount) > 0 && (
                  <div className="flex justify-between text-[#009E3C]">
                    <span>Discount</span>
                    <span className="font-bold">-{money(order.totals.discount_amount).replace('UGX ', 'UGX ')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">{order.delivery_method === 'pickup' ? 'Pickup' : 'Delivery'}</span>
                  <span className="font-bold text-gray-900">
                    {Number(order.totals.delivery_fee) > 0 ? money(order.totals.delivery_fee) : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2">
                  <span className="text-gray-900 font-bold">Total</span>
                  <span className="text-lg font-black text-gray-900">{money(order.totals.grand_total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Paid so far</span>
                  <span className="font-bold text-gray-900">{money(order.totals.amount_paid)}</span>
                </div>
                {Number(order.totals.balance) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Balance</span>
                    <span className="font-bold text-gray-900">{money(order.totals.balance)}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400">
                Anything wrong with this order? Call or WhatsApp us with the order number and we will fix it.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
