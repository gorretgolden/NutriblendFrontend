import { setCredentials } from '@/lib/features/auth/authSlice';
import type { AppDispatch } from '../store';

export const loadAuthFromStorage = (dispatch: AppDispatch) => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
        try {
            const user = JSON.parse(userStr);
            dispatch(setCredentials({ user, token }));
        } catch (error) {
            console.error('Failed to load auth from storage', error);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    }
};
