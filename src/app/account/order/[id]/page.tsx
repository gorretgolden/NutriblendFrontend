'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient, getImageUrl, formatPrice } from "@/lib/api/client";
import { 
  FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, 
  FiChevronLeft, FiMapPin, FiCreditCard, FiCalendar, FiLoader
} from "react-icons/fi";
import Link from "next/link";
import { toast } from "sonner";

export default function OrderDetailPage() {
  const { id: orderNumber } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await apiClient.getOrder(orderNumber as string);
        if (response.status && response.data) {
          setOrder(response.data);
        } else {
          toast.error(response.message || "Order not found");
          router.push('/account/order');
        }
      } catch (error) {
        console.error("Failed to fetch order", error);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber, router]);

  const getStatusInfo = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return { label: "Pending", color: "text-yellow-600 bg-yellow-50 border-yellow-100", icon: <FiClock /> };
      case "processing": return { label: "Processing", color: "text-blue-600 bg-blue-50 border-blue-100", icon: <FiTruck /> };
      case "approved": return { label: "Approved", color: "text-green-600 bg-green-50 border-green-100", icon: <FiCheckCircle /> };
      case "completed": case "delivered": return { label: "Completed", color: "text-green-600 bg-green-50 border-green-100", icon: <FiCheckCircle /> };
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
                      <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
                      {/* Variation Label Removed as requested */}
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
                    {order.notes || "No special instructions provided for this order."}
                  </div>
                </div>
             </div>
          </div>
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
                    <p className="text-xs font-bold text-gray-700 uppercase">{order.payment_method || 'COD'}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <FiTruck className="text-gray-400 w-5 h-5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Delivery Status</p>
                    <p className="text-xs font-bold text-gray-700 capitalize">{order.delivery_status || 'Pending'}</p>
                  </div>
               </div>
            </div>

            {order.status === 'pending' && (new Date().getTime() - new Date(order.created_at).getTime() <= 10 * 60 * 1000) && (
              <button 
                className="w-full mt-6 py-3 px-4 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors"
                onClick={() => {
                  if(confirm("Are you sure you want to cancel this order?")) {
                    apiClient.cancelOrder(order.order_number).then(() => {
                      toast.success("Order cancelled");
                      window.location.reload();
                    });
                  }
                }}
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
    </div>
  );
}
