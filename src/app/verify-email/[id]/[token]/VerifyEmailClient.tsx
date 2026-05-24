"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { useAppDispatch } from "@/lib/hooks/redux";
import { setCredentials, fetchUserProfile } from "@/lib/features/auth/authSlice";
import { fetchCart } from "@/lib/features/carts/cartsSlice";
import { toast } from "sonner";

interface VerifyEmailClientProps {
    id: string;
    token: string;
}

export default function VerifyEmailClient({ id, token }: VerifyEmailClientProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [status, setStatus] = useState<"loading" | "success" | "pending_approval" | "error">("loading");
    const [message, setMessage] = useState("We are verifying your email address with our servers...");
    const hasProcessed = useRef(false);

    useEffect(() => {
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        async function verify() {
            try {
                const response = await apiClient.verifyEmail(id, token);

                if (response.status && response.data) {
                    const { user: rawUser, token: authToken } = response.data;
                    const user = rawUser as any;

                    // If wholesale user and not approved yet
                    if (user.customer_type === "wholesale" && !user.is_wholesale_approved) {
                        setStatus("pending_approval");
                        setMessage("Email verified successfully! Your wholesale application is currently pending administrator review.");
                        toast.success("Email verified! Your business application is pending review.");
                        return;
                    }

                    // Otherwise, auto-login for retail/standard users
                    const userData = {
                        id: user.id,
                        name: user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim(),
                        first_name: user.first_name || user.name?.split(" ")[0] || "",
                        last_name: user.last_name || user.name?.split(" ").slice(1).join(" ") || "",
                        email: user.email,
                        contact: user.contact || user.phone,
                        phone: user.contact || user.phone,
                        profile_photo: user.profile_photo,
                        status: user.status,
                        customer_type: user.customer_type,
                    };

                    // Store details in localStorage
                    localStorage.setItem("auth_token", authToken);
                    localStorage.setItem("user", JSON.stringify(userData));

                    // Sync auth state
                    dispatch(setCredentials({ user: userData as any, token: authToken }));
                    dispatch(fetchUserProfile());
                    dispatch(fetchCart());

                    setStatus("success");
                    setMessage("Email verified successfully! Logging you in...");
                    toast.success("Welcome! Your email has been verified.");

                    // Redirect to homepage or dashboard after 2 seconds
                    setTimeout(() => {
                        router.push("/");
                    }, 2000);
                } else {
                    setStatus("error");
                    setMessage(response.message || "Invalid or expired verification link.");
                    toast.error(response.message || "Email verification failed.");
                }
            } catch (error: any) {
                console.error("Verification error:", error);
                setStatus("error");
                setMessage("A connection issue occurred. Please check your internet and try again.");
                toast.error("An error occurred during verification.");
            }
        }

        verify();
    }, [id, token, router, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-emerald-50 via-teal-50 to-emerald-100 p-4">
            <div className="max-w-md w-full mx-auto">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50 text-center relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

                    {status === "loading" && (
                        <>
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-pulse"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin"></div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Your Email</h2>
                            <p className="text-gray-500 font-medium max-w-sm mx-auto">{message}</p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200 animate-bounce">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Complete!</h2>
                            <p className="text-emerald-600 font-semibold mb-4">{message}</p>
                            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                <span>Redirecting you to the home page...</span>
                            </div>
                        </>
                    )}

                    {status === "pending_approval" && (
                        <>
                            <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-200 animate-pulse">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Verified!</h2>
                            <p className="text-gray-600 font-medium mb-6">{message}</p>
                            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-left mb-6 text-amber-800 text-sm leading-relaxed">
                                <strong>What happens next?</strong>
                                <ul className="list-disc ml-5 mt-2 space-y-1">
                                    <li>Our compliance team will review your business information.</li>
                                    <li>You will receive an email as soon as your wholesale application is approved or rejected.</li>
                                    <li>Once approved, you will gain full access to wholesale catalog prices.</li>
                                </ul>
                            </div>
                            <button
                                onClick={() => router.push("/login")}
                                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-emerald-100 transition-all duration-300 transform active:scale-95"
                            >
                                Back to Login
                            </button>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="w-20 h-20 bg-gradient-to-tr from-rose-500 to-red-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-200 animate-wiggle">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
                            <p className="text-rose-600 font-medium mb-6">{message}</p>
                            <button
                                onClick={() => router.push("/login")}
                                className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-rose-100 transition-all duration-300 transform active:scale-95 mb-3"
                            >
                                Go to Login
                            </button>
                            <button
                                onClick={() => router.push("/contact")}
                                className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-300 transform active:scale-95"
                            >
                                Contact Support
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
