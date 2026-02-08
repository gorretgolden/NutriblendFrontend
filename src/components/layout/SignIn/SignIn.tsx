"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { loginUser } from "@/lib/features/auth/authSlice";

type LoginModalProps = {
  visible: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
};

const LoginModal = ({ visible, onClose, onSwitchToSignUp }: LoginModalProps) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [visible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-md md:p-8">
        {/* Close (X) button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Cancel link */}
        <div className="mb-6 text-left">
          <button
            onClick={onClose}
            className="font-medium text-[#4caf50] hover:text-[#43a047]"
          >
            Cancel
          </button>
        </div>

        {/* Title + Description */}
        <div className="mb-4 text-left">
          <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
            Sign in or create account
          </h1>
          <p className="mt-2 text-sm leading-snug text-gray-600">
            Enter your email to sign in. If you're new, we'll help you create a NutriBlend Haven account in seconds.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Email"
              className="w-full rounded border border-gray-300 p-3 text-base outline-none focus:border-[#4caf50]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded border border-gray-300 p-3 text-base outline-none focus:border-[#4caf50]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-[#4caf50] p-3 text-base font-bold text-white transition-colors duration-300 hover:bg-[#43a047] disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-xs text-gray-500 uppercase">Or</span>
          <hr className="w-full border-gray-300" />
        </div>

        <button
          onClick={() => {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            // Extract the domain part of the API URL to redirect to /api/v1/social/google/redirect or similar
            // Usually the backend route for social login redirect
            window.location.href = `${baseUrl}/auth/google/redirect`;
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-white p-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Sign up link for users without account */}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToSignUp}
              className="font-medium text-[#4caf50] hover:text-[#43a047] underline"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Need Help */}
        <div className="mt-4 text-sm">
          <a
            href="#"
            className="font-medium text-[#4caf50] hover:text-[#43a047]"
          >
            Need help?
          </a>
        </div>

        {/* Keep signed in */}
        <div className="mt-6 flex items-center justify-start gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            id="keep-signed-in"
            className="h-4 w-4 accent-[#4caf50]"
            defaultChecked
          />
          <label htmlFor="keep-signed-in">Keep me signed in</label>
          <span className="text-gray-400">ⓘ</span>
        </div>


        {/* Terms */}
        <p className="mt-6 text-left text-xs leading-snug text-gray-400">
          By continuing, you've read and agree to our{" "}
          <a
            href="#"
            className="text-[#4caf50] hover:text-[#43a047]"
          >
            Terms and Conditions
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-[#4caf50] hover:text-[#43a047]"
          >
            Privacy Policy
          </a>
          .
        </p>

        {/* Footer text */}
        <p className="mt-10 text-center text-xs leading-snug text-gray-400 md:mt-1">
          © {new Date().getFullYear()} NutriBlend Haven. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginModal;