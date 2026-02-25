'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import NewsLetterSection from "./NewsLetterSection";
import { FaWhatsapp, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { apiClient } from "@/lib/api/client";

const Footer = () => {
  const [settings, setSettings] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiClient.getPublicSettings();
        if (response.status) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    };

    const fetchPages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages`);
        const data = await response.json();
        if (data.status) {
          setPages(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch pages", error);
      }
    };

    fetchSettings();
    fetchPages();
  }, []);

  const socialLinks = [
    { icon: FaFacebookF, url: settings?.facebook_url, label: 'Facebook' },
    { icon: FaTwitter, url: settings?.twitter_url, label: 'Twitter' },
    { icon: FaInstagram, url: settings?.instagram_url, label: 'Instagram' },
  ].filter(s => s.url);

  return (
    <div className="w-full">
      {/* Newsletter Section */}
      <NewsLetterSection />

      {/* Footer */}
      <footer className="w-full bg-gray-50 border-t border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          {/* Footer Content */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 py-8 sm:py-14">
            {/* Brand Section */}
            <div>
              <h3 className="text-gray-900 mb-4 text-lg font-extrabold tracking-tight">
                {settings?.name || "NutriBlend Haven"}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {settings?.slogan || "Your Health, Our Priority! Premium nutrition products delivered to your door."}
              </p>
              {socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map((social, i) => (
                    <a
                      key={i}
                      href={social.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="inline-flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-lg hover:shadow-green-200/50 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-gray-900 mb-4 text-sm font-bold uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/shop" className="text-gray-500 hover:text-green-600 transition-colors text-sm flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300 rounded-full" />
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/shop?is_new_arrival=true" className="text-gray-500 hover:text-green-600 transition-colors text-sm flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300 rounded-full" />
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/aboutUs" className="text-gray-500 hover:text-green-600 transition-colors text-sm flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300 rounded-full" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-500 hover:text-green-600 transition-colors text-sm flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300 rounded-full" />
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-500 hover:text-green-600 transition-colors text-sm flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300 rounded-full" />
                    Frequently Asked Questions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-gray-900 mb-4 text-sm font-bold uppercase tracking-wider">
                Customer Service
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/privacy" className="text-gray-500 hover:text-green-600 transition-colors text-sm flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300 rounded-full" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-500 hover:text-green-600 transition-colors text-sm flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300 rounded-full" />
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/account/order" className="text-gray-500 hover:text-green-600 transition-colors text-sm flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300 rounded-full" />
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="text-gray-500 hover:text-green-600 transition-colors text-sm flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300 rounded-full" />
                    My Account
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-gray-900 mb-4 text-sm font-bold uppercase tracking-wider">
                Get in Touch
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-500 text-sm">{settings?.address || "Kampala, Uganda"}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-500 text-sm">{settings?.phone || "+256 700 000 000"}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-500 text-sm">{settings?.email || "info@nutriblendhaven.com"}</span>
                </li>
                {settings?.opening_hours && (
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-500 text-sm">{settings.opening_hours}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-400 text-xs">
              © {currentYear} {settings?.name || "NutriBlend Haven"}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-xs">Secure payments powered by</span>
              <div className="flex gap-2">
                {['Visa', 'MTN', 'Airtel'].map((method) => (
                  <span key={method} className="bg-white border border-gray-200 text-gray-500 text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {method}
                  </span>
                ))}
              </div>
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
