'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks/redux';
import { setCredentials } from '@/lib/features/auth/authSlice';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // If Redux says not authenticated, check localStorage as fallback
        // (handles race condition where redux-persist hasn't rehydrated yet)
        if (!isAuthenticated && typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token');
            const userStr = localStorage.getItem('user');
            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr);
                    dispatch(setCredentials({ user, token }));
                    // Mark ready after dispatching - the next render will have isAuthenticated=true
                    setIsReady(true);
                    return;
                } catch (e) {
                    // Invalid stored data
                }
            }
        }
        setIsReady(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Also mark ready once redux confirms authentication
    useEffect(() => {
        if (isAuthenticated) {
            setIsReady(true);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        // Only redirect after ready, not loading, and confirmed not authenticated
        if (isReady && !isLoading && !isAuthenticated) {
            // Final localStorage check before redirecting
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
            if (!token) {
                sessionStorage.setItem('returnUrl', window.location.pathname);
                router.push('/login');
            }
        }
    }, [isAuthenticated, isLoading, isReady, router]);

    // Show loading state while checking authentication
    if (!isReady || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render children if not authenticated (and no token in storage)
    if (!isAuthenticated) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (!token) return null;
    }

    return <>{children}</>;
}
