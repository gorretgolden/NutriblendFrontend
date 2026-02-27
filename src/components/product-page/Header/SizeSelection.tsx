"use client";

import { setSizeSelection, setSelectedVariationId } from "@/lib/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { Product } from "@/types/product.types";

const SizeSelection = ({ data }: { data: Product }) => {
  const dispatch = useAppDispatch();

  // If there are no variations from backend, we might want a fallback or hide it
  const variations = data.variations || [];

  const handleSizeChange = (variation: any) => {
    dispatch(setSizeSelection(variation.name));
    dispatch(setSelectedVariationId(variation.id));
  };

  useEffect(() => {
    if (data.variations && data.variations.length > 0) {
      const firstVariation = data.variations[0];
      dispatch(setSizeSelection(firstVariation.name));
      dispatch(setSelectedVariationId(firstVariation.id));
    }
  }, [data.variations, dispatch]);

  const { sizeSelection } = useAppSelector(
    (state: RootState) => state.products
  );

  if (variations.length === 0) {
    return null; // Or show "Standard" size
  }

  return (
    <div className="flex flex-col">
      <span className="text-sm sm:text-base text-dark-800 mb-4 font-medium">
        Choose Variation
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-3">
        {variations.map((variation) => (
          <button
            key={variation.id}
            type="button"
            className={cn([
              "bg-white-50 border border-green-400 flex flex-col items-center justify-center p-3 text-sm rounded-lg transition-all duration-200 min-w-[100px]",
              "hover:bg-green-100 hover:border-green-400 hover:shadow-sm",
              sizeSelection === variation.name
                ? "bg-green-600 border-green-600 text-white font-medium shadow-md"
                : "text-dark-800"
            ])}
            onClick={() => dispatch(setSizeSelection(variation.name))}
          >
            <span className="font-medium">{variation.name}</span>
            <span className={cn([
              "text-xs mt-1",
              sizeSelection === variation.name ? "text-dark-100" : "text-dark-600"
            ])}>
              UGX {variation.price.toLocaleString()}
            </span>
            {variation.stock <= 5 && variation.stock > 0 && (
              <span className="text-[10px] text-red-500 mt-1">
                Only {variation.stock} left!
              </span>
            )}
            {variation.stock === 0 && (
              <span className="text-[10px] text-red-500 mt-1">
                Out of Stock
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelection;