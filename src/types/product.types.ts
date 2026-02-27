export type Discount = {
  amount: number;
  percentage: number;
};

export type Review = {
  user: string;
  comment: string;
  rating: number;
  date: string;
};


export type Product = {
  id: number;
  title: string;
  slug?: string;
  sku?: string;
  srcUrl: string;
  gallery?: string[];
  price: number;
  wholesale_price?: number;
  wholesale_min_qty?: number;
  discount: Discount;
  rating: number;
  reviews?: number;
  reviewList?: Review[];
  brand?: string;
  description?: string;
  shortDescription?: string;
  keyFeatures?: string[];
  whatsInBox?: string;
  stock?: number;
  weight?: number;
  inStock?: boolean;
  variations?: {
    id: number;
    name: string;
    price: number;
    stock: number;
  }[];
};
