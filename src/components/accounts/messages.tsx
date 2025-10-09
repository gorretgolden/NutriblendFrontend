"use client";

import React from "react";
import * as motion from "framer-motion/client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
      <div className="text-center py-16 text-gray-400 italic">
        You have no messages in your inbox.
      </div>
    );
  }

  return (
    <section className="w-full">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">
          My Messages
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 250 }}
            >
              <Card
                className={cn(
                  "rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-2xl transition-all duration-300 relative overflow-visible",
                  message.isRead ? "bg-white" : "bg-green-50"
                )}
              >
                {/* Top status strip */}
                <div
                  className={cn(
                    "absolute top-0 left-0 w-full h-1 rounded-t-2xl",
                    message.isRead ? "bg-gray-200" : "bg-green-500"
                  )}
                ></div>

                <CardContent className="p-5">
                  {/* Status & Date */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        message.isRead ? "text-gray-500" : "text-green-700"
                      )}
                    >
                      {message.isRead ? "Read" : "Unread"}
                    </span>
                    <span className="text-xs text-gray-400">{message.date}</span>
                  </div>

                  {/* Subject */}
                  <h3
                    className={cn(
                      "font-semibold text-gray-800 mb-2 truncate",
                      message.isRead ? "text-gray-800" : "text-gray-900"
                    )}
                  >
                    {message.subject}
                  </h3>

                  {/* Full Preview */}
                  <p className="text-sm text-gray-700">{message.preview}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default MyMessages;
