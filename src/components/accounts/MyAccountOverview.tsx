// src/components/accounts/AccountOverview.tsx
"use client";

import React, { useState } from "react";
import { FiUser, FiMapPin, FiMail, FiEdit2, FiPlus, FiHome } from "react-icons/fi";

const AccountOverview = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Leticia Akullu",
    email: "akulluletycia23@gmail.com",
    address: "No default shipping address available."
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Account Overview</h2>
          <button 
            onClick={handleEditToggle}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
          >
            <FiEdit2 size={18} />
            {isEditing ? "Cancel Editing" : "Edit Information"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Account Details Card - Larger and more visible */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-md">
                <FiUser className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">ACCOUNT DETAILS</h3>
                <p className="text-gray-500 text-sm">Your personal information</p>
              </div>
            </div>
            
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <button className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <FiUser className="text-blue-600" size={20} />
                  <div>
                    <p className="text-gray-600 text-sm">Full Name</p>
                    <p className="text-gray-800 text-lg font-semibold">{userData.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <FiMail className="text-blue-600" size={20} />
                  <div>
                    <p className="text-gray-600 text-sm">Email Address</p>
                    <p className="text-gray-800 text-lg font-semibold">{userData.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Address Book Card - Larger and more visible */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-r from-green-600 to-green-600 rounded-2xl shadow-md">
                <FiHome className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">ADDRESS BOOK</h3>
                <p className="text-gray-500 text-sm">Your shipping information</p>
              </div>
            </div>
            
            <div className="mb-8 p-5 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-gray-700 font-medium mb-3">Your default shipping address:</p>
              <div className="flex items-start gap-3">
                <FiMapPin className="text-green-600 mt-1" size={18} />
                <p className="text-gray-600">{userData.address}</p>
              </div>
            </div>
            
            <button className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-400 transition-all shadow-md hover:shadow-lg">
              <FiPlus size={20} />
              Add Default Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;