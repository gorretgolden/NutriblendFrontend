'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
      } catch { }
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
    { icon: FaFacebookF, url: settings?.facebook_url, label: 'Facebook' },
    { icon: FaTwitter, url: settings?.twitter_url, label: 'Twitter' },
    { icon: FaInstagram, url: settings?.instagram_url, label: 'Instagram' },
  ].filter(s => s.url);

  return (
    <div className="w-full">
      {/* Newsletter */}
      <NewsLetterSection />

      {/* iHerb-style dark footer */}
      <footer className="w-full bg-[#1a1a1a] text-gray-300">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 py-12 sm:py-16">

            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <h3 className="text-white mb-3 text-xl font-extrabold tracking-tight">
                {settings?.name || "NutriBlend Haven"}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {settings?.slogan || "Your trusted source for premium nutrition, wellness, and health supplements. Authentic products delivered fast across Uganda."}
              </p>
              {socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map((social, i) => (
                    <a key={i} href={social.url || "#"} target="_blank" rel="noopener noreferrer" aria-label={social.label}
                      className="inline-flex items-center justify-center w-9 h-9 bg-white/10 text-gray-300 rounded-lg hover:bg-[#009E3C] hover:text-white transition-all duration-300">
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white mb-4 text-sm font-bold uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-2.5">
                {[
                  { href: "/shop", label: "Shop" },
                  { href: "/shop?is_new_arrival=true", label: "New Arrivals" },
                  { href: "/brands", label: "All Brands" },
                  { href: "/aboutUs", label: "About Us" },
                  { href: "/faq", label: "FAQ" },
                  { href: "/contact", label: "Contact Us" },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-gray-400 hover:text-[#009E3C] transition-colors text-sm">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-white mb-4 text-sm font-bold uppercase tracking-wider">Customer Service</h3>
              <ul className="space-y-2.5">
                {[
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/terms", label: "Terms & Conditions" },
                  { href: "/account/order", label: "Track My Order" },
                  { href: "/account", label: "My Account" },
                  { href: "/account/mylist", label: "Wishlist" },
                  { href: "/account/myreview", label: "My Reviews" },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} onClick={(e) => handleAccountLink(e, href)} className="text-gray-400 hover:text-[#009E3C] transition-colors text-sm">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white mb-4 text-sm font-bold uppercase tracking-wider">Get In Touch</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[#009E3C] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-gray-400 text-sm">{settings?.address || "Kampala, Uganda"}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[#009E3C] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span className="text-gray-400 text-sm">{settings?.phone || "+256 700 000 000"}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[#009E3C] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span className="text-gray-400 text-sm">{settings?.email || "info@nutriblendhaven.com"}</span>
                </li>
              </ul>

              {/* We Accept */}
              <div className="mt-6">
                <p className="text-gray-500 text-xs mb-3 uppercase tracking-wider font-semibold">We Accept</p>
                <div className="flex flex-wrap gap-2">
                  {['Visa', 'MTN MoMo', 'Airtel Money', 'Cash on Delivery'].map((method) => (
                    <span key={method} className="bg-white/10 border border-white/20 text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 bg-black/30">
          <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-xs">
              © {currentYear} {settings?.name || "NutriBlend Haven"}. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-gray-500 text-xs">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
              <span>·</span>
              <span className="text-[#009E3C] font-semibold">Kampala, Uganda</span>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${settings?.phone?.replace(/\+/g, '') || "256700000000"}`}
        className="fixed w-12 h-12 sm:w-14 sm:h-14 bottom-6 right-4 sm:bottom-8 sm:right-6 bg-[#25d366] text-white rounded-2xl text-xl sm:text-2xl shadow-xl shadow-green-500/30 z-50 flex items-center justify-center transition-all hover:bg-[#128C7E] hover:scale-110 hover:shadow-2xl"
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
