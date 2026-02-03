import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { apiClient, CartItem as ApiCartItem, CartSummary } from "@/lib/api/client";

// ==================== Types ====================

export type CartItem = {
  id: number;
  name: string;
  srcUrl: string;
  price: number;
  quantity: number;
  product_id: number;
  variation_id?: number;
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
  isSynced: boolean; // Whether cart is synced with backend
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
          variation_id: item.variation_id
        });
        if (response.status && response.data) {
          return { item: response.data, backend: true };
        }
        return rejectWithValue(response.message || "Failed to add to cart");
      } else {
        // Form the local cart item
        const localItem: CartItem = {
          id: Date.now(), // Temp ID for guests
          product_id: item.product_id,
          variation_id: item.variation_id,
          quantity: item.quantity,
          name: item.name || "Product",
          price: item.price || 0,
          srcUrl: item.srcUrl || ""
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
        if (response.status) {
          return { itemId, backend: true };
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

// Alias or specific quantity reduction if needed (optional, keeping it simple for now)
export const removeCartItem = removeFromCart;
export const remove = removeFromCart;

// Update cart item quantity
export const updateCartItemAsync = createAsyncThunk(
  "cart/update",
  async (
    { itemId, quantity }: { itemId: number; quantity: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const state: any = getState();
      const isAuthenticated = state.auth?.isAuthenticated;

      if (isAuthenticated) {
        const response = await apiClient.updateCartItem(itemId, quantity);
        if (response.status && response.data) {
          return { item: response.data, backend: true };
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
          totalQuantities: action.payload.quantity,
        };
      } else {
        const existingItem = state.cart.items.find(
          (item) => item.product_id === action.payload.product_id &&
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
        state.cart.totalQuantities = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
      }

      state.totalPrice = state.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      state.adjustedTotalPrice = state.totalPrice; // Basic sync
    },

    removeFromCartLocal: (state, action: PayloadAction<number>) => {
      if (!state.cart) return;

      state.cart.items = state.cart.items.filter((i) => i.id !== action.payload);
      state.cart.totalQuantities = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
    // Fetch cart
    builder.addCase(fetchCart.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.isSynced = true;
      // Transform backend cart to local format
      if (action.payload.items) {
        state.cart = {
          items: action.payload.items.map((item: ApiCartItem) => ({
            id: item.id,
            name: item.product.name,
            srcUrl: item.product.images?.[0]?.image_path || "",
            price: item.product.price,
            quantity: item.quantity,
            product_id: item.product_id,
            variation_id: item.variation_id,
          })),
          totalQuantities: action.payload.items.reduce(
            (sum: number, item: ApiCartItem) => sum + item.quantity,
            0
          ),
        };
        state.totalPrice = action.payload.subtotal || 0;
        state.adjustedTotalPrice = action.payload.total || state.totalPrice;
      }
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Add to cart
    builder.addCase(addToCart.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action: any) => {
      state.isLoading = false;
      if (action.payload.backend) {
        // Backend cart updated, refetch
        state.isSynced = false;
      } else {
        // Local cart, state already updated by dispatch(addToCartLocal)
      }
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Clear cart
    builder.addCase(clearCartAsync.fulfilled, (state) => {
      state.cart = null;
      state.totalPrice = 0;
      state.isSynced = true;
    });
  },
});

export const {
  addToCartLocal,
  removeFromCartLocal,
  clearCartLocal,
  setPromoCode,
  setAdjustedPrice
} = cartsSlice.actions;

export default cartsSlice.reducer;
