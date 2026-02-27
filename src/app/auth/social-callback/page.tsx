"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAppDispatch } from "@/lib/hooks/redux";
import { setCredentials, fetchUserProfile } from "@/lib/features/auth/authSlice";
import { fetchCart } from "@/lib/features/carts/cartsSlice";

function SocialCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Processing your login...");
    const hasProcessed = React.useRef(false);

    useEffect(() => {
        // Prevent double-processing
        if (hasProcessed.current) return;

        const token = searchParams.get("token");
        const userParam = searchParams.get("user");
        const errorParam = searchParams.get("error");

        // Handle error redirects from backend
        if (errorParam) {
            hasProcessed.current = true;
            setStatus("error");
            setMessage(decodeURIComponent(errorParam));
            return;
        }

        // If params are not yet available, stay in loading state
        // This handles the Next.js SSR hydration where searchParams may be empty initially
        if (!token || !userParam) {
            // Set a timeout to show error if params never arrive
            const timeout = setTimeout(() => {
                if (!hasProcessed.current) {
                    hasProcessed.current = true;
                    setStatus("error");
                    setMessage("Invalid callback. Missing token or user data.");
                }
            }, 3000);
            return () => clearTimeout(timeout);
        }

        hasProcessed.current = true;

        try {
            // Parse user data
            const user = JSON.parse(decodeURIComponent(userParam));

            // Build user object with fallback for Google users who only have 'name'
            const userData = {
                id: user.id,
                name: user.name,
                first_name: user.name?.split(" ")[0] || "",
                last_name: user.name?.split(" ").slice(1).join(" ") || "",
                email: user.email,
                contact: user.contact || user.phone,
                phone: user.contact || user.phone,
                profile_photo: user.avatar || user.profile_photo,
                status: user.status,
            };

            // Store auth data in localStorage
            localStorage.setItem("auth_token", token);
            localStorage.setItem("user", JSON.stringify(userData));

            // Dispatch to Redux store — this is critical!
            // Without this, the navbar and app state won't reflect the login.
            dispatch(setCredentials({ user: userData as any, token }));

            // Fetch full user profile from API (gets the complete data)
            dispatch(fetchUserProfile());

            // Also fetch the user's cart so it appears in navbar
            dispatch(fetchCart());

            setStatus("success");
            setMessage("Login successful! Redirecting...");

            // Redirect to homepage after short delay
            setTimeout(() => {
                router.push("/");
            }, 1500);
        } catch (err) {
            console.error("Social callback error:", err);
            setStatus("error");
            setMessage("Something went wrong during login. Please try again.");
        }
    }, [searchParams, router, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full mx-auto p-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    {status === "loading" && (
                        <>
                            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-6"></div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Signing you in...</h2>
                            <p className="text-gray-500">{message}</p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome!</h2>
                            <p className="text-gray-500">{message}</p>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Login Failed</h2>
                            <p className="text-gray-500 mb-4">{message}</p>
                            <button
                                onClick={() => router.push("/")}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SocialCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                </div>
            }
        >
            <SocialCallbackContent />
        </Suspense>
    );
}
