// src/app/account/messages/page.tsx
"use client";

import React from "react";
import { FaEnvelope, FaInbox } from "react-icons/fa";

export default function MessagesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-green-100 rounded-xl">
          <FaEnvelope className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Messages</h1>
          <p className="text-sm text-gray-500">Stay updated with your order notifications</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaInbox className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No messages yet</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          You&apos;ll receive notifications here when you place orders,
          receive shipment updates, or get promotional offers.
        </p>
      </div>
    </div>
  );
}