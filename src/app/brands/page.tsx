"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react"; // for search icon

const brands = [
  { name: "Pfizer", image: "/images/pfizer.png", href: "/products/pfizer" },
  { name: "GSK", image: "/images/GSK.jpg", href: "/products/GSK" },
  { name: "AstraZeneca", image: "/images/astra.jpg", href: "/products/astra" },
  { name: "Johnson & Johnson", image: "/images/johnson.jpg", href: "/products/johnson" },
  { name: "Roche", image: "/images/rosche.png", href: "/products/rocshe" },
  { name: "Bayer", image: "/images/bayer.png", href: "/products/bayer" },
  // ...more
];

export default function BrandsPage() {
  const [search, setSearch] = useState("");

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Hero Section */}
     <section className="text-center pt-6 pb-12 sm:pt-8 sm:pb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-green-800 drop-shadow-sm">
          Our Trusted Brands
        </h1>
<p className="mt-3 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0">
  Explore pharmaceutical brands you can trust. Search or browse through
  our collection to find the right products for you.
</p>
      </section>

      {/* Search Bar */}
      <div className="flex justify-center mb-10 px-4">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Brand Grid */}
      <div className="px-6 sm:px-10 lg:px-20 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filtered.map((brand) => (
            <Link
              key={brand.name}
              href={brand.href}
              className="relative w-full h-32 sm:h-36 lg:h-44 bg-white/80 backdrop-blur rounded-2xl shadow-md border border-gray-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-0 left-0 right-0 bg-green-600 text-white text-sm font-medium text-center py-1 opacity-0 group-hover:opacity-100 transition">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

        {/* CTA footer */}
        <div className="mt-14 text-center">
          <p className="text-green-600 font-medium mb-4">
            Can’t find what you’re looking for?
          </p>
          <Link
            href="/products"
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-600 hover:shadow-lg transition"
          >
            Explore All Products
          </Link>
        </div>
      </div>
    </main>
  );
}
