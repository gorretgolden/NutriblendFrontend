"use client";

import React from "react";

const ChatHelp = () => {
  return (
    <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm p-6 overflow-hidden relative group">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-gray-600 text-lg font-medium mb-4">Questions about this product?</h3>
        
        <button 
          onClick={() => window.open('https://wa.me/256700000000', '_blank')}
          className="flex items-center space-x-3 px-8 py-3 bg-white border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-all duration-300 transform group-hover:scale-105"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
          </svg>
          <span className="font-bold text-lg uppercase tracking-tight">Chat</span>
        </button>
      </div>
      
      {/* Decorative pulse effect */}
      <div className="absolute top-0 right-0 p-2">
        <span className="flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
        </span>
      </div>
    </div>
  );
};

export default ChatHelp;
