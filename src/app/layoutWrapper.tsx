// src/app/LayoutWrapper.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks/redux";
import { setCredentials, logout } from "@/lib/features/auth/authSlice";
import { fetchCart } from "@/lib/features/carts/cartsSlice";
import { fetchWishlist } from "@/lib/features/wishlist/wishlistSlice";
import { toast } from "sonner";
import TopBanner from "@/components/layout/Banner/TopBanner";
import TopNavbar from "@/components/layout/Navbar/TopNavbar";
import Header from "@/components/homepage/Header";
import Footer from "@/components/layout/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('auth_token');

  // Handle Google Social Login Callback
  useEffect(() => {
    const token = searchParams.get('token');
    const userJson = searchParams.get('user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        dispatch(setCredentials({ user, token }));

        // Save to localStorage (apiClient should also handle this but slice needs it)
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', userJson);

        toast.success("Successfully logged in with Google!");

        // Clean URL
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.delete('token');
        nextUrl.searchParams.delete('user');
        window.history.replaceState({}, '', nextUrl.pathname);
      } catch (error) {
        console.error("Error parsing social login data:", error);
      }
    }
  }, [searchParams, dispatch]);

  // Handle Unauthorized Session
  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(logout());
      // Don't toast if we're already on login/register/cart
      if (!pathname.includes('login') && !pathname.includes('register')) {
        toast.error("Session expired. Please log in again.");
      }
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, [dispatch, pathname]);

  // Fetch cart on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  // Hide these on checkout page
  const hideLayoutRoutes = ["/cart/checkout", "/wholesale-registration"];
  const shouldHideLayout = hideLayoutRoutes.includes(pathname);

  return (
    <>
      {!shouldHideLayout && <TopBanner />}
      {!shouldHideLayout && <TopNavbar />}
      {/* {!shouldHideLayout && <Header />} */}
      {children}
      {/* {!shouldHideLayout && <Footer />} */}
    </>
  );
}
