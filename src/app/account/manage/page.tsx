"use client";

import MyAccountManagement from "@/components/accounts/MyAccountManagement";

export default function AccountManagementPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Sidebar */}
        <div className="w-64">
          {/* <Sidebar /> */}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <MyAccountManagement />
        </div>
      </div>
    </main>
  );
}
