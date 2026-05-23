// app/account/page.tsx
"use client";

import React from "react";
import { FiUser, FiMail, FiBox, FiHeart, FiBriefcase } from "react-icons/fi";
import { useAppSelector } from "@/lib/hooks/redux";
import Link from "next/link";

export default function AccountPage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-[#009E3C] to-[#007a2e] rounded-2xl p-6 md:p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-12 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-black backdrop-blur-sm border-2 border-white/25 shadow-lg">
            {(user?.first_name?.[0] || user?.name?.[0] || "").toUpperCase()}
            {(user?.last_name?.[0] || user?.name?.split(' ')[1]?.[0] || "").toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {user?.first_name || user?.name?.split(' ')[0] || ''}{' '}
              {user?.last_name || (user?.name?.split(' ').slice(1).join(' ') || '')}
            </h1>
            <p className="text-white/70 text-sm mt-1">{user?.email}</p>
            {(user?.phone || user?.contact) && (
              <p className="text-white/70 text-sm">{user?.phone || user?.contact}</p>
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
              <FiUser className="text-[#009E3C] w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="text-sm font-semibold text-gray-800">
                  {user?.first_name || user?.name?.split(' ')[0] || ''}{' '}
                  {user?.last_name || (user?.name?.split(' ').slice(1).join(' ') || '')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FiMail className="text-[#009E3C] w-5 h-5 flex-shrink-0" />
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
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-[#009E3C]/8 hover:text-[#009E3C] transition-colors group"
            >
              <FiBox className="w-5 h-5 text-gray-400 group-hover:text-[#009E3C]" />
              <span className="text-sm font-medium">View My Orders</span>
            </Link>
            <Link
              href="/account/mylist"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-[#009E3C]/8 hover:text-[#009E3C] transition-colors group"
            >
              <FiHeart className="w-5 h-5 text-gray-400 group-hover:text-[#009E3C]" />
              <span className="text-sm font-medium">My Wishlist</span>
            </Link>
            <Link
              href="/account/manage"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-[#009E3C]/8 hover:text-[#009E3C] transition-colors group"
            >
              <FiUser className="w-5 h-5 text-gray-400 group-hover:text-[#009E3C]" />
              <span className="text-sm font-medium">Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Wholesale Status */}
        {user?.wholesale_business_name && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm md:col-span-2 mt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FiBriefcase className="w-4 h-4" /> Wholesale Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-600 font-bold uppercase mb-1">Business Name</p>
                <p className="text-lg font-bold text-blue-900">{user.wholesale_business_name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Account Status</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-gray-800">Wholesale Partner</p>
                  {user.is_wholesale_approved ? (
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold border border-green-200">APPROVED</span>
                  ) : (
                    <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded-full font-bold border border-amber-200">PENDING APPROVAL</span>
                  )}
                </div>
              </div>
            </div>
            {!user.is_wholesale_approved && (
              <p className="mt-4 text-xs text-gray-500 italic">
                Our team is currently reviewing your business details. You will gain access to wholesale pricing once approved.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
