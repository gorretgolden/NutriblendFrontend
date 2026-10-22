'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient, getImageUrl, formatPrice } from "@/lib/api/client";
import { 
  FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, 
  FiChevronLeft, FiMapPin, FiCreditCard, FiCalendar, FiLoader
} from "react-icons/fi";
import Link from "next/link";
import { toast } from "sonner";

interface OrderDetailClientProps {
  id: string;
}

export default function OrderDetailClient({ id }: OrderDetailClientProps) {
  const orderNumber = id;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async (isPolling = false) => {
      try {
        const response = await apiClient.getOrder(orderNumber);
        if (response.status && response.data) {
          setOrder(response.data);
        } else if (!isPolling) {
          toast.error(response.message || "Order not found");
          router.push('/account/order');
        }
      } catch (error) {
        if (!isPolling) {
          console.error("Failed to fetch order", error);
          toast.error("Failed to load order details");
        }
      } finally {
        if (!isPolling) setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
      
      // Auto-refresh order status every 15 seconds
      const interval = setInterval(() => {
        fetchOrder(true);
      }, 15000);
      
      return () => clearInterval(interval);
    }
  }, [orderNumber, router]);

  const getStatusInfo = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return { label: "Pending", color: "text-yellow-600 bg-yellow-50 border-yellow-100", icon: <FiClock /> };
      case "processing": return { label: "Processing", color: "text-blue-600 bg-blue-50 border-blue-100", icon: <FiTruck /> };
      case "approved": return { label: "Approved", color: "text-green-600 bg-green-50 border-green-100", icon: <FiCheckCircle /> };
      case "completed": case "delivered": return { label: "Completed", color: "text-green-600 bg-green-50 border-green-100", icon: <FiCheckCircle /> };
      case "rejected": return { label: "Rejected", color: "text-red-600 bg-red-50 border-red-100", icon: <FiXCircle /> };
      case "cancelled": return { label: "Cancelled", color: "text-red-600 bg-red-50 border-red-100", icon: <FiXCircle /> };
      default: return { label: status, color: "text-gray-600 bg-gray-50 border-gray-100", icon: <FiPackage /> };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FiLoader className="w-10 h-10 text-[#009E3C] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading order details...</p>
      </div>
    );
  }

  if (!order) return null;

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="max-w-4xl animate-in fade-in duration-500">
      {/* Top Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/account/order"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
        >
          <FiChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-sm text-gray-500 mt-0.5">Order #{order.order_number}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border ${statusInfo.color}`}>
                  {React.cloneElement(statusInfo.icon as React.ReactElement, { className: "w-5 h-5" })}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Status</p>
                  <p className={`text-sm font-bold ${statusInfo.color.split(' ')[0]}`}>{statusInfo.label}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Date</p>
                <p className="text-sm font-bold text-gray-700">
                  {new Date(order.created_at).toLocaleString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                    hour: "2-digit", minute: "2-digit"
                  })}
                </p>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiPackage className="text-[#009E3C]" />
                Items ({order.items?.length || 0})
              </h3>
              <div className="space-y-4">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                      <img 
                        src={getImageUrl(item.product?.product_images?.[0]?.image_url || item.product?.images?.[0])} 
                        alt={item.product?.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.product?.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          item.product?.wholesale_price > 0 && Number(item.unit_price) <= Number(item.product?.wholesale_price)
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {item.product?.wholesale_price > 0 && Number(item.unit_price) <= Number(item.product?.wholesale_price) 
                            ? `Wholesale (${item.product?.wholesale_unit_name || item.product?.unit || 'Unit'})` 
                            : `Retail (${item.product?.unit_name || item.product?.unit || 'Unit'})`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatPrice(Number(item.total_price))}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{formatPrice(Number(item.unit_price))} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery & Notes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiMapPin className="text-[#009E3C]" />
                    Delivery Address
                  </h3>
                  <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="font-bold text-gray-800 mb-1">{order.user?.name}</p>
                    <p>{order.delivery_address}</p>
                    <p className="mt-1 font-medium">{order.town?.name}, {order.region?.name}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiCalendar className="text-[#009E3C]" />
                    Order Notes
                  </h3>
                  <div className="text-sm text-gray-600 italic bg-gray-50 p-4 rounded-xl border border-gray-100 min-h-[100px]">
                    {Array.isArray(order.notes)
                      ? (order.notes.length > 0
                        ? order.notes.map((note: any, idx: number) => (
                            <p key={idx}>{typeof note === 'string' ? note : note.body}</p>
                          ))
                        : "No special instructions provided for this order.")
                      : (order.notes || "No special instructions provided for this order.")}
                  </div>
                </div>
             </div>
          </div>
          
          {/* Payment History */}
          {order.payments && order.payments.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCreditCard className="text-[#009E3C]" />
                Payment History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-50">
                      <th className="pb-3 font-semibold text-gray-500">Date</th>
                      <th className="pb-3 font-semibold text-gray-500">Method</th>
                      <th className="pb-3 font-semibold text-gray-500 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {order.payments.map((payment: any, pIdx: number) => (
                      <tr key={pIdx}>
                        <td className="py-3 text-gray-600">
                          {new Date(payment.created_at).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric"
                          })}
                        </td>
                        <td className="py-3 text-gray-700 font-medium capitalize">{payment.payment_method}</td>
                        <td className="py-3 text-gray-900 font-bold text-right">{formatPrice(Number(payment.amount))}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-100">
                      <td colSpan={2} className="pt-3 font-bold text-gray-900">Total Paid</td>
                      <td className="pt-3 font-bold text-[#009E3C] text-right">
                        {formatPrice(order.payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
            <h3 className="text-sm font-bold text-gray-900 mb-5">Order Summary</h3>
            <div className="space-y-3 pb-5 border-b border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">{formatPrice(Number(order.total_price))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-medium text-gray-900">{formatPrice(Number(order.delivery_fee))}</span>
              </div>
              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between text-sm text-red-500">
                  <span>Discount</span>
                  <span>-{formatPrice(Number(order.discount_amount))}</span>
                </div>
              )}
            </div>
            <div className="pt-5 flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-[#009E3C]">{formatPrice(Number(order.grand_total))}</span>
            </div>

            <div className="mt-8 space-y-3">
               <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <FiCreditCard className="text-gray-400 w-5 h-5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Payment Method</p>
                    <p className="text-xs font-bold text-gray-700 capitalize">{(order.chosen_payment_method || order.payment_method || 'COD').replace(/_/g, ' ')}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <FiTruck className="text-gray-400 w-5 h-5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Delivery Status</p>
                    <p className="text-xs font-bold text-gray-700">{(order.delivery_status || 'Pending').replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
                  </div>
               </div>
            </div>

            {order.status === 'pending' && (new Date().getTime() - new Date(order.created_at).getTime() <= 10 * 60 * 1000) && (
              <button 
                className="w-full mt-6 py-3 px-4 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors"
                onClick={() => setIsCancelModalOpen(true)}
              >
                Cancel Order
              </button>
            )}

            <Link
              href={`https://api.whatsapp.com/send/?phone=256784640607&text=Hello, I have an inquiry about my order #${order.order_number}`}
              target="_blank"
              className="w-full mt-3 py-3 px-4 bg-[#009E3C] text-white rounded-xl text-sm font-bold hover:bg-[#00752C] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                onClick={() => setIsCancelModalOpen(false)}
              >
                No, Keep It
              </button>
              <button 
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
                onClick={() => {
                  setIsCancelModalOpen(false);
                  apiClient.cancelOrder(order.order_number).then(() => {
                    toast.success("Order cancelled");
                    window.location.reload();
                  });
                }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
