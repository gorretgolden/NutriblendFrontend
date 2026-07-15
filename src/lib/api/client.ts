/**
 * NutriBlend Haven API Client
 * Matches Laravel backend structure exactly
 * Base URL: http://localhost:8000/api/v1
 */

const envApi = process.env.NEXT_PUBLIC_API_URL || '';
const isDev = process.env.NODE_ENV === 'development';

const isServer = typeof window === 'undefined';
const PROD_API = 'https://admin.rasmuspharmaceuticals.com/api/v1';
const isLocalUrl = (url: string) => /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(url);

// In production, never use localhost/127.0.0.1 URLs
let API_BASE_URL = envApi || PROD_API;
if (!isDev && isLocalUrl(API_BASE_URL)) {
    API_BASE_URL = PROD_API;
}

// Node.js 18+ resolves localhost to IPv6 (::1). Replace with 127.0.0.1 ONLY during dev server-side fetches
if (isDev && isServer && API_BASE_URL.includes('localhost')) {
    API_BASE_URL = API_BASE_URL.replace('localhost', '127.0.0.1');
}

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
    region_id?: number;
    town_id?: number;
    location?: string;
    status?: string;
    is_wholesale_approved?: boolean;
    wholesale_business_name?: string;
    wholesale_business_details?: string;
    created_at?: string;
    updated_at?: string;
}



export interface Product {
    id: number;
    name: string;
    title?: string; // Frontend alias
    slug: string;
    sku?: string;
    discount?: { amount: number; percentage: number }; // Transformed alias
    short_description?: string;
    description: string;
    price: number;
    unit?: string;
    weight?: number | string;
    in_stock?: boolean;
    wholesale_price?: number;
    wholesale_min_qty?: number;
    discount_percentage?: number;
    discount_amount?: number;
    stock_quantity: number;
    category_id: number;
    brand_id?: number;
    is_featured: boolean;
    is_active: boolean;
    key_features?: any[];
    whats_in_box?: string;
    images: any[];
    product_images?: ProductImage[];
    category?: Category;
    brand?: Brand;
    variations?: ProductVariation[];
    average_rating?: number;
    review_count?: number;
    image?: string; // Frontend alias
    main_image?: string;
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
    image?: string;
    banner?: string;
    full_image_url?: string;
    full_banner_url?: string;
    icon?: string;
    color?: string;
    icon_emoji?: string;
    parent_id?: number;
    is_active: boolean;
    children?: Category[];
}

export interface Brand {
    id: number;
    name: string;
    slug: string;
    image?: string;
    full_image_url?: string;
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
    status?: string;
    towns?: Town[];
}

export interface Town {
    id: number;
    name: string;
    region_id: number;
    delivery_fee: number;
    status?: string;
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
        console.log(`[API Client] Initialized with baseURL: ${this.baseURL}`);
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'NutriBlend-Frontend/1.0.0 (Next.js Server)'
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
            console.log(`[API Client] Fetching: ${url}`);

            const config: RequestInit = {
                ...options,
                cache: 'no-store' as RequestCache, // Prevent Next.js from caching API responses
                // Only send cookies from the browser; server-side fetches must use 'omit'
                // because Node's fetch rejects credentialed cross-origin requests without
                // a matching ACAO response header, crashing Server Components in production.
                credentials: (typeof window !== 'undefined') ? 'include' : 'omit',
                headers: {
                    ...this.getAuthHeaders(),
                    ...options.headers,
                },
            };

            const response = await fetch(url, config);

            console.log(`[API Client] Response status: ${response.status}, Content-Type: ${response.headers.get('content-type')}`);

            // Handle logical errors before parsing JSON
            if (!response.ok) {
                if (response.status === 401 && typeof window !== 'undefined') {
                    // Keep auth state in sync when backend rejects current auth context
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    window.dispatchEvent(new CustomEvent('auth-unauthorized'));
                }

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

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();

                // Handle both response formats:
                // 1. ServiceResponseHelper: { status: true, message: '...', data: ... }
                // 2. Laravel Resource Collection: { data: [...], links: {...}, meta: {...} }
                if (data.status !== undefined) {
                    // Format 1: already has status field
                    return data as ApiResponse<T>;
                }

                // Format 2: Laravel paginated/resource response - wrap it
                return {
                    status: true,
                    message: 'Success',
                    data: data as T,
                    // Preserve meta and links at response level for pagination
                    ...(data.meta && { meta: data.meta }),
                    ...(data.links && { links: data.links }),
                } as ApiResponse<T>;
            }

            return {
                status: false,
                message: `Server returned non-JSON response (${contentType || 'unknown type'}). Please try again later.`,
            };
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
        region_id?: number;
        town_id?: number;
        location?: string;
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

    async registerWholesale(userData: {
        name: string;
        email: string;
        phone: string;
        password: string;
        wholesale_business_name: string;
        wholesale_business_details: string;
        region_id?: string | number;
        town_id?: string | number;
        location?: string;
    }): Promise<ApiResponse<User>> {
        return this.request<User>(
            '/auth/register-wholesale',
            {
                method: 'POST',
                body: JSON.stringify(userData),
            }
        );
    }

    async checkUniqueness(type: 'email' | 'phone', value: string): Promise<ApiResponse<{ unique: boolean; message?: string }>> {
        return this.request<{ unique: boolean; message?: string }>(
            '/auth/check-uniqueness',
            {
                method: 'POST',
                body: JSON.stringify({ type, value }),
            }
        );
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

    async verifyEmail(id: string | number, hash: string): Promise<ApiResponse<{ user: User; token: string }>> {
        return this.request<{ user: User; token: string }>(`/auth/email/verify/${id}/${hash}`, {
            method: 'POST',
        });
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
        category_slug?: string;
        brand_id?: number;
        min_price?: number;
        max_price?: number;
        is_featured?: boolean;
        is_new_arrival?: boolean;
        on_sale?: boolean;
        is_special_offer?: boolean;
        is_trending?: boolean;
        is_recommended?: boolean;
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

    async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
        return this.request<Category>(`/categories/${slug}`);
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

    // ==================== Reviews (User) ====================

    async getMyReviews(): Promise<ApiResponse<any[]>> {
        return this.request<any[]>('/reviews/my');
    }

    async getProductReviews(productId: number): Promise<ApiResponse<any>> {
        return this.request<any>(`/products/${productId}/reviews`);
    }

    async submitReview(productId: number, data: { rating: number; comment: string }): Promise<ApiResponse<any>> {
        return this.request<any>('/reviews', {
            method: 'POST',
            body: JSON.stringify({ product_id: productId, ...data }),
        });
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

    async getAllTowns(): Promise<ApiResponse<Town[]>> {
        return this.request<Town[]>('/towns');
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

    // ==================== Messages / Chat ====================

    async getMessages(page: number = 1): Promise<ApiResponse<any>> {
        return this.request<any>(`/messages?page=${page}`);
    }

    async getMessage(id: number | string): Promise<ApiResponse<any>> {
        return this.request<any>(`/messages/${id}`);
    }

    async sendMessage(data: { subject: string; body: string }): Promise<ApiResponse<any>> {
        return this.request<any>('/messages', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async replyToMessage(id: number | string, body: string): Promise<ApiResponse<any>> {
        return this.request<any>(`/messages/${id}/reply`, {
            method: 'POST',
            body: JSON.stringify({ body }),
        });
    }

    async updateMessage(id: number | string, body: string): Promise<ApiResponse<any>> {
        return this.request<any>(`/messages/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ body }),
        });
    }

    async deleteMessage(id: number | string): Promise<ApiResponse<any>> {
        return this.request<any>(`/messages/${id}`, {
            method: 'DELETE',
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

    // Wellness questions
    async submitWellnessQuestion(data: { name: string; email: string; subject: string; question: string }): Promise<ApiResponse> {
        return this.post('/wellness/submit-question', data);
    }

    async getWellnessAnswers(): Promise<ApiResponse> {
        return this.request('/wellness/answers');
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

    // Helper: detect local/dev URLs that should not be used in production
    const isLocalUrl = (url: string) => /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(url);

    const PROD_BACKEND = 'https://admin.rasmuspharmaceuticals.com';
    const isDevEnv = process.env.NODE_ENV === 'development';
    const envApi = process.env.NEXT_PUBLIC_API_URL || '';
    const envAsset = process.env.NEXT_PUBLIC_ASSET_URL || '';

    // In production, always use the real backend URL for assets
    let baseUrl: string;
    if (!isDevEnv) {
        // Production: never use localhost/127.0.0.1
        if (envAsset && !isLocalUrl(envAsset)) {
            baseUrl = envAsset;
        } else if (envApi && !isLocalUrl(envApi)) {
            baseUrl = envApi.replace(/\/api\/v1\/?$/, '');
        } else {
            baseUrl = PROD_BACKEND;
        }
    } else {
        // Development: prefer asset URL, fallback to API URL
        baseUrl = envAsset || envApi.replace(/\/api\/v1\/?$/, '') || PROD_BACKEND;
    }

    // If it's a backend storage path, ensure it starts with /storage/
    let finalPath = path.startsWith('/') ? path : '/' + path;
    if (finalPath.startsWith('/storage/')) {
        return `${baseUrl}${finalPath}`;
    }

    // Default: try storage if not a direct URL
    return `${baseUrl}/storage${finalPath}`;
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
