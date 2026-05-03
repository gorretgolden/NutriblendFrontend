"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient, getImageUrl } from "@/lib/api/client";

export default function ShopByGoal() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const cached = localStorage.getItem('featured_categories_v2');
        let categories = [];
        
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 2 * 60 * 1000) {
            categories = data;
          }
        }

        if (categories.length === 0) {
          // fetch all categories
          const response = await apiClient.getCategories();
          if (response.status && response.data) {
            const raw = Array.isArray(response.data) ? response.data : (response.data.data || []);
            categories = raw;
            localStorage.setItem('featured_categories_v2', JSON.stringify({ data: categories, timestamp: Date.now() }));
          }
        }

        if (categories.length > 0) {
          // filter by is_featured
          const featured = categories.filter((cat: any) => cat.is_featured);
          
          const mappedGoals = featured
            .slice(0, 8)
            .map((cat: any) => {
              let imageUrl = cat.full_image_url || cat.full_icon_url || null;
              if (!imageUrl) {
                if (cat.image) imageUrl = getImageUrl(cat.image);
                else if (cat.icon) imageUrl = getImageUrl(cat.icon);
              }

              return {
                label: cat.name,
                href: `/shop?category=${cat.slug}`,
                imageUrl: imageUrl,
              };
            });
          
          // If no featured categories, fallback to first 6 active parents
          const finalGoals = mappedGoals.length > 0 
            ? mappedGoals 
            : categories.filter((cat: any) => cat.is_active && !cat.parent_id).slice(0, 6).map((cat: any) => {
                let imageUrl = cat.full_image_url || cat.full_icon_url || null;
                
                if (!imageUrl) {
                  if (cat.image) imageUrl = getImageUrl(cat.image);
                  else if (cat.icon) imageUrl = getImageUrl(cat.icon);
                }

                return {
                  label: cat.name,
                  href: `/shop?category=${cat.slug}`,
                  imageUrl: imageUrl,
                };
              });

          setGoals(finalGoals);
        }
      } catch (error) {
        console.error("Failed to fetch goals", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  if (loading && goals.length === 0) {
    return (
      <div className="w-full bg-white py-6 animate-pulse">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="h-8 w-64 bg-gray-100 rounded-lg mb-6" />
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex flex-col items-start gap-4 flex-none w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] md:w-[calc(25%-18px)] lg:w-[calc(16.666%-20px)]">
                <div className="w-full aspect-[4/3] rounded-[20px] bg-gray-100" />
                <div className="h-4 w-24 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (goals.length === 0) return null;

  return (
    <section className="w-full bg-white border-b border-gray-100 py-6 sm:py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div className="space-y-1">
            <h2 className="text-[26px] sm:text-[34px] font-[900] text-gray-900 tracking-tight leading-none">Featured Categories</h2>
            <p className="text-gray-500 text-sm sm:text-base font-medium">Explore our premium selection curated just for you.</p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-2.5 text-[15px] font-extrabold text-[#009E3C] hover:text-[#007a2e] transition-all group px-5 py-2.5 bg-emerald-50 rounded-full hover:bg-emerald-100"
          >
            See All Categories
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Dynamic Category List */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6"
        >
          {goals.map((goal) => (
            <Link
              key={goal.label}
              href={goal.href}
              className="flex flex-col items-start gap-3 group"
            >
              <div
                className="w-full aspect-square rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,158,60,0.12)] border border-gray-100 group-hover:border-emerald-200 overflow-hidden bg-gray-50 relative"
              >
                {goal.imageUrl ? (
                  <img 
                    src={goal.imageUrl} 
                    alt={goal.label} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 transition-transform duration-500 group-hover:scale-110">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="space-y-1.5 px-1 w-full text-center sm:text-left">
                <span className="block text-[14px] sm:text-[16px] font-black text-gray-900 leading-tight group-hover:text-[#009E3C] transition-colors line-clamp-1">
                  {goal.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
