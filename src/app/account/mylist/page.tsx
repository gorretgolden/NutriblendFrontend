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
    imageUrl: "/images/bottle1.avif"
  },
  {
    id: "prod-2",
    name: "omega 3 premium fish oil ",
    price: 150.00,
    imageUrl: "/images/bottle2.avif"
  },
  {
    id: "prod-3",
    name: "omega 800 ultra-concentrated",
    price: 450.00,
    imageUrl: "/images/bottle3.avif"
  },
  {
    id: "prod-4",
    name: "Omega-3 Fish Oil",
    price: 320.50,
    imageUrl: "/images/bottle4.avif"
  },
];

export default function MyListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <MyList products={dummyProducts} />
    </div>
  );
}