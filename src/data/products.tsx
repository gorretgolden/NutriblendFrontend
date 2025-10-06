export type Product = {
  id: number;
  title: string;
  category: string;
  brand: string;
  price: number;
  srcUrl: string; // rename from image
  discount: { amount: number; percentage: number }; // new field
  rating: number; // new field
  reviews?: number; // optional
};

// Static list of products
export const products: Product[] = [
  {
    id: 1,
    title: "Vitamin C Tablets",
    category: "Supplements",
    brand: "Pfizer",
    price: 20000,
    srcUrl: "/images/vitamin-c.jpg",
    discount: { amount: 0, percentage: 0 },
    rating: 4.5,
    reviews: 12,
  },
  {
    id: 2,
    title: "Protein Powder",
    category: "Sports",
    brand: "GSK",
    price: 85000,
    srcUrl: "/images/protein.jpg",
    discount: { amount: 5000, percentage: 0 },
    rating: 4.2,
    reviews: 8,
  },
  {
    id: 3,
    title: "Herbal Sex Booster",
    category: "Sexual Health",
    brand: "Pfizer",
    price: 30000,
    srcUrl: "/images/sex-booster.jpg",
    discount: { amount: 0, percentage: 10 },
    rating: 4.7,
    reviews: 15,
  },
  // ... add the rest similarly
];
