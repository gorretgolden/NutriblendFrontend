'use client';
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";

const CACHE_KEY = 'top_banner_settings';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const TopBanner = () => {
  const [currentText, setCurrentText] = useState(0);
  const [settings, setSettings] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Default trust signals as fallback
  const defaultTexts = [
    "a Rasmus Pharmaceuticals entity",
    "100% Authentic — Sourced directly from brands",
    "Secure Payment — Flutterwave & mobile money",
    "Fast Delivery — Across Uganda within 24-48 hours",
    "24/7 Support — Expert wellness advice always"
  ];

  const baseTexts = settings?.trust_badges && settings.trust_badges.length > 0
    ? settings.trust_badges.map((b: any) => `${b.title || b.name} — ${b.desc || b.description || ""}`)
    : (settings?.top_banner_rotating_texts || defaultTexts);

  // Hardcode this text per client request
  const rotatingTexts = ["a Rasmus Pharmaceuticals entity", ...baseTexts.filter((t: string) => !t.toLowerCase().includes("rasmus"))];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setSettings(data);
            if (data.top_banner_is_active === false) {
              setIsVisible(false);
            }
            setIsLoading(false);
            return;
          }
        }

        // Fetch from API
        const response = await apiClient.getPublicSettings();
        if (response.status && response.data) {
          setSettings(response.data);
          if (response.data.top_banner_is_active === false) {
            setIsVisible(false);
          }

          // Cache the response
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: response.data,
            timestamp: Date.now()
          }));
        }
      } catch (error) {
        console.error("Failed to fetch top banner settings", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (rotatingTexts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % rotatingTexts.length);
    }, 4500); // 4.5 seconds for comfortable reading

    return () => clearInterval(interval);
  }, [rotatingTexts.length]);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-[#009E3C] via-[#008231] to-[#005a22] text-white shadow-md border-b border-green-500/20 relative z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-2.5">
        <div className="flex flex-row justify-between items-center gap-4">
          
          {/* Left — phone link */}
          <a 
            href={`tel:${settings?.top_banner_phone || "+256784640607"}`}
            className="flex items-center gap-2 shrink-0 hover:text-green-200 transition-colors group"
          >
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
              <PhoneIcon />
            </div>
            <span className="text-xs sm:text-sm font-black tracking-wide whitespace-nowrap">
              {settings?.top_banner_phone || "+256784640607"}
            </span>
          </a>

          {/* Center — rotating premium trust signals */}
          <div className="flex-1 max-w-[200px] xs:max-w-[280px] sm:max-w-[450px] md:max-w-[600px] flex items-center justify-center gap-2 overflow-hidden mx-auto">
            <span className="hidden sm:inline text-green-300 animate-pulse text-xs">✦</span>
            <div className="rotating-text-container">
              {rotatingTexts.map((text: string, index: number) => (
                <div 
                  key={index} 
                  className={`rotating-text ${index === currentText ? 'active' : ''}`}
                >
                  {text}
                </div>
              ))}
            </div>
            <span className="hidden sm:inline text-green-300 animate-pulse text-xs">✦</span>
          </div>

          {/* Right — event name + close button */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden lg:inline text-xs font-bold bg-white/10 border border-white/20 px-3 py-1 rounded-full text-green-100">
              {settings?.top_banner_event_name || "Free delivery over UGX 100k"}
            </span>
            <Button
              variant="ghost"
              onClick={() => setIsVisible(false)}
              className="hover:bg-white/10 text-white/80 hover:text-white transition-colors p-1.5 h-7 w-7 rounded-full flex items-center justify-center"
              type="button"
              aria-label="close banner"
            >
              <CloseIcon />
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Rotating text container */
        .rotating-text-container {
          position: relative;
          height: 24px;
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .rotating-text {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 11px;
          opacity: 0;
          transform: translateY(100%);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          letter-spacing: 0.02em;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
        }

        @media (min-width: 640px) {
          .rotating-text {
            font-size: 13px;
          }
        }

        .rotating-text.active {
          opacity: 1;
          transform: translateY(0);
        }
        
        .rotating-text:not(.active) {
          opacity: 0;
          transform: translateY(-100%);
        }
      `}</style>
    </div>
  );
};

// Icon components
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default TopBanner;
