// app/account/page.tsx
"use client";

import React from "react";
import { FiUser, FiMail, FiBox, FiHeart } from "react-icons/fi";
import { useAppSelector } from "@/lib/hooks/redux";
import Link from "next/link";

export default function AccountPage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 md:p-8 mb-8 text-white">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-sm border-2 border-white/30">
            {(user?.first_name?.[0] || user?.name?.[0] || "").toUpperCase()}
            {(user?.last_name?.[0] || user?.name?.split(' ')[1]?.[0] || "").toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {user?.first_name || user?.name?.split(' ')[0] || ''}{' '}
              {user?.last_name || (user?.name?.split(' ').slice(1).join(' ') || '')}
            </h1>
            <p className="text-green-100 text-sm mt-1">{user?.email}</p>
            {(user?.phone || user?.contact) && (
              <p className="text-green-100 text-sm">{user?.phone || user?.contact}</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Account Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Account Details */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FiUser className="w-4 h-4" /> Account Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FiUser className="text-green-600 w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="text-sm font-semibold text-gray-800">
                  {user?.first_name || user?.name?.split(' ')[0] || ''}{' '}
                  {user?.last_name || (user?.name?.split(' ').slice(1).join(' ') || '')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FiMail className="text-green-600 w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-semibold text-gray-800">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Quick Links
          </h3>
          <div className="space-y-2">
            <Link
              href="/account/order"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors group"
            >
              <FiBox className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
              <span className="text-sm font-medium">View My Orders</span>
            </Link>
            <Link
              href="/account/mylist"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors group"
            >
              <FiHeart className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
              <span className="text-sm font-medium">My Wishlist</span>
            </Link>
            <Link
              href="/account/manage"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors group"
            >
              <FiUser className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
              <span className="text-sm font-medium">Edit Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
