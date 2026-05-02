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
  
  // Local state for inputs to allow free typing
  const [minInput, setMinInput] = useState(currentMin.toString());
  const [maxInput, setMaxInput] = useState(currentMax.toString());

  // Sync inputs when slider changes
  const handleSliderChange = (v: number[]) => {
    setValues([v[0], v[1]]);
    setMinInput(v[0].toString());
    setMaxInput(v[1].toString());
  };

  // Sync slider when inputs blur
  const handleMinBlur = () => {
    let val = Number(minInput);
    if (isNaN(val) || val < 0) val = 0;
    if (val > values[1]) val = values[1];
    setValues([val, values[1]]);
    setMinInput(val.toString());
  };

  const handleMaxBlur = () => {
    let val = Number(maxInput);
    if (isNaN(val)) val = 2000000;
    if (val < values[0]) val = values[0];
    setValues([values[0], val]);
    setMaxInput(val.toString());
  };

  const applyPriceFilter = () => {
    // Ensure inputs are parsed before applying
    let min = Number(minInput);
    let max = Number(maxInput);
    
    if (isNaN(min) || min < 0) min = 0;
    if (isNaN(max)) max = 2000000;
    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (min > 0) {
      params.set("min_price", String(min));
    } else {
      params.delete("min_price");
    }
    if (max < 2000000) {
      params.set("max_price", String(max));
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
              onValueChange={handleSliderChange}
              min={0}
              max={2000000}
              step={10000}
              className="mb-8"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Min Price (UGX)</label>
                <input 
                  type="text"
                  value={minInput}
                  onChange={(e) => setMinInput(e.target.value)}
                  onBlur={handleMinBlur}
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm font-black text-gray-900 outline-none focus:border-[#009E3C] focus:ring-2 focus:ring-[#009E3C]/10 transition-all"
                  placeholder="0"
                />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Max Price (UGX)</label>
                <input 
                  type="text"
                  value={maxInput}
                  onChange={(e) => setMaxInput(e.target.value)}
                  onBlur={handleMaxBlur}
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm font-black text-gray-900 outline-none focus:border-[#009E3C] focus:ring-2 focus:ring-[#009E3C]/10 transition-all"
                  placeholder="2000000"
                />
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
