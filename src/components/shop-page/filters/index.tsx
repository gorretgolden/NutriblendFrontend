import React from "react";
import CategoriesSection from "@/components/shop-page/filters/CategoriesSection";
import PriceSection from "@/components/shop-page/filters/PriceSection";
import BrandsSection from "@/components/shop-page/filters/BrandsSection";
import { Button } from "@/components/ui/button";

const Filters = () => {
  return (
    <>
      <hr className="border-t-black/10" />
      <CategoriesSection />
      <hr className="border-t-black/10" />
      <PriceSection />
      <hr className="border-t-black/10" />
      <BrandsSection />
      <Button
        type="button"
        className="bg-[#009E3C] hover:bg-[#00752C] w-full rounded-xl text-sm font-bold py-3 h-11 transition-colors shadow-[0_4px_12px_rgba(0,158,60,0.25)]"
      >
        Apply Filter
      </Button>
    </>
  );
};

export default Filters;
