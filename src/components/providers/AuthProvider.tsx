'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { loadAuthFromStorage } from '@/lib/store/persistAuth';
import { fetchWishlist } from '@/lib/features/wishlist/wishlistSlice';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        // Load auth from localStorage on mount
        loadAuthFromStorage(dispatch);
    }, [dispatch]);

    // Fetch wishlist when user is authenticated
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchWishlist());
        }
    }, [isAuthenticated, dispatch]);

    return <>{children}</>;
}
