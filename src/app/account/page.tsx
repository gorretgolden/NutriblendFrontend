// app/account/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RegisterAccount from "@/components/accounts/MyAccount";
import Orders from "@/components/accounts/Order";
import { MyList } from "@/components/accounts";
import MyReview from "@/components/accounts/MyReview";
import MyMessages from "@/components/accounts/messages";
import AccountOverview from "@/components/accounts/MyAccountOverview";
import MyAccount from "@/components/accounts/MyAccountManagement";
import Sidebar from "@/components/accounts/sidebar";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import { fetchUserProfile } from "@/lib/features/auth/authSlice";
import { FiUser, FiBox, FiHeart, FiStar, FiMail, FiSettings } from "react-icons/fi";

const sidebarItems = [
  { key: "overview", label: "Account Overview", icon: FiUser },
  { key: "orders", label: "Orders", icon: FiBox },
  { key: "wishlist", label: "My Lists", icon: FiHeart },
  { key: "reviews", label: "Reviews", icon: FiStar },
  { key: "messages", label: "Messages", icon: FiMail },
  { key: "account", label: "Account Management", icon: FiSettings },
];

const AccountPage = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Fetch user profile on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, dispatch]);

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return <MyAccount />;
      case "orders":
        return <Orders data={[]} />;
      case "wishlist":
        return <MyList products={[]} />;
      case "reviews":
        return <MyReview reviews={[]} />;
      case "messages":
        return <MyMessages messages={[]} />;
      case "overview":
      default:
        return <AccountOverview />;
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow p-4">
              {user && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {(user.first_name?.[0] || "").toUpperCase()}
                    {(user.last_name?.[0] || "").toUpperCase()}
                  </div>
                  <p className="text-center font-semibold text-gray-800">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-center text-sm text-gray-500">{user.email}</p>
                </div>
              )}
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium ${activeSection === item.key
                        ? "bg-green-50 text-green-700"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow p-4 md:p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccountPage;
