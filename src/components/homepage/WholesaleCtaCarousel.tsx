"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ArrowRight } from "lucide-react";

const SLIDES = [
    {
        image: "https://images.unsplash.com/photo-1611079830811-b65d1a34c5af?auto=format&fit=crop&q=80&w=1600",
        title: "Become a Wholesale Partner",
        desc: "Are you a hospital, pharmacy, clinic or wholesale retailer? Unlock exclusive bulk pricing, dedicated support, and priority dispatch.",
        label: "Nutriblend Wholesale Program",
        badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    },
    {
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1600",
        title: "Empower Your Business Growth",
        desc: "Access Uganda's most reliable premium wellness catalog. Fast logistics, guaranteed authenticity, and flexible order structures.",
        label: "Nutriblend Wholesale Program",
        badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
];

export default function WholesaleCtaCarousel() {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(() => {
            setCurrentIdx((prev) => (prev + 1) % SLIDES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [isHovered]);

    return (
        <div 
            className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-[235px] sm:h-[240px] md:h-[220px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group transition-all duration-500 hover:shadow-green-950/10">
                
                {/* Background Images with Cross-Fade */}
                {SLIDES.map((slide, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            idx === currentIdx ? "opacity-100 z-0 scale-100" : "opacity-0 z-0 scale-105"
                        } transform duration-[2000ms]`}
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    />
                ))}

                {/* Glassmorphic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent z-10" />

                {/* Subtle Decorative Lights */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#00ff62]/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none z-10 animate-pulse" />

                {/* Content Overlay - Snug vertical layout for mobile, split row for desktop */}
                <div className="absolute inset-0 z-20 p-4 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-center md:justify-between gap-2 sm:gap-4 md:gap-8">
                    <div className="flex-1 text-left">
                        {/* Animated Badge */}
                        <div className="overflow-hidden mb-0.5 sm:mb-2">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={currentIdx}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`inline-flex items-center gap-1.5 backdrop-blur-md text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${SLIDES[currentIdx].badgeColor}`}
                                >
                                    <Building2 className="w-3.5 h-3.5" />
                                    {SLIDES[currentIdx].label}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                        
                        {/* Dynamic Text with Slide-In Transitions */}
                        <div className="overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIdx}
                                    initial={{ y: 25, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -25, opacity: 0 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                >
                                    <h3 className="text-[22px] sm:text-2xl md:text-3xl font-black text-white tracking-tight mb-0.5 sm:mb-1.5 drop-shadow-md leading-tight">
                                        {SLIDES[currentIdx].title}
                                    </h3>
                                    <p className="text-white/95 text-[13px] sm:text-sm max-w-2xl leading-snug font-semibold">
                                        {SLIDES[currentIdx].desc}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="flex-shrink-0 w-full md:w-auto text-left z-30 mt-1 sm:mt-0">
                        <Link
                            href="/wholesale-registration"
                            className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#009E3C] to-[#00752C] px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-black tracking-wide text-white transition-all duration-300 hover:from-[#00bc49] hover:to-[#009E3C] hover:shadow-xl hover:shadow-[#009E3C]/20 hover:scale-[1.01] active:scale-[0.98] text-center group"
                        >
                            Apply for Wholesale Program
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* Premium Clickable Slide Indicators - Safely centered at bottom on mobile */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 z-30 flex items-center gap-1.5">
                    {SLIDES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIdx(idx)}
                            className="group/btn relative p-1.5"
                            aria-label={`Go to slide ${idx + 1}`}
                        >
                            <span className={`block h-1.5 rounded-full transition-all duration-500 ${
                                idx === currentIdx 
                                    ? "w-6 bg-[#00ff62] shadow-[0_0_8px_#00ff62]" 
                                    : "w-2 bg-white/40 hover:bg-white/70"
                            }`} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
