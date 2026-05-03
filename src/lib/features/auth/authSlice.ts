import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient, User, ApiResponse } from "@/lib/api/client";

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const getInitialAuth = () => {
    if (typeof window === 'undefined') return { user: null, token: null, isAuthenticated: false };

    const token = localStorage.getItem('auth_token');
    const userJson = localStorage.getItem('user');

    if (token && userJson) {
        try {
            return {
                user: JSON.parse(userJson),
                token,
                isAuthenticated: true
            };
        } catch (e) {
            return { user: null, token: null, isAuthenticated: false };
        }
    }
    return { user: null, token: null, isAuthenticated: false };
};

const auth = getInitialAuth();

const initialState: AuthState = {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
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
        region_id?: number;
        town_id?: number;
        location?: string;
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

export const registerWholesaleUser = createAsyncThunk(
    "auth/registerWholesale",
    async (userData: {
        name: string;
        email: string;
        phone: string;
        password: string;
        wholesale_business_name: string;
        wholesale_business_details: string;
        region_id?: string | number;
        town_id?: string | number;
        location?: string;
    }, { rejectWithValue }) => {
        try {
            const response = await apiClient.registerWholesale(userData);
            if (response.status) {
                return response.data;
            }
            return rejectWithValue(response.message || "Wholesale registration failed");
        } catch (error: any) {
            return rejectWithValue(error.message || "Wholesale registration failed");
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
        clearError: (state) => {
            state.error = null;
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
            // Persist to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            }
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
            // Persist to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            }
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Register Wholesale
        builder.addCase(registerWholesaleUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(registerWholesaleUser.fulfilled, (state) => {
            state.isLoading = false;
            // No login yet, pending approval
        });
        builder.addCase(registerWholesaleUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Logout
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            // Clear localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
            }
        });

        // Fetch Profile
        builder.addCase(fetchUserProfile.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            // Persist updated profile to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(action.payload));
            }
        });
        builder.addCase(fetchUserProfile.rejected, (state, action) => {
            state.isLoading = false;
            // Do NOT clear auth state on profile fetch failure.
            // The user may simply be offline or the server may be down.
            // Only clear if the error indicates an invalid/expired token (401).
            const errorMsg = (action.payload as string) || '';
            if (errorMsg.includes('401') || errorMsg.includes('Unauthenticated') || errorMsg.includes('Token')) {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                }
            }
        });
    },
});

export const { setCredentials, clearError, logout } = authSlice.actions;
export default authSlice.reducer;
