"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { registerUser } from "@/lib/features/auth/authSlice";
import { apiClient, Region, Town } from "@/lib/api/client";
import { toast } from "sonner";

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        newsletter: true,
        terms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.terms) {
            toast.error("Please agree to the Terms and Conditions");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const apiData = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            password_confirmation: formData.confirmPassword,
        };

        const resultAction = await dispatch(registerUser(apiData));
        if (registerUser.fulfilled.match(resultAction)) {
            toast.success("Account created successfully!");
            router.push("/");
        } else if (registerUser.rejected.match(resultAction)) {
            toast.error((resultAction.payload as string) || "Registration failed");
        }
    };

    const handleGoogleSignup = () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, "");
        window.location.href = `${baseUrl}/auth/google/redirect`;
    };

    return (
        <div className="min-h-screen bg-[#f2f4f3] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-lg">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#009E3C]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-[#009E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
                        <p className="mt-2 text-sm text-gray-500">Join NutriBlend Haven today</p>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="John"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-[#009E3C] focus:ring-2 focus:ring-[#009E3C]/15 transition-all"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Doe"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-[#009E3C] focus:ring-2 focus:ring-[#009E3C]/15 transition-all"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-[#009E3C] focus:ring-2 focus:ring-[#009E3C]/15 transition-all"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="+256 7XX XXX XXX"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-[#009E3C] focus:ring-2 focus:ring-[#009E3C]/15 transition-all"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Min 8 characters"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-[#009E3C] focus:ring-2 focus:ring-[#009E3C]/15 transition-all pr-10"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    minLength={8}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-9 text-gray-400 hover:text-[#009E3C]"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Repeat password"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-[#009E3C] focus:ring-2 focus:ring-[#009E3C]/15 transition-all pr-10"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-9 text-gray-400 hover:text-[#009E3C]"
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <p className="text-xs text-red-500 -mt-2">Passwords do not match</p>
                        )}

                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="newsletter"
                                    checked={formData.newsletter}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 rounded border-gray-300 accent-[#009E3C]"
                                />
                                <span className="text-sm text-gray-600">Send me special offers & health tips</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="terms"
                                    checked={formData.terms}
                                    onChange={handleInputChange}
                                    required
                                    className="h-4 w-4 rounded border-gray-300 accent-[#009E3C]"
                                />
                                <span className="text-sm text-gray-600">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-[#009E3C] hover:underline">Terms</Link> &{" "}
                                    <Link href="/privacy" className="text-[#009E3C] hover:underline">Privacy Policy</Link>
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-[#009E3C] px-4 py-3 text-base font-bold text-white transition-all duration-200 hover:bg-[#00752C] shadow-[0_4px_14px_rgba(0,158,60,0.30)] hover:shadow-[0_6px_20px_rgba(0,158,60,0.40)] disabled:opacity-50"
                        >
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6 flex items-center">
                        <hr className="flex-1 border-gray-200" />
                        <span className="px-3 text-xs text-gray-400 uppercase">Or</span>
                        <hr className="flex-1 border-gray-200" />
                    </div>

                    {/* Google Signup */}
                    <button
                        onClick={handleGoogleSignup}
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
                    <div className="mt-6 space-y-3 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link href="/login" className="text-green-600 font-bold hover:underline">Sign In</Link>
                        </p>
                        <div className="bg-[#009E3C]/6 p-4 rounded-2xl border border-[#009E3C]/15">
                            <p className="text-xs text-[#007a2e] font-semibold mb-1 uppercase tracking-wider">Business Account</p>
                            <Link
                                href="/auth/register-wholesale"
                                className="text-sm text-[#009E3C] font-bold hover:text-[#007a2e] transition-colors"
                            >
                                Apply for Wholesale Access →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
