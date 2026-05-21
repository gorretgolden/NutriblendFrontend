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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-md md:p-8" onClick={(e) => e.stopPropagation()}>
        {/* Close (X) button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Back link */}
        <div className="mb-6 text-left">
          <button
            onClick={onSwitchToLogin}
            className="font-medium text-[#4caf50] hover:text-[#43a047]"
          >
            &larr; Back to Login
          </button>
        </div>

        {/* Title + Description */}
        <div className="mb-4 text-left">
          <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
            Reset Password
          </h1>
          <p className="mt-2 text-sm leading-snug text-gray-600">
            {success 
              ? "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder." 
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        {!success ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email Address"
                className={`w-full rounded border p-3 text-base outline-none focus:border-[#4caf50] disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                required
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded bg-[#4caf50] p-3 text-base font-bold text-white transition-colors duration-300 hover:bg-[#43a047] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <button
            onClick={onClose}
            className="w-full rounded bg-gray-100 p-3 text-base font-bold text-gray-800 transition-colors duration-300 hover:bg-gray-200"
          >
            Close
          </button>
        )}

      </div>
    </div>
  );
};

export default ForgotPasswordModal;
