// src/app/account/myreview/page.tsx
"use client";

import React from "react";
import { FaStar, FaPen } from "react-icons/fa";

export default function MyReviewsPage() {
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

      {/* Empty State */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaPen className="w-8 h-8 text-amber-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No reviews yet</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          After purchasing products, you can share your experience by leaving reviews
          on their product pages. Your feedback helps other customers!
        </p>
      </div>
    </div>
  );
}