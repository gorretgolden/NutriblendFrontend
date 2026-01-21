import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient, User, ApiResponse } from "@/lib/api/client";

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await apiClient.login(credentials);
            if (response.status && response.data) {
                return response.data;
            }
            return rejectWithValue(response.message || "Login failed");
        } catch (error: any) {
            return rejectWithValue(error.message || "Login failed");
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        password: string;
        password_confirmation: string;
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.register(userData);
            if (response.status && response.data) {
                return response.data;
            }
            return rejectWithValue(response.message || "Registration failed");
        } catch (error: any) {
            return rejectWithValue(error.message || "Registration failed");
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await apiClient.logout();
            return null;
        } catch (error: any) {
            return rejectWithValue(error.message || "Logout failed");
        }
    }
);

export const fetchUserProfile = createAsyncThunk(
    "auth/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.getProfile();
            if (response.status && response.data) {
                return response.data;
            }
            return rejectWithValue(response.message || "Failed to fetch profile");
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch profile");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            // Clear local storage manually if needed (apiClient does it too)
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Register
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Logout
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        });

        // Fetch Profile
        builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        });
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
