import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";
import { FiSliders } from "react-icons/fi";
import ProductCardSkeleton from "@/components/common/ProductCardSkeleton";
import Skeleton from "@/components/common/Skeleton";

export default function Loading() {
    return (
        <main className="pb-20">
            <div className="max-w-frame mx-auto px-4 xl:px-0">
                <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
                <BreadcrumbShop />
                <div className="flex md:space-x-5 items-start">
                    <div className="hidden md:block min-w-[295px] max-w-[295px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-black text-xl">Filters</span>
                            <FiSliders className="text-2xl text-black/40" />
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col w-full space-y-5">
                        <div className="flex flex-col lg:flex-row lg:justify-between">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-10 w-48" />
                            </div>
                            <div className="flex items-center">
                                <Skeleton className="h-6 w-32" />
                            </div>
                        </div>

                        {/* Shimmer Grid */}
                        <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
