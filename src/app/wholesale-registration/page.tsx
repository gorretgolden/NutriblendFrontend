"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { registerWholesaleUser, clearError } from "@/lib/features/auth/authSlice";
import { apiClient, Region, Town } from "@/lib/api/client";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { toast } from "sonner";
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Building, ClipboardCheck, MailCheck } from "lucide-react";

function validateEmail(email: string): string | null {
    if (!email) return "Business email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
}

function validatePhone(phone: string): string | null {
    const digits = phone.replace(/\D/g, "");
    if (!digits) return "Contact phone is required";
    if (digits.length < 9) return "Enter 9 digits after +256";
    if (digits.length > 9) return "Phone must be exactly 9 digits after +256";
    return null;
}

function validatePasswordStrength(password: string): string | null {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character (e.g. @, $, !)";
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

    // Caching Regions to resolve "Loading..." slowness instantly
    useEffect(() => {
        (async () => {
            try {
                setLoadingRegions(true);
                const cached = localStorage.getItem("cached_regions");
                if (cached) {
                    const parsed = JSON.parse(cached);
                    setRegions(parsed);
                    setLoadingRegions(false);
                    
                    // Fetch in background silently to update cache
                    apiClient.getRegions().then((res) => {
                        if (res.status && res.data) {
                            setRegions(res.data);
                            localStorage.setItem("cached_regions", JSON.stringify(res.data));
                        }
                    }).catch(() => {});
                    return;
                }

                const res = await apiClient.getRegions();
                if (res.status && res.data) {
                    setRegions(res.data);
                    localStorage.setItem("cached_regions", JSON.stringify(res.data));
                }
            } catch (err) {
                console.error("Failed to load regions", err);
            } finally {
                setLoadingRegions(false);
            }
        })();
    }, []);

    // Caching Towns to prevent loading hangs
    useEffect(() => {
        if (!formData.region_id) { setTowns([]); return; }
        (async () => {
            try {
                setLoadingTowns(true);
                const cacheKey = `cached_towns_${formData.region_id}`;
                const cached = localStorage.getItem(cacheKey);
                if (cached) {
                    const parsed = JSON.parse(cached);
                    setTowns(parsed);
                    setLoadingTowns(false);

                    // Background sync
                    apiClient.getTowns(Number(formData.region_id)).then((res) => {
                        if (res.status && res.data) {
                            setTowns(res.data);
                            localStorage.setItem(cacheKey, JSON.stringify(res.data));
                        }
                    }).catch(() => {});
                    return;
                }

                const res = await apiClient.getTowns(Number(formData.region_id));
                if (res.status && res.data) {
                    setTowns(res.data);
                    localStorage.setItem(cacheKey, JSON.stringify(res.data));
                }
            } catch (err) {
                console.error("Failed to load towns", err);
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
        const passwordErr = validatePasswordStrength(data.password);
        if (passwordErr) e.password = passwordErr;
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
            processed = value.replace(/\b\w+/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        } else if (name === "email") {
            processed = value.toLowerCase();
        }
        const updated = { ...formData, [name]: processed };
        setFormData(updated);
        setTouched((p) => ({ ...p, [name]: true }));
        const errs = validate(updated);
        setErrors((p) => ({ ...p, [name]: errs[name] }));
        if (authError) dispatch(clearError());
    };

    const handleBlur = async (name: string) => {
        setTouched((p) => ({ ...p, [name]: true }));
        const localErrs = validate(formData);
        const localErr = localErrs[name];
        setErrors((p) => ({ ...p, [name]: localErr }));

        if (!localErr && (name === "email" || name === "phone")) {
            const val = formData[name as "email" | "phone"];
            if (val) {
                try {
                    // Send phone formatted as E.164 (+256XXXXXXXXX) to match DB contact column
                    const checkVal = name === "phone" ? `+256${val}` : val;
                    const res = await apiClient.checkUniqueness(name as "email" | "phone", checkVal);
                    
                    const checkData = res.data;
                    if (res && res.status === false && res.message) {
                        const cleanMsg = name === "email" && (res.message.includes("registered") || res.message.includes("use") || res.message.includes("unique"))
                            ? "Email in use, please use another email for your application"
                            : res.message;
                        setErrors((p) => ({ ...p, [name]: cleanMsg }));
                    } else if (res && checkData && checkData.unique === false) {
                        const fallbackMsg = name === "email"
                            ? "Email in use, please use another email for your application"
                            : `This ${name} is already registered.`;
                        setErrors((p) => ({ ...p, [name]: checkData.message || fallbackMsg }));
                    }
                } catch (err) {
                    console.error(`Uniqueness validation failed for ${name}`, err);
                }
            }
        }
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

    // Beautified, Concise, and Non-Repetitive Success Screen
    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9] py-12 px-4">
                <div className="w-full max-w-lg">
                    <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-200/80 p-8 md:p-10 text-center relative overflow-hidden">
                        
                        {/* Top Accent line */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#009E3C] to-[#00752C]" />

                        {/* Floating Icon */}
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100 shadow-sm animate-pulse">
                            <CheckCircle2 className="w-10 h-10 text-[#009E3C]" />
                        </div>

                        {/* Heading */}
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Application Received!</h1>
                        <p className="text-gray-500 font-medium max-w-md mx-auto text-sm leading-relaxed mb-8">
                            Thank you for applying. We are reviewing your wholesale business details and will notify you via email once approved.
                        </p>

                        {/* Simplified 2-Step Timeline (Clean & Non-Wordy) */}
                        <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 border border-gray-100 space-y-4">
                            <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest mb-2">Next Steps</h3>
                            
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-xs font-black text-emerald-800 flex-shrink-0">
                                    <ClipboardCheck className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">Compliance Review</p>
                                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">Our compliance team is verifying your registration and store location (1-2 business days).</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-xs font-black text-amber-800 flex-shrink-0">
                                    <MailCheck className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">Account Activation</p>
                                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">You will receive an activation email to log in and unlock standard wholesale pricing.</p>
                                </div>
                            </div>
                        </div>

                        <Link href="/" className="inline-flex items-center justify-center w-full rounded-2xl bg-gradient-to-r from-[#009E3C] to-[#00752C] px-6 py-4 text-base font-black tracking-wide text-white transition-all hover:from-[#00bc49] hover:to-[#009E3C] hover:shadow-lg hover:shadow-green-900/10 active:scale-[0.98]">
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#f4f6f9]">
            {/* Split layout side banner */}
            <div className="relative hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col items-center justify-center overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1200" alt="Wholesale Supplements and Perfumes" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-br from-[#009E3C]/95 via-[#00752C]/90 to-[#003a17]/95" />
                
                {/* Brand lights */}
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

                <motion.div 
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.12,
                                delayChildren: 0.15
                            }
                        }
                    }}
                    className="relative z-10 text-white px-12 py-16 max-w-lg"
                >
                    <motion.div 
                        variants={{
                            hidden: { y: 15, opacity: 0 },
                            show: { y: 0, opacity: 1, transition: { duration: 0.4 } }
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6"
                    >
                        <Building className="w-4 h-4 text-[#00ff62]" />
                        <span className="text-[10px] font-black tracking-widest uppercase text-white">Nutriblend Wholesale Program</span>
                    </motion.div>
                    
                    <motion.h1 
                        variants={{
                            hidden: { y: 20, opacity: 0 },
                            show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
                        }}
                        className="text-4xl lg:text-5xl font-black mb-6 leading-[1.1] tracking-tight !text-white"
                    >
                        Grow Your Business With Us
                    </motion.h1>
                    
                    <motion.p 
                        variants={{
                            hidden: { y: 20, opacity: 0 },
                            show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
                        }}
                        className="text-white/95 mb-8 text-base leading-relaxed font-medium"
                    >
                        Join NutriBlend Haven as a wholesale partner and unlock exclusive bulk pricing,
                        priority delivery, and a dedicated account manager.
                    </motion.p>
                    
                    <motion.div 
                        variants={{
                            hidden: { y: 25, opacity: 0 },
                            show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
                        }}
                        className="space-y-4 bg-black/15 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-left"
                    >
                        {[
                            "Exclusive wholesale pricing on all wellness products",
                            "Dedicated support and order processing",
                            "Fast priority shipping and delivery logistics",
                            "Custom formulas and premium brands catalogue",
                        ].map((benefit) => (
                            <div key={benefit} className="flex items-center gap-3 text-sm text-white/90 font-bold">
                                <div className="w-6 h-6 rounded-lg bg-[#009E3C] flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-4.5 h-4.5 text-white" />
                                </div>
                                {benefit}
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Jumia Inspired Crisp Card Registration Form */}
            <div className="flex-1 flex items-start justify-center overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 bg-[#f4f6f9]">
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

                    {/* Mobile Summary Banner: only visible on mobile/tablet (< lg) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="block lg:hidden mb-6 bg-gradient-to-br from-[#009E3C] to-[#00752C] rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden"
                    >
                        {/* Background supplements/perfumes ambient decor photo with low opacity */}
                        <div 
                            className="absolute inset-0 opacity-15 mix-blend-overlay z-0 bg-cover bg-center pointer-events-none"
                            style={{
                                backgroundImage: `url('https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600')`
                            }}
                        />
                        {/* Floating ambient lights */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl z-0" />
                        
                        <div className="relative z-10 text-left">
                            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 backdrop-blur-md text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 text-white">
                                <Building className="w-3.5 h-3.5 text-[#00ff62]" />
                                Nutriblend Wholesale Program
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black mb-2 leading-tight tracking-tight !text-white">Grow Your Business With Us</h2>
                            <p className="text-white/90 text-[11px] sm:text-xs leading-relaxed mb-4 font-semibold">
                                Join NutriBlend Haven as a wholesale partner and unlock exclusive bulk pricing, priority delivery, and custom support.
                            </p>
                            
                            {/* Stretched grid of benefits */}
                            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10">
                                {[
                                    "Exclusive bulk pricing",
                                    "Priority delivery",
                                    "Dispenser support",
                                    "Premium catalogue",
                                ].map((benefit) => (
                                    <div key={benefit} className="flex items-center gap-1.5 text-[10px] font-black text-white/95">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff62] flex-shrink-0" />
                                        {benefit}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Clean flat card structure just like Jumia */}
                    <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.02)] border border-gray-200/80 p-6 sm:p-8 transition-all duration-300">
                        <div className="text-left border-b border-gray-100 pb-5 mb-6">
                            <span className="inline-flex items-center gap-1.5 bg-[#eefcf2] text-[#009E3C] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 border border-green-100">
                                Business Application
                            </span>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Apply for Wholesale</h2>
                            <p className="text-gray-400 text-xs font-semibold mt-1">Fill in your business details below to open a partner account</p>
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
                                        <span className="absolute inset-y-0 left-4 flex items-center text-sm text-gray-500 font-bold pointer-events-none">
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
                                hint={formData.email ? undefined : "Enter your contact or business email address"}>
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

                            <div className="border-t border-gray-100 my-6 pt-4" />

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
                                className="w-full rounded-2xl bg-gradient-to-r from-[#009E3C] to-[#00752C] py-4 text-base font-black tracking-wide text-white transition-all hover:from-[#00bc49] hover:to-[#009E3C] hover:shadow-lg hover:shadow-green-900/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8 active:scale-[0.98]">
                                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {isLoading ? "Submitting Application..." : "Submit Wholesale Application"}
                            </button>

                            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                                <p className="text-sm font-semibold text-gray-400">
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
    return `w-full rounded-xl border px-4 py-3.5 text-sm font-semibold outline-none transition-all duration-200 shadow-sm ${
        hasError
            ? "border-red-300 bg-red-50/50 text-red-900 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
            : "border-gray-200 bg-white text-gray-900 focus:border-[#009E3C] focus:ring-4 focus:ring-[#009E3C]/5 hover:border-gray-300"
    } disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`;
}

function Field({ label, error, hint, children }: {
    label: string; error?: string; hint?: React.ReactNode; children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
            {children}
            {error ? (
                <span className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" /> {error}
                </span>
            ) : hint ? (
                <span className="text-[10px] text-gray-400">{hint}</span>
            ) : null}
        </div>
    );
}
