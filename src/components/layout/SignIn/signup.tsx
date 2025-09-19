"use client";
import { useEffect, useState } from "react";

type SignUpModalProps = {
  visible: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onProfileOpen: () => void;
};

const SignUpModal = ({ visible, onClose, onSwitchToLogin, onProfileOpen }: SignUpModalProps) => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    newsletter: true,
    terms: false
  });

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [visible]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.terms) {
      alert("Please agree to the Terms and Conditions");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    // Simulate account creation
    console.log("Account created:", formData);
    
    // Show success toast
    setShowSuccessToast(true);
  };

  const handleViewProfile = () => {
    setShowSuccessToast(false);
    onClose();
    onProfileOpen();
  };

  const handleDismissToast = () => {
    setShowSuccessToast(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
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
              Create your account
            </h1>
            <p className="mt-2 text-sm leading-snug text-gray-600">
              Join iHerb to enjoy personalized recommendations, faster checkout, and order tracking.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full rounded border border-gray-300 p-3 text-base outline-none focus:border-[#4caf50]"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full rounded border border-gray-300 p-3 text-base outline-none focus:border-[#4caf50]"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full rounded border border-gray-300 p-3 text-base outline-none focus:border-[#4caf50]"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full rounded border border-gray-300 p-3 text-base outline-none focus:border-[#4caf50]"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={8}
              />
            </div>
            
            <div className="mb-4">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full rounded border border-gray-300 p-3 text-base outline-none focus:border-[#4caf50]"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                className="h-4 w-4 accent-[#4caf50] mr-2"
                checked={formData.newsletter}
                onChange={handleInputChange}
              />
              <label htmlFor="newsletter" className="text-sm text-gray-600">
                Send me special offers and wellness tips
              </label>
            </div>
            
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                className="h-4 w-4 accent-[#4caf50] mr-2"
                checked={formData.terms}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the <a href="#" className="text-[#4caf50]">Terms and Conditions</a> and <a href="#" className="text-[#4caf50]">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded bg-[#4caf50] p-3 text-base font-bold text-white transition-colors duration-300 hover:bg-[#43a047]"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 flex items-center text-gray-400">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-2 text-sm">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Google Sign Up */}
          <button className="flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-white p-3 text-base font-medium text-gray-600 transition-colors duration-300 hover:bg-gray-50">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_and_wordmark_of_Google_G_Suite_in_2020.png"
              alt="Google icon"
              className="h-5 w-5"
            />
            Sign Up with Google
          </button>

          {/* Login link for users with account */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="font-medium text-[#4caf50] hover:text-[#43a047] underline"
              >
                Sign in
              </button>
            </p>
          </div>

          {/* Footer text */}
          <p className="mt-10 text-center text-xs leading-snug text-gray-400 md:mt-1">
            © Copyright 1997-2025 iHerb, LLC. All rights reserved. 
          </p>
        </div>
      </div>

      {/* Success Toast Notification - Centered */}
      {showSuccessToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4 animate-fade-in-up">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Account Created Successfully!</h3>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Your account has been created. You can now access your profile and start shopping.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={handleDismissToast}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleViewProfile}
                className="px-4 py-2 bg-[#4caf50] text-white rounded-md hover:bg-[#43a047] transition-colors"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default SignUpModal;