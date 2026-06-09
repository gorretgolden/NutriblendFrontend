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
  name?: string;
  slug?: string;
  sku?: string;
  srcUrl: string;
  main_image?: string;
  gallery?: string[];
  price: number;
  unit?: string;
  wholesale_price?: number;
  wholesale_min_qty?: number;
  discount: Discount;
  rating: number;
  reviews?: number;
  reviewList?: Review[];
  brand?: string;
  category?: string;
  description?: string;
  shortDescription?: string;
  keyFeatures?: string[];
  whatsInBox?: string;
  stock?: number;
  stock_quantity?: number;
  weight?: number;
  weight_unit?: string;
  inStock?: boolean;
  variations?: {
    id: number;
    name: string;
    price: number;
    stock: number;
  }[];
};
