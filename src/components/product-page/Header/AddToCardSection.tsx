"use client";

import CartCounter from "@/components/ui/CartCounter";
import WishlistButton from "@/components/ui/WishlistButton";
import React, { useState } from "react";
import AddToCartBtn from "./AddToCartBtn";
import { Product } from "@/types/product.types";

const AddToCardSection = ({ data }: { data: Product }) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleAdd = () => setQuantity(prev => prev + 1);
  const handleRemove = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Quantity Label */}
      <div className="flex flex-col gap-4">
        <span className="text-sm font-bold uppercase tracking-widest text-gray-400 ml-1">Quantity</span>
        
        <div className="flex items-center gap-5">
          {/* Custom Counter Pill */}
          <div className="flex items-center justify-between bg-gray-100/50 p-2 rounded-2xl border border-gray-100 w-full max-w-[200px]">
            <button 
              onClick={handleRemove}
              className="w-11 h-11 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 hover:text-[#009E3C] hover:shadow-md transition-all active:scale-90"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
              </svg>
            </button>
            
            <span className="text-xl font-black text-gray-900 min-w-[50px] text-center">
              {quantity}
            </span>

            <button 
              onClick={handleAdd}
              className="w-11 h-11 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 hover:text-[#009E3C] hover:shadow-md transition-all active:scale-90"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div className="shrink-0 h-[60px] w-[60px]">
            <WishlistButton productId={data.id} productName={data.title} variant="detail" />
          </div>
        </div>
      </div>

      {/* Block Add to Cart Button */}
      <div className="w-full">
        <AddToCartBtn data={{ ...data, quantity }} />
      </div>
    </div>
  );
};

export default AddToCardSection;
