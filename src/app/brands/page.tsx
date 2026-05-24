"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Loader2, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { apiClient, getImageUrl, type Brand } from "@/lib/api/client";
import { motion, AnimatePresence } from "framer-motion";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24; // More items per page for a dense, premium grid

  useEffect(() => {
    async function fetchBrands() {
      try {
        setLoading(true);
        const response = await apiClient.getBrands();

        if (response.status && response.data) {
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

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <main className="min-h-screen bg-white">
      {/* ── Compact Hero Section ── */}
      <section className="relative overflow-hidden py-10 md:py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5faf7] to-white" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-black text-gray-950 tracking-tight mb-4"
            >
              Authentic Brands
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-sm md:text-base mb-6 leading-relaxed font-medium max-w-2xl mx-auto"
            >
              Verified partners delivering 100% authentic wellness products worldwide.
            </motion.p>

            {/* Compact Search */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-sm mx-auto"
            >
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="text-gray-400 w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search brands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-6 py-3 rounded-2xl border border-gray-200 bg-white focus:border-[#009E3C] focus:ring-1 focus:ring-[#009E3C]/30 transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-sm"
                disabled={loading}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Brand Grid ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 md:py-16 border-t border-gray-100">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24">
            <Loader2 className="w-10 h-10 text-[#009E3C] animate-spin" />
            <p className="mt-4 text-gray-400 font-bold tracking-widest uppercase text-[10px]">Loading Collections</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-3xl p-8">
            <p className="text-red-600 font-bold mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">No brands found</h3>
            <p className="text-gray-500 mb-8">We couldn't find any brands matching "{search}"</p>
            <button 
              onClick={() => setSearch("")}
              className="text-[#009E3C] font-black uppercase tracking-widest text-xs border-b-2 border-[#009E3C] pb-1"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              <AnimatePresence mode="popLayout">
                {currentBrands.map((brand, idx) => (
                  <motion.div
                    key={brand.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: (idx % 20) * 0.03 }}
                  >
                    <Link
                      href={`/shop?brand_id=${brand.id}`}
                      className="group flex flex-col items-center justify-center rounded-2xl border border-gray-150 bg-white p-4 transition duration-300 hover:border-[#009E3C] hover:shadow-md hover:shadow-[#009E3C]/10"
                    >
                      <div className="relative flex h-28 w-full items-center justify-center rounded-lg bg-gray-50 mb-3 overflow-hidden group-hover:bg-gray-100 transition">
                        {brand.image ? (
                          <img
                            src={getImageUrl(brand.full_image_url || brand.image || '')}
                            alt={brand.name}
                            className="max-h-24 max-w-[90%] object-contain transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="text-2xl font-black text-gray-300 uppercase">
                            {brand.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <h3 className="text-center text-xs md:text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                        {brand.name}
                      </h3>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── Premium Pagination ── */}
            {totalPages > 1 && (
              <div className="mt-24 flex justify-center items-center gap-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-14 h-14 rounded-2xl border border-gray-100 flex items-center justify-center hover:bg-[#009E3C] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all shadow-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <div className="flex items-center gap-3">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 || 
                      pageNum === totalPages || 
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-14 h-14 rounded-2xl font-black transition-all ${
                            currentPage === pageNum 
                              ? 'bg-[#009E3C] text-white shadow-xl shadow-[#009E3C]/20 scale-110' 
                              : 'bg-white border border-gray-100 text-gray-400 hover:border-[#009E3C] hover:text-[#009E3C]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 || 
                      pageNum === currentPage + 2
                    ) {
                      return <span key={pageNum} className="text-gray-300 font-bold px-2">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-14 h-14 rounded-2xl border border-gray-100 flex items-center justify-center hover:bg-[#009E3C] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all shadow-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Bottom Section ── */}
      {!loading && !error && (
        <section className="bg-gray-50 py-24 md:py-32">
          <div className="max-w-[1400px] mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight">Expand your horizon.</h2>
            <p className="text-gray-500 mb-12 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Discover over 5,000 wellness products from our curated selection of global brands.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-10 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-[#009E3C] transition-all duration-300 shadow-2xl hover:-translate-y-1"
            >
              Browse Full Catalog
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
