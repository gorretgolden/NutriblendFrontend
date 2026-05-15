"use client";

import CartCounter from "@/components/ui/CartCounter";
import WishlistButton from "@/components/ui/WishlistButton";
import React, { useState } from "react";
import AddToCartBtn from "./AddToCartBtn";
import { Product } from "@/types/product.types";

const AddToCardSection = ({ data }: { data: Product }) => {
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top Row: Quantity + Wishlist */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-[52px] bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between px-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quantity</span>
          <CartCounter onAdd={setQuantity} onRemove={setQuantity} />
        </div>
        <div className="shrink-0">
          <WishlistButton productId={data.id} productName={data.title} variant="detail" />
        </div>
      </div>

      {/* Bottom Row: Block Add to Cart Button */}
      <div className="w-full">
        <AddToCartBtn data={{ ...data, quantity }} />
      </div>
    </div>
  );
};

export default AddToCardSection;
