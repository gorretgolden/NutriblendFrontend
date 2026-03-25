"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { apiClient, getImageUrl, type Brand } from "@/lib/api/client";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBrands() {
      try {
        setLoading(true);
        const response = await apiClient.getBrands();

        if (response.status && response.data) {
          // Filter active brands only
          const activeBrands = response.data.filter(b => b.is_active);
          setBrands(activeBrands);
        } else {
          setError(response.message || "Failed to load brands");
        }
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to load brands. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchBrands();
  }, []);

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
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#009E3C]/15 focus:outline-none"
            disabled={loading}
          />
        </div>
      </div>

      {/* Brand Grid */}
      <div className="px-6 sm:px-10 lg:px-20 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#009E3C] text-white font-semibold rounded-xl hover:bg-[#00752C] transition"
            >
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">
              {search ? `No brands found matching "${search}"` : "No brands available at the moment"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filtered.map((brand) => (
              <Link
                key={brand.id}
                href={`/shop?brand_id=${brand.id}`}
                className="relative w-full h-32 sm:h-36 lg:h-44 bg-white/80 backdrop-blur rounded-2xl shadow-md border border-gray-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                {brand.image ? (
                  <img
                    src={getImageUrl(brand.image)}
                    alt={brand.name}
                    className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <span className="text-2xl font-bold text-green-800 text-center">
                      {brand.name}
                    </span>
                  </div>
                )}
                <span className="absolute bottom-0 left-0 right-0 bg-[#009E3C] text-white text-sm font-medium text-center py-1 opacity-0 group-hover:opacity-100 transition">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* CTA footer */}
        {!loading && !error && (
          <div className="mt-14 text-center">
            <p className="text-green-600 font-medium mb-4">
              Can't find what you're looking for?
            </p>
            <Link
              href="/shop"
              className="px-6 py-3 bg-[#009E3C] text-white font-semibold rounded-xl shadow-md hover:bg-[#00752C] hover:shadow-lg transition"
            >
              Explore All Products
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
