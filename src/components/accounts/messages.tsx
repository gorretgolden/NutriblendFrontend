// src/components/accounts/MyMessages.tsx

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Define the type for a message, so you can import it on the page
export type Message = {
  id: string;
  sender: string;
  subject: string;
  date: string;
  preview: string;
  isRead: boolean;
};

type MyMessagesProps = {
  messages: Message[];
};

const MyMessages = ({ messages }: MyMessagesProps) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        {/* You have no messages in your inbox. */}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-2xl font-semibold mb-2">My Messages</h2>
      {messages.map((message) => (
        <Card
          key={message.id}
          className={cn(
            "p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer",
            message.isRead ? "bg-white" : "bg-green-50"
          )}
        >
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-sm font-medium",
                message.isRead ? "text-gray-500" : "text-[#4caf50]"
              )}>
                {message.isRead ? "Read" : "Unread"}
              </span>
              <span className="text-xs text-gray-400">{message.date}</span>
            </div>
            <h3 className={cn(
              "font-semibold mt-1",
              message.isRead ? "text-gray-800" : "text-gray-900"
            )}>
              {message.subject}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {message.preview}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyMessages;