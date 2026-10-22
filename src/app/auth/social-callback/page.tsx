"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAppDispatch } from "@/lib/hooks/redux";
import { setCredentials, fetchUserProfile } from "@/lib/features/auth/authSlice";
import { fetchCart } from "@/lib/features/carts/cartsSlice";
import { toast } from "sonner";

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
        const registeredParam = searchParams.get("registered") === "true";

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

        // The values are captured above; drop them from the address bar so the
        // token and user JSON do not stay visible or in browser history.
        const leftover = new URLSearchParams(window.location.search);
        leftover.delete("token");
        leftover.delete("user");
        const cleanQuery = leftover.toString();
        window.history.replaceState(
            null,
            "",
            cleanQuery ? `${window.location.pathname}?${cleanQuery}` : window.location.pathname
        );

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

            if (registeredParam) {
                setStatus("success");
                setMessage("Account created successfully! Redirecting...");
                toast.success("Account created successfully! Welcome to NutriBlend!");
            } else {
                setStatus("success");
                setMessage("Login successful! Redirecting...");
                toast.success("Successfully logged in with Google!");
            }

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

                    {status === "error" && (() => {
                        const lowerMsg = message.toLowerCase();
                        const isPendingWholesale = lowerMsg.includes("pending") || lowerMsg.includes("wholesale");
                        const isVerification = lowerMsg.includes("verify") || lowerMsg.includes("verification");

                        if (isPendingWholesale) {
                            return (
                                <>
                                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-amber-100 animate-pulse">
                                        <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Application Pending</h2>
                                    <p className="text-gray-600 mb-8 leading-relaxed max-w-sm mx-auto">
                                        Your wholesale application is pending approval. You will receive an email once an administrator approves your account.
                                    </p>
                                    <button
                                        onClick={() => window.location.href = "/login"}
                                        className="w-full sm:w-auto px-8 py-3 bg-[#009E3C] hover:bg-[#00752C] text-white font-medium rounded-xl shadow-lg shadow-green-100 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                                    >
                                        Return to Login Page
                                    </button>
                                </>
                            );
                        }

                        if (isVerification) {
                            return (
                                <>
                                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-blue-100">
                                        <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Verification Required</h2>
                                    <p className="text-gray-600 mb-8 leading-relaxed max-w-sm mx-auto">
                                        Please verify your email address. We have sent a verification link to your inbox.
                                    </p>
                                    <button
                                        onClick={() => window.location.href = "/login"}
                                        className="w-full sm:w-auto px-8 py-3 bg-[#009E3C] hover:bg-[#00752C] text-white font-medium rounded-xl shadow-lg shadow-green-100 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                                    >
                                        Return to Login Page
                                    </button>
                                </>
                            );
                        }

                        return (
                            <>
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-red-100">
                                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-3">Login Failed</h2>
                                <p className="text-gray-600 mb-8 leading-relaxed max-w-sm mx-auto">{message}</p>
                                <button
                                    onClick={() => window.location.href = "/login"}
                                    className="w-full sm:w-auto px-8 py-3 bg-[#009E3C] hover:bg-[#00752C] text-white font-medium rounded-xl shadow-lg shadow-green-100 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                                >
                                    Return to Login Page
                                </button>
                            </>
                        );
                    })()}
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
