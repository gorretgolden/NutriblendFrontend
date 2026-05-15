'use client';

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { apiClient, getImageUrl, formatPrice } from "@/lib/api/client";
import Link from "next/link";
import SearchableSelect from "@/components/ui/SearchableSelect";
import {
  FiPackage, FiChevronRight, FiClock, FiCheckCircle, FiTruck,
  FiXCircle, FiFilter, FiChevronLeft, FiLoader
} from "react-icons/fi";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async (isPolling = false) => {
      try {
        if (!isPolling) setError(null);
        const response = await apiClient.getOrders();
        if (response.status && response.data) {
          const rawData = response.data;
          const ordersArray = Array.isArray(rawData)
            ? rawData
            : (rawData as any).data || [];
          setOrders(ordersArray);
        } else if (!isPolling) {
          setError(response.message || "Failed to load orders");
        }
      } catch (error: any) {
        if (!isPolling) {
          setError(error?.message || "Network error loading orders");
          setOrders([]);
        }
      } finally {
        if (!isPolling) setLoading(false);
      }
    };

    fetchOrders();

    // Set up polling every 15 seconds to auto-refresh order statuses
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Filter orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];
    if (statusFilter !== "all") {
      result = result.filter(o => o.status?.toLowerCase() === statusFilter);
    }
    return result;
  }, [orders, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ordersPerPage;
    return filteredOrders.slice(start, start + ordersPerPage);
  }, [filteredOrders, currentPage, ordersPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return <FiClock className="w-3.5 h-3.5" />;
      case "processing": return <FiTruck className="w-3.5 h-3.5" />;
      case "approved": case "completed": case "delivered": return <FiCheckCircle className="w-3.5 h-3.5" />;
      case "cancelled": return <FiXCircle className="w-3.5 h-3.5" />;
      default: return <FiClock className="w-3.5 h-3.5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "processing": return "bg-blue-50 text-blue-700 border-blue-200";
      case "approved": case "completed": case "delivered": return "bg-[#f0fbf4] text-[#007a2e] border-[#009E3C]/25";
      case "cancelled": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid": return <span className="text-xs text-[#009E3C] font-medium">Paid</span>;
      case "pending": return <span className="text-xs text-amber-600 font-medium">Payment pending</span>;
      default: return <span className="text-xs text-gray-500 font-medium">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FiLoader className="w-8 h-8 text-[#009E3C] animate-spin mb-3" />
        <p className="text-gray-500 text-sm">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
            {statusFilter !== 'all' && ` (filtered)`}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <SearchableSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUS_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
              placeholder="All Statuses"
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] cursor-pointer text-left min-w-[180px]"
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      {error ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <FiPackage className="w-14 h-14 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Something went wrong</h3>
          <p className="text-gray-500 text-sm mb-6">We couldn&apos;t load your orders right now. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#009E3C] text-white rounded-lg text-sm font-medium hover:bg-[#00752C] transition"
          >
            Try Again
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <FiPackage className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {statusFilter !== 'all' ? 'No orders match your filter' : 'No orders yet'}
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            {statusFilter !== 'all'
              ? 'Try changing the filter to see other orders.'
              : 'Start shopping to see your orders here!'
            }
          </p>
          {statusFilter !== 'all' ? (
            <button
              onClick={() => setStatusFilter('all')}
              className="px-5 py-2 text-sm font-medium text-[#009E3C] border border-[#009E3C]/25 rounded-lg hover:bg-[#009E3C]/6 transition"
            >
              Clear Filter
            </button>
          ) : (
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2.5 bg-[#009E3C] text-white rounded-lg text-sm font-medium hover:bg-[#00752C] transition"
            >
              Browse Products
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedOrders.map((order: any) => {
              const firstItem = order.items?.[0];
              const itemCount = order.items?.length || 0;
              const firstImageRaw = firstItem?.product?.product_images?.[0]?.image_url
                || firstItem?.product?.images?.[0]
                || null;

              return (
                <Link
                  key={order.id}
                  href={`/account/order/${order.order_number}`}
                  className="bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group block"
                >
                  <div className="p-4 md:p-5">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-800">#{order.order_number}</span>
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold capitalize border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="flex items-center gap-4">
                      {firstImageRaw && typeof firstImageRaw === 'string' && (
                        <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                          <img
                            src={getImageUrl(firstImageRaw)}
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
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">
                            {itemCount} item{itemCount !== 1 ? 's' : ''}
                          </span>
                          <span className="text-gray-300">·</span>
                          {getPaymentBadge(order.payment_status)}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900">
                          {formatPrice(Number(order.grand_total || 0))}
                        </p>
                        <FiChevronRight className="w-4 h-4 text-gray-400 ml-auto mt-1 group-hover:text-[#009E3C] transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FiChevronLeft className="w-4 h-4" /> Prev
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}