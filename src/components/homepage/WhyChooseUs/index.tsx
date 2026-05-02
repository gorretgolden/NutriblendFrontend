"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";

interface ValueProp {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function WhyChooseUs() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiClient.getPublicSettings();
        if (response.status && response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    };
    fetchSettings();
  }, []);

  const props: ValueProp[] = [
    {
      title: settings?.trust_badge_1_title || "100% Authentic",
      description: settings?.trust_badge_1_desc || "Every product verified and sourced directly from manufacturers",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
    },
    {
      title: settings?.trust_badge_2_title || "Secure Payment",
      description: settings?.trust_badge_2_desc || "Flutterwave & mobile money — pay safely and conveniently",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      title: settings?.trust_badge_3_title || "Fast Delivery",
      description: settings?.trust_badge_3_desc || "Delivered across all regions in Uganda within 24–48 hours",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
    },
    {
      title: settings?.trust_badge_4_title || "24/7 Support",
      description: settings?.trust_badge_4_desc || "Our wellness team is available around the clock to help you",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full bg-white border-y border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 md:py-14">

        {/* Section heading */}
        <div className="text-center mb-8 md:mb-10">
          <p className="text-[11px] font-black uppercase tracking-widest text-[#009E3C] mb-1">Our Promise</p>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Why Shop With NutriBlend</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
            We&apos;re committed to delivering the best wellness experience — from product quality to your doorstep.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {props.map((item, i) => (
            <div
              key={i}
              className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
            >
              {/* Green top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#009E3C] rounded-t-2xl" />

              {/* Icon circle */}
              <div className="w-14 h-14 rounded-2xl bg-[#f0fdf4] border border-green-100 flex items-center justify-center mb-4 text-[#009E3C] group-hover:bg-[#009E3C] group-hover:text-white transition-all duration-300">
                {item.icon}
              </div>

              <h3 className="font-black text-gray-900 text-base mb-1.5 tracking-tight">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
