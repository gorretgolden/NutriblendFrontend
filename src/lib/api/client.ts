/**
 * NutriBlend Haven API Client
 * Matches Laravel backend structure exactly
 * Base URL: http://localhost:8000/api/v1
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// ==================== Type Definitions ====================

export interface ApiResponse<T = any> {
    status: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
    error?: string;
}

export interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface User {
    id: number;
    name?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    contact?: string;
    role?: string;
    profile_photo?: string;
    address?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    short_description?: string;
    description: string;
    price: number;
    discount_percentage?: number;
    stock_quantity: number;
    category_id: number;
    brand_id?: number;
    is_featured: boolean;
    is_active: boolean;
    images: any[]; // JSON array of storage path strings OR ProductImage objects
    product_images?: ProductImage[]; // Related ProductImage records from API
    category?: Category;
    brand?: Brand;
    variations?: ProductVariation[];
    average_rating?: number;
    review_count?: number;
    created_at: string;
    updated_at: string;
}

export interface ProductImage {
    id: number;
    product_id: number;
    image_path?: string;
    image_url?: string;
    alt_text?: string;
    is_primary: boolean;
    sort_order?: number;
    position?: number;
}

export interface ProductVariation {
    id: number;
    product_id: number;
    name: string;
    price: number;
    stock_quantity: number;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image_path?: string;
    parent_id?: number;
    is_active: boolean;
}

export interface Brand {
    id: number;
    name: string;
    slug: string;
    logo_path?: string;
    is_active: boolean;
}

export interface CartItem {
    id: number;
    product_id: number;
    product_name: string;
    variation_id?: number;
    variation_name?: string;
    quantity: number;
    price: number;
    subtotal: number;
    product_image?: string;
    // Legacy support
    product?: Product;
    variation?: ProductVariation;
}

export interface CartSummary {
    items: CartItem[];
    total: number;
    item_count: number;
    subtotal?: number;
    tax?: number;
}

export interface Region {
    id: number;
    name: string;
    towns?: Town[];
}

export interface Town {
    id: number;
    region_id: number;
    name: string;
    delivery_fee: number;
}

export interface Discount {
    id: number;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    min_purchase_amount?: number;
    max_discount_amount?: number;
    valid_from: string;
    valid_until: string;
    is_active: boolean;
}

export interface Order {
    id: number;
    order_number: string;
    user_id: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    subtotal: number;
    delivery_fee: number;
    discount_amount: number;
    total_amount: number;
    delivery_region_id: number;
    delivery_town_id: number;
    delivery_address: string;
    notes?: string;
    items: OrderItem[];
    region?: Region;
    town?: Town;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    variation_id?: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
    product: Product;
    variation?: ProductVariation;
}

export interface WishlistItem {
    id: number;
    user_id: number;
    product_id: number;
    product: Product;
    created_at: string;
}

export interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    read_at?: string;
    created_at: string;
}

export interface Page {
    id: number;
    title: string;
    slug: string;
    content: PageContent[];
    meta_title?: string;
    meta_description?: string;
    type: 'about' | 'contact' | 'faq' | 'terms' | 'privacy' | 'custom';
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PageContent {
    type: 'hero' | 'text' | 'features' | 'faq_item' | 'contact_info';
    heading?: string;
    text?: string;
    items?: Array<{
        title: string;
        description?: string;
        icon?: string;
    }>;
    contact_details?: Record<string, string>;
}

// ==================== API Client Class ====================

class NutriBlendApiClient {
    private baseURL: string;
    private headers: HeadersInit;

    constructor() {
        this.baseURL = API_BASE_URL;
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }

    private getAuthHeaders(): HeadersInit {
        if (typeof window === 'undefined') return this.headers;

        const token = localStorage.getItem('auth_token');
        return {
            ...this.headers,
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const config: RequestInit = {
                ...options,
                headers: {
                    ...this.getAuthHeaders(),
                    ...options.headers,
                },
            };

            const response = await fetch(url, config);

            // Handle logical errors before parsing JSON
            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    return {
                        status: false,
                        message: errorData.message || `Error: ${response.status} ${response.statusText}`,
                        errors: errorData.errors
                    };
                }

                return {
                    status: false,
                    message: `Server error: ${response.status} ${response.statusText}`,
                };
            }

            const data: ApiResponse<T> = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            return {
                status: false,
                message: error instanceof Error ? error.message : 'Network error occurred',
            };
        }
    }

    private async post<T>(
        endpoint: string,
        body: any
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    // ==================== Authentication ====================

    async register(userData: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        password: string;
        password_confirmation: string;
    }): Promise<ApiResponse<{ user: User; token: string }>> {
        const response = await this.request<{ user: User; token: string }>(
            '/auth/register',
            {
                method: 'POST',
                body: JSON.stringify(userData),
            }
        );

        if (response.status && response.data) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response;
    }

    async login(credentials: {
        email: string;
        password: string;
    }): Promise<ApiResponse<{ user: User; token: string }>> {
        const response = await this.request<{ user: User; token: string }>(
            '/auth/login',
            {
                method: 'POST',
                body: JSON.stringify(credentials),
            }
        );

        if (response.status && response.data) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response;
    }

    async logout(): Promise<ApiResponse<void>> {
        const response = await this.request<void>('/auth/logout', {
            method: 'POST',
        });

        if (response.status) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            localStorage.removeItem('cart');
        }

        return response;
    }

    async getProfile(): Promise<ApiResponse<User>> {
        return this.request<User>('/me');
    }

    async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
        return this.request<User>('/me', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async changePassword(data: {
        old_password: string;
        password: string;
        password_confirmation: string;
    }): Promise<ApiResponse<void>> {
        return this.request<void>('/me/password', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // ==================== Products ====================

    async getProducts(params?: {
        page?: number;
        per_page?: number;
        search?: string;
        category_id?: number;
        brand_id?: number;
        min_price?: number;
        max_price?: number;
        is_featured?: boolean;
        is_new_arrival?: boolean;
        on_sale?: boolean;
        sort?: string;
    }): Promise<ApiResponse<PaginatedResponse<Product>>> {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, String(value));
                }
            });
        }

        return this.request<PaginatedResponse<Product>>(
            `/products?${queryParams.toString()}`
        );
    }

    async getProduct(productId: number | string): Promise<ApiResponse<Product>> {
        return this.request<Product>(`/products/${productId}`);
    }

    // ==================== Categories & Brands ====================

    async getCategories(): Promise<ApiResponse<Category[]>> {
        return this.request<Category[]>('/categories');
    }

    async getCategoriesTree(): Promise<ApiResponse<Category[]>> {
        return this.request<Category[]>('/categories/tree');
    }

    async getBrands(): Promise<ApiResponse<Brand[]>> {
        return this.request<Brand[]>('/brands');
    }

    // ==================== Shopping Cart ====================

    async getCart(): Promise<ApiResponse<CartSummary>> {
        return this.request<CartSummary>('/cart');
    }

    async addToCart(data: {
        product_id: number;
        quantity: number;
        variation_id?: number;
    }): Promise<ApiResponse<CartSummary>> {
        return this.request<CartSummary>('/cart', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateCartItem(
        cartItemId: number,
        quantity: number
    ): Promise<ApiResponse<CartSummary>> {
        return this.request<CartSummary>(`/cart/${cartItemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
        });
    }

    async removeFromCart(cartItemId: number): Promise<ApiResponse<CartSummary>> {
        return this.request<CartSummary>(`/cart/${cartItemId}`, {
            method: 'DELETE',
        });
    }

    async clearCart(): Promise<ApiResponse<void>> {
        return this.request<void>('/cart/clear/all', {
            method: 'DELETE',
        });
    }

    async getCartSummary(): Promise<ApiResponse<CartSummary>> {
        return this.request<CartSummary>('/cart/summary');
    }

    // ==================== Wishlist ====================

    async getWishlist(): Promise<ApiResponse<WishlistItem[]>> {
        return this.request<WishlistItem[]>('/wishlist');
    }

    async addToWishlist(productId: number): Promise<ApiResponse<WishlistItem>> {
        return this.request<WishlistItem>('/wishlist', {
            method: 'POST',
            body: JSON.stringify({ product_id: productId }),
        });
    }

    async removeFromWishlist(productId: number): Promise<ApiResponse<void>> {
        return this.request<void>(`/wishlist/${productId}`, {
            method: 'DELETE',
        });
    }

    async moveToCart(
        productId: number,
        quantity: number = 1,
        variationId?: number
    ): Promise<ApiResponse<CartSummary>> {
        return this.request<CartSummary>(`/wishlist/${productId}/move-to-cart`, {
            method: 'POST',
            body: JSON.stringify({ quantity, variation_id: variationId }),
        });
    }

    // ==================== Delivery ====================

    async getRegions(): Promise<ApiResponse<Region[]>> {
        return this.request<Region[]>('/regions');
    }

    async getTowns(regionId: number): Promise<ApiResponse<Town[]>> {
        return this.request<Town[]>(`/regions/${regionId}/towns`);
    }

    async calculateDeliveryFee(data: {
        region_id: number;
        town_id: number;
    }): Promise<ApiResponse<{ fee: number }>> {
        return this.request<{ fee: number }>('/delivery/calculate-fee', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // ==================== Discounts ====================

    async validateDiscount(data: {
        code: string;
        total_amount: number;
    }): Promise<
        ApiResponse<{
            discount_amount: number;
            final_amount: number;
            discount: Discount;
        }>
    > {
        return this.request<{
            discount_amount: number;
            final_amount: number;
            discount: Discount;
        }>('/discounts/validate', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getActiveDiscounts(): Promise<ApiResponse<Discount[]>> {
        return this.request<Discount[]>('/discounts/active');
    }

    // ==================== Orders ====================

    async createOrder(orderData: {
        items: { product_id: number; quantity: number; variation_id?: number }[];
        delivery_region_id: number;
        delivery_town_id: number;
        delivery_address: string;
        discount_code?: string;
        notes?: string;
        payment_method?: string;
    }): Promise<ApiResponse<Order>> {
        return this.request<Order>('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    async getOrders(params?: {
        page?: number;
        status?: string;
    }): Promise<ApiResponse<PaginatedResponse<Order>>> {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, String(value));
                }
            });
        }

        return this.request<PaginatedResponse<Order>>(
            `/orders?${queryParams.toString()}`
        );
    }

    async getOrder(orderNumber: string): Promise<ApiResponse<Order>> {
        return this.request<Order>(`/orders/${orderNumber}`);
    }

    async cancelOrder(orderNumber: string): Promise<ApiResponse<Order>> {
        return this.request<Order>(`/orders/${orderNumber}/cancel`, {
            method: 'POST',
        });
    }

    getInvoiceUrl(orderNumber: string): string {
        const token = localStorage.getItem('auth_token');
        return `${this.baseURL}/orders/${orderNumber}/invoice?token=${token}`;
    }

    // ==================== Notifications ====================

    async getNotifications(
        page: number = 1
    ): Promise<ApiResponse<PaginatedResponse<Notification>>> {
        return this.request<PaginatedResponse<Notification>>(
            `/notifications?page=${page}`
        );
    }

    async getUnreadCount(): Promise<ApiResponse<{ unread_count: number }>> {
        return this.request<{ unread_count: number }>('/notifications/unread');
    }

    async markAsRead(notificationId: number): Promise<ApiResponse<void>> {
        return this.request<void>(`/notifications/${notificationId}/mark-read`, {
            method: 'POST',
        });
    }

    async markAllAsRead(): Promise<ApiResponse<void>> {
        return this.request<void>('/notifications/mark-all-read', {
            method: 'POST',
        });
    }

    // ==================== Pages ====================

    async getPages(type?: string): Promise<ApiResponse<Page[]>> {
        const queryParams = type ? `?type=${type}` : '';
        return this.request<Page[]>(`/pages${queryParams}`);
    }

    async getPage(slug: string): Promise<ApiResponse<Page>> {
        return this.request<Page>(`/pages/${slug}`);
    }

    async getPageByType(type: 'about' | 'contact' | 'faq' | 'terms' | 'privacy'): Promise<ApiResponse<Page>> {
        return this.request<Page>(`/pages/type/${type}`);
    }

    // ==================== Settings ====================

    async getPublicSettings(): Promise<ApiResponse<Record<string, any>>> {
        return this.request<Record<string, any>>('/settings/public');
    }

    // Newsletter subscription
    async subscribeToNewsletter(email: string): Promise<ApiResponse> {
        return this.post('/newsletter/subscribe', { email });
    }
}

// ==================== Export Singleton ====================

export const apiClient = new NutriBlendApiClient();

// ==================== Helper Functions ====================

export const getImageUrl = (path: string): string => {
    if (!path) return '/images/placeholder.jpg';
    if (path.startsWith('http')) return path;

    // If it's a local frontend image, return it as is
    if (path.startsWith('/images/')) return path;
    if (path.startsWith('images/')) return '/' + path;

    // Derive backend origin from NEXT_PUBLIC_API_URL (strip /api/v1 suffix)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const baseUrl = process.env.NEXT_PUBLIC_ASSET_URL || apiUrl.replace(/\/api\/v1\/?$/, '');

    // If it's a backend storage path, ensure it starts with /storage/
    let finalPath = path.startsWith('/') ? path : '/' + path;
    if (!finalPath.startsWith('/storage/')) {
        finalPath = '/storage' + finalPath;
    }

    return `${baseUrl}${finalPath}`;
};

export const formatPrice = (
    price: number,
    currency: string = 'UGX'
): string => {
    return new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
    }).format(price);
};

export const calculateDiscount = (
    price: number,
    discountPercentage: number
): number => {
    return price - (price * discountPercentage) / 100;
};

export const isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('auth_token') !== null;
};

export const getStoredUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
};
