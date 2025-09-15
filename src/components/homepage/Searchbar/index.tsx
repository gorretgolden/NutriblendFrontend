// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";

// const trendingItems = [
//   "Vitamin D3 + K2",
//   "Medix 5.5",
//   "Everything Bagel",
//   "Peppermint Oil",
//   "K18",
//   "Olaplex",
// ];

// const browseItems = [
//   { name: "Specials", href: "/specials" },
//   { name: "Brands of the Week", href: "/brands" },
//   { name: "Sales & Offers", href: "/sales" },
//   { name: "New", href: "/new" },
//   { name: "Best Sellers", href: "/bestsellers" },
//   { name: "Health Topics", href: "/health" },
//   { name: "Supplements", href: "/category/supplements" },
//   { name: "Grocery", href: "/category/grocery" },
//   { name: "Bath", href: "/category/bath" },
//   { name: "Sports", href: "/category/sports" },
//   { name: "Beauty", href: "/category/beauty" },
//   { name: "Pets", href: "/category/pets" },
// ];

// export default function SearchWithDropdown() {
//   const [open, setOpen] = useState(false);
//   const [isFloating, setIsFloating] = useState(false);
//   const [topOffset, setTopOffset] = useState(64);
//   const ref = useRef<HTMLDivElement | null>(null);

//   // compute positioning
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const computePositioning = () => {
//       const small = window.innerWidth <= 768;
//       if (small) {
//         const nav = document.querySelector(".navbar-second") as HTMLElement | null;
//         const bottom = nav ? nav.getBoundingClientRect().bottom + window.scrollY : 56;
//         setTopOffset(Math.round(bottom + 150));
//         setIsFloating(true);
//       } else {
//         setIsFloating(false);
//       }
//     };

//     computePositioning();
//     window.addEventListener("resize", computePositioning);
//     window.addEventListener("scroll", computePositioning);
//     return () => {
//       window.removeEventListener("resize", computePositioning);
//       window.removeEventListener("scroll", computePositioning);
//     };
//   }, []);

//   // close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleToggle = () => setOpen((s) => !s);

//   const containerClasses = isFloating
//     ? "fixed left-1/2 transform -translate-x-1/2 w-[92%] z-50"
//     : "relative flex-1 max-w-4xl mx-4 lg:mx-8";

//   return (
//     <div
//       ref={ref}
//       className={containerClasses}
//       style={isFloating ? { top: `${topOffset}px` } : undefined}
//     >
//       {/* Search Form */}
//       <form className="flex shadow-lg rounded-3xl overflow-hidden border border-gray-200 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#4caf50]">
//         <input
//           type="text"
//           placeholder="Search all of NutriBlend..."
//           className="w-full px-6 py-2.5 sm:py-3.5 outline-none text-gray-700 text-base"
//           onClick={handleToggle}
//         />
//         <button
//           type="button"
//           onClick={handleToggle}
//           className="bg-[#4caf50] text-white px-6 sm:px-7 py-2.5 sm:py-3 flex items-center justify-center hover:bg-green-600 transition-colors duration-200"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//             />
//           </svg>
//         </button>
//       </form>

//       {/* Dropdown */}
//       {open && (
//         <div
//           className="absolute top-full left-0 w-full mt-3 bg-white shadow-2xl rounded-2xl p-4 sm:p-6 z-50 border border-gray-100 max-h-[70vh] overflow-y-auto"
//         >
//           {/* Trending */}
//           <div>
//             <h3 className="font-semibold mb-3 text-gray-700">Trending now</h3>
//             <div className="flex flex-wrap gap-2">
//               {trendingItems.map((item, idx) => (
//                 <button
//                   key={idx}
//                   type="button"
//                   onClick={() => setOpen(false)}
//                   className="px-4 py-2 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-[#4caf50] hover:text-white transition-colors duration-200"
//                 >
//                   {item}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <hr className="my-5" />

//           {/* Browse */}
//           <div>
//             <h3 className="font-semibold mb-3 text-gray-700">Browse</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//               {browseItems.map((item, idx) => (
//                 <Link
//                   key={idx}
//                   href={item.href}
//                   className="block bg-gray-50 hover:bg-[#4caf50] hover:text-white p-3 sm:p-4 rounded-xl text-sm font-medium text-center transition-colors duration-200"
//                   onClick={() => setOpen(false)}
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const trendingItems = [
  "Vitamin D3 + K2",
  "Medix 5.5",
  "Everything Bagel",
  "Peppermint Oil",
  "K18",
  "Olaplex",
];

const browseItems = [
  { name: "Specials", href: "/specials" },
  { name: "Brands of the Week", href: "/brands" },
  { name: "Sales & Offers", href: "/sales" },
  { name: "New", href: "/new" },
  { name: "Best Sellers", href: "/bestsellers" },
  { name: "Health Topics", href: "/health" },
  { name: "Supplements", href: "/category/supplements" },
  { name: "Grocery", href: "/category/grocery" },
  { name: "Bath", href: "/category/bath" },
  { name: "Sports", href: "/category/sports" },
  { name: "Beauty", href: "/category/beauty" },
  { name: "Pets", href: "/category/pets" },
];

export default function SearchWithDropdown() {
  const [open, setOpen] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [topOffset, setTopOffset] = useState(64);
  const ref = useRef<HTMLDivElement | null>(null);

  // compute positioning
  useEffect(() => {
    if (typeof window === "undefined") return;

    const computePositioning = () => {
      const small = window.innerWidth <= 768;
      if (small) {
        const nav = document.querySelector(".navbar-second") as HTMLElement | null;
        const bottom = nav ? nav.getBoundingClientRect().bottom + window.scrollY : 56;
        setTopOffset(Math.round(bottom + 150)); // Reduced from 150px to 16px for less space
        setIsFloating(true);
      } else {
        setIsFloating(false);
      }
    };

    computePositioning();
    window.addEventListener("resize", computePositioning);
    window.addEventListener("scroll", computePositioning);
    return () => {
      window.removeEventListener("resize", computePositioning);
      window.removeEventListener("scroll", computePositioning);
    };
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => setOpen((s) => !s);

  const containerClasses = isFloating
    ? "fixed left-1/2 transform -translate-x-1/2 w-[92%] z-50"
    : "relative flex-1 max-w-4xl mx-4 lg:mx-8 my-4"; // Added my-4 for vertical padding

  return (
    <div
      ref={ref}
      className={containerClasses}
      style={isFloating ? { top: `${topOffset}px` } : undefined}
    >
      {/* Search Form */}
      <form className="flex shadow-lg rounded-3xl overflow-hidden border border-gray-200 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#4caf50]">
        <input
          type="text"
          placeholder="Search all of NutriBlend..."
          className="w-full px-6 py-3 outline-none text-gray-700 text-base" // Increased padding for better spacing
          onClick={handleToggle}
        />
        <button
          type="button"
          onClick={handleToggle}
          className="bg-[#4caf50] text-white px-6 sm:px-7 py-3 flex items-center justify-center hover:bg-green-600 transition-colors duration-200" // Increased padding
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-full left-0 w-full mt-3 bg-white shadow-2xl rounded-2xl p-4 sm:p-6 z-50 border border-gray-100 max-h-[70vh] overflow-y-auto"
        >
          {/* Trending */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-700">Trending now</h3>
            <div className="flex flex-wrap gap-2">
              {trendingItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-[#4caf50] hover:text-white transition-colors duration-200"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <hr className="my-5" />

          {/* Browse */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-700">Browse</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {browseItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="block bg-gray-50 hover:bg-[#4caf50] hover:text-white p-3 sm:p-4 rounded-xl text-sm font-medium text-center transition-colors duration-200"
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
