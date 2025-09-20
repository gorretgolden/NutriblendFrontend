// src/app/account/messages/page.tsx

import React from "react";
// Import both the component and the Message type from the component file
import MyMessages, { Message } from "@/components/accounts/messages";

// Create some static dummy data to display on the page
const dummyMessages: Message[] = [
  {
    id: "msg-1",
    sender: "Support",
    subject: "Your order has been shipped!",
    date: "2023-11-05",
    preview: "Good news, your recent order for California Gold Nutrition DHA 700 has been shipped and is on its way. You can track your order status in the Orders section of your account.",
    isRead: false,
  },
  {
    id: "msg-2",
    sender: "Promotions",
    subject: "Get 20% off your next purchase",
    date: "2023-11-01",
    preview: "As a valued customer, we're giving you a special discount code for 20% off. Use code NUTRI20 at checkout to get the discount on any product in our store.",
    isRead: true,
  },
  {
    id: "msg-3",
    sender: "Support",
    subject: "A new review for your product",
    date: "2023-10-28",
    preview: "A new review has been submitted for the Omega-3 Fish Oil. You can view it on the product page.",
    isRead: true,
  },
];

export default function MessagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <MyMessages messages={dummyMessages} />
    </div>
  );
}