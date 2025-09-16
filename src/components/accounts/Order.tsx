"use client";

import React from "react";
import * as motion from "framer-motion/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FaBox, FaCalendarAlt, FaDollarSign } from "react-icons/fa";

type Order = {
  id: string;
  productName: string;
  orderDate: string;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  amount: number;
};

type OrdersProps = {
  data: Order[];
};

const Orders = ({ data }: OrdersProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        You have no orders yet.
      </div>
    );
  }

  return (
    <section className="overflow-hidden">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((order) => (
            <Card
              key={order.id}
              className="shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FaBox className="text-blue-500" />
                    {order.productName}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full font-medium",
                      order.status === "Pending" &&
                        "bg-yellow-100 text-yellow-700",
                      order.status === "Shipped" &&
                        "bg-blue-100 text-blue-700",
                      order.status === "Delivered" &&
                        "bg-green-100 text-green-700",
                      order.status === "Cancelled" &&
                        "bg-red-100 text-red-700"
                    )}
                  >
                    {order.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  {order.orderDate}
                </p>
                <p className="flex items-center gap-2">
                  <FaDollarSign className="text-gray-400" />
                  ${order.amount.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Orders;
