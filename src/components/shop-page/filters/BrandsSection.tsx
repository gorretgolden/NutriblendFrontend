"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { apiClient } from "@/lib/api/client";
import Skeleton from "@/components/common/Skeleton";
import Link from "next/link";

const BrandsSection = () => {
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const activeBrandId = searchParams.get("brand_id");

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await apiClient.getBrands();
                if (response.status && response.data) {
                    setBrands(response.data);
                }
            } catch (error) {
                console.error("Error fetching brands:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    const getBrandLink = (brandId: number) => {
        const params = new URLSearchParams(searchParams.toString());
        // Toggle: if already selected, remove it
        if (activeBrandId === String(brandId)) {
            params.delete("brand_id");
        } else {
            params.set("brand_id", String(brandId));
        }
        params.delete("page");
        return `/shop?${params.toString()}`;
    };

    if (loading) {
        return (
            <div className="flex flex-col space-y-2 py-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                ))}
            </div>
        );
    }

    return (
        <Accordion type="single" collapsible defaultValue="filter-brands">
            <AccordionItem value="filter-brands" className="border-none">
                <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
                    Brands
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                    <div className="grid grid-cols-2 gap-2">
                        {brands.map((brand) => (
                            <Link
                                key={brand.id}
                                href={getBrandLink(brand.id)}
                                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                                    activeBrandId === String(brand.id)
                                        ? "bg-[#009E3C] text-white border-[#009E3C] shadow-lg shadow-emerald-100"
                                        : "bg-white text-gray-700 border-gray-100 hover:border-[#009E3C] hover:bg-gray-50"
                                }`}
                            >
                                <span className="truncate">{brand.name}</span>
                                {activeBrandId === String(brand.id) && (
                                    <svg className="w-3 h-3 flex-none" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </Link>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default BrandsSection;
