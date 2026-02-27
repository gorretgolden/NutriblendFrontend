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

  const defaultTexts = ["Great Price", "Great Quality", "Live Now"];
  const rotatingTexts = settings?.top_banner_rotating_texts || defaultTexts;

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
        // Use defaults on error
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
    }, 3000);

    return () => clearInterval(interval);
  }, [rotatingTexts.length]);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-black text-white" >
      <div className="container mx-auto px-2 py-2">
        <div className="flex flex-row justify-between items-center flex-nowrap gap-2">
          {/* Left side - Contact info */}
          <div className="flex items-center gap-2 animate-slide-in-left shrink-0">
            <div className="flex items-center gap-1 bg-[#4caf50] text-white px-2 py-0.5 rounded-full whitespace-nowrap">
              <PhoneIcon />
              <span className="text-[10px]">Call For Deals</span>
              <span className="font-mono text-[11px]">{settings?.top_banner_phone || "0200 804 020"}</span>
            </div>
          </div>

          {/* Center - Brand, Bonanza and date */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 animate-fall-from-top" style={{ animationDelay: '0.3s' }}>
              <span className="text-[10px] font-bold bg-white text-[#4caf50] px-1 py-0.5 rounded">
                BANNER
              </span>
              <span className="text-sm font-extrabold text-white uppercase">
                {settings?.top_banner_event_name || "LAUNCH BONAZA"}
              </span>
            </div>

            <span className="text-[10px] font-semibold animate-slide-in-right whitespace-nowrap" style={{ animationDelay: '0.5s' }}>
              {settings?.top_banner_event_date || "1st March"}
            </span>
          </div>

          {/* Right side - Rotating texts, discount and shop now */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:block rotating-text-container animate-zoom-in-out" style={{ animationDelay: '0.7s' }}>
              {rotatingTexts.map((text: string, index: number) => (
                <div
                  key={index}
                  className={`rotating-text ${index === currentText ? 'active' : ''}`}
                >
                  {text}
                </div>
              ))}
            </div>

            <div className="bg-[#4caf50] text-white font-bold px-2 py-0.5 rounded-full animate-fade-in text-[10px] whitespace-nowrap" style={{ animationDelay: '0.9s' }}>
              {settings?.top_banner_discount_text || "GET 60% OFF"}
            </div>

            <div className="hidden md:flex items-center gap-1 animate-zoom-in-out" style={{ animationDelay: '1.1s' }}>
              <span className="text-sm font-bold">SHOP NOW</span>
            </div>

            <Button
              variant="ghost"
              onClick={() => setIsVisible(false)}
              className="hover:bg-transparent text-white hover:text-[#4caf50] transition-colors animate-fade-in p-1 h-auto w-auto"
              style={{ animationDelay: '1.3s' }}
              type="button"
              aria-label="close banner"
            >
              <CloseIcon />
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Animations */
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-left { animation: slide-in-left 0.8s ease-out forwards; }

        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.8s ease-out forwards; }

        @keyframes fall-from-top {
          0% { opacity: 0; transform: translateY(-100px) rotate(-5deg); }
          60% { transform: translateY(10px) rotate(2deg); }
          80% { transform: translateY(-5px) rotate(-1deg); }
          100% { opacity: 1; transform: translateY(0) rotate(0); }
        }
        .animate-fall-from-top { animation: fall-from-top 1s ease-out forwards; }

        @keyframes zoom-in-out {
          0% { opacity: 0; transform: scale(0.5); }
          50% { transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-zoom-in-out { animation: zoom-in-out 1s ease-out forwards; }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }

        /* Rotating text */
        .rotating-text-container {
          position: relative;
          height: 16px;
          width: 70px;
          overflow: hidden;
        }
        .rotating-text {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 10px;
          opacity: 0;
          transform: translateY(100%);
          transition: all 0.5s ease-in-out;
          white-space: nowrap;
        }
        .rotating-text.active {
          opacity: 1;
          transform: translateY(0);
        }
        .rotating-text:not(.active) {
          opacity: 0;
          transform: translateY(-100%);
        }

        /* Mobile tweaks */
        @media (max-width: 768px) {
          .container > div {
            gap: 2px !important;
          }
          .container span,
          .container div {
            font-size: 10px !important;
            padding: 1px 3px !important;
          }
        }
      `}</style>
    </div>
  );
};

// Icon components
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default TopBanner;
