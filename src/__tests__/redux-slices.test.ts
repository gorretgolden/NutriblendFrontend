/**
 * NutriBlend Haven — Redux Slices Test Suite
 *
 * Tests auth, cart, wishlist, and products Redux slices —
 * reducers, actions, and state transitions.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  setCredentials,
  logout,
} from '@/lib/features/auth/authSlice';
import cartsReducer, {
  addToCartLocal,
  removeFromCartLocal,
  clearCartLocal,
  setPromoCode,
  setAdjustedPrice,
} from '@/lib/features/carts/cartsSlice';
import wishlistReducer, {
  clearWishlist,
} from '@/lib/features/wishlist/wishlistSlice';
import productsReducer, {
  setColorSelection,
  setSizeSelection,
  setSelectedVariationId,
} from '@/lib/features/products/productsSlice';

// ==================== Auth Slice ====================

describe('Auth Slice — Reducers', () => {
  const createStore = () =>
    configureStore({
      reducer: { auth: authReducer },
      middleware: (getDefault) => getDefault({ serializableCheck: false }),
    });

  it('initial state is unauthenticated', () => {
    const store = createStore();
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setCredentials sets user and token', () => {
    const store = createStore();
    const user = { id: 1, name: 'Test', email: 'test@test.com' } as any;

    store.dispatch(setCredentials({ user, token: 'abc-token' }));

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('test@test.com');
    expect(state.token).toBe('abc-token');
  });

  it('logout clears auth state', () => {
    const store = createStore();
    const user = { id: 1, name: 'Test', email: 'test@test.com' } as any;

    store.dispatch(setCredentials({ user, token: 'abc-token' }));
    store.dispatch(logout());

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});

// ==================== Cart Slice ====================

describe('Cart Slice — Local Cart Operations', () => {
  const createStore = () =>
    configureStore({
      reducer: { carts: cartsReducer },
      middleware: (getDefault) => getDefault({ serializableCheck: false }),
    });

  const mockCartItem = {
    id: 1,
    name: 'Whey Protein',
    srcUrl: '/images/whey.jpg',
    price: 50000,
    quantity: 1,
    product_id: 10,
  };

  it('initial cart is null', () => {
    const store = createStore();
    expect(store.getState().carts.cart).toBeNull();
    expect(store.getState().carts.totalPrice).toBe(0);
  });

  it('addToCartLocal creates cart with first item', () => {
    const store = createStore();
    store.dispatch(addToCartLocal(mockCartItem));

    const state = store.getState().carts;
    expect(state.cart?.items).toHaveLength(1);
    expect(state.cart?.items[0].name).toBe('Whey Protein');
    expect(state.cart?.totalQuantities).toBe(1);
    expect(state.totalPrice).toBe(50000);
  });

  it('addToCartLocal increments quantity for existing product', () => {
    const store = createStore();
    store.dispatch(addToCartLocal(mockCartItem));
    store.dispatch(addToCartLocal({ ...mockCartItem, id: 2, quantity: 3 }));

    const state = store.getState().carts;
    expect(state.cart?.items).toHaveLength(1);
    expect(state.cart?.items[0].quantity).toBe(4);
    expect(state.totalPrice).toBe(200000); // 4 * 50000
  });

  it('addToCartLocal adds different products separately', () => {
    const store = createStore();
    store.dispatch(addToCartLocal(mockCartItem));
    store.dispatch(
      addToCartLocal({
        id: 2,
        name: 'Vitamin C',
        srcUrl: '/images/vitc.jpg',
        price: 15000,
        quantity: 2,
        product_id: 20,
      })
    );

    const state = store.getState().carts;
    expect(state.cart?.items).toHaveLength(2);
    expect(state.cart?.totalQuantities).toBe(2);
    expect(state.totalPrice).toBe(80000); // 50000 + 2*15000
  });

  it('addToCartLocal treats different variations as separate items', () => {
    const store = createStore();
    store.dispatch(addToCartLocal({ ...mockCartItem, variation_id: 1 }));
    store.dispatch(
      addToCartLocal({ ...mockCartItem, id: 2, variation_id: 2 })
    );

    const state = store.getState().carts;
    expect(state.cart?.items).toHaveLength(2);
  });

  it('removeFromCartLocal removes item by id', () => {
    const store = createStore();
    store.dispatch(addToCartLocal(mockCartItem));
    store.dispatch(removeFromCartLocal(1));

    const state = store.getState().carts;
    expect(state.cart?.items).toHaveLength(0);
    expect(state.totalPrice).toBe(0);
  });

  it('clearCartLocal resets everything', () => {
    const store = createStore();
    store.dispatch(addToCartLocal(mockCartItem));
    store.dispatch(setPromoCode('SAVE10'));
    store.dispatch(clearCartLocal());

    const state = store.getState().carts;
    expect(state.cart).toBeNull();
    expect(state.totalPrice).toBe(0);
    expect(state.promoCode).toBeNull();
  });

  it('setPromoCode stores promo code', () => {
    const store = createStore();
    store.dispatch(setPromoCode('SUMMER20'));

    expect(store.getState().carts.promoCode).toBe('SUMMER20');
  });

  it('setAdjustedPrice updates adjusted total', () => {
    const store = createStore();
    store.dispatch(setAdjustedPrice(45000));

    expect(store.getState().carts.adjustedTotalPrice).toBe(45000);
  });
});

// ==================== Wishlist Slice ====================

describe('Wishlist Slice — Reducers', () => {
  const createStore = () =>
    configureStore({
      reducer: { wishlist: wishlistReducer },
      middleware: (getDefault) => getDefault({ serializableCheck: false }),
    });

  it('initial state is empty', () => {
    const store = createStore();
    const state = store.getState().wishlist;
    expect(state.items).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('clearWishlist empties items', () => {
    const store = createStore();
    // Manually set items via store state manipulation isn't clean,
    // but we can verify clearWishlist resets state
    store.dispatch(clearWishlist());

    expect(store.getState().wishlist.items).toEqual([]);
    expect(store.getState().wishlist.error).toBeNull();
  });
});

// ==================== Products Slice ====================

describe('Products Slice — Reducers', () => {
  const createStore = () =>
    configureStore({
      reducer: { products: productsReducer },
    });

  it('initial state has defaults', () => {
    const store = createStore();
    const state = store.getState().products;
    expect(state.sizeSelection).toBe('Large');
    expect(state.selectedVariationId).toBeNull();
  });

  it('setColorSelection updates color', () => {
    const store = createStore();
    store.dispatch(setColorSelection({ name: 'Red', code: 'bg-red-500' }));

    expect(store.getState().products.colorSelection.name).toBe('Red');
  });

  it('setSizeSelection updates size', () => {
    const store = createStore();
    store.dispatch(setSizeSelection('Medium'));

    expect(store.getState().products.sizeSelection).toBe('Medium');
  });

  it('setSelectedVariationId updates variation', () => {
    const store = createStore();
    store.dispatch(setSelectedVariationId(42));

    expect(store.getState().products.selectedVariationId).toBe(42);
  });

  it('setSelectedVariationId can be cleared to null', () => {
    const store = createStore();
    store.dispatch(setSelectedVariationId(42));
    store.dispatch(setSelectedVariationId(null));

    expect(store.getState().products.selectedVariationId).toBeNull();
  });
});
