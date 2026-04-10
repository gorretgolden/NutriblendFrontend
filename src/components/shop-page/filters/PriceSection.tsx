"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";

const PriceSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMin = Number(searchParams.get("min_price")) || 0;
  const currentMax = Number(searchParams.get("max_price")) || 2000000;

  const [values, setValues] = useState<[number, number]>([currentMin, currentMax]);

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (values[0] > 0) {
      params.set("min_price", String(values[0]));
    } else {
      params.delete("min_price");
    }
    if (values[1] < 2000000) {
      params.set("max_price", String(values[1]));
    } else {
      params.delete("max_price");
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-price">
      <AccordionItem value="filter-price" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Price
        </AccordionTrigger>
        <AccordionContent className="pt-4" contentClassName="overflow-visible">
          <Slider
            defaultValue={[currentMin, currentMax]}
            value={values}
            onValueChange={(v: number[]) => setValues([v[0], v[1]])}
            min={0}
            max={2000000}
            step={5000}
          />

          <div className="mt-4 mb-4 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2 text-left min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Min</p>
              <p className="text-sm sm:text-base font-bold text-gray-800 truncate">UGX {values[0].toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2 text-right min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Max</p>
              <p className="text-sm sm:text-base font-bold text-gray-800 truncate">UGX {values[1].toLocaleString()}</p>
            </div>
          </div>

          <button
            onClick={applyPriceFilter}
            className="w-full bg-[#009E3C] hover:bg-[#00752C] text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
          >
            Apply Price
          </button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PriceSection;
