'use client';

import React, { useEffect, useState } from "react";
import Orders from "@/components/accounts/Order";
import { apiClient } from "@/lib/api/client";

type Order = {
  id: string;
  productName: string;
  orderDate: string;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  amount: number;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.getOrders();
        if (response.status && response.data) {
          // Transform API data to component format
          const transformedOrders = response.data.map((order) => ({
            id: order.id.toString(),
            productName: order.items?.[0]?.product?.name || 'Order',
            orderDate: new Date(order.created_at).toISOString().split('T')[0],
            status: (order.status.charAt(0).toUpperCase() + order.status.slice(1)) as "Pending" | "Shipped" | "Delivered" | "Cancelled",
            amount: order.total_amount,
          }));
          setOrders(transformedOrders);
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
    <div className="container mx-auto px-4 py-8">
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
          <p className="text-gray-500">Start shopping to see your orders here!</p>
        </div>
      ) : (
        <Orders data={orders} />
      )}
    </div>
  );
}