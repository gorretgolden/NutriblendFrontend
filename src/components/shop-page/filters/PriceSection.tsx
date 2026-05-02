"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { debounce } from "lodash";

const PriceSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMin = Number(searchParams.get("min_price")) || 0;
  const currentMax = Number(searchParams.get("max_price")) || 2000000;

  const [values, setValues] = useState<[number, number]>([currentMin, currentMax]);
  
  // Local state for inputs
  const [minInput, setMinInput] = useState(currentMin.toString());
  const [maxInput, setMaxInput] = useState(currentMax.toString());

  // Debounced navigation
  const debouncedApplyFilter = useCallback(
    debounce((min: number, max: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (min > 0) params.set("min_price", String(min));
      else params.delete("min_price");
      
      if (max < 2000000) params.set("max_price", String(max));
      else params.delete("max_price");
      
      params.delete("page");
      router.push(`/shop?${params.toString()}`, { scroll: false });
    }, 800),
    [searchParams, router]
  );

  // Handle typing in inputs
  const handleInputChange = (type: 'min' | 'max', val: string) => {
    if (type === 'min') {
      setMinInput(val);
      const num = Number(val);
      if (!isNaN(num)) {
        setValues([num, values[1]]);
        debouncedApplyFilter(num, values[1]);
      }
    } else {
      setMaxInput(val);
      const num = Number(val);
      if (!isNaN(num)) {
        setValues([values[0], num]);
        debouncedApplyFilter(values[0], num);
      }
    }
  };

  // Sync inputs when slider changes
  const handleSliderChange = (v: number[]) => {
    setValues([v[0], v[1]]);
    setMinInput(v[0].toString());
    setMaxInput(v[1].toString());
    debouncedApplyFilter(v[0], v[1]);
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-price">
      <AccordionItem value="filter-price" className="border-none">
        <AccordionTrigger className="text-gray-900 font-black text-lg hover:no-underline p-0 py-2">
          Price Range
        </AccordionTrigger>
        <AccordionContent className="pt-6 px-1 overflow-visible">
          <div className="px-2 mb-10">
            <Slider
              defaultValue={[currentMin, currentMax]}
              value={values}
              onValueChange={handleSliderChange}
              min={0}
              max={2000000}
              step={1000}
              className="relative flex items-center select-none touch-none w-full h-5"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="relative group">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 group-focus-within:text-[#009E3C] transition-colors">MIN</span>
                   <input 
                    type="number"
                    value={minInput}
                    onChange={(e) => handleInputChange('min', e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-xl text-sm font-black text-gray-900 focus:ring-2 focus:ring-[#009E3C]/20 transition-all outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="w-2 h-[2px] bg-gray-200" />
              <div className="flex-1">
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 group-focus-within:text-[#009E3C] transition-colors">MAX</span>
                  <input 
                    type="number"
                    value={maxInput}
                    onChange={(e) => handleInputChange('max', e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-xl text-sm font-black text-gray-900 focus:ring-2 focus:ring-[#009E3C]/20 transition-all outline-none"
                    placeholder="2000000"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                Updating results automatically...
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PriceSection;
