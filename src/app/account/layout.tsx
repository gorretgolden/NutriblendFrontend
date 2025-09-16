// src/app/account/layout.tsx

import React from "react";
import Sidebar from "@/components/accounts/sidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed on the left */}
      <aside className="w-64 bg-white shadow-md pt-8">
        <Sidebar />
      </aside>

      {/* Main Content Area - Renders the page content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}