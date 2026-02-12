'use client';
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import React, { useState, useEffect } from "react";
import { SocialNetworks } from "./footer.types";
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

  return (
    <div className="w-full">
      {/* Newsletter Section */}
      <NewsLetterSection />

      {/* Footer */}
      <footer className="w-full bg-white text-[#000000]">
        <div className="max-w-6xl mx-auto px-6">
          {/* Divider */}
          <hr className="border-gray-300 my-10" />

          {/* Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
            {/* Brand Section */}
            <div>
              <h3 className="text-[#4caf50] mb-5 text-lg font-semibold relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#4caf50]">
                {settings?.name || "NutriBlend Haven"}
              </h3>
              <p className="text-gray-700">
                {settings?.slogan || "Your Health, Our Priority!"}
              </p>
              <div className="flex mt-6 gap-4">
                <a
                  href={settings?.facebook_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 border border-[#4caf50] text-[#4caf50] rounded-full hover:bg-[#4caf50] hover:text-white transition-all"
                >
                  <FaFacebookF />
                </a>
                <a
                  href={settings?.twitter_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 border border-[#4caf50] text-[#4caf50] rounded-full hover:bg-[#4caf50] hover:text-white transition-all"
                >
                  <FaTwitter />
                </a>
                <a
                  href={settings?.instagram_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 border border-[#4caf50] text-[#4caf50] rounded-full hover:bg-[#4caf50] hover:text-white transition-all"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-[#4caf50] mb-5 text-lg font-semibold relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#4caf50]">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/shop" className="text-gray-700 hover:text-[#4caf50] transition-colors">
                    Shop
                  </Link>
                </li>
                {pages
                  .filter(page => ['about', 'contact', 'faq'].includes(page.type))
                  .map((page) => (
                    <li key={page.id}>
                      <Link href={`/${page.slug}`} className="text-gray-700 hover:text-[#4caf50] transition-colors">
                        {page.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-[#4caf50] mb-5 text-lg font-semibold relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#4caf50]">
                Customer Service
              </h3>
              <ul className="space-y-3">
                {pages
                  .filter(page => ['terms', 'privacy'].includes(page.type))
                  .map((page) => (
                    <li key={page.id}>
                      <Link href={`/${page.slug}`} className="text-gray-700 hover:text-[#4caf50] transition-colors">
                        {page.title}
                      </Link>
                    </li>
                  ))}
                <li>
                  <Link href="/account/order" className="text-gray-700 hover:text-[#4caf50] transition-colors">
                    Track Order
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-[#4caf50] mb-5 text-lg font-semibold relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#4caf50]">
                Contact Info
              </h3>
              <p className="mb-2 text-gray-700">
                {settings?.address || "Kampala, Uganda"}
              </p>
              <p className="mb-2 text-gray-700">Phone: {settings?.phone || "+256 700 000 000"}</p>
              <p className="mb-2 text-gray-700">
                Email: {settings?.email || "info@nutriblendhaven.com"}
              </p>
              {settings?.opening_hours && (
                <p className="mb-2 text-gray-700">Hours: {settings.opening_hours}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full text-center bg-black text-white pt-7 pb-6 mt-5 text-sm">
          <p>© {currentYear} {settings?.name || "NutriBlend Haven"}. All rights reserved.</p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${settings?.phone?.replace(/\+/g, '') || "256700000000"}`}
        className="fixed w-14 h-14 bottom-10 right-10 bg-[#25d366] text-white rounded-full text-2xl shadow-lg z-50 flex items-center justify-center transition-all hover:bg-[#128C7E] hover:scale-110"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
};

export default Footer;
