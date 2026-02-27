"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { loginUser } from "@/lib/features/auth/authSlice";
import { toast } from "sonner";

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // If already authenticated, redirect to returnUrl or home
    useEffect(() => {
        if (isAuthenticated) {
            const returnUrl = sessionStorage.getItem("returnUrl");
            if (returnUrl) {
                sessionStorage.removeItem("returnUrl");
                router.push(returnUrl);
            } else {
                router.push("/");
            }
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const resultAction = await dispatch(loginUser({ email, password }));
        if (loginUser.fulfilled.match(resultAction)) {
            toast.success("Signed in successfully!");
            const returnUrl = sessionStorage.getItem("returnUrl");
            if (returnUrl) {
                sessionStorage.removeItem("returnUrl");
                router.push(returnUrl);
            } else {
                router.push("/");
            }
        }
    };

    const handleGoogleLogin = () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, '');
        window.location.href = `${baseUrl}/auth/google/redirect`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Sign in to continue to checkout
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-green-600 px-4 py-3 text-base font-bold text-white transition-all duration-300 hover:bg-green-700 hover:shadow-lg disabled:opacity-50"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6 flex items-center">
                        <hr className="flex-1 border-gray-200" />
                        <span className="px-3 text-xs text-gray-400 uppercase">Or</span>
                        <hr className="flex-1 border-gray-200" />
                    </div>

                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        className="mt-4 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-base font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-md"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Links */}
                    <div className="mt-8 space-y-4 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account? <Link href="/auth/register" className="text-green-600 font-bold hover:underline">Sign Up</Link>
                        </p>
                        <hr className="border-gray-100" />
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <p className="text-xs text-green-700 font-semibold mb-2 uppercase tracking-wider">Are you a Business?</p>
                            <Link
                                href="/auth/register-wholesale"
                                className="inline-block text-sm text-green-700 font-bold hover:text-green-800 transition-colors"
                            >
                                Apply for a Wholesale Account →
                            </Link>
                        </div>
                    </div>

                    {/* Back to cart */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => router.back()}
                            className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
                        >
                            ← Go back
                        </button>
                    </div>

                    {/* Terms */}
                    <p className="mt-6 text-center text-xs text-gray-400">
                        By signing in, you agree to our Terms and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}
