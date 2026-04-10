"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

// Keyword-based response map for NutriBlend products
const responseMap: Record<string, string> = {
    vitamin: "We have a great range of vitamins! Check out our High-Potency Multivitamins, Vitamin C Immune Boosters, and Vitamin D3 supplements in the 'Vitamins & Supplements' category.",
    protein: "Looking for protein? We offer Whey Protein Isolate, Plant-Based Protein Powders, and Protein Bars. Visit our 'Protein & Fitness' section for all options.",
    weight: "For weight management, we recommend our Meal Replacement Shakes, Green Tea Extract, and Metabolism Boosters. Browse our 'Weight Management' category.",
    immune: "Boost your immunity with our Vitamin C, Zinc, Elderberry, and Echinacea supplements. Check our 'Immune Support' collection.",
    skin: "For healthy skin, try our Collagen Peptides, Biotin supplements, and Omega-3 Fish Oil. Find them in 'Beauty & Wellness'.",
    sleep: "Having trouble sleeping? Our Melatonin, Magnesium, and Chamomile supplements can help. Look in the 'Sleep & Relaxation' section.",
    energy: "Need an energy boost? Try our B-Complex Vitamins, Iron supplements, or CoQ10. Available in 'Energy & Vitality'.",
    digest: "For digestive health, we recommend Probiotics, Digestive Enzymes, and Fiber supplements. Check 'Gut Health' in our store.",
    omega: "Our Omega-3 Fish Oil and Flaxseed Oil capsules are popular choices for heart and brain health. Find them in 'Heart Health'.",
    joint: "For joint support, try our Glucosamine, Chondroitin, and Turmeric Curcumin supplements in the 'Joint & Bone Health' category.",
    order: "You can track your order from your Account Dashboard under 'My Orders'. If you need help with a specific order, please contact us at support@nutriblend.com.",
    deliver: "We deliver across Uganda! Delivery fees depend on your region and district. You can see the fee at checkout after selecting your delivery location.",
    price: "Our prices are competitive and we offer wholesale pricing for bulk orders. Check individual product pages for current prices, or register as a wholesale customer for special rates.",
    wholesale: "Interested in wholesale? Register as a wholesale customer through our 'Wholesale Registration' page. You'll get access to bulk pricing after approval.",
    return: "We accept returns within 14 days of delivery for unopened products. Please contact support@nutriblend.com to initiate a return.",
    pay: "We accept Mobile Money (MTN & Airtel), Visa/Mastercard, and Cash on Delivery. Choose your preferred method at checkout.",
    hello: "Hello! Welcome to NutriBlend Haven. I can help you find vitamins, supplements, protein products, or answer questions about orders and delivery. What are you looking for?",
    hi: "Hi there! How can I help you today? I can assist with product recommendations, order questions, or general wellness advice.",
    help: "I can help you with:\n• Finding specific supplements or vitamins\n• Product recommendations for your health goals\n• Order and delivery questions\n• Wholesale registration info\n\nJust ask me anything!",
    thank: "You're welcome! Is there anything else I can help you with?",
};

function getAIResponse(userMessage: string): string {
    const lower = userMessage.toLowerCase();

    for (const [keyword, response] of Object.entries(responseMap)) {
        if (lower.includes(keyword)) {
            return response;
        }
    }

    return "Thanks for your question! While I may not have a specific answer for that, I'd recommend browsing our product categories or contacting our support team at support@nutriblend.com for personalized help. You can also check our 'Best Sellers' for popular choices!";
}

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hello! I'm your NutriBlend Wellness Guide. Ask me about vitamins, supplements, protein, orders, or delivery — I'm here to help!" }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput("");

        // Generate contextual response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: getAIResponse(userMsg),
            }]);
        }, 600);
    };

    return (
        <>
            {/* Floating Button - shows X when open, robot when closed */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                onTouchEnd={(e) => {
                    e.preventDefault();
                    setIsOpen(prev => !prev);
                }}
                className="fixed bottom-8 left-8 w-16 h-16 bg-premium-gradient text-white rounded-2xl shadow-2xl flex items-center justify-center z-[100] transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-[#009E3C]/20 hover:shadow-[#009E3C]/40 cursor-pointer"
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                <div className="relative">
                    {isOpen ? (
                        <FaTimes size={26} />
                    ) : (
                        <>
                            <FaRobot size={28} />
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                            </span>
                        </>
                    )}
                </div>
            </button>

            {/* Backdrop Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[99] bg-black/20 cursor-pointer"
                    onClick={handleClose}
                    onTouchEnd={(e) => {
                        e.preventDefault();
                        handleClose();
                    }}
                />
            )}

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
                        <button
                            onClick={handleClose}
                            onTouchEnd={(e) => { e.preventDefault(); handleClose(); }}
                            className="hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
                            aria-label="Close chat"
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-line ${msg.role === 'user'
                                    ? 'bg-[#009E3C] text-white rounded-tr-none shadow-md'
                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
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
