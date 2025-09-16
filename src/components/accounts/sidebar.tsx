// src/components/accounts/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FaBox, FaList, FaStar, FaEnvelope } from "react-icons/fa";

const navItems = [
  { name: "Orders", href: "/account/order", icon: FaBox },
  { name: "My Lists", href: "/account/mylist", icon: FaList },
  { name: "Reviews", href: "/account/myreview", icon: FaStar },
  { name: "Messages", href: "/account/messages", icon: FaEnvelope },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <nav className="p-4 space-y-2">
      <h2 className="text-xl font-semibold mb-4">My Account</h2>
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg transition-colors duration-200",
                pathname.startsWith(item.href)
                  ? "bg-green-50 text-[#4caf50]"
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
  );
};

export default Sidebar;