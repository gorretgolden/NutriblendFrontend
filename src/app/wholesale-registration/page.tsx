"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { registerWholesaleUser } from "@/lib/features/auth/authSlice";
import { apiClient, Region, Town } from "@/lib/api/client";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { toast } from "sonner";
import { Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

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
    const { isLoading } = useAppSelector((state) => state.auth);

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
        if (!data.town_id) e.town_id = "Please select a district";
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
        }
        const updated = { ...formData, [name]: processed };
        setFormData(updated);
        setTouched((p) => ({ ...p, [name]: true }));
        const errs = validate(updated);
        setErrors((p) => ({ ...p, [name]: errs[name] }));
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
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched(Object.keys(formData).reduce((a, k) => ({ ...a, [k]: true }), {}));
        const errs = validate(formData);
        setErrors(errs);
        if (Object.keys(errs).length > 0) { toast.error("Please fix the errors before submitting"); return; }
        const result = await dispatch(registerWholesaleUser(formData));
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
                        <h1 className="text-2xl font-bold text-gray-800 mb-3">Application Submitted!</h1>
                        <p className="text-gray-600 mb-3">
                            Thank you for applying to the{" "}
                            <span className="font-semibold text-gray-800">NutriBlend Haven Wholesale Program</span>.
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Your application is under review. You will receive a confirmation email shortly.
                            Approval typically takes{" "}
                            <span className="font-semibold text-amber-600">1-3 business days</span>.
                        </p>
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-left mb-6 space-y-2 text-xs text-gray-600">
                            <p className="font-bold text-green-700 uppercase tracking-wider mb-1">What happens next?</p>
                            <p>Check your email for a confirmation of your application.</p>
                            <p>Our team will review your details within 1-3 business days.</p>
                            <p>Once approved, you will get access to wholesale pricing.</p>
                        </div>
                        <Link href="/" className="inline-block w-full rounded-lg bg-[#009E3C] px-4 py-3 text-base font-bold text-white hover:bg-[#00752C] transition-colors">
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            <div className="relative hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col items-center justify-center overflow-hidden">
                <Image src="/images/hero_wellness_vitamins.png" alt="Wholesale" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-br from-[#009E3C]/85 to-[#003a17]/75" />
                <div className="relative z-10 text-white px-10 py-12 max-w-md">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                        <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="rounded-xl" />
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4 leading-tight">Wholesale Partner Program</h1>
                    <p className="text-white/85 mb-8 text-lg">
                        Join NutriBlend Haven as a wholesale partner and unlock exclusive bulk pricing,
                        priority delivery, and a dedicated account manager.
                    </p>
                    <ul className="space-y-3">
                        {[
                            "Exclusive wholesale pricing on all products",
                            "Dedicated account manager support",
                            "Priority order processing & delivery",
                            "Early access to new product launches",
                        ].map((b) => (
                            <li key={b} className="flex items-start gap-3 text-sm text-white/90">
                                <CheckCircle className="w-4 h-4 text-white/80 mt-0.5 flex-shrink-0" />
                                {b}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex-1 flex items-start justify-center bg-white overflow-y-auto py-8 px-4 sm:px-8 lg:py-10">
                <div className="w-full max-w-xl">
                    <div className="lg:hidden text-center mb-6">
                        <Image src="/images/logo.png" alt="NutriBlend Haven" width={48} height={48} className="mx-auto mb-3 rounded-xl" />
                        <h1 className="text-2xl font-bold text-gray-900">Wholesale Program</h1>
                        <p className="text-sm text-gray-500">Partner with NutriBlend Haven</p>
                    </div>
                    <div className="hidden lg:block mb-7">
                        <h2 className="text-3xl font-bold text-gray-900">Apply for Wholesale</h2>
                        <p className="text-gray-500 mt-1">Fill in your business details to get started</p>
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
                            <Field label="District / Town" error={touched.town_id ? errors.town_id : undefined}>
                                <SearchableSelect value={formData.town_id}
                                    onChange={(v) => handleSelectChange("town_id", v)}
                                    options={towns.map((t) => ({ value: String(t.id), label: t.name }))}
                                    placeholder={loadingTowns ? "Loading districts..." : formData.region_id ? "Select District" : "Select Region first"}
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

                        <button type="submit" disabled={isLoading}
                            className="w-full rounded-xl bg-[#009E3C] py-3.5 text-base font-bold text-white transition-all hover:bg-[#00752C] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
                            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {isLoading ? "Submitting..." : "Submit Wholesale Application"}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link href="/login" className="text-green-600 font-semibold hover:underline">Log in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

function cx(hasError?: boolean) {
    return `w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
        hasError
            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
            : "border-gray-200 bg-white focus:border-[#009E3C] focus:ring-4 focus:ring-green-50"
    } disabled:bg-gray-50 disabled:cursor-not-allowed`;
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
