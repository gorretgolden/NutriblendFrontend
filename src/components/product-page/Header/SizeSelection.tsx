"use client";

import { setSizeSelection } from "@/lib/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import React from "react";

const SizeSelection = () => {
  const { sizeSelection } = useAppSelector(
    (state: RootState) => state.products
  );
  const dispatch = useAppDispatch();

  // Gram variations with labels, values, and prices
  const gramVariations = [
    { label: "50g", value: "50g", price: 15000 },
    { label: "100g", value: "100g", price: 25000 },
    { label: "250g", value: "250g", price: 50000 },
    { label: "500g", value: "500g", price: 85000 },
    { label: "1kg", value: "1000g", price: 150000 }
  ];

  return (
    <div className="flex flex-col">
      <span className="text-sm sm:text-base text-green-800 mb-4 font-medium">
        Choose Variation
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-3">
        {gramVariations.map((variation, index) => (
          <button
            key={index}
            type="button"
            className={cn([
              "bg-green-50 border border-green-200 flex flex-col items-center justify-center p-3 text-sm rounded-lg transition-all duration-200 min-w-[100px]",
              "hover:bg-green-100 hover:border-green-400 hover:shadow-sm",
              sizeSelection === variation.value 
                ? "bg-green-600 border-green-600 text-white font-medium shadow-md" 
                : "text-green-800"
            ])}
            onClick={() => dispatch(setSizeSelection(variation.value))}
          >
            <span className="font-medium">{variation.label}</span>
            <span className={cn([
              "text-xs mt-1",
              sizeSelection === variation.value ? "text-green-100" : "text-green-600"
            ])}>
              UGX {variation.price.toLocaleString()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelection;