"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { registerWholesaleUser } from "@/lib/features/auth/authSlice";
import { toast } from "sonner";

export default function WholesaleRegisterPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        wholesale_business_name: "",
        wholesale_business_details: "",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Manual dispatch since I haven't added it to authSlice yet, but I will soon
        // For now, let's assume it's there
        const resultAction = await dispatch(registerWholesaleUser(formData) as any);

        if (registerWholesaleUser.fulfilled.match(resultAction)) {
            toast.success("Application submitted successfully!");
            setIsSubmitted(true);
        } else {
            toast.error(typeof resultAction.payload === 'string' ? resultAction.payload : "Registration failed");
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Application Received!</h1>
                        <p className="text-gray-600 mb-8">
                            Thank you for your interest in NutriBlend Haven Wholesale. Your application has been submitted and is currently under review.
                            We will contact you via email once your account is approved.
                        </p>
                        <Link
                            href="/"
                            className="inline-block w-full rounded-lg bg-green-600 px-4 py-3 text-base font-bold text-white transition-all duration-300 hover:bg-green-700 hover:shadow-lg"
                        >
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-xl">
                <div className="bg-white rounded-3xl shadow-2xl border border-green-100 overflow-hidden">
                    <div className="bg-green-600 p-8 text-center text-white">
                        <h1 className="text-3xl font-bold">Wholesale Program</h1>
                        <p className="mt-2 opacity-90">Partner with NutriBlend Haven for premium health products</p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all"
                                        placeholder="+256..."
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Business Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all"
                                    placeholder="your@business.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    minLength={8}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <hr className="border-gray-100" />

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name</label>
                                <input
                                    type="text"
                                    name="wholesale_business_name"
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all"
                                    placeholder="Legal Business Name"
                                    value={formData.wholesale_business_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Business Details & License Info</label>
                                <textarea
                                    name="wholesale_business_details"
                                    required
                                    rows={4}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all resize-none"
                                    placeholder="Describe your business, location, and registration details..."
                                    value={formData.wholesale_business_details}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full rounded-xl bg-green-600 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-green-700 hover:shadow-xl hover:shadow-green-200/50 disabled:opacity-50"
                                >
                                    {isLoading ? "Submitting..." : "Submit Wholesale Application"}
                                </button>
                            </div>

                            <p className="text-center text-sm text-gray-500">
                                Already have an account? <Link href="/login" className="text-green-600 font-bold hover:underline">Log in</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
