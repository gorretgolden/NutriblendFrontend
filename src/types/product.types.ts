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
  srcUrl: string;
  gallery?: string[];
  price: number;
  discount: Discount;
  rating: number;
  reviews?: number;
  reviewList?: Review[];
  brand?: string;
  description?: string;
  shortDescription?: string;
  variations?: {
    id: number;
    name: string;
    price: number;
    stock: number;
  }[];
};
