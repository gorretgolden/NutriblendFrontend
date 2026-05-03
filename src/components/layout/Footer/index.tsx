'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import NewsLetterSection from "./NewsLetterSection";
import { FaWhatsapp, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { apiClient } from "@/lib/api/client";
import { useAppSelector } from "@/lib/hooks/redux";

const Footer = () => {
  const [settings, setSettings] = useState<any>(null);
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiClient.getPublicSettings();
        if (response.status) setSettings(response.data);
      } catch {}
    };
    fetchSettings();
  }, []);

  const handleAccountLink = (e: React.MouseEvent, href: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('open-login-modal'));
    }
  };

  const socialLinks = [
    { icon: FaFacebookF, url: settings?.facebook_url, label: 'Facebook',  color: 'hover:bg-[#1877F2]' },
    { icon: FaTwitter,   url: settings?.twitter_url,  label: 'Twitter',   color: 'hover:bg-[#1DA1F2]' },
    { icon: FaInstagram, url: settings?.instagram_url, label: 'Instagram', color: 'hover:bg-[#E1306C]' },
  ].filter(s => s.url);

  const quickLinks = [
    { href: "/shop",                        label: "Shop All Products" },
    { href: "/shop?is_new_arrival=true",    label: "New Arrivals"      },
    { href: "/brands",                      label: "All Brands"        },
    { href: "/wholesale-registration",       label: "Wholesale Registration" },
    { href: "/aboutUs",                     label: "About Us"          },
    { href: "/faq",                         label: "FAQ"               },
    { href: "/contact",                     label: "Contact Us"        },
  ];

  const serviceLinks = [
    { href: "/privacy",          label: "Privacy Policy"    },
    { href: "/terms",            label: "Terms & Conditions"},
    { href: "/account/order",    label: "Track My Order"    },
    { href: "/account",          label: "My Account"        },
    { href: "/account/mylist",   label: "Wishlist"          },
    { href: "/account/myreview", label: "My Reviews"        },
  ];

  return (
    <div className="w-full">
      <NewsLetterSection />

      <footer className="w-full bg-[#111111] text-gray-400 relative overflow-hidden">

        {/* ── Gradient divider top ── */}
        <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-[#009E3C] to-transparent opacity-60" />

        {/* ── Decorative blur orbs ── */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#009E3C]/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#F3911E]/4 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 pt-14 pb-12 sm:pt-16 sm:pb-14">

            {/* ── Brand column ── */}
            <div className="col-span-2 lg:col-span-1">
              {/* Logo text */}
              <div className="mb-1">
                <h3 className="text-white text-xl font-extrabold tracking-tight">
                  {settings?.name || "NutriBlend Haven"}
                </h3>
                <div className="h-0.5 w-10 bg-[#009E3C] rounded-full mt-1.5 mb-4" />
              </div>

              <p className="text-gray-500 text-sm leading-relaxed mb-7 max-w-xs">
                {settings?.slogan || "Your trusted source for premium nutrition, wellness, and health supplements. Authentic products delivered fast across Uganda."}
              </p>

              {/* Social icons */}
              {socialLinks.length > 0 && (
                <div className="flex gap-2.5">
                  {socialLinks.map((social, i) => (
                    <a
                      key={i}
                      href={social.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`inline-flex items-center justify-center w-9 h-9 bg-white/8 border border-white/10 text-gray-400 rounded-xl ${social.color} hover:text-white hover:border-transparent transition-all duration-250 hover:scale-105 hover:shadow-lg`}
                    >
                      <social.icon className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              )}

              {/* Trust badge */}
              <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 bg-[#009E3C]/10 border border-[#009E3C]/20 rounded-full">
                <svg className="w-3.5 h-3.5 text-[#009E3C]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[10px] font-bold text-[#009E3C] uppercase tracking-wider">100% Authentic</span>
              </div>
            </div>

            {/* ── Quick Links ── */}
            <div>
              <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#009E3C] rounded-full" />
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="group flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors duration-200"
                    >
                      <svg className="w-2.5 h-2.5 text-[#009E3C]/50 group-hover:text-[#009E3C] flex-shrink-0 transition-colors duration-200 group-hover:translate-x-0.5 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Customer Service ── */}
            <div>
              <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#F3911E] rounded-full" />
                Customer Service
              </h4>
              <ul className="space-y-3">
                {serviceLinks.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={(e) => handleAccountLink(e, href)}
                      className="group flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors duration-200"
                    >
                      <svg className="w-2.5 h-2.5 text-[#F3911E]/50 group-hover:text-[#F3911E] flex-shrink-0 transition-colors duration-200 group-hover:translate-x-0.5 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Contact & Payment ── */}
            <div>
              <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded-full" />
                Get In Touch
              </h4>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/6 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-[#009E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-500 text-sm leading-snug">{settings?.address || "Kampala, Uganda"}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/6 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-[#009E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-gray-500 text-sm">{settings?.phone || "+256 700 000 000"}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/6 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-[#009E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-500 text-sm">{settings?.email || "info@nutriblendhaven.com"}</span>
                </li>
              </ul>

              {/* Payment methods */}
              <div className="mt-7">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-3">We Accept</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Visa', 'MTN MoMo', 'Airtel Money', 'Cash on Delivery'].map((method) => (
                    <span
                      key={method}
                      className="bg-white/6 border border-white/12 text-gray-400 text-[10px] font-semibold px-2.5 py-1 rounded-md"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/8 bg-black/20">
          <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-600 text-xs">
              © {currentYear}{" "}
              <span className="text-gray-400 font-medium">{settings?.name || "NutriBlend Haven"}</span>.
              {" "}All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
              <span className="text-gray-700">·</span>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
              <span className="text-gray-700">·</span>
              <span className="text-[#009E3C] font-semibold">Kampala, Uganda</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── WhatsApp floating button ── */}
      <a
        href={`https://wa.me/${settings?.phone?.replace(/\+/g, '') || "256784640607"}`}
        className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-[#25d366] text-white rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-[0_8px_28px_rgba(37,211,102,0.40)] hover:bg-[#1fba59] hover:scale-110 hover:shadow-[0_12px_36px_rgba(37,211,102,0.50)] transition-all duration-250"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
};

export default Footer;
