'use client';

import { useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";

const NewsLetterSection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);

    try {
      const response = await apiClient.subscribeToNewsletter(email);
      if (response.status) {
        setIsSubscribed(true);
        toast.success(response.message || "Welcome aboard! You've been subscribed successfully.");
      } else {
        toast.error(response.message || "Failed to subscribe.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Rich layered gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b3d2e] via-[#145740] to-[#0d4434]" />

      {/* Decorative mesh gradient blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#009E3C]/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-[#009E3C]/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }} />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-10 lg:gap-20">

          {/* Left side: content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm px-4 py-1.5 rounded-full mb-6 border border-white/[0.08]">
              <span className="w-1.5 h-1.5 bg-[#00bc49] rounded-full animate-pulse" />
              <span className="text-[#009E3C]/90 text-[11px] font-semibold tracking-[0.15em] uppercase">Newsletter</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-white mb-4 tracking-tight leading-[1.15]">
              Stay in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009E3C] to-[#00bc49]">Loop</span>
            </h2>
            <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
              Get exclusive deals, new product announcements, and health tips delivered right to your inbox.
            </p>
          </div>

          {/* Right side: form card */}
          <div className="w-full max-w-md">
            <div className="bg-white/[0.06] backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/[0.08]">
              {isSubscribed && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/40 animate-in fade-in duration-300">
                  <div className="bg-white rounded-[2rem] p-8 md:p-12 max-w-lg w-full text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500 delay-100">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#009E3C]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#009E3C]/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-[#009E3C]/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <svg className="w-10 h-10 text-[#009E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      
                      <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Welcome to the Tribe!</h3>
                      <p className="text-gray-500 text-base leading-relaxed mb-8">
                        We&apos;re thrilled to have you! You&apos;ve successfully subscribed with <span className="font-bold text-[#009E3C]">{email}</span>. 
                        Check your inbox shortly for exclusive wellness tips and your first deal.
                      </p>

                      <button
                        onClick={() => setIsSubscribed(false)}
                        className="w-full bg-[#009E3C] hover:bg-[#007a2e] text-white font-black py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg shadow-[#009E3C]/20 hover:shadow-xl active:scale-95 text-sm uppercase tracking-widest"
                      >
                        Great, Thank You!
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!isSubscribed && (
                /* 📝 Form state */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      disabled={isLoading}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.07] border border-white/[0.1] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#009E3C]/25 focus:border-[#009E3C]/40 focus:bg-white/[0.1] transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#009E3C] to-[#007a2e] hover:from-[#00bc49] hover:to-[#009E3C] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-[#009E3C]/30 hover:shadow-xl hover:shadow-[#009E3C]/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] text-sm flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        Subscribe Now
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
              {!isSubscribed && (
                <p className="text-white/20 text-[11px] mt-4 text-center">
                  No spam, ever. Unsubscribe anytime.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetterSection;
