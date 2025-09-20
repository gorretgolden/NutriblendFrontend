'use client'
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import React, { useState } from "react";
import { PaymentBadge, SocialNetworks } from "./footer.types";
import Link from "next/link";
import LinksSection from "./LinksSection";
import Image from "next/image";
import NewsLetterSection from "./NewsLetterSection";
import LayoutSpacing from "./LayoutSpacing";
import { FaWhatsapp, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
const NewsletterSection = () => {
  return (
    <div className=" bg-gray-100">
      <div className=" w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <header className=" text-white text-center py-8 px-4" style={{backgroundColor:"#4caf50"}}>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">SUBSCRIBE TO OUR NEWSLETTER</h1>
          <p className="text-lg mb-6">Want something extra?</p>
          
          <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg">
            <div className="mb-4">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full hover:bg-green-600 text-white font-bold py-3 px-6 rounded transition-colors duration-300"
             style={{backgroundColor:"#4caf50"}}>
              SUBSCRIBE
            </button>
          </div>
        </header>
        
        {/* Divider */}
        <hr className="border-gray-300 my-10" />
        
        {/* Footer Content */}
            <footer className="text-[#000000] bg-white py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
         {/* Brand Section */}
          <div>
            <h3 className="text-[#4caf50] mb-5 text-lg font-semibold relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#4caf50]">
              NutriBlend Haven
            </h3>
            <p className="text-gray-700">
            Sex supplements <br /> and cosmestics.
            </p>
            <div className="flex mt-6 gap-4">
               <a
                href="#"
                className="inline-flex items-center justify-center w-10 h-10 border border-[#4caf50] text-[#4caf50] rounded-full hover:bg-[#4caf50] hover:text-white transition-all"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center w-10 h-10 border border-[#4caf50] text-[#4caf50] rounded-full hover:bg-[#4caf50] hover:text-white transition-all"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
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
                <a href="/aboutUs" className="text-gray-700 hover:text-[#4caf50] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-[#4caf50] transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-[#4caf50] transition-colors">
                  Get a Quote
                </a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-[#4caf50] mb-5 text-lg font-semibold relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#4caf50]">
              Products
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-700 hover:text-[#4caf50] transition-colors">
                  Specials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-[#4caf50] transition-colors">
                  Trending Now
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-[#4caf50] transition-colors">
                  Featured Brands
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-[#4caf50] transition-colors">
                  New Arrivals
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#4caf50] mb-5 text-lg font-semibold relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#4caf50]">
              Contact
            </h3>
            <p className="mb-2 text-gray-700">Plot 45, Main Street, Kampala, Uganda</p>
            <p className="mb-2 text-gray-700">Phone: +256 755 000000</p>
            <p className="mb-2 text-gray-700">Email: info@nutriblendhaven.com</p>
          </div>
        </div>

        <div className="text-center pt-6 mt-10 border-t border-gray-200 text-gray-600 text-sm">
          <p>© 2025 NutriBlend Haven. All rights reserved.</p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/256755000000"
        className="fixed w-14 h-14 bottom-10 right-10 bg-[#25d366] text-white rounded-full text-2xl shadow-lg z-50 flex items-center justify-center transition-all hover:bg-[#128C7E] hover:scale-110"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp />
      </a>
    
        
      </div>
    </div>
  );
};

export default NewsletterSection;