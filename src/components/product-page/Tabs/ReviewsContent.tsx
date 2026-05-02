'use client';

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { useAppSelector } from "@/lib/hooks/redux";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReviewsContentProps {
  productId: number;
}

const StarRating = ({ value, onChange }: { value: number; onChange?: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange?.(star)}
        className={cn("transition-colors", onChange ? "cursor-pointer hover:text-yellow-400" : "cursor-default")}
      >
        <FaStar className={star <= value ? "text-yellow-400" : "text-gray-200"} />
      </button>
    ))}
  </div>
);

const ReviewsContent = ({ productId }: ReviewsContentProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [hasOrdered, setHasOrdered] = useState(false);

  const fetchReviews = async (p = 1, append = false) => {
    try {
      const res = await apiClient.getProductReviews(productId);
      if (res.status && res.data) {
        const items = Array.isArray(res.data) ? res.data : (res.data as any).data || [];
        setReviews((prev) => (append ? [...prev, ...items] : items));
        const meta = (res.data as any).meta;
        setHasMore(meta ? meta.current_page < meta.last_page : false);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
    
    if (isAuthenticated) {
      // Check if user has ordered this product
      apiClient.getOrders().then(res => {
        if (res.status && res.data?.data) {
          const ordered = res.data.data.some((order: any) => 
            order.items?.some((item: any) => item.product_id === productId)
          );
          setHasOrdered(ordered);
        }
      });
    }
  }, [productId, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Please write a comment");
    setSubmitting(true);
    try {
      const res = await apiClient.submitReview(productId, { rating, comment });
      if (res.status) {
        toast.success("Review submitted! Thank you.");
        setComment("");
        setRating(5);
        setShowForm(false);
        fetchReviews(1);
      } else {
        toast.error(res.message || "Could not submit review");
      }
    } catch (err: any) {
      toast.error(err.message || "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchReviews(next, true);
  };

  return (
    <section>
      <div className="flex items-center justify-between flex-col sm:flex-row mb-5 sm:mb-6 gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">All Reviews</h3>
          {!loading && <span className="text-sm text-gray-500">({reviews.length})</span>}
        </div>
        {isAuthenticated && hasOrdered && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 rounded-full bg-[#009E3C] text-white text-sm font-bold hover:bg-[#007a2e] transition-colors shadow-sm"
          >
            Write a Review
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
          <h4 className="font-bold text-gray-800">Your Review</h4>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Rating</label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your experience with this product..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-[#009E3C] text-white text-sm font-bold hover:bg-[#007a2e] transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <FiLoader className="w-5 h-5 animate-spin mr-2" />
          <span>Loading reviews...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaStar className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">No reviews yet</p>
          <p className="text-gray-400 text-sm mt-1">Be the first to review this product</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#009E3C]/10 flex items-center justify-center flex-shrink-0">
                  <FaUserCircle className="w-6 h-6 text-[#009E3C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800 text-sm">{review.user?.name || "Customer"}</span>
                    <span className="text-xs text-gray-400">
                      {review.created_at
                        ? new Date(review.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : ""}
                    </span>
                  </div>
                  <StarRating value={review.rating ?? 0} />
                  <p className="text-gray-700 text-sm mt-2 leading-relaxed">{review.comment || review.review}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            className="inline-block px-10 py-3 border border-gray-300 rounded-full text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Load More Reviews
          </button>
        </div>
      )}

      {!isAuthenticated && !loading && (
        <p className="text-center text-sm text-gray-400 mt-6">
          <a href="/login" className="text-[#009E3C] font-medium hover:underline">Sign in</a> to write a review
        </p>
      )}
    </section>
  );
};

export default ReviewsContent;
