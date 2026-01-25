// src/app/account/layout.tsx
'use client';

import React from "react";
import Sidebar from "@/components/accounts/sidebar";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
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
    </AuthGuard>
  );
}