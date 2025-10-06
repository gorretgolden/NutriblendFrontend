// src/components/accounts/MyList.tsx
import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          {/* Image Section */}
          <div className="relative w-full h-40 sm:h-48 bg-gray-50">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-2"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority
            />
          </div>

          {/* Content */}
          <CardContent className="p-3 sm:p-4">
            <CardTitle className="text-base sm:text-lg font-semibold line-clamp-2">
              {product.name}
            </CardTitle>
            <p className="text-lg sm:text-xl font-bold mt-2 text-gray-800">
              ${product.price.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyList;
