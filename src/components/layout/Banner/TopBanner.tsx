'use client';
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";

const TopBanner = () => {
  const [currentText, setCurrentText] = useState(0);
  
  const rotatingTexts = [
    "Great Price",
    "Great Quality",
    "Live Now"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [rotatingTexts.length]);

  return (
    <div className="w-full bg-gradient-to-r from-[#4caf50] from-0% to-[30%] to-black to-70% text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left side - Contact info that slides in first */}
          <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-0 animate-slide-in-left">
            <div className="flex items-center gap-2 bg-[#4caf50] text-white px-3 py-1 rounded-full">
              <PhoneIcon />
              <span className="text-xs">Call For Deals</span>
              <span className="font-mono text-sm">0200 804 020</span>
            </div>
          </div>
          
          {/* Center - Brand, Bonanza and date with animations */}
          <div className="flex items-center gap-4 mb-2 md:mb-0">
            {/* Brand and Bonanza with falling animation */}
            <div className="flex items-center gap-2 animate-fall-from-top" style={{animationDelay: '0.3s'}}>
              <span className="text-xs md:text-sm font-bold bg-white text-[#4caf50] px-2 py-1 rounded">
                BRAND
              </span>
              <span className="text-lg md:text-xl font-extrabold text-white">
                BONANZA
              </span>
            </div>
            
            {/* Date with slide in animation */}
            <span className="text-xs md:text-sm font-semibold animate-slide-in-right" style={{animationDelay: '0.5s'}}>
              1st - 14th September
            </span>
          </div>
          
          {/* Right side - Rotating texts, 60% off button and show now */}
          <div className="flex items-center gap-4">
            {/* Rotating texts with zoom effect */}
            <div className="rotating-text-container animate-zoom-in-out" style={{animationDelay: '0.7s'}}>
              {rotatingTexts.map((text, index) => (
                <div 
                  key={index}
                  className={`rotating-text ${index === currentText ? 'active' : ''}`}
                >
                  {text}
                </div>
              ))}
            </div>
            
            {/* 60% off button - doesn't zoom */}
            <div className="bg-[#4caf50] text-white font-bold px-3 py-1 rounded-full animate-fade-in" style={{animationDelay: '0.9s'}}>
              GET 60% OFF
            </div>
            
            {/* Show now with zoom effect */}
            <div className="hidden md:flex items-center gap-1 animate-zoom-in-out" style={{animationDelay: '1.1s'}}>
              <span className="text-sm font-bold">SHOW NOW</span>
            </div>
            
            <Button
              variant="ghost"
              className="hover:bg-transparent text-white hover:text-[#4caf50] transition-colors animate-fade-in"
              style={{animationDelay: '1.3s'}}
              size="icon"
              type="button"
              aria-label="close banner"
            >
              <CloseIcon />
            </Button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        /* Contact info sliding in from left */
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }
        
        /* Date sliding in from right */
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }
        
        /* Brand and date falling from top */
        @keyframes fall-from-top {
          0% {
            opacity: 0;
            transform: translateY(-100px) rotate(-5deg);
          }
          60% {
            transform: translateY(10px) rotate(2deg);
          }
          80% {
            transform: translateY(-5px) rotate(-1deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotate(0);
          }
        }
        
        .animate-fall-from-top {
          animation: fall-from-top 1s ease-out forwards;
        }
        
        /* Zoom in and out animation */
        @keyframes zoom-in-out {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-zoom-in-out {
          animation: zoom-in-out 1s ease-out forwards;
        }
        
        /* Fade in animation */
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        /* Rotating text animation */
        .rotating-text-container {
          position: relative;
          height: 24px;
          width: 120px;
          overflow: hidden;
        }
        
        .rotating-text {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          opacity: 0;
          transform: translateY(100%);
          transition: all 0.5s ease-in-out;
        }
        
        .rotating-text.active {
          opacity: 1;
          transform: translateY(0);
        }
        
        .rotating-text:not(.active) {
          opacity: 0;
          transform: translateY(-100%);
        }
        
        @media (max-width: 768px) {
          .bg-gradient-to-r.to-\\[30\\%\\] {
            background: linear-gradient(180deg, #4caf50 0%, #4caf50 25%, #000000 25%, #000000 100%) !important;
          }
          
          .rotating-text-container {
            width: 100px;
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