"use client";

import { useState } from "react";

export default function MyAccountManagement() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: ".",
    password: "",
  });

  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 🔗 Later connect this to your Flask backend API
    console.log("Updated account:", formData);
    alert("Your account details have been updated successfully! 🎉");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone. ❗")) {
      // 🔗 Later connect this to your Flask backend API
      console.log("Account deletion requested");
      alert("Account deletion process initiated. We're sorry to see you go! 😢");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          JD
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
        <p className="text-gray-600 mt-2">Manage your profile and account preferences</p>
      </div>

      {/* Account Management Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Profile Information</h2>
          <p className="text-green-100 text-sm">Update your personal and company details</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="block font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Company */}
            <div className="space-y-2">
              <label className="block font-medium text-gray-700">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your company name"
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Change Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter new password"
            />
            <p className="text-sm text-gray-500">Leave blank to keep current password</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => setIsDeleting(true)}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Account
            </button>
          </div>
        </form>
      </div>

      {/* Delete Account Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Your Account?</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. All your data will be permanently removed from our systems.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleting(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}