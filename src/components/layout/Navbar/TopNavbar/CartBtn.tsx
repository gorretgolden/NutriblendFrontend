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
      className="flex items-center p-2 rounded-full hover:bg-green-50/50 relative transition-all duration-300 active:scale-95 group"
    >
      {/* Icon wrapper */}
      <div className="p-2 rounded-full bg-gray-50 group-hover:bg-green-100 transition-colors shadow-sm">
        <Image
          priority
          src="/icons/cart.svg"
          height={20}
          width={20}
          alt="Cart"
          className="w-5 h-5 object-contain group-hover:scale-110 transition-transform"
        />
      </div>

      {/* Badge */}
      {cart && cart.totalQuantities > 0 && (
        <span className="absolute top-1 right-1 bg-green-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md animate-in zoom-in duration-300">
          {cart.totalQuantities}
        </span>
      )}
    </Link>
  );
};
export default CartBtn;
