"use client";

import { useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CartBtn = () => {
  const { cart } = useAppSelector((state: RootState) => state.carts);

  return (
     <Link
      href="/cart"
      className="flex items-center p-2 rounded-lg hover:bg-gray-50 relative transition-colors duration-200"
    >
      {/* Icon wrapper */}
      <div className="p-1.5 rounded-full bg-gray-100 hover:bg-green-100 transition-colors">
        <Image
          priority
          src="/icons/cart.svg"
          height={20}
          width={20}
          alt="Cart"
          className="w-5 h-5 object-contain"
        />
      </div>

      {/* Badge */}
      {cart && cart.totalQuantities > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#4caf50] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
          {cart.totalQuantities}
        </span>
      )}
    </Link>
  );
};
export default CartBtn;
