"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { registerWholesaleUser, clearError } from "@/lib/features/auth/authSlice";
import { apiClient, Region, Town } from "@/lib/api/client";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { toast } from "sonner";
import { Eye, EyeOff, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";

const BLOCKED_DOMAINS = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com", "aol.com",
    "icloud.com", "me.com", "mac.com", "protonmail.com", "protonmail.ch",
    "ymail.com", "mail.com", "inbox.com", "zoho.com", "gmx.com", "gmx.net",
    "temp-mail.org", "mailinator.com", "guerrillamail.com", "throwaway.email",
    "trashmail.com", "dispostable.com", "yopmail.com", "fakeinbox.com",
    "maildrop.cc", "20minutemail.com", "tempmail.com", "discard.email",
    "yahoo.co.uk", "yahoo.co.in", "yahoo.com.au",
];

function isBlockedDomain(email: string): boolean {
    const parts = email.toLowerCase().split("@");
    return parts.length === 2 && BLOCKED_DOMAINS.includes(parts[1]);
}

function validateEmail(email: string): string | null {
    if (!email) return "Business email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    if (isBlockedDomain(email))
        return "Please use a business email address (gmail, yahoo, hotmail etc. are not accepted)";
    return null;
}

function validatePhone(phone: string): string | null {
    const digits = phone.replace(/\D/g, "");
    if (!digits) return "Contact phone is required";
    if (digits.length < 9) return "Enter 9 digits after +256";
    if (digits.length > 9) return "Phone must be exactly 9 digits after +256";
    return null;
}

type FormErrors = Partial<Record<string, string>>;

export default function WholesaleRegisterPage() {
    const dispatch = useAppDispatch();
    const { isLoading, error: authError } = useAppSelector((state) => state.auth);

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

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [regions, setRegions] = useState<Region[]>([]);
    const [towns, setTowns] = useState<Town[]>([]);
    const [loadingRegions, setLoadingRegions] = useState(false);
    const [loadingTowns, setLoadingTowns] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoadingRegions(true);
                const res = await apiClient.getRegions();
                if (res.status && res.data) setRegions(res.data);
            } finally {
                setLoadingRegions(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (!formData.region_id) { setTowns([]); return; }
        (async () => {
            try {
                setLoadingTowns(true);
                const res = await apiClient.getTowns(Number(formData.region_id));
                if (res.status && res.data) setTowns(res.data);
            } finally {
                setLoadingTowns(false);
            }
        })();
    }, [formData.region_id]);

    const validate = useCallback((data: typeof formData): FormErrors => {
        const e: FormErrors = {};
        if (!data.name.trim() || data.name.trim().length < 3) e.name = "Full name must be at least 3 characters";
        const emailErr = validateEmail(data.email);
        if (emailErr) e.email = emailErr;
        const phoneErr = validatePhone(data.phone);
        if (phoneErr) e.phone = phoneErr;
        if (!data.password || data.password.length < 8) e.password = "Password must be at least 8 characters";
        if (!data.region_id) e.region_id = "Please select a region";
        if (!data.town_id) e.town_id = "Please select a town";
        if (!data.location.trim()) e.location = "Specific location is required";
        if (!data.wholesale_business_name.trim() || data.wholesale_business_name.trim().length < 3)
            e.wholesale_business_name = "Business name must be at least 3 characters";
        if (!data.wholesale_business_details.trim() || data.wholesale_business_details.trim().length < 20)
            e.wholesale_business_details = "Please provide at least 20 characters of business details";
        return e;
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let processed = value;
        if (name === "phone") {
            const digits = value.replace(/\D/g, "");
            processed = digits.startsWith("0") ? digits.slice(1, 10) : digits.slice(0, 9);
        } else if (name === "name" || name === "location") {
            // Auto-capitalize names and locations
            processed = value.replace(/\b\w+/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        } else if (name === "email") {
            // Auto-lowercase email
            processed = value.toLowerCase();
        }
        const updated = { ...formData, [name]: processed };
        setFormData(updated);
        setTouched((p) => ({ ...p, [name]: true }));
        const errs = validate(updated);
        setErrors((p) => ({ ...p, [name]: errs[name] }));
        if (authError) dispatch(clearError());
    };

    const handleBlur = (name: string) => {
        setTouched((p) => ({ ...p, [name]: true }));
        setErrors((p) => ({ ...p, [name]: validate(formData)[name] }));
    };

    const handleSelectChange = (name: "region_id" | "town_id", value: string) => {
        const updated = name === "region_id"
            ? { ...formData, region_id: value, town_id: "" }
            : { ...formData, [name]: value };
        setFormData(updated);
        setTouched((p) => ({ ...p, [name]: true }));
        setErrors((p) => ({ ...p, [name]: validate(updated)[name] }));
        if (authError) dispatch(clearError());
    };

    const isFormValid = () => {
        const errs = validate(formData);
        return Object.keys(errs).length === 0 && Object.values(formData).every((v) => typeof v === "string" ? v.trim() !== "" : true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched(Object.keys(formData).reduce((a, k) => ({ ...a, [k]: true }), {}));
        const errs = validate(formData);
        setErrors(errs);
        if (Object.keys(errs).length > 0) { toast.error("Please fix the errors before submitting"); return; }
        const payload = { ...formData, phone: `+256${formData.phone}` };
        const result = await dispatch(registerWholesaleUser(payload));
        if (registerWholesaleUser.fulfilled.match(result)) {
            toast.success("Application submitted successfully!");
            setIsSubmitted(true);
        } else {
            toast.error(typeof result.payload === "string" ? result.payload : "Registration failed. Please try again.");
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Pending Approval
                        </span>
                        <h1 className="text-2xl font-bold text-gray-800 mb-3">Application Received!</h1>
                        <p className="text-gray-600 mb-3">
                            Thank you for applying for the{" "}
                            <span className="font-semibold text-gray-800">Wholesale Partner Program</span>.
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Your application has been submitted successfully and is currently{" "}
                            <span className="font-semibold text-amber-600">Pending Approval</span>. 
                            Our team will review your business details and notify you via email.
                        </p>
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 text-left mb-6 space-y-3">
                            <p className="font-bold text-amber-800 uppercase tracking-wider text-[11px]">What happens next?</p>
                            <div className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-[10px] font-bold text-amber-700 flex-shrink-0">1</div>
                                <p className="text-xs text-amber-900/80 leading-relaxed">Our team reviews your business registration and location details (usually 1-3 business days).</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-[10px] font-bold text-amber-700 flex-shrink-0">2</div>
                                <p className="text-xs text-amber-900/80 leading-relaxed">Once verified, your account will be activated and you'll receive a confirmation email.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-[10px] font-bold text-amber-700 flex-shrink-0">3</div>
                                <p className="text-xs text-amber-900/80 leading-relaxed">You'll then be able to log in and access exclusive wholesale pricing and bulk ordering.</p>
                            </div>
                        </div>
                        <Link href="/" className="inline-block w-full rounded-lg bg-[#009E3C] px-4 py-3 text-base font-bold text-white hover:bg-[#00752C] transition-colors shadow-md">
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8fcf9]">
            <div className="relative hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col items-center justify-center overflow-hidden">
                <Image src="/images/header-homepage.png" alt="Wholesale" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-br from-[#009E3C]/90 via-[#00752C]/85 to-[#003a17]/90 backdrop-blur-[2px]" />
                
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)' }}></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

                <div className="relative z-10 text-white px-12 py-16 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#00ff62] animate-pulse" />
                        <span className="text-xs font-bold tracking-widest uppercase">Partner Program</span>
                    </div>
                    <h1 className="text-5xl font-black mb-6 leading-[1.1] tracking-tight !text-white">Grow Your Business With Us</h1>
                    <p className="text-white/90 mb-10 text-lg leading-relaxed font-medium">
                        Join NutriBlend Haven as a wholesale partner and unlock exclusive bulk pricing,
                        priority delivery, and a dedicated account manager.
                    </p>
                    <div className="space-y-4 bg-black/20 backdrop-blur-md p-8 rounded-3xl border border-white/10">
                        {[
                            "Exclusive wholesale pricing on all products",
                            "Dedicated account manager support",
                            "Priority order processing & delivery",
                            "Early access to new product launches",
                        ].map((b) => (
                            <div key={b} className="flex items-center gap-4 text-sm text-white font-medium">
                                <div className="w-8 h-8 rounded-full bg-[#009E3C] flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/20">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                                {b}
                            </div>
                        ))}
                    </div>

                    {/* Trust Signals Guarantees */}
                    <div className="space-y-4 bg-black/20 backdrop-blur-md p-6 rounded-3xl border border-white/10 mt-6">
                        <p className="text-[11px] font-black tracking-wider text-[#00ff62] uppercase tracking-widest mb-1 text-left">Our Guarantees</p>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "100% Authentic", desc: "Genuine guaranteed" },
                                { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", title: "Secure Payments", desc: "256-bit encryption" },
                                { icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0", title: "Fast Delivery", desc: "Nationwide shipping" },
                                { icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", title: "24/7 Support", desc: "Expert advice" }
                            ].map((t) => (
                                <div key={t.title} className="flex flex-col gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 text-left">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-[#00ff62]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-[11px] leading-tight">{t.title}</p>
                                        <p className="text-white/60 text-[9px] block mt-0.5 leading-tight">{t.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-start justify-center overflow-y-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <div className="w-full max-w-2xl">
                    <div className="mb-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-gray-500 hover:bg-white hover:text-[#009E3C] hover:shadow-sm transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100 p-6 sm:p-10">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">Apply for Wholesale</h2>
                            <p className="text-gray-500 font-medium">Fill in your business details to partner with us</p>
                        </div>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Full Name" error={touched.name ? errors.name : undefined}>
                                <input type="text" name="name" disabled={isLoading}
                                    className={cx(touched.name && !!errors.name)}
                                    placeholder="Enter your full name" value={formData.name}
                                    onChange={handleChange} onBlur={() => handleBlur("name")} autoComplete="name" />
                            </Field>
                            <Field label="Contact Phone" error={touched.phone ? errors.phone : undefined}>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-sm text-gray-500 font-medium pointer-events-none">
                                        +256
                                    </span>
                                    <input type="tel" name="phone" disabled={isLoading}
                                        className={`${cx(touched.phone && !!errors.phone)} pl-16`}
                                        placeholder="7XX XXX XXX" value={formData.phone} maxLength={9}
                                        onChange={handleChange} onBlur={() => handleBlur("phone")} />
                                </div>
                            </Field>
                        </div>

                        <Field label="Business Email" error={touched.email ? errors.email : undefined}
                            hint="Personal emails (gmail, yahoo, etc.) are not accepted">
                            <input type="email" name="email" disabled={isLoading}
                                className={cx(touched.email && !!errors.email)}
                                placeholder="you@yourbusiness.com" value={formData.email}
                                onChange={handleChange} onBlur={() => handleBlur("email")} autoComplete="email" />
                        </Field>

                        <Field label="Password" error={touched.password ? errors.password : undefined}>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} name="password" disabled={isLoading}
                                    className={`${cx(touched.password && !!errors.password)} pr-12`}
                                    placeholder="Min. 8 characters" value={formData.password}
                                    onChange={handleChange} onBlur={() => handleBlur("password")} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Region" error={touched.region_id ? errors.region_id : undefined}>
                                <SearchableSelect value={formData.region_id}
                                    onChange={(v) => handleSelectChange("region_id", v)}
                                    options={regions.map((r) => ({ value: String(r.id), label: r.name }))}
                                    placeholder={loadingRegions ? "Loading..." : "Select Region"}
                                    disabled={isLoading || loadingRegions} isLoading={loadingRegions}
                                    className={`${cx(touched.region_id && !!errors.region_id)} text-left`} />
                            </Field>
                            <Field label="Town" error={touched.town_id ? errors.town_id : undefined}>
                                <SearchableSelect value={formData.town_id}
                                    onChange={(v) => handleSelectChange("town_id", v)}
                                    options={towns.map((t) => ({ value: String(t.id), label: t.name }))}
                                    placeholder={loadingTowns ? "Loading Towns..." : formData.region_id ? "Select Town" : "Select Region first"}
                                    disabled={!formData.region_id || isLoading} isLoading={loadingTowns}
                                    className={`${cx(touched.town_id && !!errors.town_id)} text-left`} />
                            </Field>
                        </div>

                        <Field label="Specific Location" error={touched.location ? errors.location : undefined}>
                            <input type="text" name="location" disabled={isLoading}
                                className={cx(touched.location && !!errors.location)}
                                placeholder="e.g. Kampala Road, Plot 12" value={formData.location}
                                onChange={handleChange} onBlur={() => handleBlur("location")} />
                        </Field>

                        <hr className="border-gray-100" />

                        <Field label="Business Name" error={touched.wholesale_business_name ? errors.wholesale_business_name : undefined}>
                            <input type="text" name="wholesale_business_name" disabled={isLoading}
                                className={cx(touched.wholesale_business_name && !!errors.wholesale_business_name)}
                                placeholder="Legal Business Name" value={formData.wholesale_business_name}
                                onChange={handleChange} onBlur={() => handleBlur("wholesale_business_name")} />
                        </Field>

                        <Field label="Business Details & Licence Info"
                            error={touched.wholesale_business_details ? errors.wholesale_business_details : undefined}
                            hint={`${formData.wholesale_business_details.length} / 20 min characters`}>
                            <textarea name="wholesale_business_details" disabled={isLoading} rows={4}
                                className={`${cx(touched.wholesale_business_details && !!errors.wholesale_business_details)} resize-none`}
                                placeholder="Describe your business, location, and registration details (min. 20 characters)..."
                                value={formData.wholesale_business_details}
                                onChange={handleChange} onBlur={() => handleBlur("wholesale_business_details")} />
                        </Field>

                        <button type="submit" disabled={isLoading || !isFormValid()}
                            className="w-full rounded-2xl bg-gradient-to-r from-[#009E3C] to-[#00752C] py-4 text-base font-black tracking-wide text-white transition-all hover:from-[#00bc49] hover:to-[#009E3C] hover:shadow-lg hover:shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8 active:scale-[0.98]">
                            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {isLoading ? "Submitting Application..." : "Submit Wholesale Application"}
                        </button>

                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-sm font-medium text-gray-500">
                                Already a wholesale partner?{" "}
                                <Link href="/login" className="text-[#009E3C] font-bold hover:underline">Log in here</Link>
                            </p>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function cx(hasError?: boolean) {
    return `w-full rounded-xl border px-5 py-3.5 text-[15px] font-medium outline-none transition-all shadow-sm ${
        hasError
            ? "border-red-300 bg-red-50/50 text-red-900 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
            : "border-gray-200 bg-gray-50/50 text-gray-900 focus:bg-white focus:border-[#009E3C] focus:ring-4 focus:ring-[#009E3C]/10 hover:border-gray-300"
    } disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`;
}

function Field({ label, error, hint, children }: {
    label: string; error?: string; hint?: React.ReactNode; children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            {children}
            {error ? (
                <span className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" /> {error}
                </span>
            ) : hint ? (
                <span className="text-xs text-gray-400">{hint}</span>
            ) : null}
        </div>
    );
}
