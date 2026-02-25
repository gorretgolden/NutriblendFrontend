"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { apiClient, Category } from "@/lib/api/client";
import Skeleton from "@/components/common/Skeleton";

const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.getCategories();
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
    <div className="flex flex-col space-y-0.5 text-black/60">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/shop?category=${category.slug}`}
          className="flex items-center justify-between py-2 hover:text-green-700 transition-colors"
        >
          {category.name} <MdKeyboardArrowRight />
        </Link>
      ))}
      {categories.length === 0 && (
        <p className="text-sm py-2">No categories found</p>
      )}
    </div>
  );
};

export default CategoriesSection;
