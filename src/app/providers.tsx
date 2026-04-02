"use client";

import React, { useRef, useEffect } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { makeStore, type AppStore, type RootState, type AppDispatch } from "../lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { Persistor } from "redux-persist";
import SpinnerbLoader from "@/components/ui/SpinnerbLoader";
import { fetchWishlist } from "@/lib/features/wishlist/wishlistSlice";

type Props = {
  children: React.ReactNode;
};

/**
 * Fetches the user's wishlist from the server once authenticated.
 */
function WishlistLoader() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth?.isAuthenticated);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchWishlist());
    }
    if (!isAuthenticated) {
      hasFetched.current = false;
    }
  }, [isAuthenticated, dispatch]);

  return null;
}

const Providers = ({ children }: Props) => {
  const storeRef = useRef<{ store: AppStore; persistor: Persistor } | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  const { store, persistor } = storeRef.current;

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex items-center justify-center h-96">
            <SpinnerbLoader className="w-10 border-2 border-gray-300 border-r-gray-600" />
          </div>
        }
        persistor={persistor}
      >
        <WishlistLoader />
        {children}
      </PersistGate>
    </Provider>
  );
};

export default Providers;
