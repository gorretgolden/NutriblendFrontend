// app/account/page.tsx
import React from "react";
import RegisterAccount from "@/components/accounts/MyAccount";
import  Orders from "@/components/accounts/Order";
import { MyList } from "@/components/accounts";
import MyReview, { Review } from "@/components/accounts/MyReview";
import MyMessages, { Message } from "@/components/accounts/messages";
import AccountOverview from "@/components/accounts/MyAccountOverview";


const AccountPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 flex justify-center items-start p-6">
      {/* <RegisterAccount /> */}
      <Orders data={[]} /> 
      <MyList products={[]} /> 
      <MyReview reviews={[]} /> 
      <MyMessages messages={[]} />
      <AccountOverview />


      

    </main>
  );
};

export default AccountPage;
