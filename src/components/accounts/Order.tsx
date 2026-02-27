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
    <section className="w-full">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">
          My Orders
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((order) => (
            <motion.div
              key={order.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 250 }}
            >
              <Card
                className={cn(
                  "rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                )}
              >
                {/* Colored status strip at the top */}
                <div
                  className={cn(
                    "absolute top-0 left-0 w-full h-1 rounded-t-2xl",
                    order.status === "Pending" && "bg-green-500",
                    order.status === "Shipped" && "bg-green-500",
                    order.status === "Delivered" && "bg-green-500",
                    order.status === "Cancelled" && "bg-red-500"
                  )}
                ></div>

                <CardHeader className="pt-6">
                  <CardTitle className="flex items-center justify-between text-base font-semibold text-gray-800">
                    <span className="flex items-center gap-2 truncate max-w-[70%]">
                      <FaBox className="text-indigo-500 flex-shrink-0" />
                      <span className="truncate">{order.productName}</span>
                    </span>

                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap",
                        order.status === "Pending" &&
                          "bg-green-500 text-green-800",
                        order.status === "Shipped" &&
                          "bg-green-100 text-green-800",
                        order.status === "Delivered" &&
                          "bg-green-100 text-green-800",
                        order.status === "Cancelled" &&
                          "bg-red-100 text-red-800"
                      )}
                    >
                      {order.status}
                    </span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-sm space-y-3 text-gray-600 pb-5">
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400" />
                    <span className="font-medium">{order.orderDate}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FaDollarSign className="text-gray-400" />
                    <span className="font-semibold text-gray-800">
                      ${order.amount.toFixed(2)}
                    </span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Orders;
