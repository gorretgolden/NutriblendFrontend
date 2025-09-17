// src/components/accounts/MyReview.tsx
"use client";
import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FaStar, FaEdit, FaTrash, FaUserCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Export this type so it can be used in your page file.
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
    return null; // Return nothing when there are no reviews
  }

  const toggleExpand = (id: string) => {
    if (expandedReview === id) {
      setExpandedReview(null);
    } else {
      setExpandedReview(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Reviews</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
        </span>
      </div>
      
      <div className="grid gap-5">
        {reviews.map((review) => {
          const isExpanded = expandedReview === review.id;
          const isLongComment = review.comment.length > 150;
          const displayComment = isExpanded || !isLongComment 
            ? review.comment 
            : `${review.comment.substring(0, 150)}...`;
          
          return (
            <Card 
              key={review.id} 
              className="p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border-border/40"
            >
              <div className="flex gap-4">
                {/* Product/Reviewer Image */}
                <div className="flex-shrink-0">
                  {review.productImage ? (
                    <img 
                      src={review.productImage} 
                      alt={review.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <FaUserCircle className="text-2xl text-blue-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow">
                  {/* Header with product name and rating */}
                  <div className="flex justify-between items-start mb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {review.productName}
                    </CardTitle>
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                      <div className="flex items-center text-yellow-400 mr-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={cn(
                              "text-sm",
                              i < review.rating ? "fill-current" : "text-gray-300"
                            )} 
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-yellow-700 ml-1">
                        {review.rating}.0
                      </span>
                    </div>
                  </div>
                  
                  {/* Review comment */}
                  <CardContent className="p-0 mb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {displayComment}
                      {isLongComment && (
                        <button 
                          onClick={() => toggleExpand(review.id)}
                          className="text-blue-500 hover:text-blue-700 font-medium ml-1 text-sm"
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </p>
                  </CardContent>
                  
                  {/* Footer with metadata and actions */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Reviewed by <span className="font-medium">{review.reviewerName}</span> • {review.date}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <FaEdit className="text-sm" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 gap-1 text-red-500 hover:text-red-700">
                        <FaTrash className="text-sm" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MyReview;