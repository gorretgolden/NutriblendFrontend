"use client";

import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import { setViewMode, type ViewMode } from "@/lib/features/viewMode/viewModeSlice";
import { isStaffRole } from "@/lib/viewMode";

export default function ViewModeSwitch() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const mode = useAppSelector((state) => state.viewMode.mode);

  if (!user || !isStaffRole(user.role)) return null;

  const select = (next: ViewMode) => dispatch(setViewMode(next));

  const segmentBase =
    "px-2.5 py-1.5 rounded-[10px] text-[11px] font-bold whitespace-nowrap transition-all duration-200";

  return (
    <div
      className="flex items-center rounded-xl border border-gray-200 bg-gray-50/80 p-0.5"
      title="View shop at retail or wholesale prices"
    >
      <button
        onClick={() => select("retail")}
        className={`${segmentBase} ${
          mode === "retail"
            ? "bg-white text-[#009E3C] shadow-sm"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
        Retail
      </button>
      <button
        onClick={() => select("wholesale")}
        className={`${segmentBase} ${
          mode === "wholesale"
            ? "bg-[#0B1F3A] text-white shadow-sm"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
        Wholesale
      </button>
    </div>
  );
}
