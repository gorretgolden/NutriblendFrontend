import React from 'react';

export default function ProductDetailsLoading() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Breadcrumbs Skeleton */}
      <div className="h-4 bg-gray-200 rounded w-48 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Left Column - Images */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-[4/3] bg-gray-200 rounded-3xl" />
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="flex flex-col gap-6">
          <div className="h-6 bg-gray-200 rounded w-24" />
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-32" />
          
          <div className="h-12 bg-gray-200 rounded w-48 mt-4" />
          
          <div className="space-y-3 mt-6">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>

          <div className="flex items-center gap-4 mt-8">
            <div className="h-14 bg-gray-200 rounded-full w-32" />
            <div className="h-14 bg-gray-200 rounded-full flex-grow" />
            <div className="h-14 bg-gray-200 rounded-full w-14" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-16">
        <div className="flex gap-8 border-b border-gray-200 pb-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 bg-gray-200 rounded w-24" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
}
