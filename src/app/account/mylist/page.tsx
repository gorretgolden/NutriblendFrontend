'use client';

import React, { useEffect, useState } from "react";
import MyList from "@/components/accounts/MyList";
import { apiClient, getImageUrl } from "@/lib/api/client";

// Define the type for a product
type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export default function MyListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await apiClient.getWishlist();
        if (response.status && response.data) {
          // Transform API data to component format
          const transformedProducts = response.data.map((item) => ({
            id: item.product.id.toString(),
            name: item.product.name,
            price: item.product.price,
            imageUrl: item.product.images?.[0]?.image_path
              ? getImageUrl(item.product.images[0].image_path)
              : '/images/placeholder.jpg'
          }));
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist", error);
        // Show empty state on error
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {products.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500">Start adding products you love!</p>
        </div>
      ) : (
        <MyList products={products} />
      )}
    </div>
  );
}