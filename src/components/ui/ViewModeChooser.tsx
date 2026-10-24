"use client";

import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import {
  setViewMode,
  markViewModeChosen,
  type ViewMode,
} from "@/lib/features/viewMode/viewModeSlice";
import { isStaffRole } from "@/lib/viewMode";

export default function ViewModeChooser() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { chosen } = useAppSelector((state) => state.viewMode);

  if (!isAuthenticated || !isStaffRole(user?.role) || chosen) return null;

  const choose = (mode: ViewMode) => {
    dispatch(setViewMode(mode));
    dispatch(markViewModeChosen());
  };

  const chooseLater = () => {
    dispatch(markViewModeChosen());
  };

  const firstName = (user?.name || "").trim().split(/\s+/)[0] || "there";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0B1F3A]/60 backdrop-blur-sm"
        onClick={chooseLater}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#0B1F3A]/5 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#0B1F3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Welcome back, {firstName}
          </h2>
          <p className="mt-1.5 text-sm text-gray-500">
            How would you like to view the shop?
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          <button
            onClick={() => choose("retail")}
            className="w-full flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-left hover:border-[#009E3C] hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 shrink-0 rounded-xl bg-[#009E3C]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#009E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9l1.5-5h15L21 9M3 9v10a1 1 0 001 1h16a1 1 0 001-1V9M3 9h18M9 20v-6h6v6" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Retail Prices</p>
              <p className="text-xs text-gray-500 mt-0.5">Shop as a regular customer</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-[#009E3C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => choose("wholesale")}
            className="w-full flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-left hover:border-[#0B1F3A] hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 shrink-0 rounded-xl bg-[#0B1F3A]/5 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#0B1F3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7.5h5m-2.5-3v6M9 9.5h4l3 6H9.5l-3-6zm0 0L6.5 12m2.5-2.5h5M19 14.5v4m2-2h-4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Wholesale Prices</p>
              <p className="text-xs text-gray-500 mt-0.5">See per-box bulk prices</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-[#0B1F3A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <button
          onClick={chooseLater}
          className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Choose later — you can switch anytime from the top of the site
        </button>
      </div>
    </div>
  );
}
