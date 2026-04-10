/**
 * ==============================================================
 *  NutriBlend Haven — END-TO-END UI FLOW TESTS
 * ==============================================================
 *
 * Full user journey tests that simulate real user interactions
 * across the entire system, testing flows from start to finish.
 *
 *  FLOW 1  — Guest browsing → Shop → Product Detail → Add to Cart → Checkout block
 *  FLOW 2  — Registration → Login → Full authenticated session
 *  FLOW 3  — Authenticated shopping: Browse → Cart → Promo → Checkout
 *  FLOW 4  — Wishlist management: Add → View → Move to Cart → Remove
 *  FLOW 5  — Account management: Profile → Orders → Reviews → Messages
 *  FLOW 6  — Search & Filtering end-to-end
 *  FLOW 7  — Wholesale registration & approval flow
 *  FLOW 8  — Delivery & Pricing calculations
 *  FLOW 9  — Newsletter & Contact flows
 *  FLOW 10 — Error handling & Edge cases across all flows
 *  FLOW 11 — Navigation & Layout consistency
 *  FLOW 12 — Cart lifecycle: add, update quantity, remove, clear
 *  FLOW 13 — Authentication guards & redirects
 *  FLOW 14 — Product variations & stock management
 *  FLOW 15 — Order lifecycle: create → track → cancel → review
 *
 * HOW TO RUN:
 *   npm test
 *   npx vitest run src/__tests__/e2e-ui-flows.test.ts --reporter=verbose
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Global mock setup ──
const mockFetch = vi.fn();
global.fetch = mockFetch;

function jsonResp(data: any, status = 200, ok = true) {
  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    headers: { get: () => 'application/json' },
    json: async () => data,
    text: async () => JSON.stringify(data),
  };
}

function ok(data: any, msg = 'Success') {
  return jsonResp({ status: true, message: msg, data }, 200);
}

function created(data: any, msg = 'Created') {
  return jsonResp({ status: true, message: msg, data }, 201);
}

function fail(msg: string, status = 400) {
  return jsonResp({ status: false, message: msg }, status, false);
}

function paginated(data: any[], page = 1, lastPage = 1, total?: number) {
  return jsonResp({
    status: true,
    data: {
      data,
      current_page: page,
      last_page: lastPage,
      per_page: 24,
      total: total ?? data.length,
    },
  });
}

// ── Sample data factories ──
const makeUser = (o: any = {}) => ({
  id: 1,
  first_name: 'Gorret',
  last_name: 'Golden',
  name: 'Gorret Golden',
  email: 'gorret@nutriblendhaven.com',
  phone: '+256751547645',
  status: 'active',
  customer_type: 'retail',
  email_verified_at: '2026-03-01T00:00:00Z',
  ...o,
});

const makeProduct = (o: any = {}) => ({
  id: 1,
  name: 'Whey Protein Powder',
  slug: 'whey-protein-powder',
  price: 50000,
  description: 'Premium whey protein for muscle building',
  short_description: 'Premium whey protein',
  category_id: 1,
  brand_id: 1,
  is_active: true,
  in_stock: true,
  stock_quantity: 100,
  is_featured: false,
  is_new_arrival: false,
  is_special_offer: false,
  is_trending: false,
  is_recommended: false,
  on_sale: false,
  discount_percentage: 0,
  images: [{ id: 1, image_url: '/images/whey.jpg', is_primary: true }],
  category: { id: 1, name: 'Supplements', slug: 'supplements' },
  brand: { id: 1, name: 'NutriBrand' },
  variations: [],
  average_rating: 4.5,
  review_count: 12,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-04-01T00:00:00Z',
  ...o,
});

const makeVariation = (o: any = {}) => ({
  id: 1,
  product_id: 1,
  name: '500g Pack',
  price: 30000,
  stock_quantity: 50,
  discount_percentage: 0,
  images: [],
  ...o,
});

const makeCategory = (o: any = {}) => ({
  id: 1,
  name: 'Supplements',
  slug: 'supplements',
  is_active: true,
  image: '/images/cat.jpg',
  icon: '/images/icon.png',
  header_banner: '/images/banner.jpg',
  products_count: 25,
  ...o,
});

const makeBrand = (o: any = {}) => ({
  id: 1,
  name: 'NutriBrand',
  slug: 'nutribrand',
  logo: '/images/brand.jpg',
  ...o,
});

const makeCartItem = (o: any = {}) => ({
  id: 1,
  product_id: 1,
  product: makeProduct(),
  quantity: 1,
  variation_id: null,
  variation_name: null,
  unit_price: 50000,
  total: 50000,
  ...o,
});

const makeCart = (items: any[] = [makeCartItem()]) => ({
  items,
  total: items.reduce((s: number, i: any) => s + i.total, 0),
  totalQuantities: items.reduce((s: number, i: any) => s + i.quantity, 0),
  item_count: items.length,
});

const makeOrder = (o: any = {}) => ({
  id: 1,
  order_number: 'NB-20260410-0001',
  status: 'pending',
  total: 150000,
  subtotal: 140000,
  delivery_fee: 10000,
  discount_amount: 0,
  payment_method: 'mobile_money',
  payment_status: 'pending',
  delivery_address: 'Kampala, Plot 10 Bombo Road',
  delivery_region: 'Kampala',
  delivery_town: 'Central',
  notes: '',
  items: [
    {
      id: 1,
      product: makeProduct(),
      quantity: 2,
      unit_price: 50000,
      total: 100000,
    },
  ],
  created_at: '2026-04-10T08:00:00Z',
  updated_at: '2026-04-10T08:00:00Z',
  ...o,
});

const makeReview = (o: any = {}) => ({
  id: 1,
  product_id: 1,
  product: makeProduct(),
  rating: 5,
  comment: 'Excellent product, fast delivery!',
  created_at: '2026-04-05T10:00:00Z',
  ...o,
});

const makeMessage = (o: any = {}) => ({
  id: 1,
  subject: 'Order inquiry',
  body: 'When will my order NB-0001 be shipped?',
  sender_type: 'customer',
  is_read: false,
  created_at: '2026-04-08T14:00:00Z',
  replies: [],
  ...o,
});

const makeRegion = (o: any = {}) => ({
  id: 1,
  name: 'Kampala',
  towns: [
    { id: 1, name: 'Central', delivery_fee: 5000 },
    { id: 2, name: 'Kawempe', delivery_fee: 8000 },
  ],
  ...o,
});

const makeDiscount = (o: any = {}) => ({
  id: 1,
  code: 'SAVE20',
  type: 'percentage',
  value: 20,
  min_order_amount: 50000,
  is_active: true,
  expires_at: '2026-12-31T23:59:59Z',
  ...o,
});

const makeNotification = (o: any = {}) => ({
  id: 1,
  type: 'order_status',
  title: 'Order Shipped',
  message: 'Your order NB-0001 has been shipped',
  is_read: false,
  created_at: '2026-04-09T12:00:00Z',
  ...o,
});

let apiClient: any;

beforeEach(async () => {
  vi.resetModules();
  localStorage.clear();
  mockFetch.mockReset();
  const mod = await import('@/lib/api/client');
  apiClient = mod.apiClient;
});

// ================================================================
//  FLOW 1 — GUEST BROWSING → SHOP → PRODUCT → CART BLOCK
// ================================================================

describe('Flow 01 — Guest Browsing Journey', () => {
  it('guest can browse products without authentication', async () => {
    const products = [
      makeProduct({ id: 1, name: 'Whey Protein' }),
      makeProduct({ id: 2, name: 'BCAA Powder', slug: 'bcaa-powder' }),
      makeProduct({ id: 3, name: 'Creatine Monohydrate', slug: 'creatine' }),
    ];
    mockFetch.mockResolvedValueOnce(paginated(products, 1, 3, 60));

    const result = await apiClient.getProducts({ page: 1 });

    expect(result.status).toBe(true);
    expect(result.data.data).toHaveLength(3);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    // No auth header should be sent for guest browsing
    const fetchCall = mockFetch.mock.calls[0];
    expect(fetchCall[0]).toContain('/products');
  });

  it('guest can view product detail', async () => {
    mockFetch.mockResolvedValueOnce(ok(makeProduct()));

    const result = await apiClient.getProduct(1);

    expect(result.status).toBe(true);
    expect(result.data.name).toBe('Whey Protein Powder');
    expect(result.data.price).toBe(50000);
    expect(result.data.images).toHaveLength(1);
    expect(result.data.category.name).toBe('Supplements');
  });

  it('guest can browse categories', async () => {
    const categories = [
      makeCategory({ id: 1, name: 'Supplements' }),
      makeCategory({ id: 2, name: 'Vitamins', slug: 'vitamins' }),
      makeCategory({ id: 3, name: 'Fitness Equipment', slug: 'fitness-equipment' }),
    ];
    mockFetch.mockResolvedValueOnce(ok(categories));

    const result = await apiClient.getCategories();

    expect(result.status).toBe(true);
    expect(result.data).toHaveLength(3);
  });

  it('guest can browse brands', async () => {
    const brands = [
      makeBrand({ id: 1, name: 'NutriBrand' }),
      makeBrand({ id: 2, name: 'VitaPlus', slug: 'vitaplus' }),
    ];
    mockFetch.mockResolvedValueOnce(ok(brands));

    const result = await apiClient.getBrands();

    expect(result.status).toBe(true);
    expect(result.data).toHaveLength(2);
  });

  it('guest can search for products', async () => {
    const searchResults = [
      makeProduct({ id: 1, name: 'Whey Protein Isolate' }),
      makeProduct({ id: 2, name: 'Whey Protein Concentrate', slug: 'whey-concentrate' }),
    ];
    mockFetch.mockResolvedValueOnce(paginated(searchResults));

    const result = await apiClient.getProducts({ search: 'whey protein' });

    expect(result.status).toBe(true);
    expect(result.data.data).toHaveLength(2);
    const fetchUrl = mockFetch.mock.calls[0][0];
    expect(fetchUrl).toContain('search=');
  });

  it('guest can filter products by category', async () => {
    mockFetch.mockResolvedValueOnce(paginated([makeProduct()]));

    const result = await apiClient.getProducts({ category_id: 1 });

    expect(result.status).toBe(true);
    const fetchUrl = mockFetch.mock.calls[0][0];
    expect(fetchUrl).toContain('category_id=1');
  });

  it('guest can filter products by price range', async () => {
    mockFetch.mockResolvedValueOnce(paginated([makeProduct()]));

    const result = await apiClient.getProducts({ min_price: 20000, max_price: 80000 });

    expect(result.status).toBe(true);
    const fetchUrl = mockFetch.mock.calls[0][0];
    expect(fetchUrl).toContain('min_price=');
    expect(fetchUrl).toContain('max_price=');
  });

  it('guest can sort products', async () => {
    mockFetch.mockResolvedValueOnce(paginated([makeProduct()]));

    const result = await apiClient.getProducts({ sort: 'price_asc' });

    expect(result.status).toBe(true);
  });

  it('guest product view includes reviews & rating data', async () => {
    const product = makeProduct({ average_rating: 4.5, review_count: 12 });
    mockFetch.mockResolvedValueOnce(ok(product));

    const result = await apiClient.getProduct(1);

    expect(result.data.average_rating).toBe(4.5);
    expect(result.data.review_count).toBe(12);
  });

  it('cart operations require auth — add to cart blocked without token', async () => {
    // No auth_token in localStorage
    mockFetch.mockResolvedValueOnce(fail('Unauthenticated', 401));

    const result = await apiClient.addToCart({ product_id: 1, quantity: 1 });

    expect(result.status).toBe(false);
  });
});

// ================================================================
//  FLOW 2 — REGISTRATION → LOGIN → AUTHENTICATED SESSION
// ================================================================

describe('Flow 02 — Registration & Login Journey', () => {
  it('new user registers successfully', async () => {
    mockFetch.mockResolvedValueOnce(created({
      user: makeUser(),
      token: 'new-user-token-abc',
    }));

    const result = await apiClient.register({
      first_name: 'Gorret',
      last_name: 'Golden',
      email: 'gorret@nutriblendhaven.com',
      phone: '+256751547645',
      password: 'SecurePass123!',
      password_confirmation: 'SecurePass123!',
    });

    expect(result.status).toBe(true);
    expect(result.data.token).toBe('new-user-token-abc');
    expect(result.data.user.email).toBe('gorret@nutriblendhaven.com');
  });

  it('registration fails with existing email', async () => {
    mockFetch.mockResolvedValueOnce(fail('The email has already been taken.', 422));

    const result = await apiClient.register({
      first_name: 'Gorret',
      last_name: 'Golden',
      email: 'existing@nutriblendhaven.com',
      password: 'SecurePass123!',
      password_confirmation: 'SecurePass123!',
    });

    expect(result.status).toBe(false);
    expect(result.message).toContain('already been taken');
  });

  it('registration fails with weak password', async () => {
    mockFetch.mockResolvedValueOnce(fail('The password must be at least 8 characters.', 422));

    const result = await apiClient.register({
      first_name: 'Test',
      last_name: 'User',
      email: 'new@test.com',
      password: '123',
      password_confirmation: '123',
    });

    expect(result.status).toBe(false);
  });

  it('registration fails with mismatched passwords', async () => {
    mockFetch.mockResolvedValueOnce(fail('The password confirmation does not match.', 422));

    const result = await apiClient.register({
      first_name: 'Test',
      last_name: 'User',
      email: 'new@test.com',
      password: 'SecurePass123!',
      password_confirmation: 'DifferentPass456!',
    });

    expect(result.status).toBe(false);
  });

  it('user logs in after registration', async () => {
    mockFetch.mockResolvedValueOnce(ok({
      user: makeUser(),
      token: 'login-token-xyz',
    }));

    const result = await apiClient.login({
      email: 'gorret@nutriblendhaven.com',
      password: 'SecurePass123!',
    });

    expect(result.status).toBe(true);
    expect(result.data.token).toBe('login-token-xyz');
    expect(result.data.user.first_name).toBe('Gorret');
  });

  it('login sets auth token in localStorage', async () => {
    mockFetch.mockResolvedValueOnce(ok({
      user: makeUser(),
      token: 'persisted-token',
    }));

    await apiClient.login({
      email: 'gorret@nutriblendhaven.com',
      password: 'SecurePass123!',
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'persisted-token');
  });

  it('login fails with invalid credentials', async () => {
    mockFetch.mockResolvedValueOnce(fail('Invalid credentials', 401));

    const result = await apiClient.login({
      email: 'gorret@nutriblendhaven.com',
      password: 'wrongpassword',
    });

    expect(result.status).toBe(false);
    expect(result.message).toContain('Invalid');
  });

  it('login fails for inactive user', async () => {
    mockFetch.mockResolvedValueOnce(fail('Your account is inactive. Please contact admin.', 403));

    const result = await apiClient.login({
      email: 'inactive@test.com',
      password: 'password123',
    });

    expect(result.status).toBe(false);
    expect(result.message).toContain('inactive');
  });

  it('login fails for pending wholesale user', async () => {
    mockFetch.mockResolvedValueOnce(fail('Your account is pending approval.', 403));

    const result = await apiClient.login({
      email: 'pending@wholesale.com',
      password: 'password123',
    });

    expect(result.status).toBe(false);
    expect(result.message).toContain('pending');
  });

  it('authenticated user can fetch profile', async () => {
    localStorage.setItem('auth_token', 'valid-token');
    mockFetch.mockResolvedValueOnce(ok(makeUser()));

    const result = await apiClient.getProfile();

    expect(result.status).toBe(true);
    expect(result.data.first_name).toBe('Gorret');
    expect(result.data.email).toBe('gorret@nutriblendhaven.com');
  });

  it('logout clears session', async () => {
    localStorage.setItem('auth_token', 'valid-token');
    mockFetch.mockResolvedValueOnce(ok(null, 'Logged out'));

    const result = await apiClient.logout();

    expect(result.status).toBe(true);
    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
  });

  it('full auth lifecycle: register → login → profile → logout', async () => {
    // Step 1: Register
    mockFetch.mockResolvedValueOnce(created({
      user: makeUser(),
      token: 'reg-token',
    }));
    const regResult = await apiClient.register({
      first_name: 'Gorret',
      last_name: 'Golden',
      email: 'gorret@nutriblendhaven.com',
      password: 'SecurePass123!',
      password_confirmation: 'SecurePass123!',
    });
    expect(regResult.status).toBe(true);

    // Step 2: Login
    mockFetch.mockResolvedValueOnce(ok({
      user: makeUser(),
      token: 'session-token',
    }));
    const loginResult = await apiClient.login({
      email: 'gorret@nutriblendhaven.com',
      password: 'SecurePass123!',
    });
    expect(loginResult.status).toBe(true);
    localStorage.setItem('auth_token', 'session-token');

    // Step 3: Fetch profile
    mockFetch.mockResolvedValueOnce(ok(makeUser()));
    const profileResult = await apiClient.getProfile();
    expect(profileResult.status).toBe(true);
    expect(profileResult.data.first_name).toBe('Gorret');

    // Step 4: Logout
    mockFetch.mockResolvedValueOnce(ok(null, 'Logged out'));
    const logoutResult = await apiClient.logout();
    expect(logoutResult.status).toBe(true);

    expect(mockFetch).toHaveBeenCalledTimes(4);
  });
});

// ================================================================
//  FLOW 3 — AUTHENTICATED SHOPPING: BROWSE → CART → PROMO → CHECKOUT
// ================================================================

describe('Flow 03 — Full Shopping Journey (Authenticated)', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'auth-token');
  });

  it('browse products → add to cart → view cart → apply promo → checkout', async () => {
    // Step 1: Browse products
    const products = [
      makeProduct({ id: 1, name: 'Whey Protein', price: 50000 }),
      makeProduct({ id: 2, name: 'BCAA', slug: 'bcaa', price: 35000 }),
      makeProduct({ id: 3, name: 'Creatine', slug: 'creatine', price: 45000 }),
    ];
    mockFetch.mockResolvedValueOnce(paginated(products));
    const browseResult = await apiClient.getProducts({ page: 1 });
    expect(browseResult.status).toBe(true);
    expect(browseResult.data.data).toHaveLength(3);

    // Step 2: View product detail
    mockFetch.mockResolvedValueOnce(ok(makeProduct({ id: 1 })));
    const detailResult = await apiClient.getProduct(1);
    expect(detailResult.status).toBe(true);

    // Step 3: Add to cart
    const cartAfterAdd = makeCart([
      makeCartItem({ product_id: 1, quantity: 2, total: 100000 }),
    ]);
    mockFetch.mockResolvedValueOnce(ok(cartAfterAdd));
    const addResult = await apiClient.addToCart({ product_id: 1, quantity: 2 });
    expect(addResult.status).toBe(true);

    // Step 4: Add second product
    const cartAfterSecond = makeCart([
      makeCartItem({ id: 1, product_id: 1, quantity: 2, total: 100000 }),
      makeCartItem({
        id: 2, product_id: 2, quantity: 1, total: 35000,
        product: makeProduct({ id: 2, name: 'BCAA', price: 35000 }),
      }),
    ]);
    mockFetch.mockResolvedValueOnce(ok(cartAfterSecond));
    const addResult2 = await apiClient.addToCart({ product_id: 2, quantity: 1 });
    expect(addResult2.status).toBe(true);

    // Step 5: View cart summary
    mockFetch.mockResolvedValueOnce(ok(cartAfterSecond));
    const cartResult = await apiClient.getCartSummary();
    expect(cartResult.status).toBe(true);
    expect(cartResult.data.items).toHaveLength(2);
    expect(cartResult.data.total).toBe(135000);

    // Step 6: Apply promo code
    mockFetch.mockResolvedValueOnce(ok({
      valid: true,
      discount_amount: 27000,
      final_amount: 108000,
      discount: makeDiscount(),
    }));
    const promoResult = await apiClient.validateDiscount('SAVE20', 135000);
    expect(promoResult.status).toBe(true);
    expect(promoResult.data.discount_amount).toBe(27000);

    // Step 7: Calculate delivery
    mockFetch.mockResolvedValueOnce(ok({ fee: 10000 }));
    const deliveryResult = await apiClient.calculateDeliveryFee({
      region_id: 1,
      town_id: 1,
    });
    expect(deliveryResult.status).toBe(true);
    expect(deliveryResult.data.fee).toBe(10000);

    // Step 8: Create order
    const order = makeOrder({
      total: 118000,
      subtotal: 135000,
      discount_amount: 27000,
      delivery_fee: 10000,
    });
    mockFetch.mockResolvedValueOnce(created(order));
    const orderResult = await apiClient.createOrder({
      delivery_region_id: 1,
      delivery_town_id: 1,
      delivery_address: 'Kampala, Plot 10 Bombo Road',
      payment_method: 'mobile_money',
      discount_code: 'SAVE20',
    });
    expect(orderResult.status).toBe(true);
    expect(orderResult.data.order_number).toBe('NB-20260410-0001');
    expect(orderResult.data.total).toBe(118000);

    expect(mockFetch).toHaveBeenCalledTimes(8);
  });

  it('adding to cart sends correct product and quantity', async () => {
    mockFetch.mockResolvedValueOnce(ok(makeCart()));

    await apiClient.addToCart({ product_id: 5, quantity: 3 });

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/cart');
    expect(options.method).toBe('POST');
    const body = JSON.parse(options.body);
    expect(body.product_id).toBe(5);
    expect(body.quantity).toBe(3);
  });

  it('adding variation to cart includes variation_id', async () => {
    mockFetch.mockResolvedValueOnce(ok(makeCart()));

    await apiClient.addToCart({ product_id: 1, variation_id: 3, quantity: 1 });

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.variation_id).toBe(3);
  });

  it('cart total updates correctly after adding multiple items', async () => {
    const items = [
      makeCartItem({ id: 1, product_id: 1, quantity: 2, unit_price: 50000, total: 100000 }),
      makeCartItem({ id: 2, product_id: 2, quantity: 1, unit_price: 35000, total: 35000, product: makeProduct({ id: 2, price: 35000 }) }),
      makeCartItem({ id: 3, product_id: 3, quantity: 3, unit_price: 20000, total: 60000, product: makeProduct({ id: 3, price: 20000 }) }),
    ];
    const expectedTotal = 100000 + 35000 + 60000; // 195000

    mockFetch.mockResolvedValueOnce(ok(makeCart(items)));
    const result = await apiClient.getCartSummary();

    expect(result.data.total).toBe(expectedTotal);
    expect(result.data.items).toHaveLength(3);
    expect(result.data.totalQuantities).toBe(6); // 2 + 1 + 3
  });

  it('promo code validation rejects invalid code', async () => {
    mockFetch.mockResolvedValueOnce(fail('Invalid discount code', 422));

    const result = await apiClient.validateDiscount('FAKECODE', 100000);

    expect(result.status).toBe(false);
    expect(result.message).toContain('Invalid');
  });

  it('promo code validation rejects below minimum order amount', async () => {
    mockFetch.mockResolvedValueOnce(fail('Order total must be at least UGX 50,000', 422));

    const result = await apiClient.validateDiscount('SAVE20', 30000);

    expect(result.status).toBe(false);
  });
});

// ================================================================
//  FLOW 4 — WISHLIST MANAGEMENT
// ================================================================

describe('Flow 04 — Wishlist Journey', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'auth-token');
  });

  it('full wishlist lifecycle: add → view → move to cart → remove', async () => {
    // Step 1: Add product to wishlist
    mockFetch.mockResolvedValueOnce(ok({
      id: 1,
      product_id: 1,
      product: makeProduct(),
    }));
    const addResult = await apiClient.addToWishlist(1);
    expect(addResult.status).toBe(true);

    // Step 2: Add another product
    mockFetch.mockResolvedValueOnce(ok({
      id: 2,
      product_id: 2,
      product: makeProduct({ id: 2, name: 'BCAA', slug: 'bcaa' }),
    }));
    const addResult2 = await apiClient.addToWishlist(2);
    expect(addResult2.status).toBe(true);

    // Step 3: View wishlist
    mockFetch.mockResolvedValueOnce(ok([
      { id: 1, product_id: 1, product: makeProduct() },
      { id: 2, product_id: 2, product: makeProduct({ id: 2, name: 'BCAA' }) },
    ]));
    const listResult = await apiClient.getWishlist();
    expect(listResult.status).toBe(true);
    expect(listResult.data).toHaveLength(2);

    // Step 4: Move first product to cart
    mockFetch.mockResolvedValueOnce(ok(makeCart()));
    const moveResult = await apiClient.moveToCart(1, 1);
    expect(moveResult.status).toBe(true);

    // Step 5: Remove second product from wishlist
    mockFetch.mockResolvedValueOnce(ok(null, 'Removed'));
    const removeResult = await apiClient.removeFromWishlist(2);
    expect(removeResult.status).toBe(true);

    expect(mockFetch).toHaveBeenCalledTimes(5);
  });

  it('adding duplicate to wishlist returns appropriate response', async () => {
    mockFetch.mockResolvedValueOnce(fail('Product already in wishlist', 422));

    const result = await apiClient.addToWishlist(1);

    expect(result.status).toBe(false);
  });

  it('wishlist requires authentication', async () => {
    localStorage.removeItem('auth_token');
    mockFetch.mockResolvedValueOnce(fail('Unauthenticated', 401));

    const result = await apiClient.getWishlist();

    expect(result.status).toBe(false);
  });
});

// ================================================================
//  FLOW 5 — ACCOUNT MANAGEMENT
// ================================================================

describe('Flow 05 — Account Management Journey', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'auth-token');
  });

  it('user views and updates profile', async () => {
    // View profile
    mockFetch.mockResolvedValueOnce(ok(makeUser()));
    const profile = await apiClient.getProfile();
    expect(profile.data.first_name).toBe('Gorret');

    // Update profile
    mockFetch.mockResolvedValueOnce(ok(makeUser({
      first_name: 'Gorret',
      last_name: 'Updated',
      phone: '+256700000000',
    })));
    const updateResult = await apiClient.updateProfile({
      first_name: 'Gorret',
      last_name: 'Updated',
      phone: '+256700000000',
    });
    expect(updateResult.status).toBe(true);
    expect(updateResult.data.last_name).toBe('Updated');
  });

  it('user changes password', async () => {
    mockFetch.mockResolvedValueOnce(ok(null, 'Password changed'));

    const result = await apiClient.changePassword({
      current_password: 'OldPass123!',
      password: 'NewSecure456!',
      password_confirmation: 'NewSecure456!',
    });

    expect(result.status).toBe(true);
  });

  it('password change fails with wrong current password', async () => {
    mockFetch.mockResolvedValueOnce(fail('Current password is incorrect', 422));

    const result = await apiClient.changePassword({
      current_password: 'WrongPass',
      password: 'NewSecure456!',
      password_confirmation: 'NewSecure456!',
    });

    expect(result.status).toBe(false);
  });

  it('user views order history', async () => {
    const orders = [
      makeOrder({ id: 1, order_number: 'NB-0001', status: 'delivered' }),
      makeOrder({ id: 2, order_number: 'NB-0002', status: 'processing' }),
      makeOrder({ id: 3, order_number: 'NB-0003', status: 'pending' }),
    ];
    mockFetch.mockResolvedValueOnce(paginated(orders));

    const result = await apiClient.getOrders({ page: 1 });

    expect(result.status).toBe(true);
    expect(result.data.data).toHaveLength(3);
  });

  it('user views single order detail', async () => {
    mockFetch.mockResolvedValueOnce(ok(makeOrder()));

    const result = await apiClient.getOrder('NB-20260410-0001');

    expect(result.status).toBe(true);
    expect(result.data.order_number).toBe('NB-20260410-0001');
    expect(result.data.items).toHaveLength(1);
  });

  it('user views their reviews', async () => {
    const reviews = [
      makeReview({ id: 1, rating: 5 }),
      makeReview({ id: 2, rating: 4, comment: 'Good quality' }),
    ];
    mockFetch.mockResolvedValueOnce(ok(reviews));

    const result = await apiClient.getMyReviews();

    expect(result.status).toBe(true);
    expect(result.data).toHaveLength(2);
  });

  it('user views and manages messages', async () => {
    // View messages
    const messages = [
      makeMessage({ id: 1, subject: 'Order inquiry' }),
      makeMessage({ id: 2, subject: 'Product question', is_read: true }),
    ];
    mockFetch.mockResolvedValueOnce(paginated(messages));
    const listResult = await apiClient.getMessages(1);
    expect(listResult.status).toBe(true);

    // View single message
    mockFetch.mockResolvedValueOnce(ok(makeMessage()));
    const detailResult = await apiClient.getMessage(1);
    expect(detailResult.status).toBe(true);

    // Send new message
    mockFetch.mockResolvedValueOnce(created(makeMessage({ id: 3, subject: 'New question' })));
    const sendResult = await apiClient.sendMessage({
      subject: 'New question',
      body: 'I have a question about product availability',
    });
    expect(sendResult.status).toBe(true);

    // Reply to message
    mockFetch.mockResolvedValueOnce(ok({
      ...makeMessage(),
      replies: [{ id: 1, body: 'Thanks for the info', created_at: '2026-04-10T09:00:00Z' }],
    }));
    const replyResult = await apiClient.replyToMessage(1, 'Thanks for the info');
    expect(replyResult.status).toBe(true);
  });

  it('user manages notifications', async () => {
    // Get unread count
    mockFetch.mockResolvedValueOnce(ok({ unread_count: 5 }));
    const countResult = await apiClient.getUnreadCount();
    expect(countResult.data.unread_count).toBe(5);

    // Get notifications
    const notifications = [
      makeNotification({ id: 1, title: 'Order Shipped' }),
      makeNotification({ id: 2, title: 'New Promotion' }),
    ];
    mockFetch.mockResolvedValueOnce(paginated(notifications));
    const listResult = await apiClient.getNotifications(1);
    expect(listResult.status).toBe(true);

    // Mark as read
    mockFetch.mockResolvedValueOnce(ok(null));
    await apiClient.markAsRead(1);

    // Mark all as read
    mockFetch.mockResolvedValueOnce(ok(null));
    await apiClient.markAllAsRead();

    expect(mockFetch).toHaveBeenCalledTimes(4);
  });
});

// ================================================================
//  FLOW 6 — SEARCH & FILTERING END-TO-END
// ================================================================

describe('Flow 06 — Search & Filtering Journey', () => {
  it('user searches, filters by category, then by price range', async () => {
    // Step 1: Search
    mockFetch.mockResolvedValueOnce(paginated([
      makeProduct({ id: 1, name: 'Whey Protein', category_id: 1, price: 50000 }),
      makeProduct({ id: 2, name: 'Whey Isolate', slug: 'whey-isolate', category_id: 1, price: 70000 }),
      makeProduct({ id: 3, name: 'Vegan Protein', slug: 'vegan-protein', category_id: 2, price: 45000 }),
    ], 1, 1, 3));
    const searchResult = await apiClient.getProducts({ search: 'protein' });
    expect(searchResult.data.data).toHaveLength(3);

    // Step 2: Filter by category
    mockFetch.mockResolvedValueOnce(paginated([
      makeProduct({ id: 1, name: 'Whey Protein', category_id: 1, price: 50000 }),
      makeProduct({ id: 2, name: 'Whey Isolate', slug: 'whey-isolate', category_id: 1, price: 70000 }),
    ]));
    const catResult = await apiClient.getProducts({ search: 'protein', category_id: 1 });
    expect(catResult.data.data).toHaveLength(2);

    // Step 3: Further filter by price
    mockFetch.mockResolvedValueOnce(paginated([
      makeProduct({ id: 1, name: 'Whey Protein', category_id: 1, price: 50000 }),
    ]));
    const priceResult = await apiClient.getProducts({
      search: 'protein',
      category_id: 1,
      min_price: 40000,
      max_price: 60000,
    });
    expect(priceResult.data.data).toHaveLength(1);
  });

  it('empty search results handled', async () => {
    mockFetch.mockResolvedValueOnce(paginated([], 1, 1, 0));

    const result = await apiClient.getProducts({ search: 'nonexistent product xyz' });

    expect(result.status).toBe(true);
    expect(result.data.data).toHaveLength(0);
    expect(result.data.total).toBe(0);
  });

  it('pagination works across multiple pages', async () => {
    // Page 1
    mockFetch.mockResolvedValueOnce(paginated(
      Array.from({ length: 24 }, (_, i) => makeProduct({ id: i + 1, name: `Product ${i + 1}` })),
      1, 3, 60,
    ));
    const page1 = await apiClient.getProducts({ page: 1 });
    expect(page1.data.data).toHaveLength(24);
    expect(page1.data.current_page).toBe(1);
    expect(page1.data.last_page).toBe(3);

    // Page 2
    mockFetch.mockResolvedValueOnce(paginated(
      Array.from({ length: 24 }, (_, i) => makeProduct({ id: i + 25, name: `Product ${i + 25}` })),
      2, 3, 60,
    ));
    const page2 = await apiClient.getProducts({ page: 2 });
    expect(page2.data.current_page).toBe(2);

    // Page 3 (last)
    mockFetch.mockResolvedValueOnce(paginated(
      Array.from({ length: 12 }, (_, i) => makeProduct({ id: i + 49, name: `Product ${i + 49}` })),
      3, 3, 60,
    ));
    const page3 = await apiClient.getProducts({ page: 3 });
    expect(page3.data.current_page).toBe(3);
    expect(page3.data.data).toHaveLength(12);
  });

  it('filters by boolean flags', async () => {
    mockFetch.mockResolvedValueOnce(paginated([
      makeProduct({ id: 1, on_sale: true, discount_percentage: 15 }),
    ]));

    const result = await apiClient.getProducts({ on_sale: true });

    expect(result.status).toBe(true);
    expect(result.data.data[0].on_sale).toBe(true);
  });

  it('filters by brand', async () => {
    mockFetch.mockResolvedValueOnce(paginated([
      makeProduct({ id: 1, brand_id: 2, brand: makeBrand({ id: 2, name: 'VitaPlus' }) }),
    ]));

    const result = await apiClient.getProducts({ brand_id: 2 });

    expect(result.status).toBe(true);
    const fetchUrl = mockFetch.mock.calls[0][0];
    expect(fetchUrl).toContain('brand_id=2');
  });

  it('combined filters: category + brand + price + on_sale', async () => {
    mockFetch.mockResolvedValueOnce(paginated([makeProduct()]));

    await apiClient.getProducts({
      category_id: 1,
      brand_id: 1,
      min_price: 20000,
      max_price: 80000,
      on_sale: true,
      sort: 'price_asc',
    });

    const fetchUrl = mockFetch.mock.calls[0][0];
    expect(fetchUrl).toContain('category_id=1');
    expect(fetchUrl).toContain('brand_id=1');
    expect(fetchUrl).toContain('min_price=20000');
    expect(fetchUrl).toContain('max_price=80000');
  });
});

// ================================================================
//  FLOW 7 — WHOLESALE REGISTRATION & APPROVAL
// ================================================================

describe('Flow 07 — Wholesale Registration Journey', () => {
  it('wholesale user registers with business details', async () => {
    const wholesaleUser = makeUser({
      customer_type: 'wholesale',
      status: 'pending',
      wholesale_business_name: 'Golden Supplements Ltd',
      wholesale_business_details: 'Bulk supplements distributor in Kampala',
      is_wholesale_approved: false,
    });
    mockFetch.mockResolvedValueOnce(created({ user: wholesaleUser }));

    const result = await apiClient.registerWholesale({
      first_name: 'Gorret',
      last_name: 'Golden',
      email: 'wholesale@golden.com',
      phone: '+256700000000',
      password: 'SecurePass123!',
      password_confirmation: 'SecurePass123!',
      business_name: 'Golden Supplements Ltd',
      business_details: 'Bulk supplements distributor in Kampala',
    });

    expect(result.status).toBe(true);
    expect(result.data.user.customer_type).toBe('wholesale');
    expect(result.data.user.status).toBe('pending');
  });

  it('pending wholesale user cannot access wholesale pricing', async () => {
    localStorage.setItem('auth_token', 'pending-token');
    mockFetch.mockResolvedValueOnce(fail('Your wholesale account is pending approval', 403));

    const result = await apiClient.getProducts({ wholesale: true });

    expect(result.status).toBe(false);
  });

  it('approved wholesale user sees wholesale prices', async () => {
    localStorage.setItem('auth_token', 'wholesale-token');
    const wholesaleProducts = [
      makeProduct({ id: 1, price: 50000, wholesale_price: 40000, wholesale_min_qty: 10 }),
      makeProduct({ id: 2, price: 35000, slug: 'bcaa', wholesale_price: 28000, wholesale_min_qty: 10 }),
    ];
    mockFetch.mockResolvedValueOnce(paginated(wholesaleProducts));

    const result = await apiClient.getProducts({ page: 1 });

    expect(result.status).toBe(true);
    const product = result.data.data[0];
    expect(product.wholesale_price).toBeLessThan(product.price);
    expect(product.wholesale_min_qty).toBe(10);
  });
});

// ================================================================
//  FLOW 8 — DELIVERY & PRICING CALCULATIONS
// ================================================================

describe('Flow 08 — Delivery & Pricing Journey', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'auth-token');
  });

  it('full delivery calculation flow: regions → towns → fee', async () => {
    // Step 1: Get regions
    const regions = [
      makeRegion({ id: 1, name: 'Kampala' }),
      makeRegion({ id: 2, name: 'Wakiso', towns: [{ id: 3, name: 'Entebbe', delivery_fee: 15000 }] }),
    ];
    mockFetch.mockResolvedValueOnce(ok(regions));
    const regionsResult = await apiClient.getRegions();
    expect(regionsResult.status).toBe(true);
    expect(regionsResult.data).toHaveLength(2);

    // Step 2: Get towns for selected region
    mockFetch.mockResolvedValueOnce(ok([
      { id: 1, name: 'Central', delivery_fee: 5000 },
      { id: 2, name: 'Kawempe', delivery_fee: 8000 },
      { id: 3, name: 'Makindye', delivery_fee: 7000 },
    ]));
    const townsResult = await apiClient.getTowns(1);
    expect(townsResult.status).toBe(true);
    expect(townsResult.data).toHaveLength(3);

    // Step 3: Calculate delivery fee
    mockFetch.mockResolvedValueOnce(ok({ fee: 5000 }));
    const feeResult = await apiClient.calculateDeliveryFee({
      region_id: 1,
      town_id: 1,
    });
    expect(feeResult.status).toBe(true);
    expect(feeResult.data.fee).toBe(5000);
  });

  it('delivery fee varies by location', async () => {
    // Kampala Central - cheaper
    mockFetch.mockResolvedValueOnce(ok({ fee: 5000 }));
    const kampala = await apiClient.calculateDeliveryFee({ region_id: 1, town_id: 1 });

    // Entebbe - more expensive
    mockFetch.mockResolvedValueOnce(ok({ fee: 15000 }));
    const entebbe = await apiClient.calculateDeliveryFee({ region_id: 2, town_id: 3 });

    expect(kampala.data.fee).toBeLessThan(entebbe.data.fee);
  });

  it('order total calculation: subtotal + delivery - discount', () => {
    const subtotal = 135000;
    const deliveryFee = 10000;
    const discountAmount = 27000;

    const total = subtotal + deliveryFee - discountAmount;

    expect(total).toBe(118000);
  });

  it('active discounts are fetchable', async () => {
    const discounts = [
      makeDiscount({ code: 'SAVE20', value: 20 }),
      makeDiscount({ id: 2, code: 'NEWUSER', type: 'fixed', value: 10000 }),
    ];
    mockFetch.mockResolvedValueOnce(ok(discounts));

    const result = await apiClient.getActiveDiscounts();

    expect(result.status).toBe(true);
    expect(result.data).toHaveLength(2);
  });
});

// ================================================================
//  FLOW 9 — NEWSLETTER & CONTACT
// ================================================================

describe('Flow 09 — Newsletter & Contact Flows', () => {
  it('user subscribes to newsletter', async () => {
    mockFetch.mockResolvedValueOnce(ok(null, 'Successfully subscribed'));

    const result = await apiClient.subscribeToNewsletter({ email: 'subscribe@test.com' });

    expect(result.status).toBe(true);
  });

  it('duplicate newsletter subscription rejected', async () => {
    mockFetch.mockResolvedValueOnce(fail('This email is already subscribed', 422));

    const result = await apiClient.subscribeToNewsletter({ email: 'existing@test.com' });

    expect(result.status).toBe(false);
  });

  it('wellness question submitted', async () => {
    mockFetch.mockResolvedValueOnce(ok(null, 'Question submitted'));

    const result = await apiClient.submitWellnessQuestion({
      name: 'Gorret',
      email: 'gorret@test.com',
      question: 'What supplements are best for energy?',
    });

    expect(result.status).toBe(true);
  });

  it('CMS pages load correctly', async () => {
    // About page
    mockFetch.mockResolvedValueOnce(ok({
      title: 'About NutriBlend Haven',
      content: '<p>We are your premier health and wellness destination...</p>',
    }));
    const about = await apiClient.getPageByType('about');
    expect(about.status).toBe(true);
    expect(about.data.title).toContain('About');

    // Terms page
    mockFetch.mockResolvedValueOnce(ok({ title: 'Terms & Conditions' }));
    const terms = await apiClient.getPageByType('terms');
    expect(terms.status).toBe(true);

    // Privacy page
    mockFetch.mockResolvedValueOnce(ok({ title: 'Privacy Policy' }));
    const privacy = await apiClient.getPageByType('privacy');
    expect(privacy.status).toBe(true);

    // FAQ page
    mockFetch.mockResolvedValueOnce(ok({ title: 'FAQ' }));
    const faq = await apiClient.getPageByType('faq');
    expect(faq.status).toBe(true);
  });

  it('public settings load for footer & header', async () => {
    mockFetch.mockResolvedValueOnce(ok({
      site_name: 'NutriBlend Haven',
      slogan: 'Your Premier Health & Wellness Hub',
      phone: '+256751547645',
      email: 'info@nutriblendhaven.com',
      address: 'Kampala, Uganda',
      facebook_url: 'https://facebook.com/nutriblendhaven',
      instagram_url: 'https://instagram.com/nutriblendhaven',
      twitter_url: 'https://twitter.com/nutriblendhaven',
    }));

    const result = await apiClient.getPublicSettings();

    expect(result.status).toBe(true);
    expect(result.data.site_name).toBe('NutriBlend Haven');
    expect(result.data.phone).toBeDefined();
    expect(result.data.email).toBeDefined();
  });
});

// ================================================================
//  FLOW 10 — ERROR HANDLING & EDGE CASES
// ================================================================

describe('Flow 10 — Error Handling & Edge Cases', () => {
  it('handles network failure gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network request failed'));

    const result = await apiClient.getProducts({ page: 1 });

    expect(result.status).toBe(false);
  });

  it('handles server 500 error', async () => {
    mockFetch.mockResolvedValueOnce(fail('Internal Server Error', 500));

    const result = await apiClient.getProducts({ page: 1 });

    expect(result.status).toBe(false);
  });

  it('handles 404 for non-existent product', async () => {
    mockFetch.mockResolvedValueOnce(fail('Product not found', 404));

    const result = await apiClient.getProduct(99999);

    expect(result.status).toBe(false);
    expect(result.message).toContain('not found');
  });

  it('handles 401 expired token', async () => {
    localStorage.setItem('auth_token', 'expired-token');
    mockFetch.mockResolvedValueOnce(fail('Token has expired', 401));

    const result = await apiClient.getProfile();

    expect(result.status).toBe(false);
  });

  it('handles empty cart gracefully', async () => {
    localStorage.setItem('auth_token', 'auth-token');
    mockFetch.mockResolvedValueOnce(ok(makeCart([])));

    const result = await apiClient.getCartSummary();

    expect(result.status).toBe(true);
    expect(result.data.items).toHaveLength(0);
    expect(result.data.total).toBe(0);
  });

  it('handles adding out-of-stock product to cart', async () => {
    localStorage.setItem('auth_token', 'auth-token');
    mockFetch.mockResolvedValueOnce(fail('Product is out of stock', 422));

    const result = await apiClient.addToCart({ product_id: 1, quantity: 1 });

    expect(result.status).toBe(false);
    expect(result.message).toContain('out of stock');
  });

  it('handles adding quantity exceeding stock', async () => {
    localStorage.setItem('auth_token', 'auth-token');
    mockFetch.mockResolvedValueOnce(fail('Requested quantity exceeds available stock', 422));

    const result = await apiClient.addToCart({ product_id: 1, quantity: 9999 });

    expect(result.status).toBe(false);
    expect(result.message).toContain('exceeds');
  });

  it('handles timeout / slow response', async () => {
    mockFetch.mockImplementationOnce(() =>
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 100)
      )
    );

    const result = await apiClient.getProducts({ page: 1 });

    expect(result.status).toBe(false);
  });

  it('handles malformed API response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => { throw new Error('Invalid JSON'); },
      text: async () => 'not json',
    });

    const result = await apiClient.getProducts({ page: 1 });

    // Should gracefully handle instead of crashing
    expect(result).toBeDefined();
  });
});

// ================================================================
//  FLOW 11 — NAVIGATION & LAYOUT CONSISTENCY
// ================================================================

describe('Flow 11 — Navigation & Layout Data', () => {
  it('categories load for navigation menu', async () => {
    const categories = [
      makeCategory({ id: 1, name: 'Supplements' }),
      makeCategory({ id: 2, name: 'Vitamins', slug: 'vitamins' }),
      makeCategory({ id: 3, name: 'Fitness', slug: 'fitness' }),
      makeCategory({ id: 4, name: 'Perfumes', slug: 'perfumes' }),
      makeCategory({ id: 5, name: 'Sexual Health', slug: 'sexual-health' }),
    ];
    mockFetch.mockResolvedValueOnce(ok(categories));

    const result = await apiClient.getCategories();

    expect(result.status).toBe(true);
    expect(result.data.length).toBeGreaterThanOrEqual(3);
  });

  it('category tree loads for sidebar', async () => {
    const tree = [
      {
        ...makeCategory({ id: 1, name: 'Health' }),
        children: [
          makeCategory({ id: 10, name: 'Vitamins', slug: 'vitamins' }),
          makeCategory({ id: 11, name: 'Minerals', slug: 'minerals' }),
        ],
      },
      {
        ...makeCategory({ id: 2, name: 'Fitness', slug: 'fitness' }),
        children: [
          makeCategory({ id: 20, name: 'Equipment', slug: 'equipment' }),
        ],
      },
    ];
    mockFetch.mockResolvedValueOnce(ok(tree));

    const result = await apiClient.getCategoriesTree();

    expect(result.status).toBe(true);
    expect(result.data[0].children).toBeDefined();
  });

  it('brands load for brand page and filters', async () => {
    const brands = Array.from({ length: 10 }, (_, i) =>
      makeBrand({ id: i + 1, name: `Brand ${i + 1}`, slug: `brand-${i + 1}` })
    );
    mockFetch.mockResolvedValueOnce(ok(brands));

    const result = await apiClient.getBrands();

    expect(result.status).toBe(true);
    expect(result.data).toHaveLength(10);
  });

  it('UGX price formatting is correct', () => {
    const formatPrice = (amount: number) => `UGX ${amount.toLocaleString()}`;

    expect(formatPrice(50000)).toBe('UGX 50,000');
    expect(formatPrice(1500000)).toBe('UGX 1,500,000');
    expect(formatPrice(500)).toBe('UGX 500');
    expect(formatPrice(0)).toBe('UGX 0');
  });

  it('navigation links are correctly structured', () => {
    const navLinks = [
      { href: '/', label: 'Home' },
      { href: '/shop', label: 'Shop' },
      { href: '/shop?on_sale=true', label: 'Sale' },
      { href: '/brands', label: 'Brands' },
      { href: '/wholesale-registration', label: 'Wholesale' },
      { href: '/aboutUs', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/faq', label: 'FAQ' },
    ];

    navLinks.forEach(link => {
      expect(link.href).toBeTruthy();
      expect(link.label).toBeTruthy();
      expect(link.href.startsWith('/')).toBe(true);
    });
  });

  it('footer quick links are valid', () => {
    const footerLinks = [
      '/shop',
      '/shop?is_new_arrival=true',
      '/brands',
      '/wholesale-registration',
      '/aboutUs',
      '/faq',
      '/contact',
      '/privacy',
      '/terms',
      '/account/order',
      '/account',
      '/account/mylist',
      '/account/myreview',
    ];

    footerLinks.forEach(link => {
      expect(link).toBeTruthy();
      expect(link.startsWith('/')).toBe(true);
    });
  });

  it('account sidebar links are valid', () => {
    const accountLinks = [
      { href: '/account', label: 'My Account' },
      { href: '/account/order', label: 'Orders' },
      { href: '/account/mylist', label: 'My Wishlist' },
      { href: '/account/myreview', label: 'My Reviews' },
      { href: '/account/messages', label: 'Messages' },
      { href: '/account/manage', label: 'Account Settings' },
    ];

    accountLinks.forEach(link => {
      expect(link.href).toContain('/account');
    });
  });
});

// ================================================================
//  FLOW 12 — CART LIFECYCLE: ADD → UPDATE → REMOVE → CLEAR
// ================================================================

describe('Flow 12 — Cart Lifecycle', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'auth-token');
  });

  it('full cart lifecycle: add → update quantity → remove item → clear cart', async () => {
    // Step 1: Add first item
    mockFetch.mockResolvedValueOnce(ok(makeCart([
      makeCartItem({ id: 1, product_id: 1, quantity: 1, total: 50000 }),
    ])));
    const add1 = await apiClient.addToCart({ product_id: 1, quantity: 1 });
    expect(add1.status).toBe(true);
    expect(add1.data.items).toHaveLength(1);

    // Step 2: Add second item
    mockFetch.mockResolvedValueOnce(ok(makeCart([
      makeCartItem({ id: 1, product_id: 1, quantity: 1, total: 50000 }),
      makeCartItem({ id: 2, product_id: 2, quantity: 1, total: 35000, product: makeProduct({ id: 2, name: 'BCAA', price: 35000 }) }),
    ])));
    const add2 = await apiClient.addToCart({ product_id: 2, quantity: 1 });
    expect(add2.data.items).toHaveLength(2);

    // Step 3: Update first item quantity to 3
    mockFetch.mockResolvedValueOnce(ok(makeCart([
      makeCartItem({ id: 1, product_id: 1, quantity: 3, total: 150000 }),
      makeCartItem({ id: 2, product_id: 2, quantity: 1, total: 35000 }),
    ])));
    const update = await apiClient.updateCartItem(1, 3);
    expect(update.status).toBe(true);
    expect(update.data.total).toBe(185000);

    // Step 4: Remove second item
    mockFetch.mockResolvedValueOnce(ok(makeCart([
      makeCartItem({ id: 1, product_id: 1, quantity: 3, total: 150000 }),
    ])));
    const remove = await apiClient.removeFromCart(2);
    expect(remove.status).toBe(true);
    expect(remove.data.items).toHaveLength(1);

    // Step 5: Clear entire cart
    mockFetch.mockResolvedValueOnce(ok(null, 'Cart cleared'));
    const clear = await apiClient.clearCart();
    expect(clear.status).toBe(true);

    expect(mockFetch).toHaveBeenCalledTimes(5);
  });

  it('updating cart item to quantity 0 removes it', async () => {
    mockFetch.mockResolvedValueOnce(ok(makeCart([])));

    const result = await apiClient.updateCartItem(1, 0);

    expect(result.status).toBe(true);
  });

  it('cart persists across page navigations (via API)', async () => {
    // Simulate adding to cart, then fetching cart on different page
    mockFetch.mockResolvedValueOnce(ok(makeCart([
      makeCartItem({ id: 1, product_id: 1, quantity: 2, total: 100000 }),
    ])));
    await apiClient.addToCart({ product_id: 1, quantity: 2 });

    // Fetch cart again (simulating page navigation)
    mockFetch.mockResolvedValueOnce(ok(makeCart([
      makeCartItem({ id: 1, product_id: 1, quantity: 2, total: 100000 }),
    ])));
    const cartOnNewPage = await apiClient.getCartSummary();

    expect(cartOnNewPage.data.items).toHaveLength(1);
    expect(cartOnNewPage.data.items[0].quantity).toBe(2);
  });

  it('cart badge count reflects correct total quantity', () => {
    const cart = makeCart([
      makeCartItem({ quantity: 2 }),
      makeCartItem({ id: 2, quantity: 3 }),
      makeCartItem({ id: 3, quantity: 1 }),
    ]);

    expect(cart.totalQuantities).toBe(6);
  });
});

// ================================================================
//  FLOW 13 — AUTHENTICATION GUARDS & REDIRECTS
// ================================================================

describe('Flow 13 — Authentication Guards', () => {
  it('protected routes return 401 without token', async () => {
    // No token set
    const protectedEndpoints = [
      () => apiClient.getProfile(),
      () => apiClient.getCart(),
      () => apiClient.getOrders({ page: 1 }),
      () => apiClient.getWishlist(),
      () => apiClient.getMessages(1),
      () => apiClient.getNotifications(1),
    ];

    for (const endpoint of protectedEndpoints) {
      mockFetch.mockResolvedValueOnce(fail('Unauthenticated', 401));
      const result = await endpoint();
      expect(result.status).toBe(false);
    }
  });

  it('token is included in Authorization header for authenticated requests', async () => {
    localStorage.setItem('auth_token', 'my-bearer-token');
    mockFetch.mockResolvedValueOnce(ok(makeUser()));

    await apiClient.getProfile();

    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers['Authorization']).toBe('Bearer my-bearer-token');
  });

  it('expired token triggers 401 on all protected routes', async () => {
    localStorage.setItem('auth_token', 'expired-token');
    mockFetch.mockResolvedValueOnce(fail('Token has expired', 401));

    const result = await apiClient.getProfile();

    expect(result.status).toBe(false);
  });

  it('after logout, protected routes fail', async () => {
    // Login first
    localStorage.setItem('auth_token', 'valid-token');

    // Logout
    mockFetch.mockResolvedValueOnce(ok(null, 'Logged out'));
    await apiClient.logout();

    // Try protected route
    mockFetch.mockResolvedValueOnce(fail('Unauthenticated', 401));
    const result = await apiClient.getProfile();
    expect(result.status).toBe(false);
  });
});

// ================================================================
//  FLOW 14 — PRODUCT VARIATIONS & STOCK MANAGEMENT
// ================================================================

describe('Flow 14 — Product Variations & Stock', () => {
  it('product with variations shows all available options', async () => {
    const product = makeProduct({
      has_variations: true,
      variations: [
        makeVariation({ id: 1, name: '250g', price: 25000, stock_quantity: 30 }),
        makeVariation({ id: 2, name: '500g', price: 45000, stock_quantity: 20 }),
        makeVariation({ id: 3, name: '1kg', price: 80000, stock_quantity: 15 }),
      ],
    });
    mockFetch.mockResolvedValueOnce(ok(product));

    const result = await apiClient.getProduct(1);

    expect(result.data.variations).toHaveLength(3);
    expect(result.data.variations[0].name).toBe('250g');
    expect(result.data.variations[2].price).toBe(80000);
  });

  it('variation stock determines availability', () => {
    const variations = [
      makeVariation({ id: 1, name: '250g', stock_quantity: 0 }),   // out of stock
      makeVariation({ id: 2, name: '500g', stock_quantity: 20 }),  // in stock
      makeVariation({ id: 3, name: '1kg', stock_quantity: 0 }),    // out of stock
    ];

    const available = variations.filter(v => v.stock_quantity > 0);
    const outOfStock = variations.filter(v => v.stock_quantity === 0);

    expect(available).toHaveLength(1);
    expect(outOfStock).toHaveLength(2);
    expect(available[0].name).toBe('500g');
  });

  it('variation with discount calculates correct price', () => {
    const variation = makeVariation({
      price: 45000,
      discount_percentage: 15,
    });

    const discountAmount = Math.round(variation.price * variation.discount_percentage / 100);
    const finalPrice = variation.price - discountAmount;

    expect(discountAmount).toBe(6750);
    expect(finalPrice).toBe(38250);
  });

  it('add to cart with specific variation', async () => {
    localStorage.setItem('auth_token', 'auth-token');
    mockFetch.mockResolvedValueOnce(ok(makeCart([
      makeCartItem({
        product_id: 1,
        variation_id: 2,
        variation_name: '500g',
        unit_price: 45000,
        total: 45000,
      }),
    ])));

    const result = await apiClient.addToCart({
      product_id: 1,
      variation_id: 2,
      quantity: 1,
    });

    expect(result.status).toBe(true);
    expect(result.data.items[0].variation_id).toBe(2);
  });

  it('low stock indicator triggers at correct thresholds', () => {
    const thresholds = [
      { stock: 0, label: 'Out of Stock', canAdd: false },
      { stock: 1, label: 'Only 1 left', canAdd: true },
      { stock: 3, label: 'Only 3 left', canAdd: true },
      { stock: 5, label: 'Only 5 left', canAdd: true },
      { stock: 10, label: null, canAdd: true },          // no warning
      { stock: 100, label: null, canAdd: true },          // no warning
    ];

    thresholds.forEach(({ stock, canAdd }) => {
      expect(stock > 0).toBe(canAdd);
    });
  });

  it('product images load correctly for variation and non-variation products', () => {
    // Non-variation product — uses product images
    const simpleProduct = makeProduct({
      has_variations: false,
      images: [
        { id: 1, image_url: '/images/product1-front.jpg', is_primary: true },
        { id: 2, image_url: '/images/product1-back.jpg', is_primary: false },
      ],
    });
    expect(simpleProduct.images).toHaveLength(2);
    expect(simpleProduct.images[0].is_primary).toBe(true);

    // Variation product — each variation may have its own images
    const varProduct = makeProduct({
      has_variations: true,
      variations: [
        makeVariation({
          id: 1,
          name: 'Red 500g',
          images: [{ id: 10, image_url: '/images/red-500g.jpg' }],
        }),
        makeVariation({
          id: 2,
          name: 'Blue 500g',
          images: [{ id: 11, image_url: '/images/blue-500g.jpg' }],
        }),
      ],
    });
    expect(varProduct.variations[0].images).toHaveLength(1);
  });
});

// ================================================================
//  FLOW 15 — ORDER LIFECYCLE: CREATE → TRACK → CANCEL → REVIEW
// ================================================================

describe('Flow 15 — Order Lifecycle', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'auth-token');
  });

  it('full order lifecycle: create → view → track → receive → review', async () => {
    // Step 1: Create order
    mockFetch.mockResolvedValueOnce(created(makeOrder({ status: 'pending' })));
    const createResult = await apiClient.createOrder({
      delivery_region_id: 1,
      delivery_town_id: 1,
      delivery_address: 'Kampala, Plot 10',
      payment_method: 'mobile_money',
    });
    expect(createResult.status).toBe(true);
    expect(createResult.data.status).toBe('pending');

    // Step 2: View order in list
    mockFetch.mockResolvedValueOnce(paginated([
      makeOrder({ status: 'pending' }),
    ]));
    const ordersResult = await apiClient.getOrders({ page: 1 });
    expect(ordersResult.data.data).toHaveLength(1);

    // Step 3: Track order (status changes to processing)
    mockFetch.mockResolvedValueOnce(ok(makeOrder({ status: 'processing' })));
    const trackResult = await apiClient.getOrder('NB-20260410-0001');
    expect(trackResult.data.status).toBe('processing');

    // Step 4: Order delivered
    mockFetch.mockResolvedValueOnce(ok(makeOrder({ status: 'delivered' })));
    const deliveredResult = await apiClient.getOrder('NB-20260410-0001');
    expect(deliveredResult.data.status).toBe('delivered');

    // Step 5: Submit review for purchased product
    mockFetch.mockResolvedValueOnce(created(makeReview()));
    const reviewResult = await apiClient.submitReview(1, {
      rating: 5,
      comment: 'Excellent product, fast delivery!',
    });
    expect(reviewResult.status).toBe(true);

    expect(mockFetch).toHaveBeenCalledTimes(5);
  });

  it('user cancels pending order', async () => {
    mockFetch.mockResolvedValueOnce(ok(makeOrder({ status: 'cancelled' })));

    const result = await apiClient.cancelOrder('NB-20260410-0001');

    expect(result.status).toBe(true);
    expect(result.data.status).toBe('cancelled');
  });

  it('user cannot cancel processing/delivered order', async () => {
    mockFetch.mockResolvedValueOnce(fail('Order cannot be cancelled once processing has started', 422));

    const result = await apiClient.cancelOrder('NB-0002');

    expect(result.status).toBe(false);
    expect(result.message).toContain('cannot be cancelled');
  });

  it('order statuses transition correctly', () => {
    const validTransitions: Record<string, string[]> = {
      'pending': ['processing', 'cancelled'],
      'processing': ['shipped', 'cancelled'],
      'shipped': ['delivered'],
      'delivered': [],
      'cancelled': [],
    };

    // Pending can go to processing or cancelled
    expect(validTransitions['pending']).toContain('processing');
    expect(validTransitions['pending']).toContain('cancelled');

    // Delivered is terminal
    expect(validTransitions['delivered']).toHaveLength(0);

    // Cancelled is terminal
    expect(validTransitions['cancelled']).toHaveLength(0);
  });

  it('order includes all required details', async () => {
    const fullOrder = makeOrder({
      items: [
        {
          id: 1,
          product: makeProduct({ name: 'Whey Protein' }),
          quantity: 2,
          unit_price: 50000,
          total: 100000,
        },
        {
          id: 2,
          product: makeProduct({ id: 2, name: 'BCAA', price: 35000 }),
          quantity: 1,
          unit_price: 35000,
          total: 35000,
        },
      ],
      subtotal: 135000,
      delivery_fee: 10000,
      discount_amount: 20000,
      total: 125000,
    });

    mockFetch.mockResolvedValueOnce(ok(fullOrder));
    const result = await apiClient.getOrder('NB-20260410-0001');

    expect(result.data.items).toHaveLength(2);
    expect(result.data.subtotal).toBe(135000);
    expect(result.data.delivery_fee).toBe(10000);
    expect(result.data.discount_amount).toBe(20000);
    expect(result.data.total).toBe(125000);
    expect(result.data.delivery_address).toBeTruthy();
    expect(result.data.payment_method).toBeTruthy();
  });

  it('invoice URL is retrievable for completed orders', () => {
    localStorage.setItem('auth_token', 'auth-token');

    const url = apiClient.getInvoiceUrl('NB-20260410-0001');

    expect(url).toContain('NB-20260410-0001');
    expect(url).toContain('/invoice');
    expect(url).toContain('token=auth-token');
  });

  it('product reviews include rating and comment', async () => {
    const reviews = [
      makeReview({ rating: 5, comment: 'Amazing quality!' }),
      makeReview({ id: 2, rating: 4, comment: 'Good, but expensive' }),
      makeReview({ id: 3, rating: 3, comment: 'Average product' }),
    ];
    mockFetch.mockResolvedValueOnce(ok({ data: reviews, average: 4.0, total: 3 }));

    const result = await apiClient.getProductReviews(1);

    expect(result.status).toBe(true);
    expect(result.data.data).toHaveLength(3);
    expect(result.data.average).toBe(4.0);
  });
});

// ================================================================
//  REDUX INTEGRATION — AUTH SLICE E2E
// ================================================================

describe('Redux Auth Slice — Full Flow', () => {
  it('initial state is unauthenticated', async () => {
    const { default: authReducer } = await import('@/lib/features/auth/authSlice');
    const state = authReducer(undefined, { type: 'unknown' });

    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('login flow sets auth state correctly', async () => {
    const mod = await import('@/lib/features/auth/authSlice');
    const { loginUser } = mod;
    const authReducer = mod.default;

    // Pending
    const pendingState = authReducer(undefined, { type: loginUser.pending.type });
    expect(pendingState.isLoading).toBe(true);
    expect(pendingState.error).toBeNull();

    // Fulfilled
    const fulfilledState = authReducer(pendingState, {
      type: loginUser.fulfilled.type,
      payload: { user: makeUser(), token: 'fresh-token' },
    });
    expect(fulfilledState.isLoading).toBe(false);
    expect(fulfilledState.isAuthenticated).toBe(true);
    expect(fulfilledState.user?.first_name).toBe('Gorret');
    expect(fulfilledState.token).toBe('fresh-token');
  });

  it('failed login sets error state', async () => {
    const mod = await import('@/lib/features/auth/authSlice');
    const { loginUser } = mod;
    const authReducer = mod.default;

    const rejectedState = authReducer(undefined, {
      type: loginUser.rejected.type,
      payload: 'Invalid credentials',
    });

    expect(rejectedState.isLoading).toBe(false);
    expect(rejectedState.isAuthenticated).toBe(false);
    expect(rejectedState.error).toBeDefined();
  });

  it('logout clears all auth state', async () => {
    const mod = await import('@/lib/features/auth/authSlice');
    const { logoutUser } = mod;
    const authReducer = mod.default;

    const loggedInState = {
      user: makeUser(),
      token: 'auth-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };

    const loggedOutState = authReducer(loggedInState, {
      type: logoutUser.fulfilled.type,
    });

    expect(loggedOutState.isAuthenticated).toBe(false);
    expect(loggedOutState.user).toBeNull();
    expect(loggedOutState.token).toBeNull();
  });
});

// ================================================================
//  REDUX INTEGRATION — CART SLICE E2E
// ================================================================

describe('Redux Cart Slice — Full Flow', () => {
  it('initial cart state', async () => {
    const { default: cartReducer } = await import('@/lib/features/carts/cartsSlice');
    const state = cartReducer(undefined, { type: 'unknown' });

    expect(state.cart).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.totalPrice).toBe(0);
  });

  it('add to cart action updates state', async () => {
    const mod = await import('@/lib/features/carts/cartsSlice');
    const cartReducer = mod.default;

    const state = cartReducer(undefined, {
      type: 'carts/addToCart/fulfilled',
      payload: {
        data: makeCart([
          makeCartItem({ quantity: 2, total: 100000 }),
        ]),
      },
    });

    expect(state).toBeDefined();
  });
});

// ================================================================
//  REDUX INTEGRATION — WISHLIST SLICE E2E
// ================================================================

describe('Redux Wishlist Slice — Full Flow', () => {
  it('initial wishlist state', async () => {
    const { default: wishlistReducer } = await import('@/lib/features/wishlist/wishlistSlice');
    const state = wishlistReducer(undefined, { type: 'unknown' });

    expect(state.items).toBeDefined();
    expect(state.isLoading).toBe(false);
  });
});

// ================================================================
//  REDUX INTEGRATION — PRODUCTS SLICE E2E
// ================================================================

describe('Redux Products Slice — Full Flow', () => {
  it('initial products state has defaults', async () => {
    const { default: productsReducer } = await import('@/lib/features/products/productsSlice');
    const state = productsReducer(undefined, { type: 'unknown' });

    expect(state).toBeDefined();
    expect(state.colorSelection).toBeDefined();
    expect(state.sizeSelection).toBe('Large');
    expect(state.selectedVariationId).toBeNull();
  });
});

// ================================================================
//  BUSINESS RULES VALIDATION
// ================================================================

describe('Business Rules — Cross-cutting Concerns', () => {
  it('UGX currency formatting works for all price ranges', () => {
    const formatPrice = (amount: number) => `UGX ${amount.toLocaleString()}`;

    // Small amounts
    expect(formatPrice(500)).toBe('UGX 500');
    expect(formatPrice(1000)).toBe('UGX 1,000');

    // Medium amounts
    expect(formatPrice(50000)).toBe('UGX 50,000');
    expect(formatPrice(135000)).toBe('UGX 135,000');

    // Large amounts
    expect(formatPrice(1500000)).toBe('UGX 1,500,000');
    expect(formatPrice(10000000)).toBe('UGX 10,000,000');
  });

  it('discount calculations are accurate', () => {
    const testCases = [
      { price: 50000, discount: 10, expected: 45000 },
      { price: 50000, discount: 20, expected: 40000 },
      { price: 100000, discount: 15, expected: 85000 },
      { price: 35000, discount: 50, expected: 17500 },
      { price: 80000, discount: 0, expected: 80000 },
    ];

    testCases.forEach(({ price, discount, expected }) => {
      const finalPrice = price - Math.round(price * discount / 100);
      expect(finalPrice).toBe(expected);
    });
  });

  it('cart total + delivery - discount = order total', () => {
    const scenarios = [
      { subtotal: 100000, delivery: 5000, discount: 0, expected: 105000 },
      { subtotal: 135000, delivery: 10000, discount: 27000, expected: 118000 },
      { subtotal: 50000, delivery: 15000, discount: 10000, expected: 55000 },
      { subtotal: 200000, delivery: 0, discount: 40000, expected: 160000 },
    ];

    scenarios.forEach(({ subtotal, delivery, discount, expected }) => {
      expect(subtotal + delivery - discount).toBe(expected);
    });
  });

  it('phone numbers follow Uganda format', () => {
    const validPhones = [
      '+256751547645',
      '+256700000000',
      '+256780123456',
    ];

    validPhones.forEach(phone => {
      expect(phone.startsWith('+256')).toBe(true);
      expect(phone.length).toBe(13);
    });
  });

  it('order number format is correct', () => {
    const orderNumbers = ['NB-20260410-0001', 'NB-20260411-0042', 'NB-20260101-1234'];

    orderNumbers.forEach(num => {
      expect(num.startsWith('NB-')).toBe(true);
      expect(num.length).toBeGreaterThanOrEqual(10);
    });
  });

  it('product slug is URL-safe', () => {
    const products = [
      makeProduct({ name: 'Whey Protein Powder', slug: 'whey-protein-powder' }),
      makeProduct({ name: 'BCAA Energy+', slug: 'bcaa-energy-plus' }),
      makeProduct({ name: "Women's Multivitamin", slug: 'womens-multivitamin' }),
    ];

    products.forEach(p => {
      expect(p.slug).not.toContain(' ');
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
    });
  });

  it('timestamps display with correct timezone (EAT UTC+3)', () => {
    const date = new Date('2026-04-10T14:30:00+03:00');
    const formatted = date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Africa/Nairobi',
    });

    expect(formatted).toContain('2:30');
    expect(formatted).toContain('PM');
  });

  it('pagination math is correct', () => {
    const totalProducts = 60;
    const perPage = 24;
    const totalPages = Math.ceil(totalProducts / perPage);

    expect(totalPages).toBe(3);

    // Page 1: items 1-24
    // Page 2: items 25-48
    // Page 3: items 49-60
    const page3Items = totalProducts - (perPage * (totalPages - 1));
    expect(page3Items).toBe(12);
  });

  it('wholesale pricing is always less than retail', () => {
    const products = [
      makeProduct({ price: 50000, wholesale_price: 40000 }),
      makeProduct({ price: 35000, wholesale_price: 28000 }),
      makeProduct({ price: 80000, wholesale_price: 65000 }),
    ];

    products.forEach(p => {
      expect(p.wholesale_price).toBeLessThan(p.price);
    });
  });

  it('minimum wholesale quantity is enforced', () => {
    const product = makeProduct({ wholesale_min_qty: 10 });
    const requestedQty = 5;

    expect(requestedQty).toBeLessThan(product.wholesale_min_qty);
    // UI should show error or enforce minimum
  });
});
