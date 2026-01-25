"use client";

import React, { useState } from "react";
import * as motion from "framer-motion/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FaStar, FaUserCircle } from "react-icons/fa";

export type Review = {
  id: string;
  reviewerName: string;
  productName: string;
  rating: number;
  date: string;
  comment: string;
  productImage?: string;
};

type MyReviewProps = {
  reviews: Review[];
};

const MyReview = ({ reviews }: MyReviewProps) => {
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 italic">
        You haven’t written any reviews yet.
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedReview(expandedReview === id ? null : id);
  };

  return (
    <section className="w-full">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">
          My Reviews
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => {
            const isExpanded = expandedReview === review.id;
            const isLongComment = review.comment.length > 150;
            const displayComment =
              isExpanded || !isLongComment
                ? review.comment
                : `${review.comment.substring(0, 150)}...`;

            return (
              <motion.div
                key={review.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 250 }}
              >
                <Card
                  className={cn(
                    "rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                  )}
                >
                  {/* Product Image */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-green-500 rounded-t-2xl"></div>

                  <CardHeader className="pt-6">
                    <CardTitle className="flex items-center gap-3 text-base font-semibold text-gray-800">
                      {review.productImage ? (
                        <img
                          src={review.productImage}
                          alt={review.productName}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center border border-gray-200">
                          <FaUserCircle className="text-2xl text-green-400" />
                        </div>
                      )}
                      <span className="truncate">{review.productName}</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="text-sm space-y-3 text-gray-600 pb-5">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={cn(
                            "text-sm",
                            i < review.rating ? "text-yellow-400" : "text-gray-300"
                          )}
                        />
                      ))}
                      <span className="ml-2 text-gray-800 font-medium">{review.rating}.0</span>
                    </div>

                    {/* Comment */}
                    <p className="text-gray-700">
                      {displayComment}
                      {isLongComment && (
                        <button
                          onClick={() => toggleExpand(review.id)}
                          className="text-green-500 hover:text-green-700 font-medium ml-1 text-sm"
                        >
                          {isExpanded ? "Show less" : "Read more"}
                        </button>
                      )}
                    </p>

                    {/* Metadata */}
                    <p className="text-xs text-gray-500">
                      Reviewed by <span className="font-medium text-gray-800">{review.reviewerName}</span> • {review.date}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default MyReview;
