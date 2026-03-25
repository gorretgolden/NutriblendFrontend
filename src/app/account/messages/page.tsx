'use client';

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import MyMessages, { Message } from "@/components/accounts/messages";
import { FaEnvelope } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiClient.getNotifications();
        if (response.status && response.data) {
          const rawData = (response.data as any).data || response.data;
          const items = Array.isArray(rawData) ? rawData : [];
          const mapped: Message[] = items.map((n: any) => ({
            id: String(n.id),
            sender: "NutriBlend Haven",
            subject: n.title || n.type || "Notification",
            date: n.created_at
              ? new Date(n.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "",
            preview: n.message || "",
            isRead: !!n.read_at,
          }));
          setMessages(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

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

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <FiLoader className="w-6 h-6 animate-spin mr-2" />
          <span>Loading messages...</span>
        </div>
      ) : (
        <MyMessages messages={messages} />
      )}
    </div>
  );
}
