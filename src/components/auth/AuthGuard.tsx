'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks/redux';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
    const [isHydrated, setIsHydrated] = useState(false);

    // Wait for client-side hydration before checking auth
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        // Only redirect after hydration is complete and auth state is settled
        if (isHydrated && !isLoading && !isAuthenticated) {
            sessionStorage.setItem('returnUrl', window.location.pathname);
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, isHydrated, router]);

    // Show loading state while hydrating or checking authentication
    if (!isHydrated || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render children if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
