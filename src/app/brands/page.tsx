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
      {/* ── Premium Hero Section ── */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5faf7] via-white to-white" />
        <div className="absolute top-0 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-[#009E3C]/10 blur-[120px] opacity-80" />
        <div className="absolute right-0 top-24 h-[12rem] w-[12rem] rounded-full bg-[#8bcf9a]/20 blur-[80px]" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#009E3C]/5 border border-[#009E3C]/15 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#009E3C]" />
              <span className="text-[11px] font-black tracking-[0.24em] text-[#009E3C] uppercase">Authentic Brands</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl xl:text-7xl font-black text-gray-950 tracking-tight mb-6 leading-[1.02]"
            >
              Discover premium wellness brands built for trust, quality and real results.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-base md:text-lg mb-10 leading-relaxed font-medium"
            >
              Every partner on our page is verified for authenticity, quality sourcing and safe global delivery. Explore brands you can rely on.
            </motion.p>

            {/* Premium Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-xl mx-auto"
            >
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="text-gray-400 w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search brands, names or keywords"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-8 py-5 rounded-[32px] border border-gray-200 bg-white focus:border-[#009E3C] focus:ring-2 focus:ring-[#009E3C]/20 transition-all text-base font-semibold text-gray-900 placeholder:text-gray-400 shadow-lg shadow-gray-100"
                disabled={loading}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Brand Grid ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-20 border-t border-gray-100">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              <AnimatePresence mode="popLayout">
                {currentBrands.map((brand, idx) => (
                  <motion.div
                    key={brand.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.35, delay: (idx % 12) * 0.04 }}
                  >
                    <Link
                      href={`/shop?brand_id=${brand.id}`}
                      className="group block overflow-hidden rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-24px_rgba(0,158,60,0.22)]"
                    >
                      <div className="relative overflow-hidden rounded-[28px] bg-[#f7faf6] p-6 flex items-center justify-center min-h-[220px]">
                        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#009E3C]/12 to-transparent" />
                        {brand.image ? (
                          <img
                            src={getImageUrl(brand.full_image_url || brand.image || '')}
                            alt={brand.name}
                            className="relative z-10 max-h-36 max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full bg-[#009E3C]/10 text-4xl font-black text-[#009E3C] uppercase tracking-[0.2em]">
                            {brand.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="mt-6 text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#009E3C]">Brand partner</p>
                        <h3 className="mt-3 text-xl font-black text-gray-950 leading-tight">{brand.name}</h3>
                        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                          Tap to explore curated products from this trusted wellness brand.
                        </p>
                      </div>

                      <div className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-[#009E3C]/20 bg-[#009E3C]/5 px-4 py-2 text-sm font-bold text-[#009E3C] transition group-hover:bg-[#009E3C] group-hover:text-white">
                        <span>Shop brand</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
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
