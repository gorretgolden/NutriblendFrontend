"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { cn } from "@/lib/utils";

type CartCounterProps = {
  isZeroDelete?: boolean;
  onAdd?: (value: number) => void;
  onRemove?: (value: number) => void;
  className?: string;
  initialValue?: number;
};

const CartCounter = ({
  isZeroDelete,
  onAdd,
  onRemove,
  className,
  initialValue = 1,
}: CartCounterProps) => {
  // Use the initialValue prop directly — no local state.
  // The parent (Redux) is the single source of truth for quantity.
  const counter = initialValue;

  const addToCart = () => {
    if (onAdd) {
      onAdd(counter + 1);
    }
  };

  const remove = () => {
    if ((counter === 1 && !isZeroDelete) || counter <= 0) return;

    if (onRemove) {
      onRemove(counter - 1);
    }
  };

  return (
    <div
      className={cn(
        "bg-white border border-[#009E3C]/25 w-full min-w-[110px] max-w-[110px] sm:max-w-[170px] py-2 md:py-3 px-4 sm:px-5 rounded-full flex items-center justify-between",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="h-5 w-5 sm:h-6 sm:w-6 text-[#009E3C] hover:bg-[#009E3C]/10 hover:text-[#007a2e]"
        onClick={() => remove()}
      >
        <FaMinus />
      </Button>
      <span className="font-medium text-[#009E3C] text-sm sm:text-base">
        {counter}
      </span>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="h-5 w-5 sm:h-6 sm:w-6 text-[#009E3C] hover:bg-[#009E3C]/10 hover:text-[#007a2e]"
        onClick={() => addToCart()}
      >
        <FaPlus />
      </Button>
    </div>
  );
};

export default CartCounter;