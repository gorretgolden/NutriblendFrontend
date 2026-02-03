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
            window.location.href = `${baseUrl}/api/v1/auth/google/redirect`;
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-white p-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Image src="/images/google-icon.png" alt="Google" width={20} height={20} />
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
          © 2025 NutriBlend Haven. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginModal;