import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { apiClient, getImageUrl } from "@/lib/api/client";
import { toast } from "sonner";

// ==================== Types ====================

export type CartItem = {
  id: number;
  name: string;
  srcUrl: string;
  price: number;
  quantity: number;
  product_id: number;
  variation_id?: number;
  variation_name?: string;
  attributes?: string[];
  discount?: {
    amount: number;
    percentage: number;
  };
};

export type Cart = {
  items: CartItem[];
  totalQuantities: number;
};

interface CartsState {
  cart: Cart | null;
  totalPrice: number;
  adjustedTotalPrice: number;
  promoCode: string | null;
  isLoading: boolean;
  error: string | null;
  isSynced: boolean;
}

// ==================== Helper ====================

/**
 * Transform a backend cart response into local Cart state.
 * Backend returns: { items: [...], total: number, item_count: number }
 */
function transformBackendCart(backendCart: any): { cart: Cart; totalPrice: number } {
  const items: CartItem[] = (backendCart.items || []).map((item: any) => ({
    id: item.id,
    name: item.product_name || item.product?.name || "Unknown Product",
    srcUrl: (() => {
      if (item.product_image) return getImageUrl(item.product_image);
      const firstImg = item.product?.images?.[0];
      if (!firstImg) return "/images/placeholder.jpg";
      return typeof firstImg === "string"
        ? getImageUrl(firstImg)
        : getImageUrl(firstImg.image_path || firstImg.image_url || "");
    })(),
    price: item.price || item.product?.price || 0,
    quantity: item.quantity,
    product_id: item.product_id,
    variation_id: item.variation_id,
  }));

  const totalQuantities = items.length;
  const totalPrice = backendCart.total || backendCart.subtotal || items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    cart: { items, totalQuantities },
    totalPrice,
  };
}

// ==================== Initial State ====================

const initialState: CartsState = {
  cart: null,
  totalPrice: 0,
  adjustedTotalPrice: 0,
  promoCode: null,
  isLoading: false,
  error: null,
  isSynced: false,
};

// ==================== Async Thunks ====================

// Fetch cart from backend (for logged-in users)
export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.getCart();
      if (response.status && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || "Failed to fetch cart");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch cart");
    }
  }
);

// Unified addToCart thunk
export const addToCart = createAsyncThunk(
  "cart/add",
  async (
    item: { product_id: number; quantity: number; variation_id?: number;[key: string]: any },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state: any = getState();
      const isAuthenticated = state.auth?.isAuthenticated;

      if (isAuthenticated) {
        // Add to backend cart
        const response = await apiClient.addToCart({
          product_id: item.product_id,
          quantity: item.quantity,
          variation_id: item.variation_id,
        });

        if (response.status && response.data) {
          // Return the full backend cart directly — reducer will update state
          return { backendCart: response.data, backend: true };
        }
        return rejectWithValue(response.message || "Failed to add to cart");
      } else {
        // Form the local cart item
        const localItem: CartItem = {
          id: Date.now(),
          product_id: item.product_id,
          variation_id: item.variation_id,
          quantity: item.quantity,
          name: item.name || "Product",
          price: item.price || 0,
          srcUrl: item.srcUrl || "",
        };

        dispatch(addToCartLocal(localItem));
        return { item: localItem, backend: false };
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add to cart");
    }
  }
);

// Remove from cart (Unified)
export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (itemId: number, { getState, dispatch, rejectWithValue }) => {
    try {
      const state: any = getState();
      const isAuthenticated = state.auth?.isAuthenticated;

      if (isAuthenticated) {
        const response = await apiClient.removeFromCart(itemId);
        if (response.status && response.data) {
          return { backendCart: response.data, backend: true };
        }
        if (response.status) {
          // Some responses might not include data, refetch
          dispatch(fetchCart());
          return { itemId, backend: true, refetching: true };
        }
        return rejectWithValue(response.message || "Failed to remove from cart");
      } else {
        dispatch(removeFromCartLocal(itemId));
        return { itemId, backend: false };
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to remove from cart");
    }
  }
);

// Alias
export const removeCartItem = removeFromCart;
export const remove = removeFromCart;

// Update cart item quantity
export const updateCartItemAsync = createAsyncThunk(
  "cart/update",
  async (
    { itemId, quantity }: { itemId: number; quantity: number },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state: any = getState();
      const isAuthenticated = state.auth?.isAuthenticated;

      if (isAuthenticated) {
        const response = await apiClient.updateCartItem(itemId, quantity);
        if (response.status && response.data) {
          return { backendCart: response.data, backend: true };
        }
        return rejectWithValue(response.message || "Failed to update cart");
      } else {
        return { itemId, quantity, backend: false };
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update cart");
    }
  }
);

// Clear cart
export const clearCartAsync = createAsyncThunk(
  "cart/clear",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const isAuthenticated = state.auth?.isAuthenticated;

      if (isAuthenticated) {
        const response = await apiClient.clearCart();
        if (response.status) {
          return { backend: true };
        }
        return rejectWithValue(response.message || "Failed to clear cart");
      } else {
        return { backend: false };
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to clear cart");
    }
  }
);

// ==================== Slice ====================

export const cartsSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    // Local cart actions (for guests)
    addToCartLocal: (state, action: PayloadAction<CartItem>) => {
      if (state.cart === null) {
        state.cart = {
          items: [action.payload],
          totalQuantities: 1,
        };
      } else {
        const existingItem = state.cart.items.find(
          (item) =>
            item.product_id === action.payload.product_id &&
            item.variation_id === action.payload.variation_id
        );

        if (existingItem) {
          state.cart.items = state.cart.items.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          );
        } else {
          state.cart.items.push(action.payload);
        }
        state.cart.totalQuantities = state.cart.items.length;
      }

      state.totalPrice = state.cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      state.adjustedTotalPrice = state.totalPrice;
    },

    removeFromCartLocal: (state, action: PayloadAction<number>) => {
      if (!state.cart) return;

      state.cart.items = state.cart.items.filter((i) => i.id !== action.payload);
      state.cart.totalQuantities = state.cart.items.length;
      state.totalPrice = state.cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      state.adjustedTotalPrice = state.totalPrice;
    },

    clearCartLocal: (state) => {
      state.cart = null;
      state.totalPrice = 0;
      state.adjustedTotalPrice = 0;
      state.promoCode = null;
    },

    setPromoCode: (state, action: PayloadAction<string | null>) => {
      state.promoCode = action.payload;
    },

    setAdjustedPrice: (state, action: PayloadAction<number>) => {
      state.adjustedTotalPrice = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ===== Fetch cart =====
    builder.addCase(fetchCart.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.isSynced = true;
      const { cart, totalPrice } = transformBackendCart(action.payload);
      state.cart = cart;
      state.totalPrice = totalPrice;
      state.adjustedTotalPrice = totalPrice;
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ===== Add to cart =====
    builder.addCase(addToCart.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action: any) => {
      state.isLoading = false;
      if (action.payload.backend && action.payload.backendCart) {
        // Immediately update local state from backend response
        const { cart, totalPrice } = transformBackendCart(action.payload.backendCart);
        state.cart = cart;
        state.totalPrice = totalPrice;
        state.adjustedTotalPrice = totalPrice;
        state.isSynced = true;
      }
      // Local cart is already updated by dispatch(addToCartLocal) for guests
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ===== Clear cart =====
    builder.addCase(clearCartAsync.fulfilled, (state) => {
      state.cart = null;
      state.totalPrice = 0;
      state.adjustedTotalPrice = 0;
      state.isSynced = true;
      toast.success("Cart cleared!");
    });

    // ===== Remove from cart =====
    builder.addCase(removeFromCart.fulfilled, (state, action: any) => {
      state.isLoading = false;
      if (action.payload.backend && action.payload.backendCart) {
        const { cart, totalPrice } = transformBackendCart(action.payload.backendCart);
        state.cart = cart;
        state.totalPrice = totalPrice;
        state.adjustedTotalPrice = totalPrice;
        state.isSynced = true;
      } else if (!action.payload.backend) {
        // Local cart already updated by dispatch(removeFromCartLocal)
      }
      toast.success("Item removed from cart");
    });

    // ===== Update cart =====
    builder.addCase(updateCartItemAsync.fulfilled, (state, action: any) => {
      state.isLoading = false;
      if (action.payload.backend && action.payload.backendCart) {
        const { cart, totalPrice } = transformBackendCart(action.payload.backendCart);
        state.cart = cart;
        state.totalPrice = totalPrice;
        state.adjustedTotalPrice = totalPrice;
        state.isSynced = true;
      } else if (!action.payload.backend) {
        const { itemId, quantity } = action.payload;
        if (state.cart) {
          state.cart.items = state.cart.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          );
          state.cart.totalQuantities = state.cart.items.length;
          state.totalPrice = state.cart.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          state.adjustedTotalPrice = state.totalPrice;
        }
      }
    });

    builder.addCase(updateCartItemAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(state.error || "Failed to update quantity");
    });

    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(state.error || "Failed to remove item");
    });
  },
});

export const {
  addToCartLocal,
  removeFromCartLocal,
  clearCartLocal,
  setPromoCode,
  setAdjustedPrice,
} = cartsSlice.actions;

export default cartsSlice.reducer;
