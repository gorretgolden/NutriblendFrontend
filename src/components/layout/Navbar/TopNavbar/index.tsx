// src/components/layout/Header.tsx
"use client";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Link from "next/link"; // This import is now correctly at the top
import React, { useState } from "react";
import { NavMenu } from "../navbar.types";
import { MenuList } from "./MenuList";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MenuItem } from "./MenuItem";
import InputGroup from "@/components/ui/input-group";
import ResTopNavbar from "./ResTopNavbar";
import CartBtn from "./CartBtn";
import Image from 'next/image';

const Header = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Main header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left section - Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-[#4caf50]">
              <Link href="/" className="flex items-center">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-[#4caf50] hover:scale-105 transition-transform duration-300 shadow-md">
                  <Image
                    src="/images/logo.png"
                    alt="Company Logo"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <span className="ml-2 text-xl font-semibold hidden sm:block">NutriBlend</span>
              </Link>
            </div>
          </div>

          {/* Center section - Search bar */}
          <div className="flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative">
              <form className="flex shadow-sm">
                <input
                  type="text"
                  placeholder="Search all of NutriBlend..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#4caf50] focus:border-transparent transition-all duration-200"
                />
                <button
                  type="submit"
                  className="bg-[#4caf50] text-white px-5 py-2.5 rounded-r-xl hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* Right section - Account and Cart */}
          <div className="flex items-center space-x-3">
            {/* Sign In Dropdown Component */}
            <div className="relative">
              <button
                className="flex items-center space-x-1.5 p-2 rounded-lg hover:bg-gray-50 group relative transition-colors duration-200"
                onMouseEnter={() => setIsAccountOpen(true)}
                onMouseLeave={() => setIsAccountOpen(false)}
              >
                <div className="p-1.5 rounded-full bg-gray-100 group-hover:bg-green-100 transition-colors">
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-[#4caf50] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="hidden md:inline text-sm font-medium">Account</span>
                
                {/* Dropdown indicator arrow */}
                <svg
                  className="ml-1 w-3 h-3 text-gray-400 transition-transform duration-200"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  style={{ transform: isAccountOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {isAccountOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg z-50 border border-gray-100 overflow-hidden"
                  onMouseEnter={() => setIsAccountOpen(true)}
                  onMouseLeave={() => setIsAccountOpen(false)}
                >
                  {/* Welcome header */}
                  <div className="bg-gradient-to-r from-[#4caf50] to-[#45a049] text-white p-4">
                    <h3 className="font-semibold text-lg">Welcome!</h3>
                    <p className="text-sm opacity-90">Sign in to access your account</p>
                  </div>

                  {/* User options */}
                  <div className="p-2">
                    <div className="space-y-1">
                      {/* Changed to Link component */}
                      <Link href="/account" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-[#4caf50] rounded-lg transition-colors duration-200">
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Account
                      </Link>
                      
                      {/* Already a correct Link */}
                      <Link
                        href="/account/order"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-[#4caf50] rounded-lg transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Orders
                      </Link>

                      {/* Changed to Link component with correct href */}
                      <Link href="/account/mylist" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-[#4caf50] rounded-lg transition-colors duration-200">
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        My Lists
                      </Link>
                      
                      {/* Changed to Link component with correct href */}
                      <Link href="/accounts/rewards" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-[#4caf50] rounded-lg transition-colors duration-200">
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Rewards Credit
                      </Link>
                      
                      {/* Changed to Link component with correct href */}
                      <Link href="/account/myreview" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-[#4caf50] rounded-lg transition-colors duration-200">
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        My Reviews
                      </Link>
                      
                      {/* Changed to Link component with correct href */}
                      <Link href="/account/messages" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-[#4caf50] rounded-lg transition-colors duration-200">
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Messages
                        <span className="ml-auto bg-[#4caf50] text-white text-xs rounded-full px-2 py-1">3</span>
                      </Link>
                    </div>
                  </div>

                  {/* Sign in button */}
                  <div className="p-3 border-t border-gray-100 bg-gray-50">
                    <Link
                      href="/account"
                      className="block w-full bg-[#4caf50] hover:bg-green-600 text-white text-center font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-sm"
                    >
                      Sign in / Create account
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Changed to Link component */}
            <Link href="/cart" className="flex items-center p-2 rounded-lg hover:bg-gray-50 relative transition-colors duration-200">
              <div className="p-1.5 rounded-full bg-gray-100 hover:bg-green-100">
                <svg className="w-5 h-5 text-gray-600 hover:text-[#4caf50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 bg-[#4caf50] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">0</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;