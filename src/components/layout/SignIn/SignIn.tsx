"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { loginUser, clearError } from "@/lib/features/auth/authSlice";
import { clearCartLocal, fetchCart } from "@/lib/features/carts/cartsSlice";
import { clearWishlist, fetchWishlist } from "@/lib/features/wishlist/wishlistSlice";
import { toast } from "sonner";

type LoginModalProps = {
  visible: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onSwitchToForgot?: () => void;
};

const LoginModal = ({ visible, onClose, onSwitchToSignUp, onSwitchToForgot }: LoginModalProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("rememberedEmail") || "";
    }
    return "";
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      if (error) dispatch(clearError());
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (error) dispatch(clearError());
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (error) dispatch(clearError());
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const isFormValid = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    if (!password || password.length < 6) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Real-time field validation
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const resultAction = await dispatch(loginUser({ email, password }));
    setIsSubmitting(false);
    
    if (loginUser.fulfilled.match(resultAction)) {
      const rememberMe = (document.getElementById("keep-signed-in") as HTMLInputElement)?.checked;
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      // Clear stale data from previous session
      dispatch(clearCartLocal());
      dispatch(clearWishlist());
      // Fetch this user's cart and wishlist from backend
      dispatch(fetchCart());
      dispatch(fetchWishlist());
      toast.success("You have successfully logged into your account");
      onClose();
      // Check for returnUrl (e.g., from checkout redirect)
      const returnUrl = sessionStorage.getItem("returnUrl");
      if (returnUrl) {
        sessionStorage.removeItem("returnUrl");
        router.push(returnUrl);
      }
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6" onClick={onClose}>
      <div className="relative w-full max-w-md max-h-[95vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-8" onClick={(e) => e.stopPropagation()}>
        {/* Header: Cancel (left) and Close (right) */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="font-bold text-[#4caf50] hover:text-[#43a047] text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-800 transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
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
              className={`w-full rounded border p-3 text-base outline-none focus:border-[#4caf50] disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors ${fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              value={email}
              onChange={handleEmailChange}
              required
              disabled={isSubmitting}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`w-full rounded border p-3 pr-11 text-base outline-none focus:border-[#4caf50] disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors ${fieldErrors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                value={password}
                onChange={handlePasswordChange}
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4caf50] transition-colors"
                disabled={isSubmitting}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.957 9.957 0 012.293-3.95m2.071-1.957A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.132 5.411M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid()}
            className="w-full rounded bg-[#4caf50] p-3 text-base font-bold text-white transition-colors duration-300 hover:bg-[#43a047] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Continue"}
          </button>
        </form>

        {/* Need Help / Forgot Password */}
        <div className="mt-4 text-sm text-right">
          <button
            type="button"
            onClick={onSwitchToForgot}
            className="font-medium text-[#4caf50] hover:text-[#43a047]"
          >
            Forgot password?
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-xs text-gray-500 uppercase">Or</span>
          <hr className="w-full border-gray-300" />
        </div>

          <button
            onClick={() => {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
              // Strip /api/v1 suffix since Google OAuth uses web routes
              const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, '');
              window.location.href = `${baseUrl}/auth/google/redirect`;
            }}
            disabled={isSubmitting}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-white p-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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