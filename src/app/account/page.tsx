// app/account/page.tsx
"use client";

import React, { useState } from "react";
import RegisterAccount from "@/components/accounts/MyAccount";
import Orders from "@/components/accounts/Order";
import { MyList } from "@/components/accounts";
import MyReview from "@/components/accounts/MyReview";
import MyMessages from "@/components/accounts/messages";
import AccountOverview from "@/components/accounts/MyAccountOverview";

const AccountPage = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return <RegisterAccount />;
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

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
         

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
