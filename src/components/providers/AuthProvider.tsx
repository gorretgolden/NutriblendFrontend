'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks/redux';
import { loadAuthFromStorage } from '@/lib/store/persistAuth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Load auth from localStorage on mount
        loadAuthFromStorage(dispatch);
    }, [dispatch]);

    return <>{children}</>;
}
