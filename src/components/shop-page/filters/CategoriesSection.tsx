"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { apiClient, Category } from "@/lib/api/client";
import Skeleton from "@/components/common/Skeleton";

const CategoriesSection = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

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

  const getCategoryLink = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", slug);
    // Remove category_id when using slug
    params.delete("category_id");
    params.delete("page");
    return `/shop?${params.toString()}`;
  };

  const rootCategories = categories.filter(cat => !cat.parent_id || cat.parent_id === null);

  if (loading) {
    return (
      <div className="flex flex-col space-y-3 py-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-8 w-3/4 rounded-xl" />
        <Skeleton className="h-8 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible defaultValue="filter-categories">
      <AccordionItem value="filter-categories" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5 mb-2">
          Categories
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <div className="flex flex-col space-y-1">
            {/* Show "All Products" option */}
            <Link
              href="/shop"
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-bold text-sm ${
                !activeCategory 
                  ? "bg-[#009E3C] text-white shadow-md shadow-emerald-100" 
                  : "text-gray-700 hover:bg-gray-50 hover:text-[#009E3C]"
              }`}
            >
              All Products <MdKeyboardArrowRight className={!activeCategory ? "rotate-90 transition-transform" : ""} />
            </Link>

            <div className="pt-2 space-y-1">
              {rootCategories.map((category) => (
                <div key={category.id} className="group">
                  <Link
                    href={getCategoryLink(category.slug)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all font-bold text-[13px] ${
                      activeCategory === category.slug 
                        ? "bg-emerald-50 text-[#009E3C]" 
                        : "text-gray-600 hover:text-[#009E3C] hover:bg-emerald-50/50"
                    }`}
                  >
                    {category.name}
                    {category.children && category.children.length > 0 && (
                      <MdKeyboardArrowRight className={`w-4 h-4 transition-transform ${activeCategory === category.slug ? "rotate-90" : ""}`} />
                    )}
                  </Link>

                  {/* Render children subcategories if they exist */}
                  {category.children && category.children.length > 0 && (
                    <div className="mt-1 mb-2 ml-6 space-y-0.5 border-l-2 border-emerald-50 pl-3">
                      {category.children.map((child: any) => (
                        <Link
                          key={child.id}
                          href={getCategoryLink(child.slug)}
                          className={`flex items-center py-1.5 px-2 rounded-lg text-xs transition-all font-medium ${
                            activeCategory === child.slug 
                              ? "text-[#009E3C] bg-emerald-50/50 font-bold" 
                              : "text-gray-500 hover:text-[#009E3C] hover:translate-x-1"
                          }`}
                        >
                          <span className="mr-2 opacity-30">•</span>
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {rootCategories.length === 0 && (
              <p className="text-sm py-4 text-gray-400 text-center italic">No categories available</p>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategoriesSection;
