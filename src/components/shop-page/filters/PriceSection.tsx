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
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5 mb-2">
          Price Range
        </AccordionTrigger>
        <AccordionContent className="pt-6 px-1 overflow-visible">
          <div className="px-2">
            <Slider
              defaultValue={[currentMin, currentMax]}
              value={values}
              onValueChange={(v: number[]) => setValues([v[0], v[1]])}
              min={0}
              max={2000000}
              step={10000}
              className="mb-8"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 block">Min Price</label>
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                  <span className="text-sm font-black text-gray-900">UGX {values[0].toLocaleString()}</span>
                </div>
              </div>
              <div className="h-px w-4 bg-gray-200 mt-6 flex-none" />
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 block">Max Price</label>
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                  <span className="text-sm font-black text-gray-900">UGX {values[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={applyPriceFilter}
              className="w-full bg-[#009E3C] hover:bg-[#00752C] text-white text-sm font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-[0.98]"
            >
              Apply Filter
            </button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PriceSection;
