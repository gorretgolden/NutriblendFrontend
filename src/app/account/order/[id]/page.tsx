import React from "react";
import OrderDetailClient from "./OrderDetailClient";

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  // Generate placeholder path for static export build compatibility
  return [{ id: "placeholder" }];
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = params;
  return <OrderDetailClient id={id} />;
}
