"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { registerUser, clearError } from "@/lib/features/auth/authSlice";
import { apiClient, Region, Town } from "@/lib/api/client";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { toast } from "sonner";

type SignUpModalProps = {
  visible: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onProfileOpen: () => void;
};

const SignUpModal = ({
  visible,
  onClose,
  onSwitchToLogin,
  onProfileOpen,
}: SignUpModalProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    newsletter: true,
    terms: false,
    region_id: "",
    town_id: "",
    location: "",
  });

  // Backend-driven regions & towns
  const [regions, setRegions] = useState<Region[]>([]);
  const [towns, setTowns] = useState<Town[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingTowns, setLoadingTowns] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});

  // Fetch regions from backend on mount
  useEffect(() => {
    async function fetchRegions() {
      try {
        setLoadingRegions(true);
        const response = await apiClient.getRegions();
        if (response.status && response.data) {
          setRegions(response.data);
        }
      } catch (err) {
        console.error("Error fetching regions:", err);
      } finally {
        setLoadingRegions(false);
      }
    }
    fetchRegions();
  }, []);

  // Fetch towns when region changes
  useEffect(() => {
    if (!formData.region_id) {
      setTowns([]);
      return;
    }

    async function fetchTowns() {
      try {
        setLoadingTowns(true);
        const response = await apiClient.getTowns(Number(formData.region_id));
        if (response.status && response.data) {
          setTowns(response.data);
        }
      } catch (err) {
        console.error("Error fetching towns:", err);
      } finally {
        setLoadingTowns(false);
      }
    }
    fetchTowns();
  }, [formData.region_id]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      if (error) dispatch(clearError());
    } else {
      document.body.style.overflow = "";
    }
    // Always restore scroll on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  // Auto-dismiss success toast after 3 seconds
  useEffect(() => {
    if (!showSuccessToast) return;
    const timer = setTimeout(() => {
      setShowSuccessToast(false);
      document.body.style.overflow = "";
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [showSuccessToast, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [target.name]: target.checked,
      }));
    } else {
      let val = target.value;
      if (target.name === "phone") {
        val = val.replace(/\D/g, ""); // Remove non-digits
        if (val.startsWith("0")) {
          val = val.substring(1); // Remove leading zero
        }
        val = val.substring(0, 9); // Enforce max 9 digits
      } else if (target.name === "firstName" || target.name === "lastName") {
        // Auto-capitalize names
        val = val.replace(/\b\w+/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      } else if (target.name === "email") {
        // Auto-lowercase email
        val = val.toLowerCase();
      }
      setFormData((prev) => ({
        ...prev,
        [target.name]: val,
      }));
    }

    // Clear error for this field as user types
    if (fieldErrors[target.name]) {
      setFieldErrors((prev) => ({ ...prev, [target.name]: undefined }));
    }
    // Clear Redux auth error
    if (error) dispatch(clearError());
  };

  const handleSelectChange = (name: "region_id" | "town_id", value: string) => {
    if (name === "region_id") {
      setFormData((prev) => ({
        ...prev,
        region_id: value,
        town_id: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear error for this field
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const isFormValid = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password || !formData.confirmPassword || !formData.region_id || !formData.town_id || !formData.location.trim() || !formData.terms) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return false;
    if (formData.phone.length < 9) return false;
    if (formData.password.length < 8) return false;
    if (formData.password !== formData.confirmPassword) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.terms) {
      toast.error("Please agree to the Terms and Conditions");
      return;
    }

    // Field-level validation
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Enter a valid email";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 8) errors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
    if (!formData.region_id) errors.region_id = "Please select a region";
    if (!formData.town_id) errors.town_id = "Please select a district";
    if (!formData.location.trim()) errors.location = "Location is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error("Please fix the errors before submitting");
      return;
    }

    // Prepare data for API
    const apiData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: `+256${formData.phone}`,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      region_id: formData.region_id ? Number(formData.region_id) : undefined,
      town_id: formData.town_id ? Number(formData.town_id) : undefined,
      location: formData.location || undefined,
    };

    const resultAction = await dispatch(registerUser(apiData));
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success("Account created successfully!");
      setShowSuccessToast(true);
    } else if (registerUser.rejected.match(resultAction)) {
      toast.error(resultAction.payload as string || "Failed to create account. Please try again.");
    }
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 px-2 py-6">
        <div className="relative w-full max-w-xl rounded-xl bg-white p-6 sm:p-8 shadow-2xl mt-4 sm:mt-10">
          {/* Logo + Close */}
          <div className="flex justify-center mb-4 relative">
            <img
              src="/images/logo.png"
              alt="App Logo"
              className="h-16 md:h-20 border-2 border-[#4caf50] rounded-full p-2 shadow-sm"
            />
            <button
              onClick={onClose}
              className="absolute right-2 top-2 text-gray-800 hover:text-[#4caf50] text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="mb-5 text-center">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below or{" "}
              <Link
                href="/wholesale-registration"
                onClick={onClose}
                className="text-[#4caf50] font-semibold hover:underline"
              >
                register as a wholesale customer
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Personal Info */}
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-1 mt-2 border-b pb-1">
                Personal Information
              </h2>
            </div>

            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className={`w-full rounded border p-3 text-base outline-none focus:border-[#4caf50] disabled:bg-gray-100 transition-colors ${fieldErrors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                value={formData.firstName}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              {fieldErrors.firstName && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.firstName}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className={`w-full rounded border p-3 text-base outline-none focus:border-[#4caf50] disabled:bg-gray-100 transition-colors ${fieldErrors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                value={formData.lastName}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              {fieldErrors.lastName && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.lastName}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className={`w-full rounded border p-3 text-base outline-none focus:border-[#4caf50] disabled:bg-gray-100 transition-colors ${fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <div className="flex w-full">
                <span className={`inline-flex items-center rounded-l border border-r-0 px-3 text-sm text-gray-500 bg-gray-50 ${fieldErrors.phone ? 'border-red-400' : 'border-gray-300'}`}>
                  +256
                </span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="751557654"
                  className={`w-full rounded-r border p-3 text-base outline-none focus:border-[#4caf50] disabled:bg-gray-100 transition-colors ${fieldErrors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  maxLength={9}
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.phone && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Delivery Info */}
            <div className="col-span-1 md:col-span-2 mt-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-1 border-b pb-1">
                Delivery Information
              </h2>
            </div>

            <div>
              <SearchableSelect
                value={formData.region_id}
                onChange={(value) => handleSelectChange("region_id", value)}
                options={regions.map((region) => ({ value: String(region.id), label: region.name }))}
                placeholder={loadingRegions ? "Loading regions..." : "Select Region"}
                disabled={isLoading || loadingRegions}
                isLoading={loadingRegions}
                className="w-full rounded border border-gray-300 p-3 text-base outline-none focus:border-[#4caf50] disabled:bg-gray-100 text-left"
              />
            </div>

            <div>
              <SearchableSelect
                value={formData.town_id}
                onChange={(value) => handleSelectChange("town_id", value)}
                options={towns.map((town) => ({ value: String(town.id), label: town.name }))}
                placeholder={
                  loadingTowns
                    ? "Loading districts..."
                    : formData.region_id
                      ? "Select District"
                      : "Select Region first"
                }
                disabled={!formData.region_id || isLoading || loadingTowns}
                isLoading={loadingTowns}
                className="w-full rounded border border-gray-300 p-3 text-base outline-none focus:border-[#4caf50] disabled:bg-gray-100 text-left"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <input
                type="text"
                name="location"
                placeholder="Specific Location"
                className={`w-full rounded border p-3 text-base outline-none focus:border-[#4caf50] disabled:bg-gray-100 transition-colors ${fieldErrors.location ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                value={formData.location}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              {fieldErrors.location && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.location}</p>
              )}
            </div>

            {/* Security */}
            <div className="col-span-1 md:col-span-2 mt-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-1 border-b pb-1">
                Account Security
              </h2>
            </div>

            {/* Password Fields on the same line */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full rounded border border-gray-300 p-3 text-base outline-none focus:border-[#4caf50] pr-10 disabled:bg-gray-100"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={8}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#4caf50]"
                  disabled={isLoading}
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

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full rounded border border-gray-300 p-3 text-base outline-none focus:border-[#4caf50] pr-10 disabled:bg-gray-100"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#4caf50]"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
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
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="col-span-1 md:col-span-2 text-xs text-red-500 -mt-2">Passwords do not match</p>
              )}
            </div>

            {/* Checkboxes */}
            <div className="col-span-1 md:col-span-2 mt-2">

              <label className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  className="h-5 w-5 mr-2 appearance-none border border-gray-400 rounded-sm checked:bg-[#4caf50] checked:border-[#4caf50] checked:before:content-['✔'] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-[#4caf50]">Terms</a>{" "}
                  &{" "}
                  <a href="#" className="text-[#4caf50]">Privacy</a>
                </span>
              </label>
            </div>

            {/* Submit */}
            <div className="col-span-1 md:col-span-2 mt-2">
              <button
                type="submit"
                disabled={isLoading || !isFormValid()}
                className="w-full rounded bg-[#4caf50] p-3 text-base font-bold text-white transition-colors duration-300 hover:bg-[#43a047] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>

            <div className="col-span-1 md:col-span-2 flex items-center justify-between mt-2">
              <hr className="w-full border-gray-300" />
              <span className="px-2 text-xs text-gray-500 uppercase">Or</span>
              <hr className="w-full border-gray-300" />
            </div>

            <div className="col-span-1 md:col-span-2">
              <button
                type="button"
                onClick={() => {
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                  const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, '');
                  window.location.href = `${baseUrl}/auth/google/redirect`;
                }}
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-white p-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Switch to Login */}
            <div className="col-span-1 md:col-span-2 text-center mt-2">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-[#4caf50] font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {showSuccessToast && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => {
            setShowSuccessToast(false);
            onClose();
          }}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Account Created Successfully!
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Your account has been created. You can now access your profile and
              start shopping.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => {
                  setShowSuccessToast(false);
                  onClose();
                  router.push("/#");
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>

              <button
                onClick={() => {
                  setShowSuccessToast(false);
                  onClose();
                  router.push("/account");
                }}
                className="px-4 py-2 bg-[#265728] text-white rounded-md hover:bg-[#043a07] transition-colors"
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
