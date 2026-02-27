// src/components/accounts/AccountOverview.tsx
"use client";

import React, { useState, useEffect } from "react";
import { FiUser, FiMapPin, FiMail, FiEdit2, FiPlus, FiHome } from "react-icons/fi";
import { useAppSelector } from "@/lib/hooks/redux";

const AccountOverview = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: user ? (user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user.name || "") : "",
    email: user?.email || "",
    address: user?.address || "No default shipping address available."
  });

  // Update effect if user loads later
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user.name || "",
        email: user.email,
        address: user.address || "No default shipping address available."
      });
    }
  }, [user]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 sm:mb-10 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Account Overview</h2>
          <button
            onClick={handleEditToggle}
            className="flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
          >
            <FiEdit2 size={18} />
            {isEditing ? "Cancel Editing" : "Edit Information"}
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {/* Account Details Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-md">
                <FiUser className="text-white" size={22} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">ACCOUNT DETAILS</h3>
                <p className="text-gray-500 text-xs sm:text-sm">Your personal information</p>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 sm:px-5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 sm:px-5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <button className="mt-3 sm:mt-4 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-green-500 to-lightgreen-600 text-white rounded-xl hover:from-lightgreen-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base">
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-green-50 rounded-xl">
                  <FiUser className="text-green-600" size={18} />
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Full Name</p>
                    <p className="text-gray-800 text-base sm:text-lg font-semibold truncate">{userData.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 rounded-xl">
                  <FiMail className="text-green-600" size={18} />
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Email Address</p>
                    <p className="text-gray-800 text-base sm:text-lg font-semibold truncate">{userData.email}</p>
                  </div>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-indigo-50 rounded-xl">
                    <svg className="text-green-600" size={18} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-gray-600 text-xs sm:text-sm">Phone Number</p>
                      <p className="text-gray-800 text-base sm:text-lg font-semibold truncate">{user.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Address Book Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-green-600 to-green-600 rounded-2xl shadow-md">
                <FiHome className="text-white" size={22} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">ADDRESS BOOK</h3>
                <p className="text-gray-500 text-xs sm:text-sm">Your shipping information</p>
              </div>
            </div>

            <div className="mb-6 sm:mb-8 p-4 sm:p-5 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-gray-700 font-medium mb-2 sm:mb-3">Your default shipping address:</p>
              <div className="flex items-start gap-2 sm:gap-3">
                <FiMapPin className="text-green-600 mt-0.5 sm:mt-1" size={16} />
                <p className="text-gray-600 text-sm sm:text-base">{userData.address}</p>
              </div>
            </div>

            <button className="flex items-center justify-center gap-2 sm:gap-3 w-full px-5 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-green-600 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-400 transition-all shadow-md hover:shadow-lg text-sm sm:text-base">
              <FiPlus size={18} />
              Add Default Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
