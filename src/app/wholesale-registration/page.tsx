"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { registerWholesaleUser } from "@/lib/features/auth/authSlice";
import { apiClient, Region, Town } from "@/lib/api/client";
import { toast } from "sonner";

export default function WholesaleRegisterPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        region_id: "",
        town_id: "",
        location: "",
        password: "",
        wholesale_business_name: "",
        wholesale_business_details: "",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [regions, setRegions] = useState<Region[]>([]);
    const [towns, setTowns] = useState<Town[]>([]);
    const [loadingRegions, setLoadingRegions] = useState(false);
    const [loadingTowns, setLoadingTowns] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Fetch regions on mount
    useEffect(() => {
        async function fetchRegions() {
            try {
                setLoadingRegions(true);
                const response = await apiClient.getRegions();
                if (response.status && response.data) {
                    setRegions(response.data);
                }
            } catch (err) {
                console.error("Error fetching regions:", err);
            } finally {
                setLoadingRegions(false);
            }
        }
        fetchRegions();
    }, []);

    // Fetch towns when region changes
    useEffect(() => {
        if (!formData.region_id) {
            setTowns([]);
            return;
        }
        async function fetchTowns() {
            try {
                setLoadingTowns(true);
                const response = await apiClient.getTowns(Number(formData.region_id));
                if (response.status && response.data) {
                    setTowns(response.data);
                }
            } catch (err) {
                console.error("Error fetching towns:", err);
            } finally {
                setLoadingTowns(false);
            }
        }
        fetchTowns();
    }, [formData.region_id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "region_id") {
            setFormData(prev => ({ ...prev, region_id: value, town_id: "" }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
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
                            className="inline-block w-full rounded-lg bg-[#009E3C] px-4 py-3 text-base font-bold text-white transition-all duration-300 hover:bg-[#00752C] hover:shadow-lg"
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
                    <div className="bg-[#009E3C] p-8 text-center text-white">
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
                                        minLength={3}
                                        disabled={isLoading}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009E3C] focus:ring-4 focus:ring-green-50 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Phone</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <span className="text-gray-500 font-medium">+256</span>
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            minLength={9}
                                            disabled={isLoading}
                                            className="w-full rounded-xl border border-gray-200 pl-14 pr-4 py-3 outline-none focus:border-[#009E3C] focus:ring-4 focus:ring-green-50 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="7XX XXX XXX"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Business Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    disabled={isLoading}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009E3C] focus:ring-4 focus:ring-green-50 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    placeholder="your@business.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        disabled={isLoading}
                                        minLength={8}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 outline-none focus:border-[#009E3C] focus:ring-4 focus:ring-green-50 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#009E3C]"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Region</label>
                                    <select
                                        name="region_id"
                                        value={formData.region_id}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009E3C] focus:ring-4 focus:ring-green-50 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        required
                                        disabled={isLoading || loadingRegions}
                                    >
                                        <option value="">
                                            {loadingRegions ? "Loading regions..." : "Select Region"}
                                        </option>
                                        {regions.map((region) => (
                                            <option key={region.id} value={region.id}>
                                                {region.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">District</label>
                                    <select
                                        name="town_id"
                                        value={formData.town_id}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009E3C] focus:ring-4 focus:ring-green-50 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        required
                                        disabled={!formData.region_id || isLoading || loadingTowns}
                                    >
                                        <option value="">
                                            {loadingTowns
                                                ? "Loading districts..."
                                                : formData.region_id
                                                    ? "Select District"
                                                    : "Select Region first"}
                                        </option>
                                        {towns.map((town) => (
                                            <option key={town.id} value={town.id}>
                                                {town.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Specific Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="e.g. Kampala Road, Plot 12"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009E3C] focus:ring-4 focus:ring-green-50 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <hr className="border-gray-100" />

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name</label>
                                <input
                                    type="text"
                                    name="wholesale_business_name"
                                    required
                                    minLength={3}
                                    disabled={isLoading}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009E3C] focus:ring-4 focus:ring-green-50 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                                    minLength={20}
                                    disabled={isLoading}
                                    rows={4}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#009E3C] focus:ring-4 focus:ring-green-50 transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    placeholder="Describe your business, location, and registration details (min. 20 characters)..."
                                    value={formData.wholesale_business_details}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full rounded-xl bg-[#009E3C] py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-[#00752C] hover:shadow-xl hover:shadow-[#009E3C]/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
