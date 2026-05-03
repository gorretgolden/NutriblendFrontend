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
    const [hasChecked, setHasChecked] = useState(false);

    // Single unified auth check on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (typeof window === 'undefined') {
                setIsReady(true);
                setHasChecked(true);
                return;
            }

            // If Redux already has auth state, use it
            if (isAuthenticated) {
                setIsReady(true);
                setHasChecked(true);
                return;
            }

            // Otherwise check localStorage
            const token = localStorage.getItem('auth_token');
            const userStr = localStorage.getItem('user');

            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr);
                    // Restore from localStorage
                    dispatch(setCredentials({ user, token }));
                    setIsReady(true);
                    setHasChecked(true);
                    return;
                } catch (e) {
                    // Invalid stored data - fall through
                }
            }

            // No valid auth found
            setIsReady(true);
            setHasChecked(true);
        };

        checkAuth();
    }, []); // Run once on mount

    // Handle redirect only after initial check
    useEffect(() => {
        if (!hasChecked) return; // Wait for initial mount check

        // If loading Redux state, wait
        if (isLoading) return;

        // Token exists in localStorage - consider authenticated
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

        // If token exists OR Redux confirms auth, stay on page
        if (token || isAuthenticated) {
            return; // User is authenticated, don't redirect
        }

        // No token and not authenticated - redirect to login
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('returnUrl', window.location.pathname);
            router.push('/login');
        }
    }, [hasChecked, isLoading, isAuthenticated, router]);

    // Show loading state while checking authentication
    if (!isReady || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009E3C] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    // Final check: only show if we have token OR Redux confirms auth
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token && !isAuthenticated) {
        return null; // Prevent flash of unauth content
    }

    return <>{children}</>;
}
