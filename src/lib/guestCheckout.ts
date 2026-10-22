"use client";

export interface GuestContact {
  name: string;
  phone: string;
  email: string;
}

const STORAGE_KEY = 'nutriblend_guest_contact';

export function loadGuestContact(): GuestContact | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.name !== 'string' || typeof parsed.phone !== 'string') return null;
    return { name: parsed.name, phone: parsed.phone, email: typeof parsed.email === 'string' ? parsed.email : '' };
  } catch {
    return null;
  }
}

export function saveGuestContact(contact: GuestContact) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contact));
  } catch {
    // Private browsing or a full localStorage; ordering still works.
  }
}

export function clearGuestContact() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignored for the same reason as save.
  }
}

/** Digits only, so "077 123 4567", "+256771234567" and "256771234567" all pass. */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 14;
}
