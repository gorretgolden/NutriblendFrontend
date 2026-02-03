"use client";

import React, { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { apiClient } from "@/lib/api/client";
import Skeleton from "@/components/common/Skeleton";
import Link from "next/link";

const BrandsSection = () => {
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
                    <div className="flex flex-wrap gap-2">
                        {brands.map((brand) => (
                            <Link
                                key={brand.id}
                                href={`/shop?brand_id=${brand.id}`}
                                className="bg-gray-100 px-4 py-2 rounded-full text-xs font-medium text-gray-700 hover:bg-green-600 hover:text-white transition-colors"
                            >
                                {brand.name}
                            </Link>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default BrandsSection;
