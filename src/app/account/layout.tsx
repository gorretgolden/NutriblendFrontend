// src/app/account/layout.tsx
'use client';

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { cn } from "@/lib/utils";
import { FaBox, FaHeart, FaStar, FaEnvelope, FaCog, FaBars, FaTimes, FaHome } from "react-icons/fa";

const navItems = [
  { name: "Account Overview", href: "/account", icon: FaHome, exact: true },
  { name: "Orders", href: "/account/order", icon: FaBox },
  { name: "My Wishlist", href: "/account/mylist", icon: FaHeart },
  { name: "Reviews", href: "/account/myreview", icon: FaStar },
  { name: "Messages", href: "/account/messages", icon: FaEnvelope },
  { name: "Account Settings", href: "/account/manage", icon: FaCog },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const currentPage = navItems.find((item) => isActive(item));

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile top bar */}
        <div className="md:hidden bg-white border-b border-gray-200 sticky top-[56px] z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex items-center gap-2 text-gray-700"
            >
              <FaBars className="w-5 h-5" />
              <span className="font-semibold text-sm">
                {currentPage?.name || "My Account"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div
              className="w-72 bg-white h-full shadow-xl animate-in slide-in-from-left duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">My Account</h2>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg"
                >
                  <FaTimes className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <nav className="p-3 space-y-0.5">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-lg transition-colors duration-200",
                      isActive(item)
                        ? "bg-[#009E3C]/8 text-[#009E3C] font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        <div className="flex">
          {/* Desktop sidebar */}
          <aside className="hidden md:block w-64 bg-white shadow-md min-h-[calc(100vh-64px)] sticky top-[64px]">
            <nav className="p-4 space-y-2">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">My Account</h2>
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-lg transition-colors duration-200",
                        isActive(item)
                          ? "bg-[#009E3C]/8 text-[#009E3C] font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}