"use client";

import Link from "next/link";

const brands = [
  { name: "Pfizer", image: "/images/pfizer.png", href: "/products/pfizer" },
  { name: "GSK", image: "/images/GSK.jpg", href: "/products/GSK" },
  { name: "AstraZeneca", image: "/images/astra.jpg", href: "/products/astra" },
  { name: "Johnson & Johnson", image: "/images/johnson.jpg", href: "/products/johnson" },
  { name: "Roche", image: "/images/rosche.png", href: "/products/rocshe" },
  { name: "Bayer", image: "/images/bayer.png", href: "/products/bayer" },
  
];

export default function BrandsSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-20 pt-4 pb-10 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800">
          Featured Brands
        </h2>
        <Link
          href="/brands"
          className="text-sm sm:text-base font-semibold text-green-800 hover:underline"
        >
          See All Brands
        </Link>
      </div>

      {/* Grid: mobile = 3 cols (only first 3 brands), sm+ = full list */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {brands.map((brand, i) => (
          <Link
            key={brand.name}
            href={brand.href}
            className={`${i >= 3 ? "hidden sm:block" : "block"} 
                        relative w-full h-28 sm:h-32 md:h-36 lg:h-40 
                        bg-gray-100 rounded-xl overflow-hidden shadow-md group`}
          >
            {/* Logo fills rectangle */}
            <img
              src={brand.image}
              alt={brand.name}
              className="absolute inset-0 w-full h-full object-contain p-4 group-hover:opacity-70 transition"
            />

            {/* Name visible only on hover */}
            <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs sm:text-sm font-medium text-center py-1 opacity-0 group-hover:opacity-100 transition">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}