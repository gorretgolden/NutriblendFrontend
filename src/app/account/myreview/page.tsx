'use client';

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import MyReview, { Review } from "@/components/accounts/MyReview";
import { FaStar } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiClient.getMyReviews();
        if (response.status && response.data) {
          const rawData = Array.isArray(response.data)
            ? response.data
            : (response.data as any).data || [];
          const mapped: Review[] = rawData.map((r: any) => ({
            id: String(r.id),
            reviewerName: r.user?.name || "You",
            productName: r.product?.name || r.product_name || "Unknown Product",
            rating: r.rating ?? 0,
            date: r.created_at
              ? new Date(r.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "",
            comment: r.comment || r.review || "",
            productImage: r.product?.image_url || r.product?.thumbnail || undefined,
          }));
          setReviews(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-amber-100 rounded-xl">
          <FaStar className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Reviews</h1>
          <p className="text-sm text-gray-500">Reviews you&apos;ve left on products</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <FiLoader className="w-6 h-6 animate-spin mr-2" />
          <span>Loading reviews...</span>
        </div>
      ) : (
        <MyReview reviews={reviews} />
      )}
    </div>
  );
}
