"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { apiClient, Category } from "@/lib/api/client";
import Skeleton from "@/components/common/Skeleton";

const CategoriesSection = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.getCategoriesTree();
        if (response.status && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col space-y-2 py-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible defaultValue="filter-categories">
      <AccordionItem value="filter-categories" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Categories
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <div className="flex flex-col space-y-0.5 text-black/60">
            {categories.map((category) => (
              <div key={category.id}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="flex items-center justify-between py-2 hover:text-green-700 transition-colors font-medium text-black"
                >
                  {category.name} <MdKeyboardArrowRight />
                </Link>
                {/* Render children subcategories if they exist */}
                {category.children && category.children.length > 0 && (
                  <div className="flex flex-col space-y-1 pl-4 pb-2 border-l border-green-100 ml-2">
                    {category.children.map((child: any) => (
                      <Link
                        key={child.id}
                        href={`/shop?category=${child.slug}`}
                        className="flex items-center text-sm py-1.5 hover:text-green-600 transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-sm py-2">No categories found</p>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategoriesSection;
