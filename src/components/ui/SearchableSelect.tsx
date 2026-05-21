"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

type SearchableOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SearchableSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SearchableOption[];
  placeholder: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  noResultsText?: string;
  /** Force dropdown direction. Defaults to 'auto' (detects available space). */
  dropdownDirection?: "up" | "down" | "auto";
};

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  isLoading = false,
  className = "",
  noResultsText = "No results",
  dropdownDirection = "auto",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedLabel = useMemo(() => {
    return options.find((item) => item.value === value)?.label || "";
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return options;
    return options.filter((item) => item.label.toLowerCase().includes(term));
  }, [options, query]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);
  // Determine direction when opening
  const handleToggle = () => {
    if (disabled || isLoading) return;
    if (!open && dropdownDirection === "auto" && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 250);
    } else if (dropdownDirection === "up") {
      setOpenUpward(true);
    } else {
      setOpenUpward(false);
    }
    setOpen((prev) => !prev);
  };

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled || isLoading}
        onClick={handleToggle}
        className={`${className} flex items-center justify-between gap-2 w-full ${disabled || isLoading ? "opacity-60 cursor-not-allowed bg-gray-50" : ""}`}
      >
        <span className={selectedLabel ? "text-gray-900 truncate" : isLoading ? "text-[#009E3C] font-medium animate-pulse truncate" : "text-gray-500 truncate"}>
          {selectedLabel || placeholder}
        </span>
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-gray-400 animate-spin flex-shrink-0" />
        ) : (
          <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        )}
      </button>

      {open && !disabled && !isLoading && (
        <div className={`absolute z-50 w-full rounded-lg border border-gray-200 bg-white shadow-lg
          ${openUpward ? "bottom-full mb-1" : "top-full mt-1"}`}>
          <div className="p-2 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#009E3C] focus:ring-2 focus:ring-[#009E3C]/20"
            />
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <p className="px-3 py-2 text-sm text-gray-500">{noResultsText}</p>
            ) : (
              filteredOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    onChange(item.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 ${item.value === value ? "bg-[#009E3C]/10 text-[#009E3C] font-medium" : "text-gray-800"}`}
                >
                  {item.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
