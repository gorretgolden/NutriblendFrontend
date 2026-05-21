"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import { fetchUserProfile } from "@/lib/features/auth/authSlice";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { FiUser, FiMail, FiPhone, FiLock, FiSave, FiEye, FiEyeOff } from "react-icons/fi";

export default function MyAccountManagement() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    region_id: "" as string | number,
    town_id: "" as string | number,
    location: "",
  });

  const [regions, setRegions] = useState<any[]>([]);
  const [towns, setTowns] = useState<any[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoadingTowns, setIsLoadingTowns] = useState(false);

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

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string | undefined>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.email || "",
        phone: user.phone || user.contact || "",
        region_id: user.region_id || "",
        town_id: user.town_id || "",
        location: user.location || "",
      });
    }
  }, [user]);

  // Fetch Regions
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setIsLoadingLocations(true);
        const res = await apiClient.getRegions();
        if (res.status) setRegions(res.data || []);
      } catch (err) {
        console.error("Failed to fetch regions", err);
      } finally {
        setIsLoadingLocations(false);
      }
    };
    fetchRegions();
  }, []);

  // Fetch Towns when region changes
  useEffect(() => {
    if (!formData.region_id) {
      setTowns([]);
      return;
    }
    const fetchTowns = async () => {
      try {
        setIsLoadingTowns(true);
        const res = await apiClient.getTowns(Number(formData.region_id));
        if (res.status) setTowns(res.data || []);
      } catch (err) {
        console.error("Failed to fetch towns", err);
      } finally {
        setIsLoadingTowns(false);
      }
    };
    fetchTowns();
  }, [formData.region_id]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate profile fields
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Full name is required";
    else if (formData.name.trim().length < 2) errors.name = "Name must be at least 2 characters";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Enter a valid email address";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      toast.error("Please fix the highlighted errors");
      return;
    }

    setIsSavingProfile(true);

    try {
      const response = await apiClient.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        region_id: formData.region_id ? Number(formData.region_id) : undefined,
        town_id: formData.town_id ? Number(formData.town_id) : undefined,
        location: formData.location || undefined,
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

    // Validate password fields
    const errors: Record<string, string> = {};
    if (!passwordData.old_password) errors.old_password = "Current password is required";
    if (!passwordData.password) errors.password = "New password is required";
    else if (passwordData.password.length < 8) errors.password = "Password must be at least 8 characters";
    if (!passwordData.password_confirmation) errors.password_confirmation = "Please confirm your new password";
    else if (passwordData.password !== passwordData.password_confirmation) errors.password_confirmation = "Passwords do not match";

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      toast.error("Please fix the highlighted errors");
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

  const initials = formData.name
    ? formData.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-[#009E3C] rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-[0_4px_14px_rgba(0,158,60,0.30)]">
          {initials}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
          <p className="text-sm text-gray-500">Manage your profile and security</p>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-br from-[#009E3C] to-[#007a2e] px-5 py-4">
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
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:outline-none transition-all ${profileErrors.name ? 'border-red-400 bg-red-50 focus:ring-red-100 focus:border-red-500' : 'border-gray-300 focus:ring-[#009E3C]/20 focus:border-[#009E3C]'}`}
              />
              {profileErrors.name && (
                <p className="mt-1 text-xs text-red-500">{profileErrors.name}</p>
              )}
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
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:outline-none transition-all ${profileErrors.email ? 'border-red-400 bg-red-50 focus:ring-red-100 focus:border-red-500' : 'border-gray-300 focus:ring-[#009E3C]/20 focus:border-[#009E3C]'}`}
              />
              {profileErrors.email && (
                <p className="mt-1 text-xs text-red-500">{profileErrors.email}</p>
              )}
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
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:outline-none transition-all ${profileErrors.phone ? 'border-red-400 bg-red-50 focus:ring-red-100 focus:border-red-500' : 'border-gray-300 focus:ring-[#009E3C]/20 focus:border-[#009E3C]'}`}
              />
              {profileErrors.phone && (
                <p className="mt-1 text-xs text-red-500">{profileErrors.phone}</p>
              )}
            </div>

            {/* Region */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Region
              </label>
              <select
                name="region_id"
                value={formData.region_id}
                onChange={handleProfileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none transition-all"
                disabled={isLoadingLocations}
              >
                <option value="">Select Region</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            {/* Town */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Town
              </label>
              <select
                name="town_id"
                value={formData.town_id}
                onChange={handleProfileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none transition-all"
                disabled={!formData.region_id || isLoadingTowns}
              >
                <option value="">Select Town</option>
                {towns.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Delivery Address
              </label>
              <textarea
                name="location"
                value={formData.location}
                onChange={handleProfileChange}
                placeholder="e.g. Plot 12, Kampala Road..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#009E3C]/20 focus:border-[#009E3C] focus:outline-none transition-all resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="inline-flex items-center gap-2 bg-[#009E3C] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#00752C] transition-all shadow-[0_4px_12px_rgba(0,158,60,0.28)] hover:shadow-[0_6px_18px_rgba(0,158,60,0.38)] disabled:opacity-50 disabled:shadow-none"
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
                  className={`w-full border rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:outline-none transition-all ${passwordErrors.old_password ? 'border-red-400 bg-red-50 focus:ring-red-100 focus:border-red-500' : 'border-gray-300 focus:ring-[#009E3C]/20 focus:border-[#009E3C]'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(p => ({ ...p, old: !p.old }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.old ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.old_password && (
                <p className="mt-1 text-xs text-red-500">{passwordErrors.old_password}</p>
              )}
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
                  className={`w-full border rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:outline-none transition-all ${passwordErrors.password ? 'border-red-400 bg-red-50 focus:ring-red-100 focus:border-red-500' : 'border-gray-300 focus:ring-[#009E3C]/20 focus:border-[#009E3C]'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.password ? (
                <p className="text-xs text-red-500 mt-1">{passwordErrors.password}</p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
              )}
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
                  className={`w-full border rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:outline-none transition-all ${passwordErrors.password_confirmation ? 'border-red-400 bg-red-50 focus:ring-red-100 focus:border-red-500' : 'border-gray-300 focus:ring-[#009E3C]/20 focus:border-[#009E3C]'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.password_confirmation && (
                <p className="mt-1 text-xs text-red-500">{passwordErrors.password_confirmation}</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSavingPassword}
              className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#2d2d2d] transition-all shadow-sm hover:shadow-md disabled:opacity-50"
            >
              <FiLock className="w-4 h-4" />
              {isSavingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

