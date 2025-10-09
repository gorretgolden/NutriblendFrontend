import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

type MyListProps = {
  products: Product[];
};

const MyList = ({ products }: MyListProps) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Your wishlist is empty.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className="flex flex-col items-center justify-between rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4"
        >
          {/* Product Image */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 bg-gray-50 rounded-md overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-2"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>

          {/* Product Info */}
          <div className="text-center mt-3">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-lg font-bold text-green-600 mt-1">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Action */}
          <button className="mt-3 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-green-700 transition">
            Add to Cart
          </button>
        </Card>
      ))}
    </div>
  );
};

export default MyList;
