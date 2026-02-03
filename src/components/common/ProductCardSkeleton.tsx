import React from "react";
import Skeleton from "./Skeleton";

const ProductCardSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full animate-pulse">
            <div className="bg-gray-100 w-full h-[220px]" />
            <div className="p-5 flex flex-col flex-grow bg-white space-y-3">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-5 w-full" />
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-3 w-3 rounded-full" />
                    ))}
                </div>
                <Skeleton className="h-8 w-1/2 mt-2" />
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
