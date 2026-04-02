/**
 * NutriBlend Haven — API Client Test Suite
 *
 * Tests the NutriBlendApiClient class methods, request handling,
 * auth token management, and error scenarios.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We need to mock fetch before importing the client
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Dynamic import so fetch mock is in place
let apiClient: any;

beforeEach(async () => {
  vi.resetModules();
  localStorage.clear();
  mockFetch.mockReset();

  const mod = await import('@/lib/api/client');
  apiClient = mod.apiClient;
});

// ==================== Auth ====================

describe('API Client — Authentication', () => {
  it('login stores token and user in localStorage', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        status: true,
        message: 'Login successful',
        data: {
          user: { id: 1, name: 'Test User', email: 'test@test.com' },
          token: 'test-token-123',
        },
      }),
    });

    const result = await apiClient.login({ email: 'test@test.com', password: 'pass' });

    expect(result.status).toBe(true);
    expect(result.data.token).toBe('test-token-123');
    expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'test-token-123');
  });

  it('login returns error on invalid credentials', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: { get: () => 'application/json' },
      json: async () => ({
        status: false,
        message: 'Invalid credentials',
      }),
    });

    const result = await apiClient.login({ email: 'bad@test.com', password: 'wrong' });

    expect(result.status).toBe(false);
    expect(result.message).toContain('Invalid credentials');
  });

  it('register creates account and stores token', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        status: true,
        message: 'Registration successful',
        data: {
          user: { id: 2, first_name: 'New', last_name: 'User', email: 'new@test.com' },
          token: 'new-token-456',
        },
      }),
    });

    const result = await apiClient.register({
      first_name: 'New',
      last_name: 'User',
      email: 'new@test.com',
      phone: '0771234567',
      password: 'password123',
      password_confirmation: 'password123',
    });

    expect(result.status).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'new-token-456');
  });

  it('logout clears localStorage', async () => {
    localStorage.setItem('auth_token', 'token-to-clear');
    localStorage.setItem('user', '{}');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ status: true, message: 'Logged out' }),
    });

    await apiClient.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });

  it('wholesale registration sends correct data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        status: true,
        message: 'Wholesale registration submitted',
        data: { id: 3, name: 'Wholesale Co' },
      }),
    });

    const result = await apiClient.registerWholesale({
      name: 'Wholesale Co',
      email: 'wholesale@test.com',
      phone: '0771234567',
      password: 'password123',
      wholesale_business_name: 'Wholesale Co Ltd',
      wholesale_business_details: 'Supplement distributor',
    });

    expect(result.status).toBe(true);

    const fetchCall = mockFetch.mock.calls[0];
    const body = JSON.parse(fetchCall[1].body);
    expect(body.wholesale_business_name).toBe('Wholesale Co Ltd');
  });
});

// ==================== Products ====================

describe('API Client — Products', () => {
  it('getProducts returns paginated data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        status: true,
        message: 'Success',
        data: {
          current_page: 1,
          data: [
            { id: 1, name: 'Whey Protein', slug: 'whey-protein', price: 50000 },
            { id: 2, name: 'Vitamin C', slug: 'vitamin-c', price: 15000 },
          ],
          total: 2,
          per_page: 10,
          last_page: 1,
        },
      }),
    });

    const result = await apiClient.getProducts({ page: 1, per_page: 10 });

    expect(result.status).toBe(true);
    expect(result.data.data).toHaveLength(2);
  });

  it('getProducts passes filter parameters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ status: true, data: { data: [], total: 0 } }),
    });

    await apiClient.getProducts({
      category_id: 5,
      min_price: 10000,
      max_price: 50000,
      is_featured: true,
      search: 'protein',
    });

    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain('category_id=5');
    expect(url).toContain('min_price=10000');
    expect(url).toContain('max_price=50000');
    expect(url).toContain('is_featured=true');
    expect(url).toContain('search=protein');
  });

  it('getProduct fetches single product by slug', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        status: true,
        data: { id: 1, name: 'Whey Protein', slug: 'whey-protein', price: 50000 },
      }),
    });

    const result = await apiClient.getProduct('whey-protein');

    expect(result.status).toBe(true);
    expect(result.data.slug).toBe('whey-protein');
    expect(mockFetch.mock.calls[0][0]).toContain('/products/whey-protein');
  });
});

// ==================== Categories & Brands ====================

describe('API Client — Categories & Brands', () => {
  it('getCategories returns category list', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        status: true,
        data: [
          { id: 1, name: 'Supplements', slug: 'supplements', is_active: true },
          { id: 2, name: 'Fitness', slug: 'fitness', is_active: true },
        ],
      }),
    });

    const result = await apiClient.getCategories();
    expect(result.status).toBe(true);
    expect(result.data).toHaveLength(2);
  });

  it('getBrands returns brand list', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        status: true,
        data: [{ id: 1, name: 'NutriBlend', slug: 'nutriblend', is_active: true }],
      }),
    });

    const result = await apiClient.getBrands();
    expect(result.status).toBe(true);
    expect(result.data[0].name).toBe('NutriBlend');
  });
});

// ==================== Cart ====================

describe('API Client — Cart', () => {
  it('getCart returns cart summary', async () => {
    localStorage.setItem('auth_token', 'valid-token');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        status: true,
        data: { items: [], total: 0, item_count: 0 },
      }),
    });

    const result = await apiClient.getCart();
    expect(result.status).toBe(true);
    expect(result.data.items).toEqual([]);
  });

  it('addToCart sends product and quantity', async () => {
    localStorage.setItem('auth_token', 'valid-token');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        status: true,
        data: { items: [{ id: 1, product_id: 10, quantity: 2 }], total: 100000 },
      }),
    });

    const result = await apiClient.addToCart({ product_id: 10, quantity: 2 });

    expect(result.status).toBe(true);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.product_id).toBe(10);
    expect(body.quantity).toBe(2);
  });
});

// ==================== Wishlist ====================

describe('API Client — Wishlist', () => {
  it('getWishlist returns items', async () => {
    localStorage.setItem('auth_token', 'valid-token');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        status: true,
        data: [{ id: 1, product_id: 5, product: { name: 'Test Product' } }],
      }),
    });

    const result = await apiClient.getWishlist();
    expect(result.status).toBe(true);
  });

  it('addToWishlist sends product id', async () => {
    localStorage.setItem('auth_token', 'valid-token');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        status: true,
        data: { id: 1, product_id: 5 },
      }),
    });

    await apiClient.addToWishlist(5);
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain('/wishlist');
  });
});

// ==================== Orders ====================

describe('API Client — Orders', () => {
  it('getOrders returns order list', async () => {
    localStorage.setItem('auth_token', 'valid-token');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        status: true,
        data: [
          { id: 1, order_number: 'ORD-001', status: 'pending', total_amount: 50000 },
        ],
      }),
    });

    const result = await apiClient.getOrders();
    expect(result.status).toBe(true);
  });
});

// ==================== Messages ====================

describe('API Client — Messages', () => {
  it('getMessages returns thread list', async () => {
    localStorage.setItem('auth_token', 'valid-token');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        status: true,
        data: [{ id: 1, subject: 'Help', body: 'Need help', sender_type: 'customer' }],
      }),
    });

    const result = await apiClient.getMessages();
    expect(result.status).toBe(true);
  });

  it('sendMessage posts new message', async () => {
    localStorage.setItem('auth_token', 'valid-token');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        status: true,
        data: { id: 1, subject: 'Test', body: 'Test message' },
      }),
    });

    const result = await apiClient.sendMessage({ subject: 'Test', body: 'Test message' });
    expect(result.status).toBe(true);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.subject).toBe('Test');
    expect(body.body).toBe('Test message');
  });

  it('replyToMessage sends reply to thread', async () => {
    localStorage.setItem('auth_token', 'valid-token');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        status: true,
        data: { id: 2, body: 'Reply text' },
      }),
    });

    await apiClient.replyToMessage(1, 'Reply text');

    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain('/messages/1/reply');
  });
});

// ==================== Error Handling ====================

describe('API Client — Error Handling', () => {
  it('handles network errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await apiClient.getProducts();

    expect(result.status).toBe(false);
    expect(result.message).toContain('Network error');
  });

  it('handles non-JSON error responses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      headers: { get: () => 'text/html' },
    });

    const result = await apiClient.getProducts();

    expect(result.status).toBe(false);
    expect(result.message).toContain('500');
  });

  it('handles Laravel resource collection format', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        data: [{ id: 1, name: 'Product 1' }],
        meta: { current_page: 1, total: 1 },
        links: {},
      }),
    });

    const result = await apiClient.getProducts();

    // Should wrap in standard response format
    expect(result.status).toBe(true);
  });

  it('includes auth header when token exists', async () => {
    localStorage.setItem('auth_token', 'my-bearer-token');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ status: true, data: {} }),
    });

    await apiClient.getProfile();

    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers.Authorization).toBe('Bearer my-bearer-token');
  });
});
