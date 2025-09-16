// src/components/accounts/MyReview.tsx

import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FaStar } from "react-icons/fa"; // Remember to install 'react-icons'
import { cn } from "@/lib/utils";

// Export this type so it can be used in your page file.
export type Review = {
  id: string;
  reviewerName: string;
  productName: string;
  rating: number;
  date: string;
  comment: string;
};

type MyReviewProps = {
  reviews: Review[];
};

const MyReview = ({ reviews }: MyReviewProps) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        You have not submitted any reviews yet.
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-semibold mb-2">My Reviews</h2>
      {reviews.map((review) => (
        <Card key={review.id} className="p-4 shadow-md">
          <CardTitle className="flex justify-between items-center text-lg">
            <span>{review.productName}</span>
            <div className="flex items-center text-yellow-400">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
          </CardTitle>
          <CardContent className="mt-2 text-gray-600">
            <p className="text-sm font-medium">{review.comment}</p>
            <p className="text-xs text-gray-400 mt-2">
              Reviewed on: {review.date}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyReview;