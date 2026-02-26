'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient, getImageUrl, formatPrice } from "@/lib/api/client";
import { FiPackage, FiChevronRight, FiClock, FiCheckCircle, FiTruck, FiXCircle } from "react-icons/fi";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.getOrders();
        if (response.status && response.data) {
          // Backend returns paginated: { data: [...], current_page, ... }
          const rawData = response.data;
          const ordersArray = Array.isArray(rawData)
            ? rawData
            : (rawData as any).data || [];
          setOrders(ordersArray);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return <FiClock className="w-4 h-4" />;
      case "processing": return <FiTruck className="w-4 h-4" />;
      case "completed": case "delivered": return <FiCheckCircle className="w-4 h-4" />;
      case "cancelled": return <FiXCircle className="w-4 h-4" />;
      default: return <FiClock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "completed": case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <FiPackage className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const firstItem = order.items?.[0];
            const itemCount = order.items?.length || 0;
            const firstImage = firstItem?.product?.product_images?.[0]?.image_url
              || firstItem?.product?.images?.[0]?.image_url
              || firstItem?.product?.images?.[0];

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                onClick={() => router.push(`/account?tab=orders`)}
              >
                <div className="p-4 md:p-5">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-800">#{order.order_number}</span>
                      <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold capitalize ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Items Preview */}
                  <div className="flex items-center gap-4">
                    {firstImage && (
                      <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                        <img
                          src={getImageUrl(typeof firstImage === 'string' ? firstImage : firstImage.image_url || '')}
                          alt={firstItem?.product?.name || 'Product'}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {firstItem?.product?.name || 'Order'}
                        {itemCount > 1 && <span className="text-gray-500"> +{itemCount - 1} more</span>}
                      </p>
                      <p className="text-xs text-gray-500">
                        {itemCount} item{itemCount !== 1 ? 's' : ''} · {order.payment_status === 'paid' ? '✅ Paid' : '⏳ Payment pending'}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900">
                        {formatPrice(Number(order.grand_total || 0))}
                      </p>
                      <FiChevronRight className="w-4 h-4 text-gray-400 ml-auto mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}