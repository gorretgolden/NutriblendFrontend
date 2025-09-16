// src/app/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import TopBanner from "@/components/layout/Banner/TopBanner";
import TopNavbar from "@/components/layout/Navbar/TopNavbar";
import Header from "@/components/homepage/Header";
import Footer from "@/components/layout/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide these on checkout page
  const hideLayoutRoutes = ["/cart/checkout"];
  const shouldHideLayout = hideLayoutRoutes.includes(pathname);

  return (
    <>
      {!shouldHideLayout && <TopBanner />}
      {!shouldHideLayout && <TopNavbar />}
      {/* {!shouldHideLayout && <Header />} */}
      {children}
      {/* {!shouldHideLayout && <Footer />} */}
    </>
  );
}
