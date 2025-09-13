

import React from "react";

import Orders from "@/components/accounts/Order";


type Order = {
  id: string;
  productName: string;
  orderDate: string;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  amount: number;
};


const dummyOrders: Order[] = [
  {
    id: "1",
    productName: "california Gold Nutrition DHA 700",
    orderDate: "2023-10-26",
    status: "Delivered",
    amount: 15.75,
  },
  {
    id: "2",
    productName: "Omega-3 Fish Oil",
    orderDate: "2023-10-24",
    status: "Shipped",
    amount: 8.50,
  },
  {
    id: "3",
    productName: "Omega 800 ultra-concentrated",
    orderDate: "2023-10-22",
    status: "Pending",
    amount: 6.20,
  },
];

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Orders data={dummyOrders} />
    </div>
  );
}