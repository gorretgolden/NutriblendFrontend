"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import ProductDetailsContent from "./ProductDetailsContent";
import ReviewsContent from "./ReviewsContent";
import FaqContent from "./FaqContent";

type TabBtn = {
  id: number;
  label: string;
};

const tabBtnData: TabBtn[] = [
  {
    id: 1,
    label: "Product Details",
  },
  {
    id: 2,
    label: "Rating & Reviews",
  },
  {
    id: 3,
    label: "FAQs",
  },
];

import { Product } from "@/types/product.types";

const Tabs = ({ data }: { data: Product }) => {
  const [active, setActive] = useState<number>(1);

  return (
    <div>
      <div className="flex items-center mb-6 sm:mb-8 overflow-x-auto border-b border-gray-100">
        {tabBtnData.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            type="button"
            className={cn([
              active === tab.id
                ? "border-[#009E3C] border-b-2 font-bold text-[#009E3C]"
                : "border-b border-transparent text-gray-500 font-normal hover:text-[#009E3C]",
              "px-6 py-4 rounded-none transition-all duration-200",
            ])}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div className="mb-12 sm:mb-16">
        {active === 1 && <ProductDetailsContent data={data} />}
        {active === 2 && <ReviewsContent />}
        {active === 3 && <FaqContent />}
      </div>
    </div>
  );
};

export default Tabs;
