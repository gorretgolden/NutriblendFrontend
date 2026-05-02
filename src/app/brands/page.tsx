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
  const itemsPerPage = 12; // 2 rows on desktop (6 columns)

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
      {/* ── Ultra-Premium Hero Header with Mesh Gradient ── */}
      <section className="relative overflow-hidden bg-white pt-10 md:pt-14 pb-10 md:pb-12 border-b border-gray-50">
        {/* Complex Mesh Gradient Background */}
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-50/60 rounded-full blur-[140px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#009E3C]/10 rounded-full blur-[120px]" />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-50/40 rounded-full blur-[100px]" />
        </div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23009e3c' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-emerald-100/50 mb-4 shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-[#009E3C] animate-ping" />
            <span className="text-[9px] font-black tracking-[0.3em] text-[#009E3C] uppercase">Global Partners</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-2"
          >
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009E3C] to-[#007a2e]">All Brands</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-8"
          >
            Official Clinical Distributors & Wellness Partners
          </motion.p>

          {/* Centered Integrated Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-xl mx-auto"
          >
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="text-[#009E3C] w-4 h-4 opacity-50" />
            </div>
            <input
              type="text"
              placeholder="Search by brand name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-full border border-gray-100 bg-white shadow-[0_15px_40px_-10px_rgba(0,158,60,0.1)] focus:ring-4 focus:ring-emerald-500/5 focus:border-[#009E3C]/30 transition-all text-base font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-normal"
              disabled={loading}
            />
          </motion.div>
        </div>
      </section>

      {/* ── Brand Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#009E3C] animate-spin opacity-20" />
              <Loader2 className="absolute top-0 left-0 w-12 h-12 text-[#009E3C] animate-[spin_1.5s_linear_infinite]" />
            </div>
            <p className="text-gray-400 font-black tracking-[0.3em] uppercase text-[9px]">Syncing Brands...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-red-50/50 p-8 shadow-sm">
            <p className="text-red-600 font-bold mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="h-12 px-8 bg-[#009E3C] text-white font-black rounded-xl hover:bg-[#00752C] transition shadow-lg shadow-emerald-100"
            >
              Try Again
            </button>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-gray-100">
              <Search className="w-8 h-8 text-gray-200" />
            </div>
            <p className="text-gray-900 text-xl font-black tracking-tight">
              {search ? `No matches for "${search}"` : "No brands found"}
            </p>
            <button 
              onClick={() => setSearch("")}
              className="mt-4 text-[#009E3C] font-black uppercase tracking-widest text-[10px] hover:underline underline-offset-8"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {currentBrands.map((brand, idx) => (
                  <motion.div
                    key={brand.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: (idx % itemsPerPage) * 0.03 }}
                  >
                    <Link
                      href={`/shop?brand_id=${brand.id}`}
                      className="group relative flex flex-col items-center justify-center p-5 rounded-[1.8rem] bg-white border border-gray-100 hover:border-emerald-200 transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(0,158,60,0.12)] overflow-hidden aspect-square shadow-sm"
                    >
                      {/* Logo Container */}
                      <div className="relative z-10 w-full flex-1 flex items-center justify-center">
                        {brand.image ? (
                          <img
                            src={getImageUrl(brand.image)}
                            alt={brand.name}
                            className="w-full h-auto max-h-[60px] object-contain filter group-hover:scale-110 transition-all duration-700 ease-out"
                          />
                        ) : (
                          <div className="text-3xl font-black text-gray-100 group-hover:text-emerald-50 transition-all duration-500 tracking-tighter uppercase">
                            {brand.name.substring(0, 2)}
                          </div>
                        )}
                      </div>

                      {/* Brand Info Layer */}
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-gray-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <p className="text-gray-900 text-center text-[8px] font-black uppercase tracking-widest truncate">
                           {brand.name}
                         </p>
                      </div>

                      {/* Visible Label */}
                      <div className="mt-3 text-center group-hover:opacity-0 transition-opacity duration-300">
                        <h3 className="font-bold text-gray-500 text-[10px] md:text-xs uppercase tracking-widest truncate max-w-[100px]">
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
