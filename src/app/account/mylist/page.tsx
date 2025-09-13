// src/app/accounts/mylist/page.tsx

import React from "react";
import MyList from "@/components/accounts/MyList";

// Define the type for a product to ensure data consistency
type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

// Create some static dummy data to display on the page
const dummyProducts: Product[] = [
  {
    id: "prod-1",
    name: "california Gold Nutrition DHA 700",
    price: 299.99,
    imageUrl: "https://via.placeholder.com/300"
  },
  {
    id: "prod-2",
    name: "omega 3 fish oil",
    price: 150.00,
    imageUrl: "https://via.placeholder.com/300"
  },
  {
    id: "prod-3",
    name: "omega 800 ultra-concentrated",
    price: 450.00,
    imageUrl: "https://via.placeholder.com/300"
  },
  {
    id: "prod-4",
    name: "4K Ultra HD Monitor",
    price: 320.50,
    imageUrl: "https://via.placeholder.com/300"
  },
];

export default function MyListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <MyList products={dummyProducts} />
    </div>
  );
}