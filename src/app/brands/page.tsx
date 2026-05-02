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
  const itemsPerPage = 18;

  useEffect(() => {
    async function fetchBrands() {
      try {
        setLoading(true);
        const response = await apiClient.getBrands();

        if (response.status && response.data) {
          // The backend now returns latest first
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

  // Filter and then Paginate
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

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <main className="min-h-screen bg-[#fafdfb]">
      {/* ── Premium Hero Header ── */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100 py-16 md:py-24">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-6"
          >
            <LayoutGrid className="w-4 h-4 text-[#009E3C]" />
            <span className="text-xs font-black tracking-widest text-[#009E3C] uppercase">Global Partners</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-6"
          >
            Our Trusted <span className="text-[#009E3C]">Clinical Brands</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium"
          >
            We partner with the world's leading pharmaceutical and wellness manufacturers 
            to bring you clinically-proven, high-potency health solutions.
          </motion.p>
        </div>
      </section>

      {/* ── Search & Filter Bar ── */}
      <div className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by brand name (e.g. St George, Dove, Arial)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-[#009E3C] transition-all text-base font-medium placeholder:text-gray-400"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* ── Brand Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 text-[#009E3C] animate-spin" />
            <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Curating Brands...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-red-100 p-8">
            <p className="text-red-600 font-bold mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="h-14 px-10 bg-[#009E3C] text-white font-black rounded-2xl hover:bg-[#00752C] transition shadow-lg shadow-emerald-100"
            >
              Try Again
            </button>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 text-xl font-bold">
              {search ? `No brands matching "${search}"` : "No brands available"}
            </p>
            <button 
              onClick={() => setSearch("")}
              className="mt-4 text-[#009E3C] font-bold hover:underline"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {currentBrands.map((brand, idx) => (
                  <motion.div
                    key={brand.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: (idx % 6) * 0.05 }}
                  >
                    <Link
                      href={`/shop?brand_id=${brand.id}`}
                      className="group relative flex flex-col items-center justify-center p-8 rounded-[2rem] bg-white border border-gray-100 hover:border-emerald-200 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,158,60,0.12)] overflow-hidden aspect-square"
                    >
                      {/* Subtle hover background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Logo Container */}
                      <div className="relative z-10 w-full flex-1 flex items-center justify-center">
                        {brand.image ? (
                          <img
                            src={getImageUrl(brand.image)}
                            alt={brand.name}
                            className="w-full h-auto max-h-[100px] object-contain filter group-hover:scale-110 transition-all duration-700 ease-out"
                          />
                        ) : (
                          <div className="text-4xl font-black text-gray-100 group-hover:text-[#009E3C]/20 transition-all duration-500 tracking-tighter uppercase">
                            {brand.name.substring(0, 2)}
                          </div>
                        )}
                      </div>

                      {/* Brand Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                         <p className="text-white text-center text-xs font-black uppercase tracking-widest truncate">
                           {brand.name}
                         </p>
                      </div>

                      {/* Default Label */}
                      <div className="mt-4 text-center group-hover:opacity-0 transition-opacity">
                        <h3 className="font-bold text-gray-700 text-sm md:text-base truncate">
                          {brand.name}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-emerald-50 hover:text-[#009E3C] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Only show first, last, and pages around current
                    if (
                      pageNum === 1 || 
                      pageNum === totalPages || 
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-12 h-12 rounded-xl font-bold transition-all ${
                            currentPage === pageNum 
                              ? 'bg-[#009E3C] text-white shadow-lg shadow-emerald-100' 
                              : 'bg-white border border-gray-200 text-gray-500 hover:border-emerald-200 hover:text-[#009E3C]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 || 
                      pageNum === currentPage + 2
                    ) {
                      return <span key={pageNum} className="text-gray-300">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-emerald-50 hover:text-[#009E3C] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Bottom CTA ── */}
      {!loading && !error && (
        <section className="bg-white py-20 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-black text-gray-900 mb-6">Didn't find your brand?</h2>
            <p className="text-gray-500 mb-10 text-lg">We are constantly adding new pharmaceutical partners. Check out our full product catalog in the meantime.</p>
            <Link
              href="/shop"
              className="h-16 px-12 bg-gray-900 text-white font-black rounded-2xl hover:bg-[#009E3C] transition-all duration-300 shadow-xl inline-flex items-center justify-center"
            >
              Shop All Products
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
