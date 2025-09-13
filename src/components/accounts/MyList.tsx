// src/components/accounts/MyList.tsx

import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

// Define the type for a product
type Product = {
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
    return <div className="text-center py-10 text-gray-500">Your list is empty.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <Card key={product.id}>
          <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
          <CardContent className="p-4">
            <CardTitle>{product.name}</CardTitle>
            <p className="text-xl font-bold mt-2">${product.price.toFixed(2)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyList;