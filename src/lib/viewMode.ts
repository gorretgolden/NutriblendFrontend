import { useAppSelector } from "@/lib/hooks/redux";
import type { RootState } from "@/lib/store";

export const STAFF_ROLES = ["Admin", "Super Admin", "Branch Manager"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export function isStaffRole(role: string | null | undefined): role is StaffRole {
  return !!role && (STAFF_ROLES as readonly string[]).includes(role);
}

// A real wholesale customer always sees wholesale prices. Staff members see
// them only while their browsing mode is set to wholesale.
export function isWholesaleView(user: any, viewMode: string): boolean {
  if (!user) return false;
  if (user.role === "Wholesale Customer" || user.is_wholesale_approved) return true;
  return isStaffRole(user.role) && viewMode === "wholesale";
}

export function useWholesaleView(): boolean {
  const { user, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const mode = useAppSelector((state: RootState) => state.viewMode.mode);
  if (!isAuthenticated || !user) return false;
  return isWholesaleView(user, mode);
}

export function useViewMode() {
  return useAppSelector((state: RootState) => state.viewMode);
}
