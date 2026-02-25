"use client";

import CartCounter from "@/components/ui/CartCounter";
import WishlistButton from "@/components/ui/WishlistButton";
import React, { useState } from "react";
import AddToCartBtn from "./AddToCartBtn";
import { Product } from "@/types/product.types";

const AddToCardSection = ({ data }: { data: Product }) => {
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div className="fixed md:relative w-full bg-white border-t md:border-none border-black/5 bottom-0 left-0 p-4 md:p-0 z-10 flex items-center justify-between sm:justify-start md:justify-center">
      <CartCounter onAdd={setQuantity} onRemove={setQuantity} />
      <AddToCartBtn data={{ ...data, quantity }} />
      <div className="ml-3 sm:ml-4">
        <WishlistButton productId={data.id} productName={data.title} variant="detail" />
      </div>
    </div>
  );
};

export default AddToCardSection;
