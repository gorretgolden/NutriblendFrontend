import ProductCarousel from "@/components/common/ProductCarousel";
import BrandsSection from "@/components/homepage/Brands";
import HeroCarousel, { CarouselSlide } from "@/components/homepage/imageCarousel";
import FlashSale from "@/components/homepage/FlashSale";
import ShopByGoal from "@/components/homepage/ShopByGoal";
import ThreeColBanners from "@/components/homepage/ThreeColBanners";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";
import NewsletterForm from "@/components/homepage/NewsletterForm";
import { transformProduct } from "@/lib/transformers";
import { apiClient } from "@/lib/api/client";
import Link from "next/link";
import FadeIn from "@/components/common/FadeIn";
export const revalidate = 60;

// ── Safe product fetch helper ───────────────────────────────────────────────
async function fetchProducts(params: Record<string, unknown>, limit = 8) {
  try {
    const res = await apiClient.getProducts({ ...params, per_page: limit });
    if (!res.status) return [];
    const raw = res.data;
    const arr = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
    return arr.map(transformProduct);
  } catch {
    return [];
  }
}

// ── Server data fetch ───────────────────────────────────────────────────────
async function getHomePageData() {
  const [
    trendingProducts,
    featuredProducts,
    specialOfferProducts,
    latestProducts,
    onSaleProducts,
    heroSlideSettings,
  ] = await Promise.all([
    fetchProducts({ is_trending: true }),
    fetchProducts({ is_featured: true }),
    fetchProducts({ is_special_offer: true }),
    fetchProducts({ per_page: 8 }),
    fetchProducts({ on_sale: true }),
    apiClient.getPublicSettings().catch(() => ({ status: false, data: null })),
  ]);

  const heroSlides = (
    heroSlideSettings.status &&
    Array.isArray(heroSlideSettings.data?.hero_carousel) &&
    heroSlideSettings.data.hero_carousel.length > 0
  ) ? heroSlideSettings.data.hero_carousel : [];

  const defaultBadges = [
    { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "100% Authentic", desc: "Sourced directly from brands" },
    { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", title: "Secure Payment", desc: "Flutterwave & mobile money" },
    { icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0", title: "Fast Delivery", desc: "Across Uganda" },
    { icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", title: "24/7 Support", desc: "Always here to help" },
  ];

  const trustBadges = defaultBadges.map((badge, idx) => {
    if (heroSlideSettings.status && Array.isArray(heroSlideSettings.data?.trust_badges) && heroSlideSettings.data.trust_badges[idx]) {
      return {
        icon: badge.icon,
        title: heroSlideSettings.data.trust_badges[idx].title || badge.title,
        desc: heroSlideSettings.data.trust_badges[idx].desc || badge.desc,
      };
    }
    return badge;
  });

  return {
    trendingProducts,
    featuredProducts,
    specialOfferProducts,
    latestProducts,
    onSaleProducts,
    heroSlides,
    trustBadges,
  };
}

// ── Section Heading Component ───────────────────────────────────────────────
function SectionHeading({
  label, title, viewAllLink
}: { label: string; title: string; viewAllLink: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-[#009E3C] mb-0.5">{label}</p>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{title}</h2>
      </div>
      <Link
        href={viewAllLink}
        className="inline-flex items-center gap-1 text-[13px] sm:text-sm font-semibold text-[#009E3C] hover:text-[#007a2e] transition-colors group border border-[#009E3C]/30 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 hover:bg-[#009E3C]/5"
      >
        View all
        <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default async function Home() {
  const {
    trendingProducts, featuredProducts, specialOfferProducts,
    latestProducts, onSaleProducts, heroSlides, trustBadges
  } = await getHomePageData();

  return (
    <main className="bg-[#f4f6f9] w-full min-h-screen">

      {/* ── 1. Hero Carousel ── */}
      <section className="bg-white shadow-sm border-b border-gray-200/80">
        <div className="max-w-[1600px] mx-auto">
          <HeroCarousel slides={heroSlides} autoPlay={true} interval={6000} />
        </div>
      </section>

      {/* ── 2. Shop by Category ── */}
      <FadeIn duration={0.8}>
        <ShopByGoal />
      </FadeIn>

      {/* ── 3. Trust Signals Bar ── */}
      <FadeIn duration={0.8} className="bg-white border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-gray-100">
            {trustBadges.map((t, i) => (
              <div key={i} className="flex items-center gap-3 md:px-6 md:first:pl-0 md:last:pr-0">
                <div className="w-10 h-10 rounded-xl bg-[#f0fbf4] border border-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#009E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={t.icon} />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">{t.title}</p>
                  <p className="text-gray-400 text-[11px] block">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── 4. Three-Column Promo Banners ── */}
      <FadeIn duration={0.8} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ThreeColBanners />
      </FadeIn>

      {/* ── 5. New Arrivals ── */}
      {latestProducts.length > 0 && (
        <FadeIn duration={1} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="bg-white rounded-2xl px-4 py-5 md:px-6 border border-gray-100 shadow-sm">
            <SectionHeading label="Just In" title="New Arrivals" viewAllLink="/shop" />
            <ProductCarousel products={latestProducts} title="New Arrivals" hideHeader viewAllLink="/shop" />
          </div>
        </FadeIn>
      )}

      {/* ── 6. Trending Products 🔥 ── */}
      {trendingProducts.length > 0 && (
        <FadeIn direction="left" duration={0.8} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="bg-white rounded-2xl px-4 py-5 md:px-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full mb-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Hot Right Now
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Trending Products</h2>
              </div>
              <Link href="/shop?is_trending=true" className="inline-flex items-center gap-1 text-[13px] sm:text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors group border border-orange-200 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 hover:bg-orange-50">
                View all
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <ProductCarousel products={trendingProducts} title="Trending Products" hideHeader viewAllLink="/shop?is_trending=true" />
          </div>
        </FadeIn>
      )}

      {/* ── 7. Brands Section ── */}
      <FadeIn duration={0.8} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <BrandsSection />
      </FadeIn>

      {/* ── 8. Featured Products ⭐ ── */}
      {featuredProducts.length > 0 && (
        <FadeIn direction="right" duration={0.8} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="bg-white rounded-2xl px-4 py-5 md:px-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-[#009E3C] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full mb-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Staff Picks
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Featured Products</h2>
              </div>
              <Link href="/shop?is_featured=true" className="inline-flex items-center gap-1 text-[13px] sm:text-sm font-semibold text-[#009E3C] hover:text-[#007a2e] transition-colors group border border-[#009E3C]/30 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 hover:bg-[#009E3C]/5">
                View all
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <ProductCarousel products={featuredProducts} title="Featured Products" hideHeader viewAllLink="/shop?is_featured=true" />
          </div>
        </FadeIn>
      )}

      {/* ── Wholesale CTA Banner Section ── */}
      <FadeIn duration={0.8} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#009E3C] to-[#005a22] text-white shadow-lg border border-green-700/30 group">
          {/* Subtle design elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />

          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 border border-white/10">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                For Businesses & Retailers
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2 !text-white">
                Join Our Exclusive Wholesale Program
              </h2>
              <p className="!text-white text-sm sm:text-base max-w-2xl leading-relaxed">
                Get exclusive bulk pricing, personalized support, priority delivery, and custom wellness formulations designed directly for your pharmacy, clinic, or shop.
              </p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/wholesale-registration"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#009E3C] hover:bg-gray-50 transition-all duration-200 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg active:scale-[0.98] text-center"
              >
                Apply Now
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white hover:bg-white/5 transition-all duration-200 rounded-2xl font-black text-sm uppercase tracking-wider text-center"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── 9. Why Choose Us ── */}
      <FadeIn duration={0.8}>
        <WhyChooseUs />
      </FadeIn>

      {/* ── 10. Special Offers 🏷️ ── */}
      {specialOfferProducts.length > 0 && (
        <FadeIn duration={0.8} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-6 md:px-8 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-purple-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full mb-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Exclusive Deals
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Special Offers</h2>
              </div>
              <Link href="/shop?is_special_offer=true" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-purple-500 hover:text-purple-600 transition-colors group border border-purple-200 rounded-full px-4 py-1.5 hover:bg-purple-50">
                View all deals
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <ProductCarousel products={specialOfferProducts} title="Special Offers" hideHeader viewAllLink="/shop?is_special_offer=true" />
          </div>
        </FadeIn>
      )}

      {/* ── 11. On Sale (Legacy) ── */}
      {onSaleProducts.length > 0 && (
        <FadeIn duration={0.8} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-6 md:px-8 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full mb-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Limited Time
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">On Sale Now</h2>
              </div>
              <Link href="/shop?on_sale=true" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors group border border-red-200 rounded-full px-4 py-1.5 hover:bg-red-50">
                View all deals
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <ProductCarousel products={onSaleProducts} title="On Sale" hideHeader viewAllLink="/shop?on_sale=true" />
          </div>
        </FadeIn>
      )}
      


    </main>
  );
}
