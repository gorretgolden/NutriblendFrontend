"use client";

import React, { useState } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hello! I'm your NutriBlend Wellness Guide. How can I help you reach your health goals today?" }
    ]);
    const [input, setInput] = useState("");

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages([...messages, { role: 'user', content: input }]);
        setInput("");

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "That's a great question! For wellness goals like yours, I'd recommend looking at our 'Best Sellers' section or checking out our High-Potency Multivitamins. Would you like me to show you some options?"
            }]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 left-8 w-16 h-16 bg-premium-gradient text-white rounded-2xl shadow-2xl flex items-center justify-center z-[100] transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-[#009E3C]/20 hover:shadow-[#009E3C]/40"
            >
                <div className="relative">
                    <FaRobot size={28} />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                    </span>
                </div>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 left-6 w-80 md:w-96 glass-effect rounded-2xl shadow-2xl z-[100] overflow-hidden flex flex-col border border-white/40 animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-premium-gradient p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                                <FaRobot size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Wellness Guide</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-blink"></span>
                                    <span className="text-[10px] opacity-90 uppercase tracking-widest font-semibold text-white/80">Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                            <FaTimes size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-[#009E3C] text-white rounded-tr-none shadow-md'
                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            placeholder="Ask about vitamins, protein..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#009E3C]/30 outline-none transition-all"
                        />
                        <button type="submit" className="w-10 h-10 bg-[#009E3C] text-white rounded-xl flex items-center justify-center hover:bg-[#007a2e] transition-colors shadow-sm">
                            <FaPaperPlane size={14} />
                        </button>
                    </form>
                </div>
            )}

            <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-blink {
          animation: blink 1.5s infinite;
        }
      `}</style>
        </>
    );
};

export default AIAssistant;
