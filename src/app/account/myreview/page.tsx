
import React from "react";

import MyReview, { Review } from "@/components/accounts/MyReview";


const dummyReviews: Review[] = [
  {
    id: "review-1",
    reviewerName: "John Doe",
    productName: "california Gold Nutrition DHA 700",
    rating: 5,
    date: "2023-11-01",
    comment: "This is a fantastic product! I've been using it for a while and feel great.",
  },
  {
    id: "review-2",
    reviewerName: "Jane Smith",
    productName: "omega 3 fish oil",
    rating: 4,
    date: "2023-10-28",
    comment: "A solid product, works as expected. A bit pricey but worth it.",
  },
  {
    id: "review-3",
    reviewerName: "Mike Johnson",
    productName: "omega 800 ultra-concentrated",
    rating: 5,
    date: "2023-10-25",
    comment: "Extremely potent and high quality. The best omega I've tried.",
  },
];

export default function MyReviewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <MyReview reviews={dummyReviews} />
    </div>
  );
}