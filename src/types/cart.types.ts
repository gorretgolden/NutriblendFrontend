// types/cart.types.ts
import { Product } from "@/types/product.types";

export type CartItem = {
  product: Product;   
  quantity: number;
};
