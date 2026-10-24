import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "@/components/storage";
import productsReducer from "./features/products/productsSlice";
import cartsReducer from "./features/carts/cartsSlice";
import authReducer from "./features/auth/authSlice";
import wishlistReducer from "./features/wishlist/wishlistSlice";
import viewModeReducer from "./features/viewMode/viewModeSlice";

const persistConfig = {
  key: "root",
  storage,
  version: 2,
  whitelist: ["carts", "wishlist", "auth"],
  migrate: (state: any) => {
    // v2: Reset cart to fix stale totalQuantities (521 bug)
    if (state && state._persist && state._persist.version < 2) {
      return Promise.resolve({
        ...state,
        carts: {
          cart: null,
          totalPrice: 0,
          adjustedTotalPrice: 0,
          promoCode: null,
          isLoading: false,
          error: null,
          isSynced: false,
        },
        _persist: { ...state._persist, version: 2 },
      });
    }
    return Promise.resolve(state);
  },
};

const rootReducer = combineReducers({
  products: productsReducer,
  carts: cartsReducer,
  auth: authReducer,
  wishlist: wishlistReducer,
  // Deliberately NOT in the persist whitelist: viewMode keeps its own
  // localStorage entry so a staff member's browsing mode survives reloads
  // without going through the redux-persist migration machinery.
  viewMode: viewModeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  const persistor = persistStore(store);
  return { store, persistor };
};

const store = makeStore().store;

// Infer the type of the store
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };
