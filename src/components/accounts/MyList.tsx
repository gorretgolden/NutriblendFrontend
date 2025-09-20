// src/components/accounts/MyList.tsx

import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";

// Make sure to export this type so it can be used in your page file.
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
        {/* Your list is empty. */}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id}>
          <div className="relative w-full h-48 bg-white p-2">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-t-lg"
            />
          </div>
          <CardContent className="p-4">
            <CardTitle>{product.name}</CardTitle>
            <p className="text-xl font-bold mt-2">
              ${product.price.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyList;