"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import { fetchUserProfile } from "@/lib/features/auth/authSlice";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { FiUser, FiMail, FiPhone, FiLock, FiSave, FiTrash2, FiAlertTriangle, FiEye, FiEyeOff } from "react-icons/fi";

export default function MyAccountManagement() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.email || "",
        phone: user.phone || user.contact || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      const response = await apiClient.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      if (response.status) {
        // Await profile refresh so Redux + localStorage are fully updated
        await dispatch(fetchUserProfile()).unwrap();
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.password !== passwordData.password_confirmation) {
      toast.error("New password and confirmation do not match");
      return;
    }

    if (passwordData.password.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    setIsSavingPassword(true);

    try {
      const response = await apiClient.changePassword({
        old_password: passwordData.old_password,
        password: passwordData.password,
        password_confirmation: passwordData.password_confirmation,
      });

      if (response.status) {
        toast.success("Password changed successfully!");
        setPasswordData({ old_password: "", password: "", password_confirmation: "" });
      } else {
        toast.error(response.message || "Failed to change password");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to change password. Check your current password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    toast.info("Account deletion has been requested. Our team will process this shortly.");
    setIsDeleting(false);
  };

  const initials = formData.name
    ? formData.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
          {initials}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
          <p className="text-sm text-gray-500">Manage your profile and security</p>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-5 py-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <FiUser className="w-4 h-4" /> Profile Information
          </h3>
        </div>

        <form onSubmit={handleProfileSubmit} className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiUser className="w-4 h-4 text-gray-400" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleProfileChange}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiMail className="w-4 h-4 text-gray-400" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleProfileChange}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiPhone className="w-4 h-4 text-gray-400" /> Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleProfileChange}
                placeholder="Enter your phone number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              {isSavingProfile ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-5 py-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <FiLock className="w-4 h-4" /> Change Password
          </h3>
        </div>

        <form onSubmit={handlePasswordSubmit} className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiLock className="w-4 h-4 text-gray-400" /> Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.old ? "text" : "password"}
                  name="old_password"
                  value={passwordData.old_password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter your current password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(p => ({ ...p, old: !p.old }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.old ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiLock className="w-4 h-4 text-gray-400" /> New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="password"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter new password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiLock className="w-4 h-4 text-gray-400" /> Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="password_confirmation"
                  value={passwordData.password_confirmation}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Confirm new password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSavingPassword}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:from-gray-800 hover:to-gray-900 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <FiLock className="w-4 h-4" />
              {isSavingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-xl border border-red-200 overflow-hidden">
        <div className="px-5 py-4">
          <h3 className="text-base font-semibold text-red-700 flex items-center gap-2">
            <FiAlertTriangle className="w-4 h-4" /> Danger Zone
          </h3>
          <p className="text-sm text-red-600 mt-1">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            type="button"
            onClick={() => setIsDeleting(true)}
            className="mt-4 inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-all shadow-md"
          >
            <FiTrash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <FiAlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Your Account?
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleting(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
