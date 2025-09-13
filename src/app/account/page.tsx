// app/account/page.tsx
import React from "react";
import RegisterAccount from "@/components/accounts/MyAccount";
import  Orders from "@/components/accounts/Order";

const AccountPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 flex justify-center items-start p-6">
      <RegisterAccount />
      <Orders data={[]} /> {/* Pass actual order data here */}
    </main>
  );
};

export default AccountPage;
