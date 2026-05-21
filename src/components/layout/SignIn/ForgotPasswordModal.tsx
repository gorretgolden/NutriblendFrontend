"use client";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";

type ForgotPasswordModalProps = {
  visible: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
};

const ForgotPasswordModal = ({ visible, onClose, onSwitchToLogin }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      // Reset state when opened
      setSuccess(false);
      setError(null);
      setEmail("");
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/password/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }

      setSuccess(true);
      toast.success("Password reset link sent to your email");
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]" />

      <div 
        className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.2)] overflow-hidden animate-[scaleIn_250ms_ease-out] z-10" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close (X) button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors duration-150"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 md:p-10 flex flex-col items-center text-center">
          
          {/* Back link */}
          <div className="w-full text-left mb-6">
            <button
              onClick={onSwitchToLogin}
              className="group inline-flex items-center gap-1.5 font-bold text-[#009E3C] hover:text-[#00752C] transition-colors text-sm"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </button>
          </div>

          {/* Illustration */}
          <div className="mb-6 relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#009E3C]/10 to-[#00bc49]/10 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full bg-[#009E3C]/10 animate-ping opacity-30" />
              <svg className="w-12 h-12 text-[#009E3C] z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {/* Little sparkle/key detail */}
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm z-20">
                <div className="bg-[#009E3C] rounded-full p-1.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Title + Description */}
          <div className="mb-8 w-full">
            <h1 className="text-[26px] font-extrabold text-gray-900 tracking-tight mb-3">
              Reset Password
            </h1>
            <p className="text-[15px] text-gray-500 font-medium leading-relaxed">
              {success 
                ? "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder." 
                : "Enter your email address and we'll send you a link to securely reset your password."}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 w-full rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 flex items-start gap-2.5 text-left">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          {!success ? (
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-6 text-left">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full rounded-xl border-2 px-4 py-3.5 text-[15px] font-medium outline-none transition-all duration-200 focus:bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed ${error ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-gray-200 bg-gray-50 focus:border-[#009E3C] focus:shadow-[0_0_0_4px_rgba(0,158,60,0.1)] hover:border-gray-300'}`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#009E3C] py-4 px-6 text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#008733] shadow-[0_4px_12px_rgba(0,158,60,0.25)] hover:shadow-[0_6px_18px_rgba(0,158,60,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Link...
                  </>
                ) : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-gray-100 py-4 px-6 text-[15px] font-bold text-gray-800 transition-colors duration-200 hover:bg-gray-200"
            >
              Close
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
