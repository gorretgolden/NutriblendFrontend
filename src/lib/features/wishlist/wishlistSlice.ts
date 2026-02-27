import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient, type WishlistItem } from "@/lib/api/client";

interface WishlistState {
    items: WishlistItem[];
    isLoading: boolean;
    error: string | null;
}

const initialState: WishlistState = {
    items: [],
    isLoading: false,
    error: null,
};

// Async thunks
export const fetchWishlist = createAsyncThunk(
    "wishlist/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.getWishlist();
            if (response.status && response.data) {
                return response.data;
            }
            return rejectWithValue(response.message);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const addToWishlistAsync = createAsyncThunk(
    "wishlist/add",
    async (productId: number, { rejectWithValue }) => {
        try {
            const response = await apiClient.addToWishlist(productId);
            if (response.status && response.data) {
                return response.data;
            }
            return rejectWithValue(response.message);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeFromWishlistAsync = createAsyncThunk(
    "wishlist/remove",
    async (productId: number, { rejectWithValue }) => {
        try {
            const response = await apiClient.removeFromWishlist(productId);
            if (response.status) {
                return productId;
            }
            return rejectWithValue(response.message);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const moveToCartAsync = createAsyncThunk(
    "wishlist/moveToCart",
    async (
        { productId, quantity = 1 }: { productId: number; quantity?: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.moveToCart(productId, quantity);
            if (response.status) {
                return productId;
            }
            return rejectWithValue(response.message);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch wishlist
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Add to wishlist
        builder
            .addCase(addToWishlistAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToWishlistAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items.push(action.payload);
            })
            .addCase(addToWishlistAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Remove from wishlist
        builder
            .addCase(removeFromWishlistAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = state.items.filter(
                    (item) => item.product_id !== action.payload
                );
            })
            .addCase(removeFromWishlistAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Move to cart
        builder
            .addCase(moveToCartAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(moveToCartAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = state.items.filter(
                    (item) => item.product_id !== action.payload
                );
            })
            .addCase(moveToCartAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
